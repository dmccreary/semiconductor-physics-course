---
title: "Quantum Mechanics: Wave Equations and Atomic Structure"
description: Provides the quantum mechanical foundations for semiconductor band theory, covering wave-particle duality, the Schrödinger equation, 1D quantum problems, tunneling, the hydrogen atom, and spin.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 13:54:22
version: 0.08
---

# Quantum Mechanics: Wave Equations and Atomic Structure

## Summary

This chapter provides the quantum mechanical foundations required to understand why electrons in a periodic solid form energy bands. Starting from wave-particle duality and the de Broglie wavelength, students work through the time-dependent and time-independent Schrödinger equations, the physical meaning of wave functions and probability density, and canonical one-dimensional problems — particle-in-a-box, infinite and finite potential wells, and quantum tunneling (including the WKB approximation). The hydrogen atom model introduces atomic orbitals and all four quantum numbers; the Pauli exclusion principle, electron spin, and spin-orbit coupling complete the atomic picture needed for the tight-binding and band-structure treatments in Chapter 5.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Wave-Particle Duality
2. de Broglie Wavelength
3. Heisenberg Uncertainty Principle
4. Schrodinger Equation
5. Time-Dependent Schrodinger Equation
6. Time-Independent Schrodinger Equation
7. Wave Function
8. Probability Density
9. Quantum Normalization
10. Particle in a Box
11. Infinite Potential Well
12. Finite Potential Well
13. Quantum Tunneling
14. Tunnel Probability
15. WKB Approximation
16. Hydrogen Atom Model
17. Atomic Orbitals
18. Quantum Numbers
19. Principal Quantum Number
20. Angular Momentum Quantum Number
21. Magnetic Quantum Number
22. Spin Quantum Number
23. Pauli Exclusion Principle
24. Electron Spin
25. Spin-Orbit Coupling
26. Perturbation Theory
27. Variational Method

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../01-intro-semiconductors/index.md)
- [Chapter 2: Crystal Lattice Structure and Symmetry](../02-crystal-lattice-structure/index.md)

---

!!! mascot-welcome "Abandon classical intuition, all ye who enter here."
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Welcome to quantum mechanics — the framework where particles are waves, waves are particles, and certainty is a concept for the philosophically naive. Don't panic. Every semiconductor engineer has walked this path and survived. The goal of this chapter is not to make quantum mechanics feel comfortable (it doesn't) but to give you the specific tools you need to understand why silicon has a bandgap of 1.12 eV and GaN has one of 3.4 eV. We'll derive what we need, wave our hands where Dirac already did the hard work, and come out the other side ready for band theory. Let's get excited about the profoundly weird!

## Wave-Particle Duality

The starting point of quantum mechanics is the experimental observation — accumulated through the early twentieth century — that both light and matter exhibit dual wave-like and particle-like behavior depending on the experimental context. The photoelectric effect (Einstein, 1905) demonstrated that light of frequency \(\nu\) delivers energy in discrete packets of \(E = h\nu\), where \(h = 6.626 \times 10^{-34}\) J·s is Planck's constant. Compton scattering (1923) showed that photons carry momentum \(p = h/\lambda\), establishing light's particle character quantitatively.

Louis de Broglie extended this duality to matter in 1924: any particle with momentum \(p\) has an associated **de Broglie wavelength**:

\[
\lambda = \frac{h}{p} = \frac{h}{mv}
\]

For a nonrelativistic particle of mass \(m\) and kinetic energy \(E_k = p^2/2m\), the wavelength is:

\[
\lambda = \frac{h}{\sqrt{2mE_k}}
\]

For an electron (\(m_e = 9.109 \times 10^{-31}\) kg) with kinetic energy 1 eV, this gives \(\lambda \approx 1.23\) nm — comfortably in the range of semiconductor quantum well thicknesses and atomic spacings. An electron at 100 keV (typical TEM beam) has \(\lambda \approx 0.004\) nm = 0.04 Å — far smaller than a silicon unit cell, which is why electron diffraction works so well for crystal structure analysis.

## The Heisenberg Uncertainty Principle

Wave-particle duality has an immediate consequence: a particle cannot simultaneously have a precisely defined position **and** precisely defined momentum. The **Heisenberg uncertainty principle** states:

\[
\Delta x \cdot \Delta p_x \geq \frac{\hbar}{2}
\]

