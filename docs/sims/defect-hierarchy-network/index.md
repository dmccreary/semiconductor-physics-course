---
title: Crystal Defect Hierarchy Network
description: Students will classify crystal defects by dimensionality and identify (Analyze, L4) which device parameters each defect type degrades, via a clickable hierarchical network diagram.
status: implemented
library: vis-network
bloom_level: L4 (Analyze)
---

# Crystal Defect Hierarchy Network



<iframe src="main.html" width="100%" height="562"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Crystal Bonding, Defects, and Surfaces](../../chapters/03-crystal-bonding-defects/index.md).

```text
Type: MicroSim
**sim-id:** defect-hierarchy-network<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Learning objective:** Students will classify crystal defects by dimensionality and identify (Analyze, L4) which device parameters each defect type degrades, via a clickable hierarchical network diagram.

**Canvas size:** 800 × 500 px, responsive.

**Graph structure (vis-network):**
Root node: "Crystal Defects" — large, gray rectangle.
Level-1 nodes (dimensionality categories): "0D: Point Defects" (blue), "1D: Line Defects" (orange), "2D: Planar Defects" (green), "3D: Volume Defects" (red).
Level-2 nodes (specific types):
- Under 0D: "Vacancy", "Self-Interstitial", "Substitutional Impurity", "Frenkel Pair", "Schottky Defect"
- Under 1D: "Edge Dislocation", "Screw Dislocation"
- Under 2D: "Stacking Fault", "Grain Boundary", "Surface State", "Interface State"
- Under 3D: "Precipitate", "Void"

All level-2 nodes are clickable. Clicking opens an infobox overlay with: name, dimensionality, formation mechanism, degraded device parameters (mobility, lifetime, \(V_T\), etc.), and a real example.

Layout: hierarchical top-to-bottom. Edge arrows from root → level-1 → level-2. Edge labels: "includes".

**Implementation:** vis-network, single HTML file. Node click event → infobox rendered in right panel. Canvas parents to document.querySelector('main').
```

## Related Resources

- [Chapter 3: Crystal Bonding, Defects, and Surfaces](../../chapters/03-crystal-bonding-defects/index.md)
