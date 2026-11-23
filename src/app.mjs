import { DEFAULTS, createModel, advance, sample, toCSV } from './model.mjs';

const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');
const controls = Object.fromEntries(['rate','reflect','speed','memory','render'].map(name => [name, document.getElementById(name)]));
const labels = {
  rate: value => `${value} / min`,
  reflect: value => (value / 100).toFixed(2),
  speed: value => `${(value / 100).toFixed(2)}×`,
  memory: value => (value / 100).toFixed(2),
  render: value => (value / 100).toFixed(2),
};
let model = createModel();
let paused = false;
let previous = 0;
let accumulator = 0;
let lastSample = -1;
let samples = [];
const FIXED_DT = 0.02;
const reset = () => {
  model = createModel(readParams());
  samples = [sample(model)];
  lastSample = 0;
  accumulator = 0;
};
function readParams() {
  return {
    rate: Number(controls.rate.value),
    reflect: Number(controls.reflect.value) / 100,
    speed: Number(controls.speed.value) / 100,
    memory: Number(controls.memory.value) / 100,
    render: Number(controls.render.value) / 100,
  };
}
Object.entries(controls).forEach(([key, element]) => element.addEventListener('input', () => {
  document.getElementById(`${key}-val`).textContent = labels[key](Number(element.value));
  model.params = { ...model.params, ...readParams() };
}));
document.getElementById('toggle').addEventListener('click', event => {
  paused = !paused;
  event.currentTarget.textContent = paused ? 'Resume simulation' : 'Pause simulation';
  event.currentTarget.setAttribute('aria-pressed', String(paused));
});
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('export').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([toCSV(samples)], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'pwr369-synthetic-run.csv';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 250);
});
let width = 800;
let height = 530;
let dpr = 1;
function resize() {
  const rect = canvas.getBoundingClientRect();
  dpr = Math.min(2, devicePixelRatio || 1);
  width = Math.max(320, Math.round(rect.width));
  height = Math.max(300, Math.round(rect.height));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();
// Seeded dot geometry makes rendering reproducible, without changing simulation state.
let seed = 369;
function random() {
  seed = (1664525 * seed + 1013904223) >>> 0;
  return seed / 4294967296;
}
const dots = Array.from({ length: 740 }, () => ({
  angle: random() * 2 * Math.PI,
  radius: Math.sqrt(random()),
  size: 0.35 + random() * 1.5,
  phase: random() * 2 * Math.PI,
  color: random(),
}));
function render(now) {
  const cx = width * 0.5;
  const cy = height * 0.49;
  const boundary = Math.min(width * 0.43, height * 0.39);
  const scale = boundary / model.params.radius;
  const gain = model.params.render;
  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, boundary * 1.6);
  bg.addColorStop(0, '#1a2951');
  bg.addColorStop(0.52, '#0e1835');
  bg.addColorStop(1, '#070b18');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, boundary, 0, 2 * Math.PI);
  ctx.clip();
  for (const dot of dots) {
    const angle = dot.angle + 0.008 * Math.sin(now * 0.45 + dot.phase);
    const radius = dot.radius * boundary;
    let field = 0;
    for (const wave of model.waves) {
      const delta = Math.abs(dot.radius * model.params.radius - wave.radius);
      field += wave.amplitude * Math.exp(-delta * delta / 90) * (wave.direction > 0 ? 1 : -0.65);
    }
    const wobble = (2.2 + gain * 5) * Math.sin(now * 1.3 + dot.phase + radius * 0.04) + field * 3;
    const x = cx + Math.cos(angle) * (radius + wobble);
    const y = cy + Math.sin(angle) * (radius + wobble);
    const red = dot.color > 0.68;
    const blue = dot.color < 0.31;
    ctx.fillStyle = red ? `rgba(255,159,169,${0.12 + gain * 0.36})`
      : blue ? `rgba(119,171,253,${0.18 + gain * 0.42})`
      : `rgba(119,239,230,${0.15 + gain * 0.38})`;
    ctx.beginPath();
    ctx.arc(x, y, dot.size * (0.4 + gain * 0.75), 0, 2 * Math.PI);
    ctx.fill();
  }
  for (let i = 1; i <= 4; i++) {
    ctx.strokeStyle = 'rgba(105,140,210,.09)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, boundary * i / 4, 0, 2 * Math.PI);
    ctx.stroke();
  }
  for (const wave of model.waves) {
    const col = wave.direction === 1 ? '255,186,122' : '101,224,226';
    const radius = Math.max(0, wave.radius * scale);
    const alpha = Math.min(0.9, (0.16 + gain * 0.52) * wave.amplitude);
    ctx.shadowBlur = 18 + gain * 24;
    ctx.shadowColor = `rgba(${col},.7)`;
    ctx.strokeStyle = `rgba(${col},${alpha})`;
    ctx.lineWidth = 1.1 + 2 * gain * wave.amplitude;
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, 2 * Math.PI); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(${col},${alpha * 0.34})`;
    ctx.lineWidth = 10 * gain * scale;
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, 2 * Math.PI); ctx.stroke();
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = '#86cdd6a0';
  ctx.lineWidth = 1.7;
  ctx.setLineDash([6, 8]);
  ctx.beginPath(); ctx.arc(cx, cy, boundary, 0, 2 * Math.PI); ctx.stroke();
  ctx.setLineDash([]);
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20 + model.memory * 13);
  glow.addColorStop(0, '#fff6de');
  glow.addColorStop(0.22, '#f0b7ff');
  glow.addColorStop(0.6, 'rgba(173,125,247,.4)');
  glow.addColorStop(1, 'rgba(114,100,190,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, 28 + model.memory * 14, 0, 2 * Math.PI); ctx.fill();
  ctx.restore();
  ctx.font = '11px system-ui,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b4c9df';
  ctx.fillText('PULSE / SOURCE', cx, cy + 42 + model.memory * 3);
  ctx.fillStyle = '#8bd0db';
  ctx.fillText('BOUNDARY / JUNCTION', cx, cy - boundary - 14);
  document.getElementById('pCount').textContent = model.pulseCount;
  document.getElementById('rCount').textContent = model.returnCount;
  document.getElementById('mLevel').textContent = model.memory.toFixed(2);
  document.getElementById('simTime').textContent = model.time.toFixed(1) + ' s';
}
function frame(timestamp) {
  const now = timestamp / 1000;
  if (!previous) previous = now;
  const delta = Math.min(0.1, now - previous);
  previous = now;
  if (!paused) {
    accumulator += delta;
    while (accumulator >= FIXED_DT) {
      advance(model, FIXED_DT);
      accumulator -= FIXED_DT;
      if (model.time - lastSample >= 0.2 - 1e-8) {
        samples.push(sample(model));
        lastSample = model.time;
      }
    }
  }
  render(now);
  requestAnimationFrame(frame);
}
reset();
requestAnimationFrame(frame);