where \(\Delta x\) is the standard deviation of position, \(\Delta p_x\) is the standard deviation of momentum, and \(\hbar = h/2\pi = 1.055 \times 10^{-34}\) J·s is the reduced Planck constant. Similarly, for energy and time:

\[
\Delta E \cdot \Delta t \geq \frac{\hbar}{2}
\]

These are not statements about measurement limitations or engineering imprecision — they are fundamental properties of nature arising from the wave nature of quantum states. A particle confined to a small region (small \(\Delta x\)) necessarily has a large spread in momentum (\(\Delta p_x\)), and hence a nonzero minimum kinetic energy — the **zero-point energy**. This zero-point energy is directly responsible for the ground-state energy of the particle-in-a-box and for the stability of atoms (electrons cannot simply collapse into the nucleus because doing so would require infinite momentum spread).

## The Schrödinger Equation

The wave equation governing quantum particles is the **Schrödinger equation**, proposed by Erwin Schrödinger in 1926. The **time-dependent Schrödinger equation** is:

\[
i\hbar \frac{\partial \Psi(\mathbf{r}, t)}{\partial t} = \hat{H} \Psi(\mathbf{r}, t) = \left[-\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r}, t)\right] \Psi(\mathbf{r}, t)
\]

where \(\Psi(\mathbf{r}, t)\) is the **wave function** (a complex-valued function of position and time), \(\hat{H}\) is the Hamiltonian operator (total energy), \(m\) is the particle mass, \(\nabla^2\) is the Laplacian, and \(V(\mathbf{r}, t)\) is the potential energy.

When the potential \(V\) is time-independent, we can separate variables: \(\Psi(\mathbf{r}, t) = \psi(\mathbf{r})\,e^{-iEt/\hbar}\). Substituting into the time-dependent equation yields the **time-independent Schrödinger equation**:

\[
\hat{H}\psi(\mathbf{r}) = \left[-\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r})\right]\psi(\mathbf{r}) = E\psi(\mathbf{r})
\]

This is an **eigenvalue equation**: the allowed energies \(E\) are the eigenvalues of the Hamiltonian, and the corresponding wave functions \(\psi(\mathbf{r})\) are the eigenstates. In semiconductor physics, the time-independent Schrödinger equation is the workhorse: we solve it for an electron in a periodic crystal potential (Chapter 5), in a quantum well (Chapter 19), and at a metal-semiconductor junction (Chapter 13).

### The Wave Function and Probability Density

The **wave function** \(\psi(\mathbf{r})\) is the fundamental quantum mechanical description of a particle's state. It is complex-valued and, by itself, has no direct physical meaning. The physical observable is the **probability density** \(|\psi(\mathbf{r})|^2\), which gives the probability per unit volume of finding the particle at position \(\mathbf{r}\):

\[
P(\mathbf{r}) = |\psi(\mathbf{r})|^2 = \psi^*(\mathbf{r})\,\psi(\mathbf{r})
\]

The wave function must be **normalized**: the total probability of finding the particle somewhere in all of space must equal one:

\[
\int_{-\infty}^{\infty} |\psi(\mathbf{r})|^2 \, d^3r = 1
\]

Additionally, physically acceptable wave functions must be continuous, have continuous first derivatives (except at infinite potential jumps), and be square-integrable. These **boundary conditions** are what force quantization: not all values of \(E\) produce well-behaved wave functions, only discrete values do.

## Particle in a Box: Quantization Made Explicit

The **particle-in-a-box** (infinite potential well) is the simplest non-trivial quantum system and the direct ancestor of the quantum well devices used in semiconductor lasers. The problem: a particle of mass \(m\) is confined to a one-dimensional box of length \(L\), with potential \(V = 0\) inside (\(0 < x < L\)) and \(V = \infty\) outside. The boundary conditions require \(\psi(0) = \psi(L) = 0\) (the wave function vanishes at infinite potential walls).

Solving the time-independent Schrödinger equation inside the box:

\[
-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2} = E\psi \implies \psi_n(x) = \sqrt{\frac{2}{L}}\sin\!\left(\frac{n\pi x}{L}\right), \quad n = 1, 2, 3, \ldots
\]

The corresponding quantized energy levels are:

\[
E_n = \frac{n^2\pi^2\hbar^2}{2mL^2} = \frac{n^2 h^2}{8mL^2}
\]

Four results follow immediately:

