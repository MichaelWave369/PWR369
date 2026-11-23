# Φ PWR-369: Pulse · Wave · Return

An open, testable toy model for **Ignite → Radiate → Meet → Alter → Echo → Remember**, with an interactive RGB-dot wave-field visualization, deterministic simulation core, CSV exports and scientific/interpretive guardrails.

> **Scope:** This is a synthetic system, **not** a body sensor, proof of external energy perception, a physiological digital twin or evidence of astral travel. The visual language was inspired by a personal description of internally imagined pulses, nested bubbles and fuzzy RGB dots. Its predictions apply to the *software model*, unless independently validated elsewhere.

## Run it

**Browser:** Serve the repository as static files and open `http://localhost:8080`:

```bash
npm run serve
```

No framework or install required. The Node standard library powers testing and CSV generation.

**Tests:**

```bash
npm test
npm run check
```

**Reproducible CSV:**

```bash
node scripts/export-run.mjs --seconds=20 --rate=66 --reflect=0.65 --out=pwr369-run.csv
```

In the web lab, adjust **pulse rate**, **reflection**, **propagation speed**, **memory persistence**, and **fuzzy-dot gain**. Pause/reset the model, or export the observed synthetic time series.

## Experiments

| Test | Control | Expected observation |
|---|---|---|
| Zero return | `reflect=0` | no inbound waves or return-driven memory |
| Delayed return | `reflect>0` | inbound wave only after crossing boundary |
| Persistence | lower `memory` | faster decay of the remembered residue |
| Presentation-only | change `render` | altered visual vividness; identical state history |
| Rate change | increase `rate` | more pulses in a fixed simulated interval |

Details: [Model specification](docs/PWR369_SPEC_v0.1.md).

## Architecture

```text
index.html               browser UI (static GitHub Pages-friendly)
styles/main.css          responsive dark UI
src/model.mjs            deterministic model, validation, samples, CSV
src/app.mjs              canvas rendering, controls, export
scripts/export-run.mjs   headless experiment CLI
tests/model.test.mjs      Node built-in test runner
.github/workflows/       unit-test CI and optional Pages publication
```

The **simulation and renderer are deliberately separate**. `render` gain does not appear in state-transition equations. This keeps visual salience from masquerading as measured signal strength.

## Nested Bubble / Altermath mapping

- **Bubble:** bounded domain.
- **Gear:** an interaction operator between domains.
- **Keyhole:** restricted viewpoint/observation.
- **Altermath:** consequential interface interaction, including hidden structure that could affect future states.

These are conceptual names, not anatomical claims.

## Live deployment

This repo includes a GitHub Actions Pages workflow. For a new GitHub repository, enable **Settings → Pages → Build and deployment → GitHub Actions**. The workflow deploys static site files on pushes to `main`.

## Open research roadmap

- [ ] Optional multi-domain / coupled-oscillator branch with explicit units and parameter sweeps.
- [ ] Junction operator `T`, with hidden-state experiments and matched coarse observables.
- [ ] Saved runs, parameter presets, and accessible reduced-motion visualization.
- [ ] Physiological data adapters *only* with clear sensor provenance and explicit calibration.
- [ ] Peer-review reproducibility pack with fixed datasets, schema version and benchmark results.

## License

MIT. See [LICENSE](LICENSE).
