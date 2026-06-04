---
title: Cubic Crystal Structure Explorer
description: Students will identify atomic positions in SC, BCC, FCC, and diamond cubic structures and calculate atoms per unit cell (Remember/Apply, L1/L3) by manipulating an interactive 3D-perspective model.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Cubic Crystal Structure Explorer



<iframe src="main.html" width="100%" height="562"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Crystal Lattice Structure and Symmetry](../../chapters/02-crystal-lattice-structure/index.md).

```text
Type: MicroSim
**sim-id:** cubic-crystal-structure-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will identify atomic positions in SC, BCC, FCC, and diamond cubic structures and calculate atoms per unit cell (Remember/Apply, L1/L3) by manipulating an interactive 3D-perspective model.

**Canvas size:** 900 × 550 px, responsive — call updateCanvasSize() first in setup().

**Controls (p5.js built-in):**
- Select dropdown: Structure — "Simple Cubic (SC)", "Body-Centered Cubic (BCC)", "Face-Centered Cubic (FCC)", "Diamond Cubic", "Zincblende (GaAs)". Default: "Face-Centered Cubic (FCC)".
- Slider: Rotation angle φ 0–360°, default 30°. Label: "Rotate (°):"
- Slider: Tilt θ 10–80°, default 35°. Label: "Tilt (°):"
- Checkbox: "Show bonds" (default checked).
- Checkbox: "Show unit cell outline" (default checked).

**Visual layout:**

Left panel (65%): 3D isometric perspective projection of one conventional unit cell, drawn with p5.js manual 3D→2D projection (no WebGL). Use rotation/tilt sliders to update the viewing angle each frame.

Atom rendering:
- Corner atoms: draw as full circles with radius scaled by perspective, color light blue (#90caf9). Eight corners, each contributing 1/8 atom.
- Face-center atoms (FCC, diamond): light blue, radius × 0.85 (slightly smaller to indicate partial inclusion, though drawn fully).
- BCC body-center atom: green (#a5d6a7), full size.
- Diamond second sublattice atoms: orange (#ffb74d) at positions (¼,¼,¼), (¾,¾,¼), (¾,¼,¾), (¼,¾,¾) in fractional coordinates.
- Zincblende: first sublattice atoms orange (Ga), second sublattice purple (#7b1fa2) (As).

Draw bond lines between nearest-neighbor pairs if "Show bonds" checked.
Draw cube outline in dark gray if "Show unit cell outline" checked.

Right panel (35%): Information card showing:
- Structure name (bold, large).
- "Atoms per unit cell: N"
- "Coordination number: N"
- "APF: XX%"
- "Nearest-neighbor distance: X·a"
- "Semiconductor examples:" with 2–3 materials.

**Behavior:**
- Selecting a new structure immediately redraws.
- Hover over an atom: highlight yellow, tooltip shows fractional coordinates.
- Sliders update projection in real time.

**Implementation:** p5.js, single self-contained HTML file. Manual perspective projection via 3D rotation matrices. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 2: Crystal Lattice Structure and Symmetry](../../chapters/02-crystal-lattice-structure/index.md)
