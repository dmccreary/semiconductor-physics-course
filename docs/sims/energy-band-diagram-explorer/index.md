---
title: Interactive Energy Band Diagram Explorer
description: Students will identify E_C, E_V, and E_g on an energy band diagram and explain (Understand, L2) how varying the bandgap energy determines whether a material behaves as a conductor, semiconductor, or insulator.
status: implemented
library: p5.js
bloom_level: L2 (Understand)
---

# Interactive Energy Band Diagram Explorer



<iframe src="main.html" width="100%" height="542"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../../chapters/01-intro-semiconductors/index.md).

```text
Type: MicroSim
**sim-id:** energy-band-diagram-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will identify E_C, E_V, and E_g on an energy band diagram and explain (Understand, L2) how varying the bandgap energy determines whether a material behaves as a conductor, semiconductor, or insulator.

**Canvas size:** 800 × 520 px, responsive — recalculate all layout positions on window resize.

**Controls (p5.js built-in):**

- Slider: Bandgap energy E_g from 0.0 to 7.0 eV, step 0.01, default 1.12 eV. Label displayed: "Bandgap E_g (eV): X.XX"
- Slider: Temperature T from 0 to 600 K, step 1, default 300 K. Label displayed: "Temperature (K): XXX"
- Select dropdown: Material preset with options "Custom", "Ge (0.66 eV)", "Si (1.12 eV)", "GaAs (1.42 eV)", "GaN (3.40 eV)", "Diamond (5.50 eV – insulator)", "SiO₂ (9.0 eV – insulator)". Selecting a preset snaps the E_g slider to the preset value and displays the material name below the diagram.

**Visual layout (left 60% of canvas — band diagram panel):**

- Draw a horizontal filled rectangle near the top of the panel (height 90 px), labeled "Conduction Band (CB)" in bold, filled with light blue (#b3e5fc). This represents the conduction band.
- Draw a horizontal filled rectangle near the bottom of the panel (height 90 px), labeled "Valence Band (VB)" in bold, filled with light green (#c8e6c9). This represents the valence band.
- The vertical gap between the two rectangles represents E_g. Scale the gap height linearly from 0 px (E_g = 0) to 200 px (E_g = 7 eV), so 1 eV ≈ 28.6 px.
- Draw a red dashed horizontal line at the bottom edge of the CB rectangle; label it "E_C" on the left margin.
- Draw a blue dashed horizontal line at the top edge of the VB rectangle; label it "E_V" on the left margin.
- Center a label in the forbidden gap region: "Forbidden Gap" on line 1 and "E_g = X.XX eV" on line 2, in dark gray text.
- Color the gap region with a background tint:
  - E_g < 0.3 eV: light red (#ffcdd2) — conductor / semimetal
  - 0.3 – 4.5 eV: light yellow (#fff9c4) — semiconductor
  - > 4.5 eV: light gray (#f5f5f5) — insulator
- Animate small filled circles (electrons, radius 6 px, color #1565c0) using a simplified thermal distribution:
  - Populate the VB with 20 filled blue circles arranged randomly within the VB rectangle (always present).
  - In the CB, display N_CB conduction electrons computed qualitatively as: N_CB = round(8 × exp(−E_g / (2 × 0.026 × T / 300))), clamped to 0–8. These circles appear as brighter blue (#42a5f5) and drift slowly left-right within the CB rectangle.
  - When an electron is in the CB, draw a corresponding open circle (hole) in the VB at the same horizontal x-position.
  - At T = 0, N_CB = 0 regardless of E_g.
- Below the diagram, display a label for material class: "Conductor" (red), "Semiconductor" (amber), or "Insulator" (gray) based on the E_g tint thresholds above.

**Right panel (40% of canvas — information panel):**

- Display: "E_g = X.XX eV" in large text.
- Display: "Temperature = XXX K"
- Display: "Material class: [Conductor / Semiconductor / Insulator]"
- Display: "Conduction electrons ≈ N_CB (symbolic)"
- Compute and display the photon wavelength equivalent: "Photon energy = E_g → λ = 1240 / E_g = XXXX nm"
- Display which spectral region: UV (< 400 nm), Visible-violet (400–450 nm), Visible-blue (450–495 nm), Visible-green (495–570 nm), Visible-yellow (570–590 nm), Visible-orange (590–620 nm), Visible-red (620–750 nm), Near-IR (750–1400 nm), Mid-IR (> 1400 nm).
- If E_g places λ in the visible range (400–700 nm), display a small filled rectangle (30 × 20 px) showing the approximate HSL color of that wavelength.

**Behavior:**

- Sliders and dropdown update all displayed values and the diagram immediately on each frame.
- Selecting a preset snaps the E_g slider; "Custom" leaves sliders at their current positions.
- Electron animation: conduction-band electrons drift left and right within the CB rectangle using perlin noise or simple sinusoidal motion; they fade in and out smoothly as N_CB changes.
- On window resize: call updateCanvasSize() first in setup(); recompute all panel widths and element positions proportionally.

**Implementation:** p5.js, single self-contained HTML file. Parent canvas with `canvas.parent(document.querySelector('main'))`. Use createSlider(), createSelect() for controls. No external data dependencies.
```

## Related Resources

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../../chapters/01-intro-semiconductors/index.md)
