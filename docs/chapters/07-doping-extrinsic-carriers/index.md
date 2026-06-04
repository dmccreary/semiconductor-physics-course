---
title: Doping, Extrinsic Carriers, and the Fermi Level
description: How substitutional impurities transform intrinsic semiconductors into controllable conductors through donor/acceptor doping, three temperature regimes, and Fermi level engineering
generated_by: claude skill chapter-content-generator
date: 2026-06-03 14:00:00
version: 0.08
---

# Doping, Extrinsic Carriers, and the Fermi Level

## Summary

Doping is the primary engineering lever in semiconductor devices. This chapter covers how substitutional impurities — donors (group V) and acceptors (group III) — introduce shallow energy levels that ionize at room temperature, dramatically shifting the carrier concentrations from the intrinsic values. The three operating regimes (freeze-out, extrinsic, and intrinsic) are analyzed as functions of temperature. Students learn to calculate majority and minority carrier concentrations using the charge-neutrality condition, to handle compensation doping and net doping, and to track how the Fermi level moves with doping density and temperature — including the distinction between degenerate and non-degenerate semiconductors.

## Concepts Covered

This chapter covers the following 28 concepts from the learning graph:

1. N-Type Doping
2. P-Type Doping
3. Donor Atoms
4. Acceptor Atoms
5. Group V Dopants in Silicon
6. Group III Dopants in Silicon
7. Phosphorus as Donor
8. Arsenic as Donor
9. Antimony as Donor
10. Boron as Acceptor
11. Gallium as Acceptor
12. Aluminum as Acceptor
13. Indium as Acceptor
14. Ionization Energy
15. Complete Ionization
16. Freeze-Out Regime
17. Extrinsic Regime
18. Intrinsic Regime Temperature
19. Majority Carriers
20. Minority Carriers
21. Extrinsic Carrier Concentration
22. Degenerate Semiconductor
23. Non-Degenerate Semiconductor
24. Compensation Doping
25. Net Doping Concentration
26. Fermi Level in N-Type
27. Fermi Level in P-Type
28. Temperature Dependence of Fermi Level

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Crystal Lattice Structure and Symmetry](../02-crystal-lattice-structure/index.md)
- [Chapter 3: Crystal Bonding, Defects, and Surfaces](../03-crystal-bonding-defects/index.md)
- [Chapter 6: Fermi-Dirac Statistics and Intrinsic Carrier Concentrations](../06-fermi-dirac-statistics/index.md)

---

!!! mascot-welcome "Welcome, Fellow Particles — We're Going Impure Today!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Nova here! You've spent six chapters learning about pure, pristine, intrinsic silicon. Perfect crystal. Perfect symmetry. Perfectly useless for making transistors. Today we deliberately ruin everything by cramming in foreign atoms — and *that's* where the magic happens. Welcome to doping: semiconductor physics' proudest act of intentional contamination.

## 7.1 Why Pure Silicon Fails as a Device Material

Intrinsic silicon at room temperature has a carrier concentration of roughly \(n_i \approx 9.65 \times 10^{9}\) cm\(^{-3}\). That sounds like a lot until you compare it to the \(5 \times 10^{22}\) silicon atoms per cubic centimeter in the lattice — meaning only about 1 in every 5 trillion atoms contributes a free electron. The result is a resistivity around 2,300 Ω·cm, far too high (and too fixed) for any practical transistor or diode.

The genius of semiconductor engineering is that we can raise (or lower) the carrier concentration by **13 orders of magnitude** — from \(10^{9}\) to \(10^{22}\) cm\(^{-3}\) — simply by substituting a tiny fraction of silicon atoms with atoms from neighboring groups in the periodic table. This substitutional impurity process is called **doping**, and the impurity atoms are called **dopants**.

Two broad categories define the game:

- **N-type doping:** Adding dopants that donate extra electrons, shifting the semiconductor toward electron-rich (negative charge carriers dominant)
- **P-type doping:** Adding dopants that accept electrons (i.e., donate holes), shifting the semiconductor toward hole-rich (positive charge carriers dominant)

