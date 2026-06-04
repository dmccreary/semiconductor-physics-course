---
title: "Bloch's Theorem, Band Formation, and E-k Diagrams"
description: Derives energy band formation in periodic crystals using the Kronig-Penney model, Bloch's theorem, free-electron, nearly-free-electron, and tight-binding models, leading to effective mass, holes, and density of states.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 13:54:22
version: 0.08
---

# Bloch's Theorem, Band Formation, and E-k Diagrams

## Summary

This chapter bridges quantum mechanics and the macroscopic electrical behavior of solids by showing how electron states in a periodic crystal organize into energy bands. The Kronig-Penney model demonstrates analytically how allowed and forbidden energy ranges emerge from a periodic potential. Bloch's theorem establishes that solutions in a periodic lattice are plane waves modulated by the lattice periodicity, introducing crystal momentum. The free-electron, nearly-free-electron, and tight-binding models each illuminate different aspects of band formation. The E-k dispersion relation leads directly to the effective mass approximation, the hole concept, and the density of states in systems of reduced dimensionality — all quantities central to carrier statistics and device analysis.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. Kronig-Penney Model
2. Bloch Theorem
3. Bloch Wave Functions
4. Crystal Momentum
5. Periodic Potential
6. Band Gap Origin
7. Free Electron Model
8. Nearly-Free Electron Model
9. Tight-Binding Model
10. Linear Combination of Atomic Orbitals
11. E-k Dispersion Relation
12. Effective Mass Approximation
13. Longitudinal Effective Mass
14. Transverse Effective Mass
15. Density-of-States Effective Mass
16. Conductivity Effective Mass
17. Hole Concept
18. Hole Effective Mass
19. Heavy Holes
20. Light Holes
21. Split-Off Band
22. Spin-Orbit Splitting
23. Density of States 3D
24. Density of States 2D
25. Density of States 1D
26. Density of States 0D

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Crystal Lattice Structure and Symmetry](../02-crystal-lattice-structure/index.md)
- [Chapter 4: Quantum Mechanics: Wave Equations and Atomic Structure](../04-quantum-mechanics/index.md)

---

!!! mascot-welcome "Why do electrons travel in bands? Because they're in a solid band together!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Chapter 5 — the payoff chapter. Everything we've built since Chapter 1 — crystal structure, quantum mechanics, wave functions — culminates here, where we ask the most important question in semiconductor physics: *why does a periodic solid have energy bands at all?* Spoiler: it's Bloch's theorem. We'll derive the bandgap from first principles, meet the effective mass approximation (the useful fiction that makes semiconductor engineering tractable), discover that holes are real things, and learn what density of states means in 3D, 2D, 1D, and 0D. This is the most mathematically dense chapter in the course. It's also the most satisfying. Let's get excited!

## The Periodic Potential

An electron moving through a crystal lattice experiences the electrostatic potential from every ion core. Because the lattice is periodic with translation vectors \(\mathbf{R}\), the potential is also periodic:

\[
V(\mathbf{r} + \mathbf{R}) = V(\mathbf{r}) \quad \text{for all lattice vectors } \mathbf{R}
\]

This is the key distinction between a crystal electron and a free electron. A free electron has plane-wave states and a parabolic dispersion \(E = \hbar^2k^2/2m_e\). The periodic potential breaks this — but in a structured, beautiful way.

## The Kronig-Penney Model: Bands from a Toy Potential

The **Kronig-Penney model** (1931) replaces the real crystal potential with a periodic array of rectangular barriers (height \(V_0\), width \(b\)) separated by wells (width \(a\), depth zero), period \(d = a+b\). The Bloch condition requires that energy \(E\) satisfies:

\[
\cos(kd) = \cos(\alpha a)\cos(\beta b) - \frac{\alpha^2 + \beta^2}{2\alpha\beta}\sin(\alpha a)\sin(\beta b)
\]

where \(\alpha = \sqrt{2mE}/\hbar\) and \(\beta = \sqrt{2m(V_0-E)}/\hbar\). The left side is bounded in [−1, +1]; the right side is not. Energy ranges where the right side lies outside [−1, +1] have no real solution for \(k\) — these are the **forbidden energy gaps**. Energy ranges where it lies inside are **allowed bands**.

The key insight: bandgaps open at Brillouin zone boundaries (\(k = \pm n\pi/d\)) because the wave is Bragg-diffracted by the periodic potential, producing standing waves with different energies depending on whether the electron probability peaks at ion cores or between them.

## Bloch's Theorem

**Bloch's theorem** (Felix Bloch, 1928) states that eigenstates of a Hamiltonian with a periodic potential take the form:

\[
\psi_{n\mathbf{k}}(\mathbf{r}) = e^{i\mathbf{k}\cdot\mathbf{r}}\, u_{n\mathbf{k}}(\mathbf{r})
\]