- The ground state (\(n = 1\)) has nonzero energy \(E_1 = \pi^2\hbar^2/2mL^2\) — the **zero-point energy**, a direct consequence of the uncertainty principle (confining the particle to length \(L\) gives \(\Delta p \gtrsim \hbar/L\)).
- Energy levels scale as \(n^2\), so they are non-uniformly spaced.
- The energy \(E_n \propto 1/L^2\): halving the box quadruples the ground-state energy. Quantum well lasers exploit this — narrower wells produce blue-shifted emission.
- Each state has \(n-1\) nodes (zeros of \(\psi\)) inside the box.

The particle-in-a-box is not just a pedagogical toy. It is the zeroth-order model for: (1) electrons in a **quantum well** (GaAs slab sandwiched between AlGaAs barriers), where the finite barrier height makes it a finite well; (2) electrons in a **quantum dot**, where confinement in all three dimensions produces fully discrete energy levels; and (3) the density of states in a 1D conductor (Chapter 19).

!!! mascot-thinking "The particle-in-a-box: the only housing crisis with a physics derivation."
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova thinking">
    The zero-point energy is the punchline of quantum confinement: you cannot trap a particle in a box and have it sit still. The more tightly you confine it, the more energetically it squirms. This is Heisenberg uncertainty made tangible: small \(\Delta x\) → large \(\Delta p\) → large \(E_k\). For a GaAs quantum well of width \(L = 10\) nm, the ground-state confinement energy for electrons (effective mass \(0.067\,m_e\)) is about 55 meV — not negligible compared to the bandgap. This is exactly why quantum well lasers emit at different wavelengths depending on well thickness, and why semiconductor laser designers spend so much time on "strain and well width optimization."

The following MicroSim lets you adjust the box width and visualize the quantized energy levels and wave functions interactively.

#### Diagram: Particle in a Box — Energy Level Explorer


<iframe src="../../sims/particle-in-a-box-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Particle in a Box — Energy Level Explorer Fullscreen](../../sims/particle-in-a-box-explorer<br/>/main.html)


<iframe src="../../sims/particle-in-a-box-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Particle in a Box — Energy Level Explorer Fullscreen](../../sims/particle-in-a-box-explorer<br/>/main.html)

<details markdown="1">
<summary>Particle in a Box — Energy Level Explorer</summary>
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
</details>

## Finite Potential Well

The **finite potential well** is the physically realistic version of the particle-in-a-box: the potential is zero inside the well (\(0 < x < L\)) and \(V_0 > 0\) (finite) outside. This small change has a profound consequence: the wave function can **penetrate into the classically forbidden region** (\(|x| > L/2\)), decaying exponentially with characteristic length:

\[
\kappa = \frac{\sqrt{2m(V_0 - E)}}{\hbar}
\]

Applying continuity of \(\psi\) and \(d\psi/dx\) at the well boundaries produces transcendental equations for the allowed energies — equations that cannot be solved in closed form but are easily solved numerically or graphically. The results differ from the infinite well in three important ways:

- All energy levels are **lower** than the corresponding infinite-well values (the wave function extends into the barrier, increasing the effective length).
- The number of bound states is **finite** — if \(V_0\) is small enough, even the ground state becomes unbound.
- Wave function **evanescent tails** in the barrier region are the quantum mechanical basis for **resonant tunneling** in double-barrier structures (exploited in resonant tunneling diodes, RTDs).

The finite well is the direct model for a **semiconductor quantum well**: a thin layer of narrow-gap material (e.g., GaAs, \(E_g = 1.42\) eV) sandwiched between wide-gap barriers (e.g., Al\(_{0.3}\)Ga\(_{0.7}\)As, \(E_g \approx 1.80\) eV). The conduction band offset \(\Delta E_c \approx 0.23\) eV is the effective \(V_0\) for electrons; the valence band offset \(\Delta E_v \approx 0.15\) eV is \(V_0\) for holes. Quantum well lasers, introduced commercially in the 1980s, achieve threshold current densities 10–50× lower than bulk DH lasers by concentrating the carrier density and optical gain in the thin well region.

## Quantum Tunneling

**Quantum tunneling** is the penetration of a quantum particle through a potential energy barrier higher than the particle's total energy — a process that is classically forbidden but quantum mechanically allowed. It is the direct consequence of the exponentially decaying (evanescent) wave function in the classically forbidden region. If the barrier is thin enough, the evanescent tail has non-negligible amplitude on the far side, and the particle can emerge beyond the barrier — having "tunneled" through it without ever having had enough energy to surmount it.

The **tunnel probability** \(T\) for a particle of energy \(E\) tunneling through a rectangular barrier of height \(V_0 > E\) and width \(d\) is (in the limit \(\kappa d \gg 1\)):

