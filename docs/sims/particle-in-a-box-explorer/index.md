---
title: Particle in a Box — Energy Level Explorer
description: Students will calculate the quantized energy levels of a particle confined in a 1D box and explain (Apply, L3) how confinement energy scales with box width and quantum number, using an interactive visualization.
status: implemented
library: p5.js
bloom_level: L3 (Apply)
---

# Particle in a Box — Energy Level Explorer



<iframe src="main.html" width="100%" height="542"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: "Quantum Mechanics: Wave Equations and Atomic Structure"](../../chapters/04-quantum-mechanics/index.md).

```text
Type: MicroSim
**sim-id:** particle-in-a-box-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will calculate the quantized energy levels of a particle confined in a 1D box and explain (Apply, L3) how confinement energy scales with box width and quantum number, using an interactive visualization.

**Canvas size:** 850 × 520 px, responsive.

**Controls (p5.js built-in):**
- Slider: Box width \(L\), 1–20 nm, default 10 nm, step 0.1 nm. Label: "Well width L (nm):"
- Slider: Number of levels to show, 1–6, default 4, step 1. Label: "Energy levels shown:"
- Select dropdown: Particle type — "Electron (m = m_e)", "GaAs electron (m = 0.067 m_e)", "GaAs heavy hole (m = 0.5 m_e)". Default: "GaAs electron".
- Checkbox: "Show probability density |ψ|²" (default checked) — overlays the wave function probability density on each level.

**Visual layout:**

Left panel (60%): Draw the infinite potential well as two tall vertical walls with the horizontal axis as energy. Inside the well (between the walls), draw horizontal lines for each quantized energy level \(E_n\) at the correct vertical position proportional to \(n^2\). Label each level "n=1, E=X.XX meV", etc.

For each level, overlay the wave function \(\psi_n(x) = A\sin(n\pi x/L)\) as a sinusoidal curve centered on the energy level line, with amplitude scaled to 30% of the level spacing. If "Show |ψ|²" is checked, shade the area under \(|\psi_n|^2\) with a translucent blue fill.

Right panel (40%): Table of all displayed energy levels:
- n, \(E_n\) in meV and eV, \(\lambda\) (photon wavelength for the \(n=2 \to n=1\) transition).
- Ratio \(E_n/E_1 = n^2\) highlighted.
- Display: "Zero-point energy E₁ = X.XX meV".
- Display: "Confinement energy scales as 1/L²: doubling L → 4× lower E₁."

**Behavior:**
- All sliders update the diagram in real time.
- Particle type dropdown changes the effective mass and recalculates all energies.
- Clicking on an energy level highlights it and shows the wave function on the right panel.
- On window resize: updateCanvasSize() reflows proportionally.

**Implementation:** p5.js, single HTML file. Energies computed analytically. Use createSlider(), createSelect(), createCheckbox(). Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 4: "Quantum Mechanics: Wave Equations and Atomic Structure"](../../chapters/04-quantum-mechanics/index.md)
