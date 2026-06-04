---
title: Quantum Tunneling Probability Explorer
description: Students will calculate the tunnel probability through a rectangular barrier and evaluate (Evaluate, L5) how barrier width and height affect tunneling in semiconductor devices, using an interactive simulation.
status: scaffold
library: p5.js
bloom_level: TBD
---

# Quantum Tunneling Probability Explorer



<iframe src="main.html" width="100%" height="562"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: "Quantum Mechanics: Wave Equations and Atomic Structure"](../../chapters/04-quantum-mechanics/index.md).

```text
Type: MicroSim
**sim-id:** quantum-tunneling-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will calculate the tunnel probability through a rectangular barrier and evaluate (Evaluate, L5) how barrier width and height affect tunneling in semiconductor devices, using an interactive simulation.

**Canvas size:** 900 × 540 px, responsive.

**Controls (p5.js built-in):**
- Slider: Barrier height \(V_0\), 0.1–5.0 eV, default 1.0 eV, step 0.05 eV. Label: "Barrier height V₀ (eV):"
- Slider: Barrier width \(d\), 0.1–3.0 nm, default 1.0 nm, step 0.05 nm. Label: "Barrier width d (nm):"
- Slider: Particle energy \(E\), 0.05–4.9 eV, default 0.5 eV, step 0.05 eV. Label: "Particle energy E (eV):"
- Select dropdown: Particle type — "Electron (m = m_e)", "GaAs conduction electron (m = 0.067 m_e)". Default: "Electron".
- Checkbox: "Show wave function" (default checked).

**Visual layout:**

Left panel (60%): Schematic of the potential energy barrier.
- Draw horizontal potential energy profile: flat at \(E = 0\) on both sides (well regions), rectangular step up to \(V_0\) in the barrier region of width \(d\).
- Draw the incident particle energy \(E\) as a dashed horizontal line in the color green.
- If "Show wave function" is checked, draw the wave function qualitatively:
  - Left of barrier: sinusoidal (incident + reflected), amplitude 1.0.
  - Inside barrier: exponentially decaying, amplitude \(e^{-\kappa x}\).
  - Right of barrier: sinusoidal with reduced amplitude \(\sqrt{T}\).
- If \(E > V_0\): draw a transmitted wave with amplitude ~1.0 (near-unity transmission above barrier). Label "Classical regime: E > V₀".
- Color the barrier region light red (#ffcdd2).

Right panel (40%):
- Display: "Tunnel probability T = X.XX × 10^N" in large bold.
- Display: "κ = X.XX nm⁻¹ (decay constant in barrier)".
- Display: "Transmission coefficient: T = X.XX%".
- Context interpretation:
  - T < 10⁻¹⁰: "Negligible tunneling."
  - 10⁻¹⁰ < T < 10⁻³: "Detectable tunneling — relevant for gate oxide leakage."
  - T > 10⁻³: "Significant tunneling — device function enabled."
- Show relevant application: e.g., "At d = 1.5 nm, V₀ = 3.1 eV (SiO₂/Si), T ≈ 10⁻⁷ — this is the gate oxide leakage regime that drove the shift to high-κ dielectrics."

**Behavior:** All sliders update T and the wave function visualization in real time. If E > V₀, switch to classical transmission formula (T → 1). On resize: updateCanvasSize() reflows.

**Implementation:** p5.js, single HTML file. T computed analytically from the exact rectangular barrier formula. Parent canvas to document.querySelector('main').
```

## Related Resources

- [Chapter 4: "Quantum Mechanics: Wave Equations and Atomic Structure"](../../chapters/04-quantum-mechanics/index.md)
