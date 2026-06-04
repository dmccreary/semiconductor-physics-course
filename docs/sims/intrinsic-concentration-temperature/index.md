---
title: Temperature Dependence of ni Explorer
description: Students will calculate intrinsic carrier concentration as a function of temperature for multiple materials and evaluate (Evaluate, L5) which materials are suitable for high-temperature operation.
status: scaffold
library: Chart.js
bloom_level: TBD
---

# Temperature Dependence of ni Explorer



<iframe src="main.html" width="100%" height="542"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Fermi-Dirac Statistics and Intrinsic Carrier Concentrations](../../chapters/06-fermi-dirac-statistics/index.md).

```text
Type: MicroSim
**sim-id:** intrinsic-concentration-temperature<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning objective:** Students will calculate intrinsic carrier concentration as a function of temperature for multiple materials and evaluate (Evaluate, L5) which materials are suitable for high-temperature operation.

**Canvas size:** 780 × 480 px, responsive.

**Chart type:** Line chart (Chart.js) with a logarithmic y-axis.

**Dataset:** For each material, compute \(n_i(T) = \sqrt{N_C(T)N_V(T)}\exp(-E_g/2k_BT)\) from T = 200 K to T = 700 K in 10 K steps. Include Si (E_g=1.12 eV), Ge (E_g=0.66 eV), GaAs (E_g=1.42 eV), GaN (E_g=3.4 eV). Use appropriate effective masses for N_C and N_V scaling (~T^{3/2}).

**Visual:**
- X-axis: Temperature T (K), 200–700 K.
- Y-axis: n_i (cm⁻³), log scale, 10⁻¹⁰ to 10²⁰.
- Four colored lines (Si=blue, Ge=green, GaAs=orange, GaN=red).
- Horizontal dashed reference lines at n_i = 10^15 (typical light doping level) and n_i = 10^10 (Si at 300 K).
- Draw a vertical dashed line at T = 300 K.

**Interaction:**
- Hovering over any point shows: material, temperature, n_i value, and whether the device would be in the intrinsic regime at that T for a given doping level (configurable via dropdown: "Doping N_D = 10^15, 10^16, 10^17 cm⁻³").
- Clicking a material line highlights it and shows the approximate maximum safe operating temperature (where n_i ~ N_D/10).

**Implementation:** Chart.js v4, single HTML file. Computed n_i values precomputed and stored as arrays. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 6: Fermi-Dirac Statistics and Intrinsic Carrier Concentrations](../../chapters/06-fermi-dirac-statistics/index.md)
