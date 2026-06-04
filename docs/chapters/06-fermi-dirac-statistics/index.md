---
title: Fermi-Dirac Statistics and Intrinsic Carrier Concentrations
description: Develops carrier statistics for semiconductors — Fermi-Dirac and Maxwell-Boltzmann distributions, effective density of states, intrinsic carrier concentration, intrinsic Fermi level, and the law of mass action.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 13:54:22
version: 0.08
---

# Fermi-Dirac Statistics and Intrinsic Carrier Concentrations

## Summary

This chapter develops the statistical mechanics framework that determines how electrons and holes populate the energy bands in thermal equilibrium. Fermi-Dirac statistics is derived and contrasted with the Maxwell-Boltzmann approximation valid for non-degenerate semiconductors. Using the effective densities of states in the conduction and valence bands, students calculate the intrinsic carrier concentration and its strong exponential temperature dependence. The intrinsic Fermi level and the law of mass action (np = ni²) are derived — results that underpin every equilibrium carrier calculation in subsequent chapters.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Fermi Energy
2. Fermi Level
3. Fermi-Dirac Distribution
4. Maxwell-Boltzmann Distribution
5. Bose-Einstein Distribution
6. Effective Density of States
7. Conduction Band Effective DOS
8. Valence Band Effective DOS
9. Intrinsic Carrier Concentration
10. Intrinsic Fermi Level
11. Temperature Dependence ni
12. Law of Mass Action
13. Electron Concentration Formula
14. Hole Concentration Formula
15. Charge Neutrality Condition

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../01-intro-semiconductors/index.md)
- [Chapter 5: Bloch's Theorem, Band Formation, and E-k Diagrams](../05-bloch-theorem-band-theory/index.md)

---

!!! mascot-welcome "Electrons: famously unwilling to share. Bosons could learn something from them."
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Chapter 6! Here's where we ask: given a semiconductor with energy bands (Chapter 5), how many electrons actually end up in the conduction band at room temperature? The answer comes from Fermi-Dirac statistics — the probability distribution for quantum particles that obey the Pauli exclusion principle, which is to say, particles that refuse to share a quantum state with anyone. Electrons are fermions. They are deeply territorial. Knowing their statistical behavior gives us the intrinsic carrier concentration \(n_i\), one of the most important material parameters in semiconductor physics. Let's count electrons — statistically!

## Statistical Distributions in Quantum Systems

Before deriving carrier concentrations, we need to understand the three fundamental quantum statistical distributions, because semiconductors intersect all three depending on the temperature regime and carrier type.

Three types of quantum particles exist, distinguished by their spin:

- **Fermions** (half-integer spin: electrons, holes, protons): obey the **Pauli exclusion principle** — no two fermions can occupy the same quantum state. Distribution: Fermi-Dirac.
- **Bosons** (integer spin: photons, phonons, Cooper pairs): no restriction on state occupancy. Distribution: Bose-Einstein.
- **Classical particles** (distinguishable, distinguishable states): obey Maxwell-Boltzmann statistics in the limit of low occupancy.

For our purposes, electrons and holes are fermions. Phonons (lattice vibrations, critical for carrier scattering in Chapter 8) are bosons. At room temperature and for non-degenerate doping levels, the Fermi-Dirac distribution reduces to the Maxwell-Boltzmann approximation — a simplification we will use throughout most of this course.

## The Fermi-Dirac Distribution

The **Fermi-Dirac distribution** \(f(E)\) gives the probability that a quantum state at energy \(E\) is occupied by an electron at thermal equilibrium at temperature \(T\):

\[
f(E) = \frac{1}{1 + \exp\!\left(\dfrac{E - E_F}{k_BT}\right)}
\]

where \(E_F\) is the **Fermi energy** (also called the **Fermi level**), \(k_B = 8.617 \times 10^{-5}\) eV/K is Boltzmann's constant, and \(T\) is temperature in kelvin.

Three limits of the Fermi-Dirac distribution are essential:

- At \(E = E_F\): \(f(E_F) = 1/2\) exactly, at any temperature. The Fermi level is always defined as the energy at which the occupation probability is exactly one-half.
- For \(E \gg E_F\) (by several \(k_BT\)): \(f(E) \approx \exp[-(E-E_F)/k_BT]\) — the **Maxwell-Boltzmann** tail. For non-degenerate semiconductors, the conduction band minimum \(E_C\) lies several \(k_BT\) above \(E_F\), so this approximation applies.
- At \(T = 0\): \(f(E) = 1\) for \(E < E_F\) and \(f(E) = 0\) for \(E > E_F\) — a sharp step function. All states below \(E_F\) are filled; all above are empty.

The **Bose-Einstein distribution** \(n_{BE}(E) = 1/[\exp(E/k_BT) - 1]\) governs phonons and photons; it appears in Chapter 8 (phonon scattering) and Chapter 17 (laser photon statistics).

The **Maxwell-Boltzmann distribution** \(f_{MB}(E) = A\exp(-E/k_BT)\) is the classical limit, valid when occupation probabilities are small — which requires \(E - E_F \gg k_BT\). For silicon at room temperature with doping below \(\sim 10^{18}\) cm\(^{-3}\), this approximation is excellent and greatly simplifies algebra.

The following table contrasts all three distributions:

| Distribution | Particles | Occupancy Constraint | Expression |
|---|---|---|---|
| Fermi-Dirac | Fermions (e⁻, holes) | Max 1 per state | \(1/[1+e^{(E-E_F)/k_BT}]\) |
| Bose-Einstein | Bosons (photons, phonons) | Unlimited | \(1/[e^{E/k_BT}-1]\) |
| Maxwell-Boltzmann | Classical | Unlimited, low density | \(A\,e^{-E/k_BT}\) |

## The Fermi Level: Physical Interpretation

The **Fermi level** \(E_F\) is the chemical potential of the electron gas — the energy at which a marginal electron would be in equilibrium with the system. Several key properties:

- \(E_F\) is a thermodynamic quantity characterizing the equilibrium state of the electron system; it does not correspond to a specific allowed energy state (it often falls inside the forbidden gap).
- In a **metal**, \(E_F\) falls inside a partially filled band at all temperatures.
- In an **intrinsic (undoped) semiconductor**, \(E_F\) lies within the forbidden gap, approximately midway between \(E_C\) and \(E_V\) (the precise position is derived below).
- \(E_F\) shifts with doping: upward toward \(E_C\) for n-type material, downward toward \(E_V\) for p-type material (Chapter 7).
- When two materials are in thermal equilibrium in contact (a junction), their Fermi levels are equal. This condition governs the built-in potential of p-n junctions and the Schottky barrier height at metal-semiconductor contacts.

## Effective Density of States

To compute the number of electrons in the conduction band, we multiply the density of available states \(g_{CB}(E)\) by the probability of occupancy \(f(E)\) and integrate over the conduction band:

\[
n = \int_{E_C}^{\infty} g_{CB}(E)\,f(E)\,dE
\]

Using the 3D parabolic-band density of states from Chapter 5, \(g_{CB}(E) = \frac{\sqrt{2}\,m_{dos,n}^{*3/2}}{\pi^2\hbar^3}\sqrt{E - E_C}\), and applying the Maxwell-Boltzmann approximation \(f(E) \approx e^{-(E-E_F)/k_BT}\):

\[
n = N_C \exp\!\left(-\frac{E_C - E_F}{k_BT}\right)
\]

where \(N_C\) is the **effective density of states in the conduction band**:

\[
N_C = 2\left(\frac{2\pi m_{dos,n}^* k_BT}{h^2}\right)^{3/2}
\]

At \(T = 300\) K: \(N_C = 2.86 \times 10^{19}\) cm\(^{-3}\) for silicon (\(m_{dos,n}^* = 1.08\,m_0\)).

Analogously, the hole concentration is:

\[
p = N_V \exp\!\left(-\frac{E_F - E_V}{k_BT}\right)
\]

where \(N_V = 2(2\pi m_{dos,p}^* k_BT/h^2)^{3/2}\) is the **effective density of states in the valence band**. At 300 K: \(N_V = 3.10 \times 10^{19}\) cm\(^{-3}\) for silicon (\(m_{dos,p}^* = 0.81\,m_0\)).

\(N_C\) and \(N_V\) can be thought of as the number of available quantum states per unit volume "condensed" to the band edges — the virtual reservoir from which electrons and holes are drawn.

!!! mascot-thinking "N_C and N_V are not actual counts — they're effective targets for Fermi-Dirac statistics."
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova thinking">
    Here's the intuition behind \(N_C\): imagine taking all the states in the conduction band and collapsing them to a single energy level at \(E_C\), with a degeneracy \(N_C\). The Boltzmann occupation of this imaginary level \(N_C \times e^{-(E_C - E_F)/k_BT}\) gives the exact same electron count as integrating the real parabolic density of states with the real Fermi-Dirac distribution (in the non-degenerate limit). It's a brilliantly compact fiction. Note that \(N_C\) and \(N_V\) are temperature-dependent (\(\propto T^{3/2}\)) — a fact that matters when computing carrier concentrations at temperatures other than 300 K.

#### Diagram: Fermi-Dirac Distribution and Carrier Concentration Explorer

<details markdown="1">
<summary>Fermi-Dirac Distribution and Carrier Concentration Explorer</summary>
Type: MicroSim
**sim-id:** fermi-dirac-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will apply the Fermi-Dirac distribution to calculate electron and hole concentrations in a semiconductor and explain (Apply, L3) how temperature and Fermi level position determine n and p.

**Canvas size:** 900 × 540 px, responsive.

**Controls:**
- Slider: Temperature T, 100–700 K, default 300 K. Label: "Temperature (K):"
- Slider: Fermi level position \(E_F - E_i\), −0.6 to +0.6 eV, default 0 eV (intrinsic). Label: "E_F − E_i (eV):"
- Select: Material — "Silicon (E_g=1.12 eV)", "GaAs (E_g=1.42 eV)", "Ge (E_g=0.66 eV)". Default: Si.

**Visual layout:**

Left panel (55%): Energy-axis diagram (vertical energy axis). Draw:
- Horizontal bands for CB (top, blue) and VB (bottom, green), with the gap in between.
- Horizontal dashed lines for E_C, E_V, E_F (moveable), E_i (midgap reference).
- Beside the bands, draw the Fermi-Dirac function f(E) as a curve (sigmoid), with the 50% point exactly at E_F.
- Shade the CB region with intensity proportional to n (computed from N_C formula) — darker shade = more electrons.
- Shade the VB region with intensity proportional to p.

Right panel (45%): Computed values:
- \(f(E_C)\) = probability of occupying the CB edge.
- n = electron concentration (cm⁻³).
- p = hole concentration (cm⁻³).
- n·p product (should equal \(n_i^2\)).
- \(n_i\) (intrinsic concentration at current T).
- Display: "Material class: n-type / p-type / intrinsic" based on whether n > p, n < p, or n ≈ p.

**Behavior:** All sliders update computed values and visualization in real time. On resize: updateCanvasSize() reflows.

**Implementation:** p5.js, single HTML file. Use built-in createSlider(), createSelect(). Parent canvas to document.querySelector('main').
</details>

## Intrinsic Carrier Concentration

For an **intrinsic (undoped) semiconductor** in thermal equilibrium, charge neutrality requires \(n = p = n_i\), where \(n_i\) is the **intrinsic carrier concentration**. Multiplying the \(n\) and \(p\) expressions:

\[
n_i^2 = n \cdot p = N_C N_V \exp\!\left(-\frac{E_g}{k_BT}\right)
\]

\[
\boxed{n_i = \sqrt{N_C N_V}\,\exp\!\left(-\frac{E_g}{2k_BT}\right)}
\]

This is one of the most important equations in semiconductor physics. The intrinsic carrier concentration is an exponentially sensitive function of the bandgap and temperature. Some key values at 300 K:

| Material | \(E_g\) (eV) | \(n_i\) at 300 K (cm⁻³) | \(n_i\) at 400 K (cm⁻³) |
|---|---|---|---|
| Si | 1.12 | \(9.65 \times 10^9\) | ~\(10^{13}\) |
| Ge | 0.66 | \(2.4 \times 10^{13}\) | ~\(10^{16}\) |
| GaAs | 1.42 | \(\sim 2 \times 10^6\) | ~\(10^{10}\) |
| GaN | 3.40 | \(\sim 10^{-10}\) | ~\(10^{-4}\) |

The exponential temperature dependence is striking: silicon's \(n_i\) increases by more than three orders of magnitude between 300 K and 400 K. This is why silicon CMOS devices fail at elevated temperatures — when \(n_i\) approaches the doping concentration, the device enters the **intrinsic regime** and transistors can no longer be turned off. Wide-gap semiconductors like GaN and SiC, with \(n_i\) near zero at room temperature, can operate at temperatures exceeding 400°C without this problem.

## The Intrinsic Fermi Level

To find the position of the Fermi level in an intrinsic semiconductor, we set \(n = p\) and solve for \(E_F\):

\[
N_C \exp\!\left(-\frac{E_C - E_F}{k_BT}\right) = N_V \exp\!\left(-\frac{E_F - E_V}{k_BT}\right)
\]

Solving:

\[
E_i \equiv E_F\Big|_{\text{intrinsic}} = \frac{E_C + E_V}{2} + \frac{k_BT}{2}\ln\frac{N_V}{N_C} = E_{\text{midgap}} + \frac{3k_BT}{4}\ln\frac{m_{dos,p}^*}{m_{dos,n}^*}
\]

The second term corrects for the asymmetry between \(N_C\) and \(N_V\). For silicon (\(m_{dos,p}^* > m_{dos,n}^*\)), \(E_i\) lies slightly below the midgap — about 7 meV below \(E_{\text{midgap}}\) at 300 K, a negligible correction in most calculations. The label \(E_i\) denotes the **intrinsic Fermi level** and serves as a convenient reference energy throughout the course: \(n = n_i\exp[(E_F-E_i)/k_BT]\) and \(p = n_i\exp[(E_i-E_F)/k_BT]\).

## The Law of Mass Action

The product \(n \cdot p\) is independent of Fermi level position:

\[
\boxed{n \cdot p = n_i^2 = N_C N_V \exp\!\left(-\frac{E_g}{k_BT}\right)}
\]

This is the **law of mass action** — a direct analog of the chemical equilibrium constant for the reaction \(\emptyset \rightleftharpoons e^- + h^+\). It holds in thermal equilibrium regardless of doping: if doping increases \(n\), then \(p\) decreases such that their product remains \(n_i^2\). This constraint links carrier concentrations across all equilibrium semiconductor physics.

## The Charge Neutrality Condition

In a semiconductor with donor density \(N_D\) and acceptor density \(N_A\), equilibrium requires that the total charge is zero:

\[
n + N_A^- = p + N_D^+
\]

where \(N_D^+\) is the density of ionized donors (positive charge) and \(N_A^-\) is the density of ionized acceptors. For complete ionization (the common room-temperature approximation):

\[
n + N_A = p + N_D
\]

Combined with the law of mass action \(np = n_i^2\), these two equations determine \(n\) and \(p\) for any doping condition. This is the foundation of all extrinsic carrier calculations in Chapter 7.

#### Diagram: Temperature Dependence of ni Explorer

<details markdown="1">
<summary>Temperature Dependence of n_i Explorer</summary>
Type: MicroSim
**sim-id:** intrinsic-concentration-temperature<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning objective:** Students will calculate intrinsic carrier concentration as a function of temperature for multiple materials and evaluate (Evaluate, L5) which materials are suitable for high-temperature operation.

**Canvas size:** 780 × 480 px, responsive.

**Chart type:** Line chart (Chart.js) with a logarithmic y-axis.

**Dataset:** For each material, compute \(n_i(T) = \sqrt{N_C(T)N_V(T)}\exp(-E_g/2k_BT)\) from T = 200 K to T = 700 K in 10 K steps. Include Si (E_g=1.12 eV), Ge (E_g=0.66 eV), GaAs (E_g=1.42 eV), GaN (E_g=3.4 eV). Use appropriate effective masses for N_C and N_V scaling (~T^{3/2}).

**Visual:**
- X-axis: Temperature T (K), 200–700 K.
- Y-axis: n_i (cm⁻³), log scale, 10⁻¹⁰ to 10²⁰.
- Four colored lines (Si=blue, Ge=green, GaAs=orange, GaN=red).
- Horizontal dashed reference lines at n_i = 10^15 (typical light doping level) and n_i = 10^10 (Si at 300 K).
- Draw a vertical dashed line at T = 300 K.

**Interaction:**
- Hovering over any point shows: material, temperature, n_i value, and whether the device would be in the intrinsic regime at that T for a given doping level (configurable via dropdown: "Doping N_D = 10^15, 10^16, 10^17 cm⁻³").
- Clicking a material line highlights it and shows the approximate maximum safe operating temperature (where n_i ~ N_D/10).

**Implementation:** Chart.js v4, single HTML file. Computed n_i values precomputed and stored as arrays. Parent canvas to document.querySelector('main').
</details>

!!! mascot-warning "n_i for Si at 300 K = 9.65×10⁹ cm⁻³. Memorize this number. It will follow you for the rest of your career."
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova cautioning">
    Silicon's intrinsic carrier concentration of ~10¹⁰ cm⁻³ at room temperature seems small against a total silicon atom density of 5×10²² cm⁻³ — one intrinsic carrier per 5 trillion atoms. But \(n_i\) sets the baseline below which you cannot make effective transistors: if your doping level \(N_D\) gets anywhere near \(n_i\), your semiconductor is effectively intrinsic and your transistor won't turn off. The rule of thumb: for a functional device, you need \(N_D \gg n_i\) — in practice \(N_D > 10^{14}\) cm⁻³ minimum. Also note: the commonly cited \(n_i = 1.45 \times 10^{10}\) cm⁻³ for silicon is a historical value based on older effective mass data; the current best value is \(9.65 \times 10^9\) cm⁻³. Textbook to textbook discrepancies in this value are common. Don't be alarmed — they're all within a factor of two of each other, which is within the exponential sensitivity of the formula.

## Key Takeaways

- **Fermi-Dirac distribution**: \(f(E) = 1/[1+\exp((E-E_F)/k_BT)]\). At \(E = E_F\), \(f = 0.5\). The Fermi level is the energy at which the occupation probability is exactly one-half.
- **Maxwell-Boltzmann approximation** applies when \(E_C - E_F \gg k_BT\) (non-degenerate semiconductors), giving \(f(E) \approx e^{-(E-E_F)/k_BT}\).
- **Effective density of states**: \(N_C = 2(2\pi m_{dos,n}^* k_BT/h^2)^{3/2}\) and \(N_V = 2(2\pi m_{dos,p}^* k_BT/h^2)^{3/2}\). These represent the effective number of available states condensed to the band edges.
- **Carrier concentrations**: \(n = N_C\exp(-(E_C-E_F)/k_BT)\), \(p = N_V\exp(-(E_F-E_V)/k_BT)\).
- **Intrinsic carrier concentration**: \(n_i = \sqrt{N_CN_V}\exp(-E_g/2k_BT)\). For Si: \(n_i = 9.65 \times 10^9\) cm⁻³ at 300 K. Exponentially sensitive to \(E_g\) and \(T\).
- **Intrinsic Fermi level** \(E_i\) lies within the bandgap, near (but not exactly at) midgap: \(E_i = E_{\text{midgap}} + (3k_BT/4)\ln(m_{dos,p}^*/m_{dos,n}^*)\).
- **Law of mass action**: \(np = n_i^2\) in thermal equilibrium, regardless of doping.
- **Charge neutrality**: \(n + N_A = p + N_D\) determines equilibrium carrier concentrations when doping is present.

!!! mascot-celebration "You can now count electrons at the quantum level. That's a superpower."
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    You just derived where electrons actually *are* in a semiconductor at thermal equilibrium. Fermi-Dirac statistics, effective density of states, intrinsic carrier concentration, the law of mass action — these are the four pillars of equilibrium semiconductor carrier physics. Everything you compute from here — doping effects, junction built-in potentials, recombination rates — rests on \(n = N_C\exp(-(E_C-E_F)/k_BT)\) and \(np = n_i^2\). Chapter 7: we deliberately disturb this equilibrium by introducing dopant atoms. Things get interesting.