where \(u_{n\mathbf{k}}(\mathbf{r}+\mathbf{R}) = u_{n\mathbf{k}}(\mathbf{r})\) is a cell-periodic function and \(e^{i\mathbf{k}\cdot\mathbf{r}}\) is a plane-wave envelope. These are the **Bloch wave functions**. The band index \(n\) labels which band; \(\mathbf{k}\) is the **crystal momentum**, defined only modulo a reciprocal lattice vector — hence restricted to the first Brillouin zone.

Two consequences:
- Electrons are delocalized throughout the entire crystal, yet the probability density \(|u_{n\mathbf{k}}|^2\) reflects local crystal symmetry.
- The energy \(E_n(\mathbf{k})\) is periodic in k-space: \(E_n(\mathbf{k}+\mathbf{G}) = E_n(\mathbf{k})\).

## Three Models of Band Formation

Three analytical models illuminate complementary aspects of band formation:

**The free electron model** sets \(V = 0\). Bands are purely parabolic, no gaps exist. Useful as a baseline; correctly predicts metallic conduction but cannot explain semiconductors.

**The nearly-free electron (NFE) model** treats \(V(\mathbf{r})\) as a weak perturbation. Away from zone boundaries, bands remain nearly parabolic. *At* zone boundaries, two degenerate free-electron states mix strongly, splitting in energy by \(2|V_G|\) — the **Fourier component of the potential** at reciprocal lattice vector \(\mathbf{G}\). This is the bandgap origin: gap width = \(2|V_G|\).

**The tight-binding (LCAO) model** starts from localized atomic orbitals and assembles the crystal by introducing nearest-neighbor hopping integral \(t\). For a 1D chain:

\[
E(k) = E_0 - 2t\cos(ka)
\]

This cosine band has width \(4t\). Larger \(t\) (stronger overlap) → broader band. Isolated atomic levels → zero-width bands. The tight-binding model directly connects band energies to atomic orbital energies — foundational for heterostructure design.

!!! mascot-thinking "Three models, one truth — and they all agree on what matters."
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova thinking">
    Free electron model: gaps come from Bragg scattering of delocalized waves. Tight-binding model: bands come from tunneling between localized atomic states. These sound like opposite views of the same reality — and they are. For most semiconductors the truth is in the middle: electrons live in covalent bonding states, neither perfectly delocalized nor tightly confined. Both models give the same qualitative result (bands and gaps exist), and both are useful in different contexts (NFE near zone boundaries, TB for understanding orbital contributions to bands).

#### Diagram: Interactive E-k Band Structure Explorer


<iframe src="../../sims/ek-band-structure-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Interactive E-k Band Structure Explorer Fullscreen](../../sims/ek-band-structure-explorer<br/>/main.html)


<iframe src="../../sims/ek-band-structure-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Interactive E-k Band Structure Explorer Fullscreen](../../sims/ek-band-structure-explorer<br/>/main.html)

<details markdown="1">
<summary>Interactive E-k Band Structure Explorer</summary>
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
</details>

## The Effective Mass Approximation

Near a band extremum at \(\mathbf{k}_0\), the E-k relation is approximately parabolic. The curvature of the band defines the **effective mass tensor**:

\[
\frac{1}{m^*_{ij}} = \frac{1}{\hbar^2}\frac{\partial^2 E}{\partial k_i \partial k_j}
\]

In the effective mass approximation, an electron near a band edge behaves like a free particle with mass \(m^*\), absorbing all crystal potential effects into this single parameter. This allows the entire classical and statistical mechanics toolkit to be applied to semiconductor electrons.

For silicon's conduction band (CBM near X), the equi-energy surfaces are **ellipsoids** with:
- **Longitudinal effective mass** \(m_l^* = 0.92\,m_0\): low curvature along the valley axis.
- **Transverse effective mass** \(m_t^* = 0.19\,m_0\): high curvature perpendicular to the axis.

Two scalar effective masses are derived for practical calculations:
- **Density-of-states mass** \(m_{dos}^*\): gives the correct 3D DOS. For 6-valley Si: \(m_{dos}^* = 6^{2/3}(m_l^* m_t^{*2})^{1/3} \approx 1.08\,m_0\).
- **Conductivity mass** \(m_c^*\): gives the correct mobility. For Si: \(1/m_c^* = \frac{1}{3}(1/m_l^* + 2/m_t^*) \Rightarrow m_c^* \approx 0.26\,m_0\).

!!! mascot-tip "m* < m_e doesn't mean the electron is lighter. It means the band curves more steeply."
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova giving a tip">
    GaAs has \(m^* = 0.067\,m_0\) — 15× lighter than a free electron. This does not mean GaAs electrons are physically lighter. It means the GaAs conduction band is very sharply curved at Γ, so electrons accelerate 15× more readily under an applied field. A negative effective mass — which occurs near the *top* of a filled band — means the electron accelerates *opposite* to the force. This sounds alarming until you realize it's exactly what gives rise to the hole.

