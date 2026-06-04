---
title: Dimensionality and Density of States Explorer
description: Students will predict and compare g(E) in 3D, 2D, 1D, and 0D and explain (Understand, L2) how dimensionality reduction improves semiconductor laser performance.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Dimensionality and Density of States Explorer



<iframe src="main.html" width="100%" height="562"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: "Bloch's Theorem, Band Formation, and E-k Diagrams"](../../chapters/05-bloch-theorem-band-theory/index.md).

```text
Type: MicroSim
**sim-id:** density-of-states-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will predict and compare g(E) in 3D, 2D, 1D, and 0D and explain (Understand, L2) how dimensionality reduction improves semiconductor laser performance.

**Canvas size:** 900 × 540 px, responsive.

**Controls:**
- Select dropdown: Dimensionality — "3D (Bulk)", "2D (Quantum Well)", "1D (Quantum Wire)", "0D (Quantum Dot)". Default: "3D".
- Slider: Effective mass \(m^*/m_0\), 0.05–1.0, default 0.067. Label: "m*/m₀:"
- Slider: Confinement dimension L, 1–20 nm, default 10 nm (active when not 3D). Label: "L (nm):"
- Checkbox: "Show gain bandwidth" — overlays schematic optical gain curve width relative to DOS shape.

**Visual layout:**

Left panel (65%): Plot of g(E) vs. E from E_c to E_c + 0.4 eV.
- 3D: smooth √(E-E_c) curve.
- 2D: staircase with equal-height steps at E_n = n²·ħ²π²/(2m*L²).
- 1D: spiky curve with 1/√(E-E_n) peaks at subband edges.
- 0D: vertical arrows at discrete energies E_n.
All normalized to same peak height. Color: 3D=blue, 2D=green, 1D=orange, 0D=red.

Right panel (35%): Card showing dimensionality, g(E) formula, device application, laser threshold comparison (bulk > QW > QD).

**Behavior:** All controls update the plot in real time. On resize: updateCanvasSize() reflows.

**Implementation:** p5.js, single HTML file. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 5: "Bloch's Theorem, Band Formation, and E-k Diagrams"](../../chapters/05-bloch-theorem-band-theory/index.md)
