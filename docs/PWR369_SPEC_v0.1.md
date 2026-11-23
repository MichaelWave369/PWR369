# PWR-369 v0.1 — Pulse · Wave · Return

**Status:** Exploratory, falsifiable *computational analogy*, not a validated model of the user's perception, a new physical force, or evidence for astral travel.

**Origin:** A description of heart- and brain-like pulses as moving outward and returning inward, experienced as internally generated imagery. The user previously described a visual 'fuzzy dots' field: many RGB-like microdots, zoomable nested cells, toroidal/gearlike forms, and morphing patterns. The model treats that as *reported imagery*, not a recording of external fields.

## 1. Core statement

A bounded system generates events; their consequences propagate through its domains, interact at interfaces, and some effects feed back into later states. A perception/rendering layer can portray these relations as pulsing waves, rings, dots, or geometries.

**PULSE → PROPAGATE → ENCOUNTER → TRANSFORM → RETURN → RE-INTEGRATE → NEXT PULSE**

This loop is useful across signal processing, coupled oscillators, memory systems and generative graphics, but these applications need independent validation.

## 2. The 3 layers (don't conflate)

1. **Physiological / measurable:** electrocardiography/photoplethysmography (heart), respiration, EEG (brain), and their timing relationships. Measured rhythms and autonomic feedback are real. An EEG heartbeat-evoked response is not the same as seeing outward and inward energy waves.
2. **Phenomenological / reported:** a mind's-eye impression of luminous dots, pulses, loops, tunnels and relief. These are real as experiences; their physical interpretation is unverified.
3. **Computational / synthetic:** the explicit, reproducible equations below. Visual beauty is not evidence of physiological accuracy.

## 3. Language: six verbs

| Word | Meaning | Model role |
|---|---|---|
| **Ignite** | A local event occurs | input pulse p |
| **Radiate** | Its influence spreads | outbound state o |
| **Meet** | Propagation reaches a boundary/interface | junction J |
| **Alter** | A junction filters, mixes or transforms influence | transfer operator T |
| **Echo** | Some influence returns after delay | inbound state r |
| **Remember** | Return changes a later state | memory / residue m |

**NBG mapping:** A *bubble* is a bounded domain, a *gear* is an interface transform, a *keyhole* is a limited observation, and **Altermath** denotes the consequential inter-domain relation, including structure that may be invisible to a coarse view. This maps an existing conceptual vocabulary onto this new toy model; it does not identify a physical biological junction.

## 4. A precise minimal dynamical model

Let t be discrete time (e.g., 0.05 s per step). Choose a synthetic pulse input p[t] such as an impulse train, not a measurement of a human.

    o[t+1] = a * o[t] + b * p[t]                 # outward activation
    r[t+1] = c * r[t] + k * o[t-d]              # delayed partial return
    m[t+1] = rho * m[t] + eta * r[t]            # persistent residue
    z[t]   = F(o[t], r[t], m[t], context[t])    # latent rendering state
    image[t] = Render(z[t], gain, viewpoint)     # visualization only

where:
- 0 ≤ a,c,rho < 1 are decay/retention factors;
- b is pulse-to-outgoing coupling;
- k is return gain, with k=0 as the no-return control;
- d ≥ 0 is time delay (a chosen number of steps);
- eta is return-to-memory coupling;
- F and Render are intentionally independent of the physiology until tested.

**Spatial version** (optional): an outgoing radial wave with effective propagation speed v reaches a ring boundary of radius R; a fraction k returns as an incoming wave. A graphical ring reflection is a convenient analogy, *not* evidence that mental signals reflect at a skull-sized boundary.

## 5. The nine observables (3 × 3 study grid)

| Timing | Structure | Consequence |
|---|---|---|
| pulse period | outbound amplitude | return fraction k |
| delay / lag | phase difference | coherence / entrainment |
| decay time | junction transform | persistence of residue m |

These can all be measured in a synthetic run. In physiological studies only some can be estimated from appropriate sensors and protocols. The vividness of subjective imagery is a separate report, not equivalent to one of these sensor measures.

## 6. Minimum useful experiments

**A. No return:** k=0. Prediction: an outward response, no reflected ring, and no return-driven new residue.

**B. Return and delay:** k>0 and d>0. Prediction: inward effect appears only after a lag; memory changes after return.

**C. Boundary-transform comparison:** keep pulses and summary statistics fixed; alter junction transform T. Prediction: two apparently identical coarse inputs may produce different later outputs. This is an *Altermath / keyhole* demonstration of hidden consequential structure, contingent on the chosen model.

**D. Phase comparison:** vary independently generated heart-like and brain-like oscillators. Prediction: their synthetic phase relations change patterns in the renderer; this does not imply that real human brain and heart are directly phase-locked in the way depicted.

**E. Render invariance:** hold state history fixed, change only render gain/dot density. Prediction: the imagery changes without any changes to the simulated underlying dynamics. Crucial protection against mistaking vividness for energy magnitude.

Log seeds, parameters, time series, pulse events and run dates. Avoid treating one run as proof of an explanation.

## 7. Interpretive principles

- **Representation ≠ source:** seeing a heartbeat-like wave in thought does not establish that a wave was directly perceived outside the body.
- **Connection ≠ common frequency:** heart rhythm, breathing and cortical oscillations operate at different rates, and some interactions are context-dependent.
- **Feedback ≠ perpetual motion:** every non-driven model should decay; energy is not created by saying "return." Use explicit input and damping.
- **Observation has a keyhole:** visual patterns depend partly on what the renderer emphasizes. The same system may have multiple valid visual projections.
- **No target trance state:** the simulation is an intellectual/creative tool, not an induction exercise or attempt to recreate impaired responsiveness.

## 8. Scientific grounding and limits

- Steinfath et al., *Heartbeat-Evoked Responses in M/EEG: A Systematic Review of Methods With Suggestions for Analysis and Reporting*, **Psychophysiology** (2026). Reviews 132 studies, and highlights methodological variation and artifacts: https://pmc.ncbi.nlm.nih.gov/articles/PMC13053922/
- *The brain–heart axis: integrative cooperation of neural, mechanical and biochemical pathways*, **Nature Reviews Cardiology** (2025): https://www.nature.com/articles/s41569-025-01140-3
- *The Coding Logic of Interoception*, **Annual Review of Physiology** (2024): https://www.annualreviews.org/content/journals/10.1146/annurev-physiol-042222-023455
- *Challenges and Approaches in the Study of Neural Entrainment* (2024): https://pubmed.ncbi.nlm.nih.gov/39358026/
- *Redefining respiratory sinus arrhythmia as respiratory heart rate variability* (2025): https://www.nature.com/articles/s41569-025-01160-z

## 9. Compact notation

`PWR(B, J, p; a, b, c, k, d, rho, eta, Render)`

B is domain topology; J is a set of interfaces; p is injected pulse stream; parameters define propagation, return, and memory; Render maps internal states to visible output. When comparing runs, hold p and Render fixed while testing junction effects.

**One-line philosophy:** *The wave is not the whole world; the returning consequence changes what the next wave can become.*