\[
T \approx 16\frac{E(V_0-E)}{V_0^2}\exp(-2\kappa d), \quad \kappa = \frac{\sqrt{2m(V_0-E)}}{\hbar}
\]

The exponential dependence on \(\kappa d\) makes tunneling exquisitely sensitive to barrier width and height. Changing \(d\) by 0.1 nm can change \(T\) by an order of magnitude.

The **WKB approximation** (Wentzel-Kramers-Brillouin) generalizes the rectangular barrier result to slowly varying potentials \(V(x)\):

\[
T \approx \exp\!\left(-2\int_{x_1}^{x_2} \kappa(x)\,dx\right), \quad \kappa(x) = \frac{\sqrt{2m[V(x)-E]}}{\hbar}
\]

where \(x_1\) and \(x_2\) are the classical turning points where \(V(x) = E\). The WKB approximation is valid when the potential varies slowly on the scale of the de Broglie wavelength.

Tunneling has numerous technological consequences in semiconductor devices:

- **Zener breakdown** in heavily doped p-n junctions: electrons tunnel directly from the valence band of the p-side to the conduction band of the n-side through the depletion region (band-to-band tunneling).
- **Gate oxide leakage** in scaled MOSFETs: electrons tunnel through the thin SiO₂ gate dielectric (thickness < 2 nm in advanced nodes), limiting further oxide scaling and motivating high-κ dielectric replacement.
- **Resonant tunneling diodes (RTDs)**: double-barrier structures with quantum well resonances give negative differential resistance — exploited in terahertz oscillators.
- **Scanning tunneling microscopy (STM)**: atomic-resolution imaging via the exponential sensitivity of tunnel current to tip-sample separation.

#### Diagram: Quantum Tunneling Probability Explorer


<iframe src="../../sims/quantum-tunneling-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Quantum Tunneling Probability Explorer Fullscreen](../../sims/quantum-tunneling-explorer<br/>/main.html)


<iframe src="../../sims/quantum-tunneling-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Quantum Tunneling Probability Explorer Fullscreen](../../sims/quantum-tunneling-explorer<br/>/main.html)

<details markdown="1">
<summary>Quantum Tunneling Probability Explorer</summary>
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
</details>

!!! mascot-tip "Gate oxide leakage is just electrons deciding that 1.5 nm of SiO₂ is a suggestion, not a rule."
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova giving a tip">
    When the ITRS roadmap pushed MOSFET gate oxide thickness below ~2 nm in the early 2000s, engineers discovered that the quantum mechanics they had been politely ignoring was suddenly the dominant leakage mechanism. An electron with 0.5 eV energy tunneling through 1.5 nm of SiO₂ (\(V_0 \approx 3.1\) eV) has a tunnel probability of roughly \(10^{-7}\) per attempt — but electrons attempt ~\(10^{15}\) times per second, producing measurable gate current. This single physical mechanism drove the entire industry to replace SiO₂ with high-κ dielectrics (HfO₂, hafnium-based stacks) in the 45 nm node (~2007). One equation, one industry pivot.

## The Hydrogen Atom Model

The **hydrogen atom** — a single proton surrounded by one electron — is the only atom with an exact analytical solution to the Schrödinger equation. Despite its apparent simplicity, it captures all the essential quantum mechanical features of atomic structure and serves as the basis for understanding donor and acceptor impurity states in semiconductors.

The potential energy is the Coulomb attraction: \(V(r) = -e^2/(4\pi\epsilon_0 r)\). Solving the three-dimensional Schrödinger equation in spherical coordinates through separation of variables \(\psi(r,\theta,\phi) = R(r)\,Y_l^m(\theta,\phi)\) yields the **atomic orbitals** — the eigenstate wave functions labeled by three quantum numbers.

The quantized energy eigenvalues are:

\[
E_n = -\frac{m_e e^4}{2(4\pi\epsilon_0)^2\hbar^2} \frac{1}{n^2} = -\frac{13.6\text{ eV}}{n^2}
\]

The ground state (\(n = 1\)) energy is −13.6 eV — the energy required to ionize hydrogen. The characteristic spatial scale is the **Bohr radius**:

\[
a_0 = \frac{4\pi\epsilon_0\hbar^2}{m_e e^2} = 0.529\text{ Å}
\]

