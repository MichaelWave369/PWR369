/** PWR-369 synthetic pulse-wave-return system.
 * This simulation is not a sensor or a model of literal energy traveling through a body.
 * All times are simulated seconds; lengths are arbitrary display units.
 */
export const DEFAULTS = Object.freeze({
  rate: 66,         // pulses per simulated minute
  reflect: 0.65,    // reflected fraction in [0, 1]
  speed: 1,         // propagation multiplier
  memory: 0.78,    // retention factor for one second
  render: 0.70,    // graphics gain ONLY; not used in state transition
  radius: 200,
  pulseGain: 0.14,
  returnMemoryGain: 0.44,
});

function bounded(value, lo, hi, fallback) {
  return Number.isFinite(value) ? Math.min(hi, Math.max(lo, value)) : fallback;
}
export function validateParams(values = {}) {
  const v = { ...DEFAULTS, ...values };
  return {
    rate: bounded(v.rate, 1, 240, DEFAULTS.rate),
    reflect: bounded(v.reflect, 0, 1, DEFAULTS.reflect),
    speed: bounded(v.speed, 0.05, 5, DEFAULTS.speed),
    memory: bounded(v.memory, 0, 0.999, DEFAULTS.memory),
    render: bounded(v.render, 0, 1, DEFAULTS.render),
    radius: bounded(v.radius, 1, 10000, DEFAULTS.radius),
    pulseGain: bounded(v.pulseGain, 0, 1, DEFAULTS.pulseGain),
    returnMemoryGain: bounded(v.returnMemoryGain, 0, 2, DEFAULTS.returnMemoryGain),
  };
}

export function createModel(values = {}) {
  return {
    params: validateParams(values),
    time: 0,
    nextPulse: 0,
    pulseCount: 0,
    returnCount: 0,
    memory: 0,
    waves: [],
    nextId: 1,
    history: [],
  };
}

function inject(model) {
  const amplitude = Math.min(1.75, 1 + model.params.pulseGain * model.memory);
  model.waves.push({ id: model.nextId++, direction: 1, radius: 0, amplitude, age: 0 });
  model.pulseCount++;
}

/** Deterministic simulation step; returns the supplied model. */
export function advance(model, dt) {
  if (!Number.isFinite(dt) || dt <= 0) return model;
  if (dt > 0.25) throw new RangeError('Step must be <= 0.25 simulated seconds');
  const params = model.params;
  model.time += dt;
  while (model.nextPulse <= model.time + 1e-10) {
    inject(model);
    model.nextPulse += 60 / params.rate;
  }
  model.memory *= Math.pow(params.memory, dt);
  const speedPerSecond = params.speed * 85;
  for (const wave of model.waves) {
    wave.age += dt;
    wave.radius += wave.direction * speedPerSecond * dt;
    if (wave.direction === 1 && wave.radius >= params.radius) {
      // Keep overshoot for better numerical fidelity with fixed steps.
      const overshoot = wave.radius - params.radius;
      wave.radius = params.radius - overshoot;
      wave.direction = -1;
      wave.amplitude *= params.reflect;
      if (wave.amplitude > 1e-8) model.returnCount++;
    }
    if (wave.direction === -1 && wave.radius <= 0) {
      model.memory = Math.min(4, model.memory + wave.amplitude * params.returnMemoryGain);
      wave.dead = true;
    }
    if (wave.age > 30 || wave.amplitude <= 1e-8) wave.dead = true;
  }
  model.waves = model.waves.filter(wave => !wave.dead);
  return model;
}

export function sample(model) {
  return {
    time: Number(model.time.toFixed(4)),
    pulses: model.pulseCount,
    returns: model.returnCount,
    outbound: model.waves.filter(w => w.direction === 1).length,
    inbound: model.waves.filter(w => w.direction === -1).length,
    memory: Number(model.memory.toFixed(6)),
  };
}
export function runSynthetic(values = {}, seconds = 15, step = 0.02, sampleEvery = 0.2) {
  const m = createModel(values);
  const samples = [sample(m)];
  let nextSample = sampleEvery;
  const iterations = Math.ceil(seconds / step);
  for (let i = 0; i < iterations; i++) {
    advance(m, step);
    if (m.time + 1e-8 >= nextSample) {
      samples.push(sample(m));
      nextSample += sampleEvery;
    }
  }
  return { model: m, samples };
}
export function toCSV(samples) {
  const keys = ['time', 'pulses', 'returns', 'outbound', 'inbound', 'memory'];
  return [keys.join(','), ...samples.map(row => keys.map(key => row[key]).join(','))].join('\n') + '\n';
}