Before we detail the chemistry, let's appreciate why doping is so phenomenally effective. Silicon sits in Group IV of the periodic table, forming four covalent bonds with its neighbors. Swap one silicon atom for a Group V atom (five valence electrons) and suddenly there's a leftover electron with no bond to join. That electron is weakly held and easily freed at room temperature. Conversely, a Group III atom (three valence electrons) creates a "missing bond" that acts as a mobile positive charge.

---

## 7.2 Donor Atoms and N-Type Doping

A **donor atom** is a substitutional impurity from Group V of the periodic table. When incorporated into the silicon lattice, it contributes one extra electron beyond what the four covalent bonds require. The commonly used Group V dopants in silicon are:

| Dopant | Symbol | Typical Use | Ionization Energy \(E_d\) (meV) |
|--------|--------|-------------|----------------------------------|
| Phosphorus | P | Standard n-type, implantation | ~45 |
| Arsenic | As | CMOS source/drain, low diffusivity | ~54 |
| Antimony | Sb | Epitaxial layers, slow diffuser | ~43 |

The ionization energies are all remarkably small — around 40–55 meV — compared to silicon's bandgap of 1.12 eV. At room temperature, \(k_BT \approx 26\) meV, so \(E_d / k_BT \approx 2\), and the Fermi-Dirac distribution ensures the vast majority of donor levels are ionized (empty of electrons, having donated to the conduction band).

**Phosphorus** (\(E_d = 45\) meV) is the workhorse of n-type silicon. It diffuses readily at processing temperatures, integrates cleanly into modern CMOS flows, and has been the default n-type dopant for decades. **Arsenic** has a lower diffusivity — it stays put when annealed, making it ideal for shallow source/drain junctions in modern transistors. **Antimony** diffuses extremely slowly and sees niche use in epitaxial structures where you want a sharp doping profile.

!!! mascot-thinking "Nova Thinks: The Hydrogen Atom Analogy"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    Here's a beautiful piece of physics hiding in those tiny ionization energies. The donor electron orbiting its parent nucleus looks exactly like a hydrogen atom — except it's embedded in a dielectric medium (silicon, \(\varepsilon_r \approx 11.7\)) and the effective mass is reduced (\(m^* \approx 0.33\, m_0\)). Scaling the hydrogen ground-state energy by these factors gives \(E_d \approx E_H \times m^*/m_0 / \varepsilon_r^2 \approx 13.6\) eV \(\times 0.33 / 137 \approx 33\) meV. Not bad for a back-of-envelope estimate! The Bohr radius also balloons to ~3 nm, spanning about 10 lattice constants — explaining why the model works despite the crystal environment.

The donor creates a discrete energy level \(E_d\) just below the conduction band edge \(E_C\). When this level gives up its electron to the conduction band (ionization), the donor becomes a fixed, positively charged ion \(N_D^+\). At room temperature in lightly to moderately doped silicon, essentially **all donors are ionized** — a condition called **complete ionization** that we'll use as our standard approximation.

With complete ionization, the electron concentration in an n-type semiconductor equals the donor concentration (plus any intrinsic contribution):

\[
n \approx N_D \quad \text{(when } N_D \gg n_i \text{)}
\]

And using the law of mass action \(n \cdot p = n_i^2\), the hole concentration becomes:

\[
p = \frac{n_i^2}{N_D}
\]

In n-type material, electrons are the **majority carriers** (dominant) and holes are the **minority carriers** (rare). The ratio \(n/p = N_D^2/n_i^2\) can exceed \(10^{12}\) for typical doping levels — minority carriers are genuinely scarce.

---

## 7.3 Acceptor Atoms and P-Type Doping

An **acceptor atom** is a substitutional impurity from Group III — one valence electron short of completing four covalent bonds. This missing bond is effectively a hole. The acceptor accepts an electron from the valence band, ionizing negatively and releasing a hole into the valence band. The standard Group III acceptors in silicon are:

| Dopant | Symbol | Typical Use | Ionization Energy \(E_a\) (meV) |
|--------|--------|-------------|----------------------------------|
| Boron | B | Standard p-type (universal) | ~45 |
| Gallium | Ga | Solar cells, specialty doping | ~72 |
| Aluminum | Al | Power devices, historical | ~69 |
| Indium | In | Deep acceptor, specialty | ~160 |

