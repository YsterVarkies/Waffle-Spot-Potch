import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { gsap } from '@/lib/gsap';
import { HALF, noise2, pocketCentres, restHeight, rng, surfaceAt, waffleSize } from './waffleGeometry';
import type { Recipe, ToppingType } from './recipes';

const { width: W, depth: D } = waffleSize(HALF);
const REST = restHeight(HALF);
const SCOOP_R = 0.4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutBack = (x: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/* ---------- geometries made once per dressing ---------- */

function displace(g: THREE.BufferGeometry, amount: number, freq: number, seed = 0) {
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = noise2(v.x * freq + seed, v.z * freq + v.y * freq * 0.7) - 0.5;
    const len = v.length() || 1;
    v.multiplyScalar(1 + (n * amount) / len);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function scoopGeometry() {
  // The icosahedron comes unindexed; welding its vertices gives smooth normals instead of facets.
  const g = mergeVertices(new THREE.IcosahedronGeometry(SCOOP_R, 6).deleteAttribute('normal').deleteAttribute('uv'));
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = noise2(v.x * 6 + 3, v.z * 6 + v.y * 4) * 0.7 + noise2(v.x * 15, v.y * 15 + v.z * 9) * 0.3;
    v.multiplyScalar(1 + (n - 0.5) * 0.16);
    if (v.y < -0.16) v.y = -0.16 + (v.y + 0.16) * 0.12; // sits flat on the waffle
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function baconGeometry() {
  const g = new THREE.BoxGeometry(0.72, 0.028, 0.15, 36, 1, 4);
  const p = g.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const lean = new THREE.Color('#8e2d1c');
  const fat = new THREE.Color('#e9b796');
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    p.setY(i, p.getY(i) + Math.sin(x * 15) * 0.035);
    const stripe = Math.abs(z) > 0.045 || Math.abs(z) < 0.012 ? 0.75 : 0.05;
    c.copy(lean).lerp(fat, stripe);
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

function marshmallowGeometry() {
  const g = new THREE.CylinderGeometry(0.095, 0.1, 0.13, 22, 3);
  const p = g.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const white = new THREE.Color('#fff4ec');
  const toast = new THREE.Color('#c9853f');
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const n = noise2(p.getX(i) * 30, p.getZ(i) * 30);
    c.copy(white).lerp(toast, clamp01((y + 0.02) * 9 * (0.6 + n * 0.6)));
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return g;
}

/** A fried chicken strip: a flattened capsule with a craggy, unevenly browned crumb. */
function chickenGeometry() {
  const HALF_LEN = 0.23;
  const g = new THREE.CapsuleGeometry(0.15, HALF_LEN * 2, 12, 24).rotateZ(Math.PI / 2);
  const p = g.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const light = new THREE.Color('#e3a24a');
  const dark = new THREE.Color('#7a3d10');
  const c = new THREE.Color();
  const v = new THREE.Vector3();
  const out = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // push each point out along its normal (away from the nearest point on the axis) by a crumb of noise
    out.set(v.x - Math.min(HALF_LEN, Math.max(-HALF_LEN, v.x)), v.y, v.z).normalize();
    const n1 = noise2(v.x * 8 + 3, v.z * 8 + v.y * 5);
    const n2 = noise2(v.x * 40, v.z * 40 + v.y * 25);
    v.addScaledVector(out, (n1 - 0.5) * 0.05 + (n2 - 0.5) * 0.035);
    // tenders are flat and broad
    v.y *= 0.5;
    v.z *= 1.12;
    p.setXYZ(i, v.x, v.y, v.z);
    c.copy(light).lerp(dark, clamp01(Math.pow(n2, 1.6) * 1.1 + (n1 - 0.5) * 0.9));
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

function shavingGeometry() {
  const g = new THREE.BoxGeometry(0.22, 0.012, 0.06, 10, 1, 1);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    p.setY(i, p.getY(i) + x * x * 1.4);
  }
  g.computeVertexNormals();
  return g;
}

interface Kind {
  geometry: () => THREE.BufferGeometry;
  material: () => THREE.Material;
  /** how high the item's centre sits above whatever it rests on */
  lift: number;
  /** rests on the wall tops (large items) rather than dropping into pockets */
  onTop?: boolean;
  /** may land on the scoop */
  onScoop?: boolean;
  scale: [number, number];
  tilt: number;
}

const std = (color: string, roughness = 0.6, extra: THREE.MeshStandardMaterialParameters = {}) => () =>
  new THREE.MeshStandardMaterial({ color, roughness, ...extra });

const KINDS: Record<ToppingType, Kind> = {
  banana: { geometry: () => new THREE.CylinderGeometry(0.125, 0.125, 0.045, 26), material: std('#f0d672', 0.45), lift: 0.03, onTop: true, scale: [0.9, 1.1], tilt: 0.25 },
  almond: { geometry: () => new THREE.SphereGeometry(0.088, 12, 8).scale(1, 0.22, 0.62), material: std('#d7a95f', 0.6), lift: 0.018, onScoop: true, scale: [0.85, 1.2], tilt: 0.9 },
  oreo: { geometry: () => new THREE.DodecahedronGeometry(0.036, 0).scale(1, 0.55, 1), material: std('#1c1412', 0.85), lift: 0.015, onScoop: true, scale: [0.6, 1.5], tilt: 3 },
  sprinkle: { geometry: () => new THREE.CapsuleGeometry(0.011, 0.05, 2, 6), material: std('#ffffff', 0.4), lift: 0.012, onScoop: true, scale: [0.9, 1.1], tilt: 3 },
  floss: {
    geometry: () => displace(new THREE.SphereGeometry(0.24, 20, 16), 0.12, 9),
    material: std('#ffffff', 1, { transparent: true, opacity: 0.92 }),
    lift: 0.12,
    onTop: true,
    scale: [0.75, 1.35],
    tilt: 3,
  },
  marshmallow: { geometry: marshmallowGeometry, material: () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 }), lift: 0.065, onTop: true, scale: [0.9, 1.1], tilt: 0.3 },
  shaving: { geometry: shavingGeometry, material: std('#2a1309', 0.45), lift: 0.03, onScoop: true, scale: [0.7, 1.2], tilt: 0.8 },
  strawberry: { geometry: () => new THREE.SphereGeometry(0.13, 20, 16).scale(0.9, 0.55, 1.2), material: std('#cf2a40', 0.35), lift: 0.05, onTop: true, scale: [0.85, 1.15], tilt: 0.5 },
  blueberry: { geometry: () => new THREE.SphereGeometry(0.058, 14, 12).scale(1, 0.85, 1), material: std('#2b2c5e', 0.3), lift: 0.045, onScoop: true, scale: [0.85, 1.15], tilt: 3 },
  chunk: { geometry: () => new THREE.BoxGeometry(0.1, 0.065, 0.08), material: std('#ffffff', 0.55), lift: 0.035, onScoop: true, scale: [0.6, 1.3], tilt: 1.2 },
  chicken: {
    geometry: chickenGeometry,
    material: () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }),
    lift: 0.07,
    onTop: true,
    scale: [0.95, 1.05],
    tilt: 0.12,
  },
  bacon: { geometry: baconGeometry, material: () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 }), lift: 0.04, onTop: true, scale: [0.95, 1.05], tilt: 0.12 },
  chip: { geometry: () => new THREE.ConeGeometry(0.03, 0.045, 8), material: std('#3a1c0c', 0.5), lift: 0.02, onScoop: true, scale: [0.8, 1.2], tilt: 0.4 },
  nut: { geometry: () => new THREE.DodecahedronGeometry(0.032), material: std('#b8874f', 0.75), lift: 0.02, onScoop: true, scale: [0.7, 1.3], tilt: 3 },
};