In a semiconductor, a donor atom (e.g., phosphorus in silicon) is a hydrogen-like system with the electron orbiting a singly-charged ion core in a medium with relative permittivity \(\epsilon_r\) and with effective mass \(m_n^*\) replacing the free electron mass. The donor ionization energy scales as:

\[
E_d = \frac{m_n^*/m_0}{\epsilon_r^2} \times 13.6\text{ eV}
\]

For silicon (\(m_n^* \approx 0.26\,m_0\), \(\epsilon_r = 11.7\)): \(E_d \approx 26\text{ meV}/11.7^2 \times 13.6 \approx 26\text{ meV}\) — confirming that phosphorus donors in silicon are ionized at room temperature (\(k_BT \approx 26\text{ meV}\)) as assumed in all our Chapter 1 discussions. This is the **effective-mass approximation** for impurity states, derived in Chapter 7.

## Quantum Numbers

The full specification of an electron state in the hydrogen atom requires **four quantum numbers**, each arising from a different boundary condition or fundamental quantum mechanical property:

The following table defines all four quantum numbers and their allowed values:

| Quantum Number | Symbol | Physical Origin | Allowed Values | Effect |
|---|---|---|---|---|
| Principal | \(n\) | Radial boundary condition | 1, 2, 3, … | Sets energy: \(E_n = -13.6/n^2\) eV |
| Angular momentum | \(l\) | Angular momentum magnitude | 0 to \(n-1\) | Sets orbital shape (s, p, d, f) |
| Magnetic | \(m_l\) | \(z\)-component of \(\mathbf{L}\) | \(-l\) to \(+l\) | Sets orbital orientation |
| Spin | \(m_s\) | Intrinsic electron spin | \(+\frac{1}{2}\), \(-\frac{1}{2}\) | Sets spin state (↑, ↓) |

The **principal quantum number** \(n\) determines the energy and the size of the orbital (mean radius \(\langle r \rangle \approx n^2 a_0\)). The **angular momentum quantum number** \(l\) determines the orbital's shape: \(l = 0\) gives a spherically symmetric s orbital; \(l = 1\) gives dumbbell-shaped p orbitals; \(l = 2\) gives d orbitals. The notation 1s, 2s, 2p, 3s, 3p, 3d corresponds to \((n, l)\) pairs. The **magnetic quantum number** \(m_l\) selects among the \(2l+1\) orientations of each orbital type, which are degenerate in energy in the absence of a magnetic field. The **spin quantum number** \(m_s\) labels the two spin states of the electron.

The total degeneracy of the \(n\)th shell is:

\[
g_n = 2\sum_{l=0}^{n-1}(2l+1) = 2n^2
\]

For \(n = 1\): \(g = 2\) (1s↑ and 1s↓). For \(n = 2\): \(g = 8\) (2s and three 2p orbitals, each with two spins).

## Pauli Exclusion Principle and Electron Spin

The **Pauli exclusion principle** (Wolfgang Pauli, 1925) states that no two electrons in a quantum system can occupy the same quantum state — equivalently, no two electrons can have the same values of all four quantum numbers \((n, l, m_l, m_s)\). This is a consequence of the **Fermi-Dirac statistics** that govern half-integer spin particles (fermions), which demands that the many-electron wave function is antisymmetric under exchange of any two electrons.

The Pauli exclusion principle is the reason the periodic table has the structure it does. Without it, all electrons in every atom would collapse into the 1s ground state. With it, electrons fill shells in order of increasing energy, producing the shell structure that governs chemical bonding and the periodic trends that predict semiconductor properties.

**Electron spin** is an intrinsic angular momentum \(\mathbf{S}\) with magnitude \(|\mathbf{S}| = \hbar\sqrt{s(s+1)}\) where \(s = 1/2\). The two possible projections of spin along any axis are \(\hbar/2\) (spin-up, \(m_s = +1/2\)) and \(-\hbar/2\) (spin-down, \(m_s = -1/2\)). Spin has no classical analog; it is a purely quantum mechanical property. Spin is central to semiconductor spintronics, where devices seek to use the spin degree of freedom alongside charge to store and process information.

**Spin-orbit coupling** is the interaction between an electron's spin angular momentum \(\mathbf{S}\) and its orbital angular momentum \(\mathbf{L}\), arising from relativistic effects. The Hamiltonian contribution is:

\[
\hat{H}_{SO} = \frac{1}{2m_e^2 c^2} \frac{1}{r}\frac{dV}{dr} \mathbf{L}\cdot\mathbf{S}
\]

