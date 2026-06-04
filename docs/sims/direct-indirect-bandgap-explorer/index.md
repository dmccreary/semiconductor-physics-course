---
title: Direct vs. Indirect Bandgap — E-k Diagram Explorer
description: Students will distinguish (Analyze, L4) direct and indirect bandgap materials by identifying whether the conduction band minimum and valence band maximum occur at the same k-value, and will predict the consequence for optical emission efficiency.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Direct vs. Indirect Bandgap — E-k Diagram Explorer



<iframe src="main.html" width="100%" height="582"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../../chapters/01-intro-semiconductors/index.md).

```text
Type: MicroSim
**sim-id:** direct-indirect-bandgap-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will distinguish (Analyze, L4) direct and indirect bandgap materials by identifying whether the conduction band minimum and valence band maximum occur at the same k-value, and will predict the consequence for optical emission efficiency.

**Canvas size:** 900 × 560 px, responsive — recalculate all positions on window resize.

**Controls (p5.js built-in):**

- Select dropdown: Material — "GaAs (direct, 1.42 eV)", "InP (direct, 1.35 eV)", "GaN (direct, 3.40 eV)", "Silicon (indirect, 1.12 eV)", "Germanium (indirect, 0.66 eV)". Default: "GaAs (direct, 1.42 eV)".
- Checkbox: "Show phonon arrow" (default unchecked) — when checked and an indirect-gap material is selected, annotates the momentum component of the optical transition with a horizontal arrow labeled "Phonon (Δk)".
- Button: "Animate optical transition" — triggers an animated excitation sequence showing a dot rising from VBM to CBM.

**Visual layout (left 65% of canvas — E-k diagram panel):**

- Horizontal axis: crystal momentum k, spanning from L point (−1.0 in normalized units) through Γ (0.0) to X point (+1.0). Draw axis with tick marks and labels: "L", "Γ", "X". Label axis "Crystal momentum k →".
- Vertical axis: Energy (eV), spanning from −0.5 to E_g + 0.8 eV, with origin at E_V = 0 (VBM). Label axis "Energy E (eV) ↑".
- Draw a horizontal dashed line at E = 0 labeled "E_V (VBM)" and at E = E_g labeled "E_C (CBM)".
- Valence band: draw as a downward-opening parabola centered at k = 0 (Γ), with vertex at E = 0 (E_V). Half-width ≈ 0.8 in k-units. Fill region below the parabola with a light green (#c8e6c9) tint. Label "Valence Band".
- Conduction band for DIRECT-gap materials (GaAs, InP, GaN):
  - Draw an upward-opening parabola centered at k = 0, vertex at E = E_g. Half-width ≈ 0.6 in k-units.
  - Label CBM with a dot and "CBM (Γ)".
  - Fill region above the parabola with a light blue (#b3e5fc) tint. Label "Conduction Band".
- Conduction band for INDIRECT-gap Si:
  - Draw an upward-opening parabola (narrower, representing larger effective mass transversely) centered at k ≈ +0.85 (near X), vertex at E = E_g.
  - Also draw a shallower secondary minimum at k ≈ −0.85 (symmetric).
  - Label the minimum "CBM (near X)".
- Conduction band for INDIRECT-gap Ge:
  - Draw CBM parabola centered at k = ±1.0 (L point, zone boundary), vertex at E = E_g.
  - Label "CBM (L)".
- When "Animate optical transition" is clicked:
  - For DIRECT gap: draw a vertical gold arrow from VBM point (k=0, E=0) upward to CBM point (k=0, E=E_g), animated over 1.5 s. Annotate "hν = E_g". No horizontal component.
  - For INDIRECT gap: draw a two-part animated arrow. First, draw a vertical component (photon: energy) from VBM to an intermediate energy level at k=0. Then draw a horizontal component (phonon: momentum) from k=0 to the CBM k-position, reaching E = E_g. Annotate the vertical part "Photon (ΔE)" and, if "Show phonon arrow" is checked, annotate the horizontal part "Phonon (Δk)". Use separate colors: gold for photon arrow, orange for phonon arrow.

**Right panel (35% of canvas — information panel):**

- Material name in bold, large text.
- "E_g = X.XX eV"
- "Gap type: Direct" (green text) or "Indirect" (orange text).
- "Optical emission efficiency: High" (direct) or "Low — phonon required" (indirect).
- Brief one-sentence statement of primary application (e.g., "GaAs: laser diodes, RF amplifiers" or "Si: CMOS ICs, solar cells").
- A color-coded bar labeled "Emission efficiency" — 100% filled green for direct, 10% filled orange for indirect.

**Behavior:**

- Dropdown selection immediately redraws the E-k diagram with correct CBM position, E_g value, and gap type.
- "Animate optical transition" triggers once per button press; subsequent presses replay the animation.
- If a direct-gap material is selected and "Show phonon arrow" is checked, display a small note: "No phonon needed for direct transitions."
- On window resize: call updateCanvasSize() at start of setup(); reflow all layout dimensions proportionally.

**Implementation:** p5.js, single self-contained HTML file. All band curves computed analytically as parabolas. Use createSelect(), createCheckbox(), createButton() for controls. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../../chapters/01-intro-semiconductors/index.md)