**Boron** is the uncontested champion of p-type silicon. Its ionization energy (~45 meV) is the smallest among common acceptors, it diffuses readily, and it's the default choice for virtually all CMOS p-type regions. Boron's low atomic mass also makes it particularly suitable for ion implantation at shallow energies.

**Gallium** has a slightly deeper level and slower diffusivity. It sees use in solar cell applications where controlled p-type doping with minimal performance loss is desired. **Aluminum** was an early favorite but fell out of favor because it forms \(\text{Al}_2\text{O}_3\) during high-temperature oxidation, complicating processing. **Indium** is a curiosity — its 160 meV ionization energy means it's *not* fully ionized at room temperature, which introduces interesting physics (and practical headaches) for power device applications.

!!! mascot-warning "Nova Warns: Boron is NOT from Group III on Modern Periodic Tables!"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    Fun exam trap: "group III" in semiconductor contexts means Group 13 in IUPAC notation (the modern periodic table column numbering). Boron is element 5, in the column now called Group 13 (or IIIA in the old American labeling). Silicon is Group 14 (IVA). Phosphorus is Group 15 (VA). Don't confuse the old "main-group" letter system with the IUPAC 1–18 column numbers. On exams, say "one column to the left (p-type) or right (n-type) of silicon in the periodic table" and you'll be unambiguous.

The acceptor energy level \(E_a\) sits just above the valence band edge \(E_V\). When an electron from the valence band fills this level, the acceptor ionizes to \(A^-\) and the vacated valence-band state propagates as a hole. With complete ionization:

\[
p \approx N_A \quad \text{(when } N_A \gg n_i \text{)}
\]

\[
n = \frac{n_i^2}{N_A}
\]

In p-type material, holes are the majority carriers. For \(N_A = 10^{17}\) cm\(^{-3}\) and \(n_i = 9.65 \times 10^9\) cm\(^{-3}\), we get \(n \approx 9.3 \times 10^2\) cm\(^{-3}\) — barely a thousand electrons per cubic centimeter. Minority carriers barely exist.

---

## 7.4 Ionization Energy and Complete Ionization

The **ionization energy** \(E_d\) (or \(E_a\)) is the energy required to promote a donor electron to the conduction band (or to transfer a valence-band electron to an acceptor level). For shallow donors and acceptors in silicon, these energies are 30–160 meV.

**Complete ionization** — the assumption that every dopant atom has been ionized — is valid when:

1. Temperature is high enough that \(k_BT\) is comparable to \(E_d\) or \(E_a\)
2. The Fermi level is not too close to the impurity level

The fraction of ionized donors is given by the Fermi-Dirac occupancy of the donor level:

\[
\frac{N_D^+}{N_D} = 1 - f(E_d) = 1 - \frac{1}{1 + \frac{1}{g_D}\exp\!\left(\frac{E_F - E_d}{k_BT}\right)}
\]

where \(g_D = 2\) is the spin degeneracy factor for donors (an electron can occupy the level with spin up or spin down). For most practical cases at room temperature with shallow dopants, \(N_D^+ \approx N_D\) — complete ionization is an excellent approximation.

The complete ionization approximation simplifies all our subsequent calculations enormously. We'll flag when it breaks down (deep impurities, very low temperatures, degenerate doping).

<details markdown="1">
<summary>#### MicroSim: Dopant Ionization Fraction vs. Temperature</summary>

