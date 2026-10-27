import * as THREE from 'three';

/** A Belgian waffle piece: a slab whose top is a grid of deep square pockets. */
export interface WaffleSpec {
  cols: number;
  rows: number;
  /** pocket pitch */
  cell: number;
  /** wall thickness between pockets */
  wall: number;
  /** wall height above the pocket floor */
  depth: number;
  /** pocket floor height above the bottom */
  base: number;
  /** grid segments per cell (mesh density) */
  seg: number;
}

export const HALF: WaffleSpec = { cols: 4, rows: 4, cell: 0.42, wall: 0.105, depth: 0.15, base: 0.13, seg: 16 };

export const waffleSize = (s: WaffleSpec) => ({ width: s.cols * s.cell + s.wall, depth: s.rows * s.cell + s.wall });

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Smooth value noise, 0..1 */
export function noise2(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Height of the top surface at local (x, z), centred on the piece. r = 1 on a wall, 0 in a pocket. */
export function surfaceAt(s: WaffleSpec, x: number, z: number, rim = true) {
  const { width: W, depth: D } = waffleSize(s);
  const u = x + W / 2;
  const v = z + D / 2;
  const hw = s.wall / 2;
  const gx = (u - hw) / s.cell;
  const gz = (v - hw) / s.cell;
  const dx = Math.abs(gx - Math.round(gx)) * s.cell;
  const dz = Math.abs(gz - Math.round(gz)) * s.cell;
  const rx = 1 - smoothstep(hw * 0.5, hw * 1.45, dx);
  const rz = 1 - smoothstep(hw * 0.5, hw * 1.45, dz);
  const r = Math.max(rx, rz);
  // pockets are slightly dished, walls slightly crowned
  const dish = (1 - r) * 0.012 * (Math.cos((gx % 1) * Math.PI * 2) + Math.cos((gz % 1) * Math.PI * 2));
  let y = s.base + s.depth * r - dish;
  // the outer rim of a square piece rolls over into the side (a round piece does its own rim)
  if (rim) {
    const edge = Math.min(u, W - u, v, D - v);
    y *= 0.8 + 0.2 * smoothstep(0, s.wall * 0.75, edge);
  }
  return { y, r };
}

/** A round Belgian waffle: the same pocket grid, cut to a disc. */
export const ROUND: WaffleSpec = { cols: 5, rows: 5, cell: 0.4, wall: 0.11, depth: 0.16, base: 0.14, seg: 16 };

export function buildRoundWaffleGeometry(s: WaffleSpec = ROUND, seed = 3): THREE.BufferGeometry {
  const R = waffleSize(s).width / 2;
  const nr = 56;
  const ns = 144;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const c = new THREE.Color();
  const stride = ns + 1;

  // Top surface in polar rings, so the edge is a true circle.
  for (let i = 0; i <= nr; i++) {
    const rad = (i / nr) * R;
    for (let j = 0; j <= ns; j++) {
      const th = (j / ns) * Math.PI * 2;
      const x = Math.cos(th) * rad;
      const z = Math.sin(th) * rad;
      const { y, r } = surfaceAt(s, x, z, false);
      const edge = smoothstep(0, s.wall * 0.9, R - rad);
      // a solid raised rim all the way round, so the edge is a clean circle
      const rim = smoothstep(R - s.wall * 1.7, R - s.wall * 0.7, rad);
      const top = s.base + s.depth;
      const n = noise2(x * 7 + seed * 13, z * 7) * 0.6 + noise2(x * 21, z * 21 + seed * 7) * 0.4;
      pos.push(x, (y + (top - y) * rim) * (0.78 + 0.22 * edge) + (n - 0.5) * 0.008, z);
      const toast = Math.min(1, Math.max(0, Math.max(r, rim) * 0.78 + (n - 0.5) * 0.45 + 0.08));
      c.copy(POCKET).lerp(RIDGE, toast);
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < nr; i++) {
    for (let j = 0; j < ns; j++) {
      const a = i * stride + j;
      const b = a + 1;
      const cc = a + stride;
      const d = cc + 1;
      idx.push(a, b, cc, b, d, cc);
    }
  }

  // Side wall and underside.
  const outer = nr * stride;
  const sideStart = pos.length / 3;
  for (let j = 0; j <= ns; j++) {
    const k = (outer + j) * 3;
    const x = pos[k];
    const y = pos[k + 1];
    const z = pos[k + 2];
    pos.push(x, y, z);
    col.push(SIDE.r, SIDE.g, SIDE.b);
    pos.push(x * 0.985, 0, z * 0.985);
    col.push(UNDER.r, UNDER.g, UNDER.b);
  }
  for (let j = 0; j < ns; j++) {
    const t1 = sideStart + j * 2;
    const b1 = t1 + 1;
    const t2 = sideStart + (j + 1) * 2;
    const b2 = t2 + 1;
    idx.push(t1, t2, b1, b1, t2, b2);
  }
  const center = pos.length / 3;
  pos.push(0, 0, 0);
  col.push(UNDER.r, UNDER.g, UNDER.b);
  for (let j = 0; j < ns; j++) {
    idx.push(center, sideStart + j * 2 + 1, sideStart + (j + 1) * 2 + 1);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** The top of the walls, for resting toppings on. */
export const restHeight = (s: WaffleSpec) => s.base + s.depth;

const POCKET = new THREE.Color('#f2bd62');
const RIDGE = new THREE.Color('#b9671f');
const SIDE = new THREE.Color('#cf873a');
const UNDER = new THREE.Color('#b8702a');

export function buildWaffleGeometry(s: WaffleSpec, seed = 1): THREE.BufferGeometry {
  const { width: W, depth: D } = waffleSize(s);
  const nx = Math.round(s.cols * s.seg) + 1;
  const nz = Math.round(s.rows * s.seg) + 1;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const c = new THREE.Color();

  // Top surface
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const x = -W / 2 + (i / (nx - 1)) * W;
      const z = -D / 2 + (j / (nz - 1)) * D;
      const { y, r } = surfaceAt(s, x, z);
      const n = noise2(x * 7 + seed * 13, z * 7) * 0.6 + noise2(x * 21, z * 21 + seed * 7) * 0.4;
      pos.push(x, y + (n - 0.5) * 0.008, z);
      // ridges toast darker than pocket floors, with an uneven bake
      const toast = Math.min(1, Math.max(0, r * 0.78 + (n - 0.5) * 0.45 + 0.08));
      c.copy(POCKET).lerp(RIDGE, toast);
      col.push(c.r, c.g, c.b);
    }
  }
  for (let j = 0; j < nz - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i;
      const b = a + 1;
      const cc = a + nx;
      const d = cc + 1;
      idx.push(a, cc, b, b, cc, d);
    }
  }

  // Perimeter, walked around the top grid
  const ring: number[] = [];
  for (let i = 0; i < nx; i++) ring.push(i);
  for (let j = 1; j < nz; j++) ring.push(j * nx + (nx - 1));
  for (let i = nx - 2; i >= 0; i--) ring.push((nz - 1) * nx + i);
  for (let j = nz - 2; j >= 1; j--) ring.push(j * nx);

  // Sides (own vertices, so the edge reads crisp)
  const sideStart = pos.length / 3;
  for (const k of ring) {
    const x = pos[k * 3];
    const y = pos[k * 3 + 1];
    const z = pos[k * 3 + 2];
    pos.push(x, y, z);
    col.push(SIDE.r, SIDE.g, SIDE.b);
    pos.push(x * 0.985, 0, z * 0.985);
    col.push(UNDER.r, UNDER.g, UNDER.b);
  }
  for (let k = 0; k < ring.length; k++) {
    const k2 = (k + 1) % ring.length;
    const t1 = sideStart + k * 2;
    const b1 = t1 + 1;
    const t2 = sideStart + k2 * 2;
    const b2 = t2 + 1;
    idx.push(t1, t2, b1, b1, t2, b2);
  }

  // Underside
  const center = pos.length / 3;
  pos.push(0, 0, 0);
  col.push(UNDER.r, UNDER.g, UNDER.b);
  for (let k = 0; k < ring.length; k++) {
    const k2 = (k + 1) % ring.length;
    idx.push(center, sideStart + k * 2 + 1, sideStart + k2 * 2 + 1);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Centres of every pocket, for pooling sauce. */
export function pocketCentres(s: WaffleSpec) {
  const { width: W, depth: D } = waffleSize(s);
  const out: [number, number][] = [];
  for (let j = 0; j < s.rows; j++) {
    for (let i = 0; i < s.cols; i++) {
      out.push([-W / 2 + s.wall / 2 + s.cell * (i + 0.5), -D / 2 + s.wall / 2 + s.cell * (j + 0.5)]);
    }
  }
  return out;
}

/** Seeded random numbers so a recipe always dresses the waffle the same way. */
export function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
