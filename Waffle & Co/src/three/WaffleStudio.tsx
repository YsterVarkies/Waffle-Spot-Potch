import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';
import { HALF, buildWaffleGeometry, waffleSize } from './waffleGeometry';
import { Dressing } from './Dressing';
import type { Recipe } from './recipes';

export type WaffleSize = 'half' | 'full';

interface StudioProps {
  recipe: Recipe;
  size: WaffleSize;
  /** pointer tilt and drag-to-turn (desktop only, so a phone can still scroll past it) */
  interactive?: boolean;
  className?: string;
}

const { width: PIECE_W, depth: PIECE_D } = waffleSize(HALF);
const GAP = 0.03;
const PLATE_Y = 0.05;

/** The Belgian waffle on its platter. "Full" is two pieces side by side; "half" slides one away. */
export default function WaffleStudio({ recipe, size, interactive = true, className = '' }: StudioProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`studio ${className}`}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.75]}
        shadows
        camera={{ position: [0, 3.2, 5.6], fov: 30, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        aria-hidden="true"
      >
        <Scene recipe={recipe} size={size} interactive={interactive} />
      </Canvas>
    </div>
  );
}

function Platter({ split }: { split: { current: { s: number } } }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.scale.x = THREE.MathUtils.lerp(1, 0.56, split.current.s);
  });
  return (
    <RoundedBox ref={ref} args={[4.5, 0.1, 2.55]} radius={0.05} smoothness={4} position={[0, PLATE_Y, 0]} receiveShadow>
      <meshStandardMaterial color="#f5efe7" roughness={0.32} metalness={0} />
    </RoundedBox>
  );
}

function Scene({ recipe, size, interactive }: { recipe: Recipe; size: WaffleSize; interactive: boolean }) {
  const turntable = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const split = useRef({ s: size === 'half' ? 1 : 0 });
  const drag = useRef({ active: false, x: 0, spin: 0, velocity: 0 });
  const { camera, pointer, gl } = useThree();

  const geoLeft = useMemo(() => buildWaffleGeometry(HALF, 1), []);
  const geoRight = useMemo(() => buildWaffleGeometry(HALF, 2), []);
  const batter = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.74, metalness: 0 }), []);

  useEffect(
    () => () => {
      geoLeft.dispose();
      geoRight.dispose();
      batter.dispose();
    },
    [geoLeft, geoRight, batter],
  );

  useEffect(() => {
    const tween = gsap.to(split.current, { s: size === 'half' ? 1 : 0, duration: 1.15, ease: 'power3.inOut' });
    return () => {
      tween.kill();
    };
  }, [size]);

  // Drag to turn the platter; it eases back to its idle sway when let go.
  useEffect(() => {
    if (!interactive) return;
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.x = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.x;
      drag.current.x = e.clientX;
      drag.current.velocity = dx * 0.01;
      drag.current.spin += dx * 0.01;
    };
    const up = (e: PointerEvent) => {
      drag.current.active = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = 'grab';
    };
    el.style.cursor = 'grab';
    el.style.touchAction = 'pan-y';
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [gl, interactive]);

  const look = useMemo(() => new THREE.Vector3(0, 0.25, 0), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const s = split.current.s;
    const d = drag.current;

    // pieces: side by side for a full; the right one slides off for a half
    if (left.current && right.current) {
      left.current.position.x = THREE.MathUtils.lerp(-(PIECE_W / 2 + GAP / 2), 0, s);
      right.current.position.set(PIECE_W / 2 + GAP / 2 + s * 2.4, Math.sin(s * Math.PI) * 0.45, 0);
      right.current.rotation.set(0, s * 0.9, -s * 0.25);
      right.current.scale.setScalar(Math.max(0.001, 1 - s));
      right.current.visible = s < 0.99;
    }

    // turntable: idle sway, pointer tilt, and drag spin that relaxes back
    if (!d.active) {
      d.spin = THREE.MathUtils.damp(d.spin, 0, 1.6, dt);
    }
    if (turntable.current) {
      const sway = Math.sin(t * 0.32) * 0.32;
      const tiltY = interactive ? pointer.x * 0.25 : 0;
      const tiltX = interactive ? -pointer.y * 0.06 : 0;
      turntable.current.rotation.y = THREE.MathUtils.damp(turntable.current.rotation.y, sway + tiltY + d.spin, 4, dt);
      turntable.current.rotation.x = THREE.MathUtils.damp(turntable.current.rotation.x, tiltX, 4, dt);
      turntable.current.position.y = Math.sin(t * 0.9) * 0.025;
    }

    // camera comes closer for a half, and backs off on narrow (portrait) canvases so the plate still fits
    const aspect = state.size.width / Math.max(1, state.size.height);
    const fit = Math.max(1, THREE.MathUtils.lerp(1.55, 1.05, s) / aspect);
    const camZ = THREE.MathUtils.lerp(5.6, 4.3, s) * fit;
    const camY = THREE.MathUtils.lerp(3.2, 2.7, s) * fit;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 4, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 4, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 4, dt);
    camera.lookAt(look);
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[3.5, 6.5, 4]}
        intensity={2.3}
        color="#fff0dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
      />
      <directionalLight position={[-5, 2.5, -2]} intensity={1.1} color="#ffc8a0" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[9, 5, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ffe3c6" position={[-6, 2, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ff9cc0" position={[6, 1.5, -1]} rotation-y={-Math.PI / 2} scale={[5, 2, 1]} />
        <Lightformer form="circle" intensity={1.6} position={[0, 2, 6]} scale={2.5} />
      </Environment>

      <group ref={turntable}>
        <Platter split={split} />
        <group position={[0, PLATE_Y + 0.05, 0]}>
          <group ref={left}>
            <mesh geometry={geoLeft} material={batter} castShadow receiveShadow />
            <Dressing key={recipe.id} recipe={recipe} seed={11} />
          </group>
          <group ref={right}>
            <mesh geometry={geoRight} material={batter} castShadow receiveShadow />
            <Dressing key={recipe.id} recipe={recipe} seed={23} />
          </group>
        </group>
      </group>

      <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2.6} far={2.5} resolution={512} color="#000000" />
    </>
  );
}

export const PIECE = { width: PIECE_W, depth: PIECE_D };