**sim-id:** `dopant-ionization-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive visualization showing the fraction of ionized donors/acceptors as a function of temperature (50K–600K) for different dopant types (Phosphorus, Arsenic, Boron, Indium). Two panels: (top) ionization fraction \(N_D^+/N_D\) vs. T; (bottom) energy band diagram showing \(E_C\), \(E_V\), \(E_F\), and dopant level \(E_d\) or \(E_a\) as function of T.

**Controls:**
- Dropdown: Dopant type (P, As, Sb, B, Ga, Al, In)
- Slider: Doping concentration \(10^{14}\) to \(10^{19}\) cm\(^{-3}\)
- Checkbox: Show Fermi-Dirac tail overlay

**Key Learning Objectives:**
- L2 (Understand): Explain why shallow dopants are nearly fully ionized at 300 K
- L3 (Apply): Predict ionization fraction for a given temperature and dopant
- L4 (Analyze): Identify when complete ionization approximation breaks down

**Suggested Implementation Notes:**
- Use `createDropdown()` for dopant type selection
- Animate temperature sweep with play/pause button
- Highlight 300 K operating point with a vertical dashed line
- Color-code donor (blue) vs. acceptor (red) curves

</details>

---

## 7.5 The Three Temperature Regimes

Carrier concentration in a doped semiconductor is not constant — it varies dramatically with temperature. Before examining the math, let's understand the three regimes qualitatively:

1. **Freeze-out regime** (low T, typically below ~100 K for silicon): \(k_BT\) is so small that dopants cannot ionize. Carriers "freeze" onto their parent atoms. Carrier concentration drops exponentially with decreasing temperature. This regime kills the performance of bipolar transistors operated at cryogenic temperatures — a real concern for quantum computing applications.

2. **Extrinsic regime** (intermediate T, roughly 100–600 K for silicon at \(N_D = 10^{15}\) cm\(^{-3}\)): All dopants are ionized, intrinsic carriers are negligible. This is the "designed operating range" for nearly all room-temperature devices. Carrier concentration is essentially constant at \(n \approx N_D\) (or \(p \approx N_A\)) regardless of temperature changes.

3. **Intrinsic regime** (high T, above ~500–700 K for typical doping): Thermally generated intrinsic carriers overwhelm the dopant contribution. The semiconductor "forgets" its doping and behaves intrinsically. For silicon, this occurs at lower temperatures when doping is light; heavily doped silicon can maintain extrinsic behavior to higher temperatures.

The transition temperatures depend strongly on doping concentration. For \(N_D = 10^{14}\) cm\(^{-3}\), the extrinsic regime ends around 450 K. For \(N_D = 10^{17}\) cm\(^{-3}\), it extends beyond 650 K. This is why power devices operated at high temperatures require heavier doping.

The complete expression for electron concentration spanning all three regimes uses the charge-neutrality condition:

\[
n + N_A^- = p + N_D^+
\]

Combined with \(np = n_i^2(T)\) and the Fermi-Dirac ionization fractions, this gives an implicit equation for \(n\) that must be solved numerically in general. However, the simplifications available in each regime make analytical solutions tractable.

In the **extrinsic regime** with only donors (no compensating acceptors):

\[
n \approx N_D, \quad p \approx \frac{n_i^2(T)}{N_D}
\]

!!! mascot-encourage "Nova Encourages: Temperature Regimes Are Just Three Acts of a Play"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Nova in encouraging pose">
    The three-regime picture can feel overwhelming when you first see the full carrier-concentration vs. temperature curve, but think of it like a three-act drama. Act I (freeze-out): the cast is asleep, nobody on stage. Act II (extrinsic): the dopants have full control, running the show smoothly. Act III (intrinsic): the thermally generated crowd storms the stage and chaos rules. Your device engineers want their audience firmly in Act II. Everything else is physics for the textbook and the exam.

<details markdown="1">
<summary>#### MicroSim: Carrier Concentration vs. Temperature</summary>

**sim-id:** `carrier-vs-temperature-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Log-scale plot of electron concentration \(n(T)\) and hole concentration \(p(T)\) vs. temperature (50K–1000K) for doped silicon. Clearly demarcated freeze-out, extrinsic, and intrinsic regimes with shading. User can adjust doping type and concentration to see how regime boundaries shift.

**Controls:**
- Radio buttons: N-type / P-type
- Slider: Doping concentration \(\log(N_D)\) from 14 to 19 cm\(^{-3}\)
- Checkbox: Show \(n_i(T)\) reference curve
- Checkbox: Show regime labels

