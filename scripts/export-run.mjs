#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { runSynthetic, toCSV } from '../src/model.mjs';
const args = Object.fromEntries(process.argv.slice(2).map(pair => {
  const [key, value] = pair.split('=');
  return [key.replace(/^--/, ''), value];
}));
const seconds = Number(args.seconds ?? 20);
if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 600) throw new Error('seconds must be between 0 and 600');
const params = {};
for (const key of ['rate', 'reflect', 'speed', 'memory', 'render']) {
  if (args[key] !== undefined) params[key] = Number(args[key]);
}
const { samples } = runSynthetic(params, seconds);
const path = args.out ?? 'pwr369-run.csv';
writeFileSync(path, toCSV(samples), 'utf8');
console.log(`Saved ${samples.length} samples to ${path}`);
