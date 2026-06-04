---
title: Semiconductor Lattice Constant and Bandgap Map
description: Students will compare lattice constants and bandgaps of common semiconductors and evaluate (Evaluate, L5) lattice mismatch implications for heterostructure design.
status: scaffold
library: Chart.js
bloom_level: TBD
---

# Semiconductor Lattice Constant and Bandgap Map



<iframe src="main.html" width="100%" height="582"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Crystal Lattice Structure and Symmetry](../../chapters/02-crystal-lattice-structure/index.md).

```text
Type: MicroSim
**sim-id:** lattice-bandgap-map<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning objective:** Students will compare lattice constants and bandgaps of common semiconductors and evaluate (Evaluate, L5) lattice mismatch implications for heterostructure design.

**Canvas size:** 780 × 500 px, responsive.

**Chart type:** Scatter plot (Chart.js Scatter). Each semiconductor is a labeled data point.

**Dataset:** Plot the following (lattice constant in Å on x-axis, bandgap in eV on y-axis):
- Si: (5.431, 1.12), Ge: (5.658, 0.66), GaAs: (5.653, 1.42), AlAs: (5.661, 2.16), InP: (5.869, 1.35), InAs: (6.058, 0.36), GaP: (5.451, 2.26), AlP: (5.467, 2.45), InSb: (6.479, 0.17), GaSb: (6.096, 0.72).
- Color direct-gap materials green (#4caf50), indirect-gap red (#f44336).
- Draw curved interpolation lines between ternary alloy endpoints (e.g., GaAs-AlAs in gray, InAs-GaAs in orange) labeled with the alloy name.

**Interaction:**
- Clicking or hovering a data point displays an infobox: material name, lattice constant, bandgap, gap type (direct/indirect), and key applications.
- A vertical reference line at x = 5.431 Å (Si) is toggleable via a "Show Si reference" checkbox.
- A vertical reference line at x = 5.869 Å (InP) is toggleable via "Show InP reference" checkbox.

**Implementation:** Chart.js v4, single HTML file. Custom tooltip callbacks for rich infoboxes. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 2: Crystal Lattice Structure and Symmetry](../../chapters/02-crystal-lattice-structure/index.md)
