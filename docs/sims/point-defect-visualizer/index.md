---
title: Point Defect Visualizer
description: Students will identify the five point defect types in a crystal lattice cross-section and explain (Understand, L2) their effect on carrier behavior by clicking defect sites to reveal detailed descriptions.
status: implemented
library: p5.js
bloom_level: L2 (Understand)
---

# Point Defect Visualizer



<iframe src="main.html" width="100%" height="522"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Crystal Bonding, Defects, and Surfaces](../../chapters/03-crystal-bonding-defects/index.md).

```text
Type: MicroSim
**sim-id:** point-defect-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will identify the five point defect types in a crystal lattice cross-section and explain (Understand, L2) their effect on carrier behavior by clicking defect sites to reveal detailed descriptions.

**Canvas size:** 820 × 500 px, responsive — call updateCanvasSize() in setup().

**Controls (p5.js built-in):**
- Select dropdown: "Highlight defect type" — "All defects", "Vacancies only", "Interstitials only", "Substitutional impurities", "Frenkel pairs", "Schottky defects". Default: "All defects".
- Button: "Randomize positions" — redistributes defect locations randomly, keeping counts fixed.

**Visual layout:**

Left panel (65%): Top-down 2D view of a 10×10 section of a simple square lattice representing a crystal cross-section. Draw host atoms as filled light-blue circles (radius 14 px). Lattice spacing ~50 px.

Place approximately 2–3 of each defect type at random lattice or interstitial positions:
- Vacancy: empty dashed-circle outline in dark red; label "V".
- Self-interstitial: small orange circle at midpoint between lattice sites; label "I".
- Substitutional donor (P): green circle at lattice site; label "P⁺".
- Substitutional deep trap (Au): purple circle at lattice site; label "Au".
- Frenkel pair: a vacancy + nearby interstitial connected by a curved dashed arc.

Hover over any defect: highlight with yellow glow; display tooltip showing defect name, mechanism, and electrical effect.
Click any defect: open detail card in right panel.

Right panel (35%): Detail card for the clicked defect:
- Name and dimensionality (0D point defect).
- Formation mechanism.
- Charge states possible.
- Electrical impact (carrier concentration, lifetime, mobility).
- Real-world consequence (one sentence).

**Behavior:** Dropdown grays out non-selected defect types. "Randomize" regenerates positions. On resize: updateCanvasSize() reflows proportionally.

**Implementation:** p5.js, single HTML file. Use createSelect(), createButton(). Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 3: Crystal Bonding, Defects, and Surfaces](../../chapters/03-crystal-bonding-defects/index.md)