## The Hole Concept

A completely filled band carries no current — every \(\mathbf{k}\) is occupied and paired with \(-\mathbf{k}\). When one electron is excited from the valence band, leaving an empty state at \(\mathbf{k}_0\), the residual current is that of a single positive charge with momentum \(-\mathbf{k}_0\). This is a **hole**.

Hole properties:
- Charge \(+e\).
- Crystal momentum \(\mathbf{k}_h = -\mathbf{k}_e\) (negative of missing electron).
- Energy measured downward from VBM.
- Positive effective mass \(m_h^* > 0\) (from negative band curvature).

Spin-orbit coupling splits the valence band near \(\Gamma\) into three subbands:

| Subband | Symbol | \(m^*/m_0\) (Si) | \(m^*/m_0\) (GaAs) |
|---|---|---|---|
| Heavy hole | HH | 0.49 | 0.51 |
| Light hole | LH | 0.16 | 0.082 |
| Split-off | SO | ~0.24 | ~0.15 |

The HH and LH bands are degenerate at \(\mathbf{k}=0\) in unstrained material but split under biaxial or uniaxial strain — the basis of strained silicon's enhanced hole mobility (Chapter 20).

## Density of States

The **density of states (DOS)** \(g(E)\) counts allowed quantum states per unit energy per unit volume. It enters every calculation of carrier concentration, optical absorption, and recombination rate.

In **3D (bulk)** with a parabolic band:

\[
g_{3D}(E) = \frac{1}{2\pi^2}\left(\frac{2m^*}{\hbar^2}\right)^{3/2}\!\sqrt{E - E_c}
\]

The square-root energy dependence is the signature of 3D confinement. In lower-dimensional systems, each confinement dimension converts a continuous k-continuum into discrete subbands, changing the DOS shape:

- **2D (quantum well)**: step function at each subband energy \(E_n\): \(g_{2D} = m^*/\pi\hbar^2\) per step.
- **1D (quantum wire)**: inverse-square-root divergences (van Hove singularities) at subband edges.
- **0D (quantum dot)**: delta functions — fully discrete spectrum.

The delta-function DOS of quantum dots produces extremely narrow optical gain spectra and ultra-low threshold currents — the reason quantum dot lasers are commercially attractive. Quantum well lasers (step-function DOS) already outperform bulk lasers by 10–50× in threshold current; quantum dot lasers push this further.

#### Diagram: Dimensionality and Density of States Explorer


<iframe src="../../sims/density-of-states-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Dimensionality and Density of States Explorer Fullscreen](../../sims/density-of-states-explorer<br/>/main.html)


<iframe src="../../sims/density-of-states-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Dimensionality and Density of States Explorer Fullscreen](../../sims/density-of-states-explorer<br/>/main.html)

<details markdown="1">
<summary>Dimensionality and Density of States Explorer</summary>
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
</details>

## Key Takeaways

- The **periodic potential** opens energy gaps at Brillouin zone boundaries via Bragg scattering. Gap width = \(2|V_G|\) (NFE model).
- **Bloch's theorem**: \(\psi_{n\mathbf{k}} = e^{i\mathbf{k}\cdot\mathbf{r}}u_{n\mathbf{k}}\). Crystal momentum \(\mathbf{k}\) is restricted to the first Brillouin zone; band index \(n\) labels which band.
- **Kronig-Penney** analytically shows alternating barriers and wells → allowed/forbidden energy alternation.
- **Effective mass** \(m^* = \hbar^2(\partial^2 E/\partial k^2)^{-1}\): absorbs the crystal potential; enables classical mechanics of carriers. Key values: Si \(m_c^* = 0.26\,m_0\), GaAs \(m_n^* = 0.067\,m_0\).
- **Holes** are positively charged quasiparticles with positive effective mass, momentum opposite to missing electron. Valence band splits into HH, LH, SO subbands via spin-orbit coupling.
- **DOS**: 3D \(\propto \sqrt{E}\); 2D step function; 1D van Hove divergences; 0D discrete delta functions. Lower dimensionality → sharper optical gain → lower laser threshold.

!!! mascot-celebration "Bloch would be proud. So would Kronig and Penney."
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    You derived the energy band structure of crystals from quantum mechanics, understood Bloch wave functions, grasped the effective mass trick that makes all of semiconductor engineering tractable, and saw how dimensionality changes the density of states from smooth to spiky to discrete. That is the theoretical core of this entire field. Everything from here — carrier statistics, transport, junctions, transistors, lasers — is applying this framework to specific device geometries. Chapter 6: we put electrons into these bands and count them statistically.