**Key Learning Objectives:**
- L2 (Understand): Identify the three temperature regimes from a \(n(T)\) plot
- L3 (Apply): Predict operating regime for a given doping level and temperature
- L4 (Analyze): Explain why high doping extends the extrinsic regime

</details>

---

## 7.6 Majority and Minority Carriers

The terms **majority carriers** and **minority carriers** refer to the dominant and rare carrier type in a doped semiconductor:

- **N-type silicon**: Electrons are majority carriers (\(n \approx N_D\)), holes are minority carriers (\(p = n_i^2/N_D \ll N_D\))
- **P-type silicon**: Holes are majority carriers (\(p \approx N_A\)), electrons are minority carriers (\(n = n_i^2/N_A \ll N_A\))

These designations matter enormously for device operation. In a p-n junction, current flow is dominated by majority carrier motion in the bulk and minority carrier injection across the junction. In bipolar transistors, minority carrier diffusion in the base is the entire operating principle.

The ratio of majority to minority carriers gives a sense of scale:

\[
\frac{n}{p}\bigg|_{\text{n-type}} = \frac{N_D^2}{n_i^2}
\]

For \(N_D = 10^{15}\) cm\(^{-3}\): ratio \(= (10^{15})^2 / (9.65 \times 10^9)^2 \approx 1.07 \times 10^{10}\). Ten billion to one. Minority carriers are so rare that in many first-order calculations you can simply pretend they don't exist — until you need them, at which point they control everything (junctions, recombination, transistor gain).

**Extrinsic carrier concentration** refers to the carrier density set by doping rather than thermal generation. In the extrinsic regime, \(n \approx N_D\) regardless of temperature (within the regime), which is precisely why we dope semiconductors: to get a predictable, controlled, thermally stable carrier concentration.

---

## 7.7 Compensation Doping

Real silicon almost always contains both donors and acceptors simultaneously — either from intentional co-doping or from unavoidable background impurities. **Compensation doping** occurs when both donor and acceptor species are present. The net effect depends on which dominates.

The charge-neutrality condition in the presence of both donors and acceptors (with complete ionization) is:

\[
n + N_A = p + N_D
\]

Combined with \(np = n_i^2\), this gives:

\[
n = \frac{(N_D - N_A)}{2} + \sqrt{\left(\frac{N_D - N_A}{2}\right)^2 + n_i^2}
\]

For \(N_D > N_A\) and \(N_D - N_A \gg n_i\):

\[
n \approx N_D - N_A \equiv N_{\text{net}}
\]

The **net doping concentration** \(N_{\text{net}} = |N_D - N_A|\) determines the carrier concentration. This has a critical implication: you can tune doping from the outside post-fabrication by implanting compensating dopants. Modern device fabrication uses precisely controlled compensation to create doping profiles that vary across micrometer distances.

| Case | Net Type | Majority Carrier |
|------|----------|-----------------|
| \(N_D > N_A\) | N-type | Electrons |
| \(N_A > N_D\) | P-type | Holes |
| \(N_D = N_A\) | Compensated | \(n = p = n_i\) |
| \(N_D \approx N_A\) | Lightly doped | Near-intrinsic |

The case \(N_D = N_A\) is called **full compensation** — the semiconductor behaves as if it were intrinsic, even with large amounts of impurities present. Full compensation increases scattering (more impurity centers) while paradoxically reducing carrier concentration.

!!! mascot-tip "Nova Tips: Net Doping is the Number That Matters"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova with tip pose">
    When reading SIMS (Secondary Ion Mass Spectrometry) profiles of real wafers, you'll always see both donor and acceptor profiles. What matters for electrical behavior is the *net* difference — and the net doping can be much smaller than either individual concentration. A wafer with \(N_D = 5 \times 10^{15}\) and \(N_A = 4.9 \times 10^{15}\) cm\(^{-3}\) has \(N_{\text{net}} = 10^{14}\) cm\(^{-3}\) — lightly n-type despite having dense impurity populations. Electrical measurements (Hall effect, four-point probe) measure net doping; chemical measurements (SIMS) measure total impurity content. Both matter.

---

## 7.8 Degenerate and Non-Degenerate Semiconductors