In semiconductors, spin-orbit coupling splits the valence band into the **heavy-hole (HH)** and **light-hole (LH)** bands at the zone center (\(\Gamma\) point) and produces the **split-off (SO)** band at energy \(\Delta_{SO}\) below. The spin-orbit splitting is material-dependent: \(\Delta_{SO} = 0.044\) eV in silicon, 0.341 eV in GaAs, and 0.82 eV in InAs. Larger splitting (heavier atoms) more effectively separates the hole bands, which affects the density of states and therefore the properties of p-type devices.

## Perturbation Theory and Variational Methods

The hydrogen atom and the particle-in-a-box are among the very few quantum systems with exact analytical solutions. Real semiconductor problems — donors in a crystal, quantum confinement in an arbitrary potential, Stark shifts from electric fields — require approximate methods. Two frameworks are standard:

**Perturbation theory** applies when the Hamiltonian can be written as \(\hat{H} = \hat{H}_0 + \hat{H}'\), where \(\hat{H}_0\) has known solutions and \(\hat{H}'\) is a small correction. The first-order energy correction is:

\[
E_n^{(1)} = \langle \psi_n^{(0)} | \hat{H}' | \psi_n^{(0)} \rangle
\]

In semiconductor physics, perturbation theory is applied to: the effect of strain on band edges (deformation potential theory), the linear Stark effect on donor states in an electric field, and the **k·p method** for computing effective masses and band dispersion near high-symmetry points.

**The variational method** finds an upper bound on the ground-state energy by choosing a **trial wave function** \(\phi(\alpha)\) parameterized by variational parameter(s) \(\alpha\) and minimizing the expectation value of the Hamiltonian:

\[
E_{\text{trial}}(\alpha) = \frac{\langle \phi(\alpha) | \hat{H} | \phi(\alpha) \rangle}{\langle \phi(\alpha) | \phi(\alpha) \rangle} \geq E_{\text{ground state}}
\]

The variational principle guarantees that any trial function gives an energy above (or equal to) the true ground state; minimizing over \(\alpha\) finds the best approximation within the chosen functional form. The variational method is the basis for the **tight-binding** (linear combination of atomic orbitals, LCAO) approach to band structure in Chapter 5.

## Key Takeaways

This chapter built the quantum mechanical toolkit required for semiconductor band theory:

- **Wave-particle duality**: particles have de Broglie wavelength \(\lambda = h/p\); the electron's wavelength at typical energies is nanometers — the scale of quantum wells and atomic spacings.
- The **uncertainty principle** \(\Delta x \cdot \Delta p \geq \hbar/2\) is fundamental, not technical: it produces zero-point energy and prevents atomic collapse.
- The **Schrödinger equation** — time-dependent and time-independent — governs quantum particle behavior. The time-independent form is an eigenvalue equation whose eigenvalues are the quantized allowed energies.
- The **wave function** \(\psi\) is complex; \(|\psi|^2\) is the probability density. Normalization, continuity, and square-integrability impose boundary conditions that select quantized energies.
- The **infinite and finite potential wells** model quantum confinement. Energy levels scale as \(n^2/L^2\); finite barriers allow evanescent penetration, enabling tunneling.
- **Quantum tunneling** probability scales as \(\exp(-2\kappa d)\) — exponentially sensitive to barrier width. It governs Zener breakdown, gate oxide leakage, and STM resolution.
- The **hydrogen atom** provides exact energy levels \(E_n = -13.6/n^2\) eV and the four quantum numbers \((n, l, m_l, m_s)\). Adapted with effective mass and permittivity, it models donor/acceptor ionization energies in semiconductors.
- The **Pauli exclusion principle** determines shell filling and the periodic table's structure. **Spin-orbit coupling** splits the valence band into HH, LH, and SO subbands.
- **Perturbation theory** and **variational methods** handle real problems. Perturbation theory underlies the k·p method for effective masses; the variational method underlies tight-binding band structure.

!!! mascot-celebration "You just survived quantum mechanics. The Nobel Committee is watching."
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    Twenty-seven quantum mechanical concepts, one chapter, zero paradoxes (we agreed not to discuss measurement). You now have the Schrödinger equation, wave functions, quantization, tunneling, the hydrogen atom, spin, and perturbation theory in your toolkit. That is genuinely the foundation of modern physics. Next chapter: we unleash all of this on a periodic crystal and watch energy bands emerge from the mathematics like rabbits from a very well-behaved hat. Bloch's theorem awaits. Time to jump bands!
