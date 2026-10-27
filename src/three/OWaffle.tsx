import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ROUND, buildRoundWaffleGeometry, waffleSize } from './waffleGeometry';

const RADIUS = waffleSize(ROUND).width / 2;
const ELEVATION = THREE.MathUtils.degToRad(48);

/** Frames the whole round waffle in the canvas, whatever its shape, so the waffle itself is the O. */
function Rig() {
  const camera = useThree(s => s.camera) as THREE.PerspectiveCamera;
  const size = useThree(s => s.size);

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const byWidth = (RADIUS * 1.06) / (tan * aspect);
    const byHeight = (RADIUS * Math.sin(ELEVATION) * 1.04 + 0.16) / tan;
    const d = Math.max(byWidth, byHeight);
    camera.position.set(0, Math.sin(ELEVATION) * d, Math.cos(ELEVATION) * d);
    camera.lookAt(0, 0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

/** One round waffle, slowly turning. No background: it is drawn straight onto the page. */
function Disc() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => buildRoundWaffleGeometry(), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.74 }), []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.35;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

export default function OWaffle() {
  return (
    <Canvas camera={{ fov: 30, near: 0.1, far: 30 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} aria-hidden="true">
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff0dc" />
      <directionalLight position={[-4, 2, -2]} intensity={0.7} color="#ffc8a0" />
      <Rig />
      <Disc />
    </Canvas>
  );
}