Our standard semiconductor equations assume the Fermi level lies well inside the bandgap, at least a few \(k_BT\) away from either band edge. When this holds, the Fermi-Dirac distribution can be approximated by the Boltzmann distribution, giving simple exponential expressions for carrier concentrations. A semiconductor satisfying this condition is called **non-degenerate**.

When doping is very heavy (\(N_D \gtrsim 10^{18}\) cm\(^{-3}\) for silicon), the Fermi level approaches or enters the conduction band. This is the **degenerate** condition. Several important things change:

1. The Boltzmann approximation fails — the full Fermi-Dirac integral must be used
2. The donor levels broaden into a band and merge with the conduction band
3. Bandgap narrowing occurs: heavy doping (and the associated impurity potential fluctuations) reduces the effective bandgap by tens of meV, increasing \(n_i\) significantly
4. Ohmic contacts form readily because the Fermi level is inside the band

The boundary between non-degenerate and degenerate is fuzzy but often taken as:

\[
E_F \leq E_C - 2k_BT \quad \text{(non-degenerate n-type)}
\]

or equivalently \(N_D \leq N_C/2 \approx 10^{18}\) cm\(^{-3}\) for silicon at 300 K.

Degenerate silicon is the material of transistor source and drain regions, heavily doped polysilicon gates, and ohmic contact regions. Understanding when you've crossed into degeneracy is essential for avoiding errors in junction calculations.

---

## 7.9 The Fermi Level in Doped Semiconductors

The most powerful conceptual tool in semiconductor physics is tracking the Fermi level \(E_F\). In equilibrium, \(E_F\) is uniform throughout any connected material — but its position relative to the band edges encodes the local carrier concentrations.

We derived in Chapter 6 that:

\[
n = N_C \exp\!\left(-\frac{E_C - E_F}{k_BT}\right)
\]

\[
p = N_V \exp\!\left(-\frac{E_F - E_V}{k_BT}\right)
\]

For **n-type material** with \(n \approx N_D\):

\[
E_F = E_C - k_BT \ln\!\left(\frac{N_C}{N_D}\right)
\]

For \(N_D = 10^{16}\) cm\(^{-3}\) in silicon at 300 K (\(N_C = 2.82 \times 10^{19}\) cm\(^{-3}\)):

\[
E_F = E_C - 0.0259 \times \ln\!\left(\frac{2.82 \times 10^{19}}{10^{16}}\right) = E_C - 0.0259 \times 7.95 \approx E_C - 0.206 \text{ eV}
\]

The Fermi level sits 0.206 eV below \(E_C\), well inside the bandgap but much closer to the conduction band than to the valence band. The system is decidedly n-type.

For **p-type material** with \(p \approx N_A\):

\[
E_F = E_V + k_BT \ln\!\left(\frac{N_V}{N_A}\right)
\]

Here \(E_F\) lies above \(E_V\) (closer to the valence band than to the conduction band).

The displacement of \(E_F\) from the intrinsic Fermi level \(E_i\) (midgap) is a useful measure of doping:

\[
E_F - E_i = k_BT \ln\!\left(\frac{N_D}{n_i}\right) \quad \text{(n-type)}
\]

\[
E_i - E_F = k_BT \ln\!\left(\frac{N_A}{n_i}\right) \quad \text{(p-type)}
\]

This is one of the most useful expressions in device physics. It connects the Fermi level position (observable through contact potential measurements) to the doping concentration. It also shows that each decade of doping above \(n_i\) shifts \(E_F\) by \(k_BT \ln(10) \approx 60\) meV at room temperature.

---

## 7.10 Temperature Dependence of the Fermi Level

The Fermi level position is not fixed — it varies with temperature, and understanding this dependence is crucial for high-temperature device operation and for interpreting measurements.

As temperature increases:

1. \(N_C(T) \propto T^{3/2}\) and \(N_V(T) \propto T^{3/2}\) both increase
2. \(n_i(T)\) increases exponentially
3. In the extrinsic regime: \(E_F(T) = E_C - k_BT \ln(N_C(T)/N_D)\) shifts downward (toward midgap) because \(k_BT\) grows and \(N_C(T)\) grows

