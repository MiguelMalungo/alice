/** Gold sparkle bursts on a fixed Canvas 2D layer. `burst(x, y)` in viewport px. */
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; rot: number };

const canvas = document.getElementById('fx') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const parts: P[] = [];
let raf = 0;
let dpr = 1;

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
addEventListener('resize', resize);

function star(x: number, y: number, r: number, rot: number) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = rot + (i * Math.PI) / 4;
    const rr = i % 2 ? r * 0.38 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life++;
    p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.96; p.rot += 0.1;
    const t = p.life / p.max;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = t < 0.4 ? '#F3D27A' : '#C4933A';
    star(p.x, p.y, p.r * (1 - t * 0.6), p.rot);
    if (p.life >= p.max) parts.splice(i, 1);
  }
  ctx.globalAlpha = 1;
  raf = parts.length ? requestAnimationFrame(tick) : 0;
}

export function burst(x: number, y: number, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 2 + Math.random() * 4;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, life: 0, max: 26 + Math.random() * 16, r: 4 + Math.random() * 5, rot: Math.random() * 6 });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
