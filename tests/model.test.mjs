import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, createModel, advance, sample, runSynthetic, toCSV, validateParams } from '../src/model.mjs';

test('zero reflection means no inbound waves, no return count and no stored residue', () => {
  const { model } = runSynthetic({ reflect: 0 }, 12);
  assert.equal(model.returnCount, 0);
  assert.equal(model.memory, 0);
  assert.equal(model.waves.some(w => w.direction < 0), false);
});

test('nonzero reflection yields delayed response and memory', () => {
  const model = createModel({ rate: 30, reflect: 0.8, speed: 1 });
  for (let i = 0; i < 100; i++) advance(model, 0.02);
  assert.equal(model.returnCount, 0, 'boundary not reached at 2 seconds');
  for (let i = 0; i < 120; i++) advance(model, 0.02);
  assert.ok(model.returnCount > 0, 'return after boundary crossing');
  for (let i = 0; i < 150; i++) advance(model, 0.02);
  assert.ok(model.memory > 0, 'return reached the source and left residue');
});

test('no input and no returns causes memory to decay monotonically', () => {
  const model = createModel({ rate: 1, reflect: 0, memory: 0.5 });
  model.nextPulse = 1e9;
  model.memory = 1;
  advance(model, 0.25);
  const first = model.memory;
  advance(model, 0.25);
  assert.ok(first < 1);
  assert.ok(model.memory < first);
});

test('simulation is deterministic for identical parameters and timesteps', () => {
  const a = runSynthetic({ rate: 57, reflect: 0.41 }, 13);
  const b = runSynthetic({ rate: 57, reflect: 0.41 }, 13);
  assert.deepEqual(a.samples, b.samples);
});

test('render gain does not alter the modeled physical state', () => {
  const low = runSynthetic({ render: 0 }, 12);
  const high = runSynthetic({ render: 1 }, 12);
  assert.deepEqual(low.samples, high.samples);
});

test('rate drives number of pulses over fixed simulated duration', () => {
  const slow = runSynthetic({ rate: 30 }, 10);
  const fast = runSynthetic({ rate: 120 }, 10);
  assert.ok(fast.model.pulseCount > slow.model.pulseCount);
});

test('controls have bounded validated parameters', () => {
  const p = validateParams({ rate: -5, reflect: 2, memory: NaN, speed: 0 });
  assert.equal(p.rate, 1);
  assert.equal(p.reflect, 1);
  assert.equal(p.memory, DEFAULTS.memory);
  assert.equal(p.speed, 0.05);
});

test('CSV retains schema and sampled data', () => {
  const csv = toCSV(runSynthetic({}, 1).samples);
  assert.match(csv, /^time,pulses,returns,outbound,inbound,memory\n/);
  assert.ok(csv.split('\n').length > 3);
});

test('invalid timesteps are ignored and oversized steps fail loudly', () => {
  const m = createModel();
  advance(m, -1);
  assert.equal(sample(m).time, 0);
  assert.throws(() => advance(m, 1), RangeError);
});