At sufficiently high temperature, the intrinsic carrier generation dominates and \(E_F \to E_i\) (midgap). The Fermi level of any semiconductor converges to near midgap at high temperature, erasing the memory of doping.

The Fermi level shift with temperature in n-type silicon follows approximately:

\[
\frac{dE_F}{dT} \approx -k_B \left[\ln\!\left(\frac{N_C}{N_D}\right) + \frac{3}{2}\right]
\]

For \(N_D = 10^{16}\) cm\(^{-3}\): \(dE_F/dT \approx -0.204\) meV/K. The Fermi level drops toward midgap at about 0.2 meV per kelvin — or about 20 meV per 100 K temperature rise. Over the automotive temperature range (−40°C to +125°C), \(E_F\) shifts by about 33 meV, enough to appreciably change threshold voltages in MOSFETs. This is why automotive-grade chips require careful temperature compensation.

| Temperature (K) | \(n_i\) (cm\(^{-3}\)) | \(E_F - E_i\) for \(N_D=10^{16}\) (meV) |
|-----------------|----------------------|------------------------------------------|
| 200 | \(\sim 10^4\) | +553 |
| 300 | \(9.65 \times 10^9\) | +357 |
| 400 | \(\sim 10^{13}\) | +147 |
| 500 | \(\sim 10^{15}\) | +6 |
| 600 | \(\sim 5\times10^{16}\) | −8 (now intrinsic!) |

Notice how \(E_F\) plummets toward midgap between 300 K and 500 K, and the semiconductor crosses into intrinsic behavior around 500–600 K for this doping level.

!!! mascot-celebration "Nova Celebrates: You Now Control the Fermi Level!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    Pause and appreciate what you've just learned. By choosing a dopant type and concentration, you can place the Fermi level anywhere in the bandgap. N-type pushes it toward the conduction band; p-type pushes it toward the valence band; heavy doping can drive it into a band entirely (degenerate). This Fermi-level engineering is literally how every transistor, diode, LED, and solar cell in the world works. All those devices are, at their core, spatial variations in \(E_F\) — junctions are just two regions where you've positioned \(E_F\) differently. You now understand the foundational control knob of all semiconductor technology. Let's get excited — the devices are coming!

---

## Summary

This chapter covered how substitutional impurities transform silicon from a mediocre conductor into a precision-engineered material:

- **Group V donors** (P, As, Sb) contribute electrons and create n-type material with \(n \approx N_D\)
- **Group III acceptors** (B, Ga, Al, In) contribute holes and create p-type material with \(p \approx N_A\)
- **Shallow dopants** (ionization energies 40–160 meV) are nearly completely ionized at room temperature
- **Three temperature regimes** — freeze-out, extrinsic, intrinsic — determine carrier concentration vs. temperature behavior
- **Majority carriers** dominate; **minority carriers** control device switching and junction behavior
- **Compensation doping** makes net doping \(N_{\text{net}} = |N_D - N_A|\) the electrically relevant quantity
- **Degenerate semiconductors** (\(N_D \gtrsim 10^{18}\) cm\(^{-3}\)) require Fermi-Dirac integrals and exhibit bandgap narrowing
- **Fermi level position** is calculable from doping and encodes all carrier information; it shifts toward midgap at elevated temperatures

## Key Equations

\[
n \approx N_D, \quad p \approx \frac{n_i^2}{N_D} \quad \text{(n-type, extrinsic regime)}
\]

\[
p \approx N_A, \quad n \approx \frac{n_i^2}{N_A} \quad \text{(p-type, extrinsic regime)}
\]

\[
n = \frac{N_D - N_A}{2} + \sqrt{\left(\frac{N_D - N_A}{2}\right)^2 + n_i^2} \quad \text{(general n-type with compensation)}
\]

\[
E_F = E_C - k_BT \ln\!\left(\frac{N_C}{N_D}\right) \quad \text{(n-type, non-degenerate)}
\]

\[
E_F - E_i = k_BT \ln\!\left(\frac{N_D}{n_i}\right) \quad \text{(n-type displacement from midgap)}
\]
