import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HALF, buildWaffleGeometry } from './waffleGeometry';

/** One slowly turning waffle, sized to sit inside the O of SPOT in the hero. */
function Piece() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => buildWaffleGeometry(HALF, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.74 }), []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.4;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
    </group>
  );
}

export default function OWaffle() {
  return (
    <Canvas
      camera={{ position: [0, 2.3, 2.5], fov: 34, near: 0.1, far: 20 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff0dc" />
      <Piece />
    </Canvas>
  );
}
