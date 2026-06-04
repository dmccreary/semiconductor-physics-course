---
title: Miller Indices Crystal Plane Explorer
description: Students will calculate Miller indices from axis intercepts and identify the corresponding crystal plane orientation in a 3D cubic cell (Apply, L3).
status: scaffold
library: p5.js
bloom_level: TBD
---

# Miller Indices Crystal Plane Explorer



<iframe src="main.html" width="100%" height="542"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Crystal Lattice Structure and Symmetry](../../chapters/02-crystal-lattice-structure/index.md).

```text
Type: MicroSim
**sim-id:** miller-indices-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will calculate Miller indices from axis intercepts and identify the corresponding crystal plane orientation in a 3D cubic cell (Apply, L3).

**Canvas size:** 850 × 520 px, responsive.

**Controls (p5.js built-in):**
- Three sliders: h (−3 to 3, default 1), k (−3 to 3, default 0), l (−3 to 3, default 0). Labels: "h:", "k:", "l:".
- Button: "Render Plane".
- Select dropdown: Preset planes — "Custom", "(100)", "(110)", "(111)", "(200)", "(210)", "(211)", "(010)", "(001)". Selecting preset snaps sliders.

**Visual layout:**

Left panel (60%): Isometric 3D view of a 2×2×2 simple cubic supercell. Draw atoms as small gray circles at integer coordinate positions. Draw the selected (hkl) plane as a translucent blue polygon (alpha ≈ 0.4) clipping through the supercell. Highlight atoms on or near the plane in orange. Draw crystallographic axes (x, y, z) in red, green, blue with labels. Mark axis intercepts with filled triangle markers.

Right panel (40%): Step-by-step calculation display:
- "Intercepts on a, b, c axes: X, Y, Z"
- "Reciprocals: 1/X, 1/Y, 1/Z"
- "Miller indices: (h k l)"
- "Plane family {hkl} has N equivalent planes in cubic symmetry."
- "Interplanar spacing: d = a / √(h²+k²+l²) = X.XX Å (Si)"

**Behavior:**
- Any slider change immediately re-renders the plane.
- If h=k=l=0, display error: "Invalid: (000) is not a Miller index."
- Hover over an atom shows its (fractional) coordinates.

**Implementation:** p5.js, single HTML file. Compute plane polygon from intercepts analytically. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 2: Crystal Lattice Structure and Symmetry](../../chapters/02-crystal-lattice-structure/index.md)