/* ---------- placement ---------- */

interface Placed {
  matrix: THREE.Matrix4;
  color?: THREE.Color;
  delay: number;
}

function scoopSurface(x: number, z: number, sx: number, sz: number, sy: number) {
  const d = Math.hypot(x - sx, z - sz);
  if (d >= SCOOP_R * 0.92) return null;
  return sy + Math.sqrt(SCOOP_R * SCOOP_R - d * d) * 0.86;
}

function place(type: ToppingType, count: number, rand: () => number, scoop: THREE.Vector3 | null, colors?: string[]): Placed[] {
  const k = KINDS[type];
  const out: Placed[] = [];
  const m = 0.12;
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  let tries = 0;
  while (out.length < count && tries < count * 40) {
    tries++;
    let x = -W / 2 + m + rand() * (W - 2 * m);
    let z = -D / 2 + m + rand() * (D - 2 * m);
    if (type === 'chicken' || type === 'bacon') {
      // lay the strips side by side across the piece
      const lane = out.length / Math.max(1, count - 1) - 0.5;
      x = (rand() - 0.5) * 0.12;
      z = lane * (D - 0.55);
    }
    let y = (k.onTop ? REST : surfaceAt(HALF, x, z).y) + k.lift;
    if (scoop) {
      const top = scoopSurface(x, z, scoop.x, scoop.z, scoop.y);
      if (top !== null) {
        if (!k.onScoop) continue;
        y = top + k.lift * 0.6;
      }
    }
    const sc = k.scale[0] + rand() * (k.scale[1] - k.scale[0]);
    s.set(sc, sc, sc);
    const yaw = type === 'chicken' ? (rand() - 0.5) * 0.9 : type === 'bacon' ? (rand() - 0.5) * 0.35 : rand() * Math.PI * 2;
    e.set((rand() - 0.5) * k.tilt, yaw, (rand() - 0.5) * k.tilt);
    q.setFromEuler(e);
    p.set(x, y, z);
    out.push({
      matrix: new THREE.Matrix4().compose(p, q, s),
      color: colors ? new THREE.Color(colors[Math.floor(rand() * colors.length)]) : undefined,
      delay: rand(),
    });
  }
  return out;
}

