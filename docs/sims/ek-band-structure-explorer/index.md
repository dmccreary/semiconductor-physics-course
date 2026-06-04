---
title: Interactive E-k Band Structure Explorer
description: Students will read and interpret E-k diagrams for real semiconductors and identify (Analyze, L4) conduction band minima, valence band maxima, and bandgap values at high-symmetry k-points.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Interactive E-k Band Structure Explorer



<iframe src="main.html" width="100%" height="582"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: "Bloch's Theorem, Band Formation, and E-k Diagrams"](../../chapters/05-bloch-theorem-band-theory/index.md).

```text
Type: MicroSim
**sim-id:** ek-band-structure-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will read and interpret E-k diagrams for real semiconductors and identify (Analyze, L4) conduction band minima, valence band maxima, and bandgap values at high-symmetry k-points.

**Canvas size:** 950 × 560 px, responsive.

**Controls:**
- Select dropdown: Material — "Si (indirect, 1.12 eV)", "Ge (indirect, 0.66 eV)", "GaAs (direct, 1.42 eV)", "GaN (direct, 3.40 eV)", "Free Electron". Default: "Si".
- Checkbox: "Show effective mass parabolas" (default checked) — overlays fitted parabolas near CBM and VBM.
- Select: "Brillouin zone path" — "L–Γ–X" (default, for cubic), "K–Γ–M" (hexagonal, for GaN).

**Visual layout:**

Main panel (70%): Schematic E-k diagram drawn along the selected path. Horizontal axis labeled with high-symmetry k-points. Vertical axis: Energy (eV), origin at VBM.

Draw 4–6 bands (valence and conduction) as smooth schematic curves for each material:
- Si: CBM near X at ~0.85 of Γ→X distance, 6-fold degenerate; VBM at Γ, split into HH, LH, SO.
- GaAs: CBM and VBM both at Γ; gap 1.42 eV; show L and X valleys as higher CB minima.
- Ge: CBM at L; VBM at Γ; gap 0.66 eV.
- GaN: CBM and VBM at Γ; gap 3.40 eV; hexagonal path.
- Free Electron: single parabola crossing zone boundary (Bragg reflection visible as slight gap).

Mark VBM and CBM with labeled dots. Shade the bandgap in yellow. Label E_g.

If "Show effective mass parabolas" checked: overlay red dashed parabola at CBM (width ∝ 1/m_n*), blue dashed parabolas at VBM for HH and LH.

Right panel (30%): material name, E_g, gap type, CBM location, effective masses m_n*, m_HH, m_LH.

**Behavior:** Dropdown updates immediately. Hover on band shows (k, E) coordinates and band label.

**Implementation:** p5.js, single HTML file. Bands as Bezier curve approximations. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 5: "Bloch's Theorem, Band Formation, and E-k Diagrams"](../../chapters/05-bloch-theorem-band-theory/index.md)
