---
title: Fermi-Dirac Distribution and Carrier Concentration Explorer
description: Students will apply the Fermi-Dirac distribution to calculate electron and hole concentrations in a semiconductor and explain (Apply, L3) how temperature and Fermi level position determine n and p.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Fermi-Dirac Distribution and Carrier Concentration Explorer



<iframe src="main.html" width="100%" height="562"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Fermi-Dirac Statistics and Intrinsic Carrier Concentrations](../../chapters/06-fermi-dirac-statistics/index.md).

```text
Type: MicroSim
**sim-id:** fermi-dirac-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will apply the Fermi-Dirac distribution to calculate electron and hole concentrations in a semiconductor and explain (Apply, L3) how temperature and Fermi level position determine n and p.

**Canvas size:** 900 × 540 px, responsive.

**Controls:**
- Slider: Temperature T, 100–700 K, default 300 K. Label: "Temperature (K):"
- Slider: Fermi level position \(E_F - E_i\), −0.6 to +0.6 eV, default 0 eV (intrinsic). Label: "E_F − E_i (eV):"
- Select: Material — "Silicon (E_g=1.12 eV)", "GaAs (E_g=1.42 eV)", "Ge (E_g=0.66 eV)". Default: Si.

**Visual layout:**

Left panel (55%): Energy-axis diagram (vertical energy axis). Draw:
- Horizontal bands for CB (top, blue) and VB (bottom, green), with the gap in between.
- Horizontal dashed lines for E_C, E_V, E_F (moveable), E_i (midgap reference).
- Beside the bands, draw the Fermi-Dirac function f(E) as a curve (sigmoid), with the 50% point exactly at E_F.
- Shade the CB region with intensity proportional to n (computed from N_C formula) — darker shade = more electrons.
- Shade the VB region with intensity proportional to p.

Right panel (45%): Computed values:
- \(f(E_C)\) = probability of occupying the CB edge.
- n = electron concentration (cm⁻³).
- p = hole concentration (cm⁻³).
- n·p product (should equal \(n_i^2\)).
- \(n_i\) (intrinsic concentration at current T).
- Display: "Material class: n-type / p-type / intrinsic" based on whether n > p, n < p, or n ≈ p.

**Behavior:** All sliders update computed values and visualization in real time. On resize: updateCanvasSize() reflows.

**Implementation:** p5.js, single HTML file. Use built-in createSlider(), createSelect(). Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 6: Fermi-Dirac Statistics and Intrinsic Carrier Concentrations](../../chapters/06-fermi-dirac-statistics/index.md)