function drizzleCurve(rand: () => number, scoop: THREE.Vector3 | null, phase: number) {
  const pts: THREE.Vector3[] = [];
  const zig = 7;
  const m = 0.16;
  for (let i = 0; i <= zig; i++) {
    const t = i / zig;
    const x = -W / 2 + m + t * (W - 2 * m) + (rand() - 0.5) * 0.08;
    const side = (i + phase) % 2 === 0 ? -1 : 1;
    const z = side * (D / 2 - m - rand() * 0.12);
    pts.push(new THREE.Vector3(x, 0, z));
  }
  // walk the zig-zag and lift each point onto whatever it crosses
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2);
  const fine = curve.getPoints(90).map(v => {
    let y = REST + 0.03;
    if (scoop) {
      const top = scoopSurface(v.x, v.z, scoop.x, scoop.z, scoop.y);
      if (top !== null) y = Math.max(y, top + 0.02);
    }
    return new THREE.Vector3(v.x, y, v.z);
  });
  return new THREE.CatmullRomCurve3(fine, false, 'catmullrom', 0.5);
}

/* ---------- the dressing ---------- */

interface DressingProps {
  recipe: Recipe;
  seed: number;
}

export function Dressing({ recipe, seed }: DressingProps) {
  const progress = useRef({ t: 0 });
  const scoopRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const instRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const poolRef = useRef<THREE.InstancedMesh>(null);
  const settled = useRef(false);

  const built = useMemo(() => {
    const rand = rng(seed * 977 + recipe.id.length * 131 + recipe.id.charCodeAt(0));
    const scoop = recipe.scoop ? new THREE.Vector3((rand() - 0.5) * 0.3, REST + 0.13, (rand() - 0.5) * 0.3) : null;

    const groups = recipe.toppings.map(t => {
      const kind = KINDS[t.type];
      const items = place(t.type, t.count, rand, scoop, t.colors);
      return { type: t.type, items, geometry: kind.geometry(), material: kind.material(), colored: !!t.colors };
    });

    const drizzles = recipe.drizzle.map((color, i) => {
      const curve = drizzleCurve(rand, scoop, i);
      const geometry = new THREE.TubeGeometry(curve, 260, 0.03 - i * 0.005, 8, false);
      const material = new THREE.MeshPhysicalMaterial({ color, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 });
      return { geometry, material, count: geometry.index!.count };
    });

    let pools: { matrices: THREE.Matrix4[]; geometry: THREE.BufferGeometry; material: THREE.Material } | null = null;
    if (recipe.pool) {
      const centres = pocketCentres(HALF).filter(() => rand() < recipe.pool!.share);
      const size = HALF.cell - HALF.wall * 1.1;
      pools = {
        matrices: centres.map(([x, z]) => new THREE.Matrix4().makeTranslation(x, HALF.base + HALF.depth * 0.55, z)),
        geometry: new THREE.BoxGeometry(size, 0.03, size),
        material: new THREE.MeshPhysicalMaterial({ color: recipe.pool.color, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
      };
    }

    let dust: THREE.BufferGeometry | null = null;
    if (recipe.dust) {
      const pts: number[] = [];
      for (let i = 0; i < 320; i++) {
        const x = (rand() - 0.5) * (W - 0.1);
        const z = (rand() - 0.5) * (D - 0.1);
        let y = surfaceAt(HALF, x, z).y + 0.012;
        if (scoop) {
          const top = scoopSurface(x, z, scoop.x, scoop.z, scoop.y);
          if (top !== null) y = top + 0.01;
        }
        pts.push(x, y, z);
      }
      dust = new THREE.BufferGeometry();
      dust.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    }

    return {
      scoop,
      scoopGeometry: scoop ? scoopGeometry() : null,
      scoopMaterial: new THREE.MeshPhysicalMaterial({ color: '#f9ead0', roughness: 0.62, sheen: 0.4, sheenColor: new THREE.Color('#fff6e6') }),
      groups,
      drizzles,
      pools,
      dust,
      dustMaterial: new THREE.PointsMaterial({ color: '#ffffff', size: 0.02, transparent: true, opacity: 0, depthWrite: false }),
    };
  }, [recipe, seed]);

  // Dispose everything this dressing made when it is swapped for another.
  useLayoutEffect(
    () => () => {
      built.scoopGeometry?.dispose();
      built.scoopMaterial.dispose();
      built.groups.forEach(g => {
        g.geometry.dispose();
        g.material.dispose();
      });
      built.drizzles.forEach(d => {
        d.geometry.dispose();
        d.material.dispose();
      });
      built.pools?.geometry.dispose();
      built.pools?.material.dispose();
      built.dust?.dispose();
      built.dustMaterial.dispose();
    },
    [built],
  );

  // Instance colours are set once; the drop-in animation then runs on `progress.t`.
  useLayoutEffect(() => {
    built.groups.forEach((g, gi) => {
      const mesh = instRefs.current[gi];
      if (!mesh) return;
      g.items.forEach((it, i) => {
        mesh.setMatrixAt(i, it.matrix);
        if (it.color) mesh.setColorAt(i, it.color);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    if (poolRef.current && built.pools) {
      built.pools.matrices.forEach((m, i) => poolRef.current!.setMatrixAt(i, m));
      poolRef.current.instanceMatrix.needsUpdate = true;
    }
    settled.current = false;
    progress.current.t = 0;
    const tween = gsap.to(progress.current, { t: 1, duration: 2.1, ease: 'none' });
    return () => {
      tween.kill();
    };
  }, [built]);

  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() }), []);

  useFrame(() => {
    if (settled.current) return;
    const t = progress.current.t;

    // 1. sauce pools rise in the pockets
    if (poolRef.current && built.pools) {
      const k = clamp01(t / 0.25);
      built.pools.matrices.forEach((m, i) => {
        m.decompose(tmp.p, tmp.q, tmp.s);
        tmp.s.set(1, Math.max(0.001, k), 1);
        tmp.m.compose(tmp.p, tmp.q, tmp.s);
        poolRef.current!.setMatrixAt(i, tmp.m);
      });
      poolRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. the scoop drops and settles
    if (scoopRef.current && built.scoop) {
      const k = easeOutBack(clamp01((t - 0.05) / 0.3));
      scoopRef.current.position.set(built.scoop.x, built.scoop.y + (1 - k) * 1.4, built.scoop.z);
      scoopRef.current.scale.setScalar(Math.max(0.001, 0.4 + 0.6 * k));
    }

    // 3. sauce is drizzled on
    built.drizzles.forEach((d, i) => {
      const k = clamp01((t - 0.3 - i * 0.08) / 0.35);
      d.geometry.setDrawRange(0, Math.floor((d.count * k) / 3) * 3);
    });

    // 4. toppings rain down in a stagger
    built.groups.forEach((g, gi) => {
      const mesh = instRefs.current[gi];
      if (!mesh) return;
      g.items.forEach((it, i) => {
        const start = 0.28 + gi * 0.08 + it.delay * 0.25;
        const k = easeOutBack(clamp01((t - start) / 0.28));
        it.matrix.decompose(tmp.p, tmp.q, tmp.s);
        tmp.p.y += (1 - k) * 1.3;
        tmp.s.multiplyScalar(Math.max(0.001, k));
        tmp.m.compose(tmp.p, tmp.q, tmp.s);
        mesh.setMatrixAt(i, tmp.m);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });

    // 5. a dusting of icing sugar last
    if (built.dust) built.dustMaterial.opacity = clamp01((t - 0.75) / 0.25) * 0.95;

    if (t >= 1) settled.current = true;
  });

  return (
    <group>
      {built.pools && (
        <instancedMesh
          ref={poolRef}
          args={[built.pools.geometry, built.pools.material, built.pools.matrices.length]}
          castShadow={false}
          receiveShadow
        />
      )}
      {built.scoop && built.scoopGeometry && (
        <mesh ref={scoopRef} geometry={built.scoopGeometry} material={built.scoopMaterial} castShadow receiveShadow />
      )}
      {built.drizzles.map((d, i) => (
        <mesh key={i} geometry={d.geometry} material={d.material} castShadow />
      ))}
      {built.groups.map((g, gi) => (
        <instancedMesh
          key={g.type + gi}
          ref={el => {
            instRefs.current[gi] = el;
          }}
          args={[g.geometry, g.material, g.items.length]}
          castShadow
          receiveShadow
        />
      ))}
      {built.dust && <points ref={dustRef} geometry={built.dust} material={built.dustMaterial} />}
    </group>
  );
}
