---
title: Strained Silicon, 2D Materials, and Power/Microwave Devices
description: Strain-enhanced mobility, graphene and TMD band structure, van der Waals heterostructures, power device physics, Gunn/IMPATT diodes, and microwave device parasitics
generated_by: claude skill chapter-content-generator
date: 2026-06-03 20:30:00
version: 0.08
---

# Strained Silicon, 2D Materials, and Power/Microwave Devices

## Summary

This chapter covers three groups of advanced topics that extend the core device physics. Strained silicon — where biaxial or uniaxial mechanical strain modifies the band structure to enhance carrier mobility — is analyzed alongside critical thickness limits and pseudomorphic layer growth. Graphene and transition metal dichalcogenides (TMDs) such as MoS₂ are introduced as atomically thin semiconductors with unique band structures (Dirac points in graphene, direct bandgap in monolayer MoS₂) and extraordinary transport properties; van der Waals heterostructures and carbon nanotubes complete the 2D-materials survey. The second part covers power and microwave device families: power diodes, thyristors, SCRs, IGBTs, superjunction power MOSFETs, and high-voltage design principles; Gunn diodes, IMPATT diodes, and negative-resistance microwave sources; and the parasitics and cutoff frequencies that govern high-frequency device performance.

## Concepts Covered

This chapter covers the following 37 concepts from the learning graph:

1. Strained Silicon
2. Strain Effects on Band Structure
3. Biaxial Strain
4. Uniaxial Strain
5. Critical Thickness
6. Pseudomorphic Layers
7. Graphene Properties
8. Graphene Band Structure
9. Graphene Dirac Points
10. Graphene Mobility
11. Transition Metal Dichalcogenides
12. Molybdenum Disulfide MoS2
13. TMD Band Structure
14. 2D Materials Overview
15. Van der Waals Heterostructures
16. Carbon Nanotube Properties
17. Carbon Nanotube Band Structure
18. Quantum Confinement Effects
19. Power Diode Structure
20. Power Diode Ratings
21. Thyristor Structure
22. Thyristor Operation
23. Silicon-Controlled Rectifier
24. IGBT Structure
25. IGBT Operation
26. Power MOSFET
27. Superjunction MOSFET
28. High-Voltage Device Design
29. Breakdown Engineering
30. Punch-Through Voltage
31. Gunn Diode
32. Gunn Effect
33. Transferred Electron Effect
34. IMPATT Diode
35. Negative Resistance Devices
36. Microwave Device Parasitics
37. Cutoff Frequency High-Frequency

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Crystal Lattice Structure and Symmetry](../02-crystal-lattice-structure/index.md)
- [Chapter 3: Crystal Bonding, Defects, and Surfaces](../03-crystal-bonding-defects/index.md)
- [Chapter 5: Bloch's Theorem, Band Formation, and E-k Diagrams](../05-bloch-theorem-band-theory/index.md)
- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../11-pn-junction-equilibrium/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)
- [Chapter 14: Bipolar Junction Transistors](../14-bipolar-transistors/index.md)
- [Chapter 15: JFET, MESFET, and Long-Channel MOSFET Fundamentals](../15-jfet-mesfet-mosfet/index.md)
- [Chapter 19: III-V/II-VI Semiconductors, Quantum Nanostructures, and HEMTs](../19-compound-semiconductors-quantum/index.md)

---

!!! mascot-welcome "Nova on Chapter 20: The Periodic Table Fights Back"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Chapter 20 is an intellectual adventure across three frontiers: bending silicon to improve its band structure, discovering that a single layer of atoms can be a semiconductor, and learning how to handle 10,000 volts with something the size of a transistor. Strained silicon, graphene, MoS₂, IGBTs, and Gunn diodes — it sounds like a random assortment, but each one is a clever answer to a specific limitation of conventional silicon device physics. Let's explore the edges of what semiconductor science can do.

## 20.1 Strained Silicon: Bending the Band Structure

Silicon's carrier mobility — 1400 cm²/V·s for electrons, 450 cm²/V·s for holes — is not a fixed constant. It's determined by the effective mass and scattering rate, which are determined by the band structure, which is determined by the crystal potential. If you deform the crystal with mechanical strain, you change the potential, change the band structure, and change the mobility. This is the engineering insight behind **strained silicon**.

### 20.1.1 Strain Effects on Band Structure

**Biaxial strain** (equal in-plane strain in x and y directions) applied to the silicon layer:

- **Tensile biaxial strain** (stretching silicon in-plane, e.g., by growing on a relaxed SiGe virtual substrate): Splits the six-fold degenerate conduction band valleys into two groups — two low-energy valleys (perpendicular to the wafer surface, ⊥ valleys) and four higher-energy in-plane valleys. Electrons preferentially populate the ⊥ valleys, which have smaller in-plane effective mass (smaller curvature in the transport direction). Result: electron mobility increases by 70–100%.

- **Compressive biaxial strain** (compressing silicon in-plane): Splits the valence band, pushing the light-hole band higher. The upper valence band has a more favorable (smaller) in-plane effective mass. Result: hole mobility increases by 20–40%.

**Uniaxial strain** (strain in one in-plane direction only):

- **Uniaxial tensile strain** (along current flow direction) → electron mobility increase (preferred for NMOS)
- **Uniaxial compressive strain** (along current flow direction) → hole mobility increase (preferred for PMOS); stronger effect than biaxial for holes

Intel's 90 nm process (2003) was the first commercial node to use strained silicon by embedding SiGe in recessed source/drain regions of PMOS transistors. The SiGe's larger lattice constant compresses the channel uniaxially, boosting hole mobility by ~50%. This single technique extended silicon MOSFET performance by 2–3 years beyond what would have been possible by scaling alone.

### 20.1.2 Critical Thickness and Pseudomorphic Layers

When a strained layer grows on a substrate with a different lattice constant, the strain energy increases with thickness. Below a critical thickness \(h_c\), the layer remains pseudomorphic (fully strained, no dislocations). Above \(h_c\), misfit dislocations form, partially relaxing the strain.

The critical thickness (Matthews-Blakeslee model):

\[
h_c = \frac{b(1-\nu\cos^2\theta)}{8\pi f(1+\nu)\cos\lambda}\!\left[\ln\!\left(\frac{h_c}{b}\right) + 1\right]
\]

where \(f = |a_{\text{layer}} - a_{\text{sub}}|/a_{\text{sub}}\) is the lattice mismatch, \(b\) is the Burgers vector magnitude, \(\nu\) is Poisson's ratio, and \(\theta\), \(\lambda\) are dislocation geometry angles.

For Si on Si\(_{0.8}\)Ge\(_{0.2}\) (20% Ge, \(f \approx 0.8\%\)): \(h_c \approx 14\) nm. This matches well with modern MOSFET channel depths — confirming that strained silicon is compatible with sub-20 nm technology.

---

## 20.2 Graphene and 2D Materials

In 2004, Geim and Novoselov (Nobel Prize 2010) showed that a single atomic layer of carbon — **graphene** — could be isolated and was mechanically stable. This discovery launched the field of 2D materials and continues to reshape materials physics.

### 20.2.1 Graphene Band Structure and Dirac Points

Graphene is a hexagonal lattice of carbon atoms, each bonded to three neighbors (sp² hybridization). The fourth valence electron per atom forms a π system of overlapping \(p_z\) orbitals.

The electronic band structure of graphene is remarkable: the conduction and valence bands meet at six points (the K and K' corners of the Brillouin zone) called **Dirac points** (or K-points, or Dirac cones). Near these points, the dispersion is:

\[
E(\mathbf{k}) = \pm \hbar v_F |\mathbf{k}|
\]

This is a **linear** dispersion (vs. the usual \(E \propto k^2\) for semiconductors) — the same dispersion as massless relativistic particles (Dirac fermions). The **Fermi velocity** \(v_F \approx 10^6\) m/s ≈ c/300.

Consequences of linear dispersion:

1. **Zero effective mass** at the Dirac point: \(m^* = \hbar k/v_F \to 0\) as \(k \to 0\)
2. **Zero bandgap**: Pristine graphene is a semimetal, not a semiconductor
3. **Extraordinary mobility**: \(\mu \approx 200,000\) cm²/V·s at room temperature on hexagonal boron nitride (hBN) substrates (vs. 1400 for silicon)
4. **Klein tunneling**: Relativistic carriers cannot be localized by a barrier — they tunnel through 100% at normal incidence (making it difficult to build a graphene transistor with high ON/OFF ratio)

### 20.2.2 Transition Metal Dichalcogenides (TMDs)

The lack of a bandgap in graphene limits its transistor applications. **Transition metal dichalcogenides (TMDs)** — MX₂ where M = Mo, W and X = S, Se, Te — have two-atom-thick structures (X-M-X sandwich) with substantial bandgaps.

**MoS₂** (molybdenum disulfide) is the archetype:

- **Bulk MoS₂:** Indirect bandgap of 1.3 eV (like silicon, but from different physics)
- **Monolayer MoS₂:** Direct bandgap of 1.8 eV — the K-point valleys become the band edges due to broken inversion symmetry
- **Electron mobility:** 100–500 cm²/V·s on SiO₂ substrates (limited by impurity and phonon scattering); > 1000 cm²/V·s on hBN
- **Strong photoluminescence:** Direct gap → efficient light emission; PL quantum yield approaches 100% in ideal suspended monolayers

The direct gap in monolayer MoS₂ enables the first demonstrations of ultrathin transistors with channel thickness of only 0.65 nm — potentially allowing gate lengths below 5 nm without the quantum tunneling that limits silicon FETs.

**Valley polarization** in TMDs: The K and K' valleys have opposite Berry curvature, allowing circularly polarized light to selectively excite one valley. This **valleytronics** — using valley index as an information carrier — is a new paradigm being explored for post-CMOS information processing.

### 20.2.3 Van der Waals Heterostructures

Unlike conventional semiconductor heterostructures (which require careful lattice matching), 2D materials bond to each other via **van der Waals** forces — no covalent bonds cross the interface. Any 2D material can be stacked on any other with atomically sharp interfaces regardless of lattice constant.

**Van der Waals heterostructures** (Geim's group introduced the concept in 2013) stack graphene, hBN, MoS₂, WS₂, and other 2D materials like "atomic Lego." Representative applications:

- Graphene/hBN/graphene tunneling transistors (resonant tunneling diodes in 2D)
- MoS₂/WSe₂ type-II heterostructures (electrons in MoS₂, holes in WSe₂) for novel optoelectronics
- Twisted bilayer graphene at ~1.1° "magic angle" → correlated insulator and superconductor (moiré flat bands, 2018 discovery)

### 20.2.4 Carbon Nanotubes

A **carbon nanotube (CNT)** is graphene rolled into a cylinder. The rolling direction (chiral vector) determines whether the CNT is metallic or semiconducting:

- Metallic CNTs: Zero bandgap; ballistic conductors at room temperature; current-carrying capacity 10⁹ A/cm² (1000× copper)
- Semiconducting CNTs: Bandgap \(E_g \approx 0.9/d\) eV (where \(d\) is diameter in nm); mobility > 10,000 cm²/V·s

CNT field-effect transistors have demonstrated excellent switching performance. IBM demonstrated a 1 nm carbon nanotube transistor in 2016 — the smallest transistor ever made at that time. Sorting semiconducting CNTs from metallic ones (roughly 1/3 of randomly grown CNTs are metallic) remains a manufacturing challenge.

---

## 20.3 Power Device Physics

Power devices operate at voltages from 30 V to 10 kV and currents from amperes to kiloamperes, at power levels that would destroy conventional transistors. Their design is dominated by one fundamental tension: **low on-resistance** (for efficiency) vs. **high breakdown voltage** (for safety). These requirements conflict — and the physics of resolving the conflict defines the field.

### 20.3.1 Power Diode Structure and Ratings

A **power diode** (also called a rectifier) must withstand high reverse voltage while having low forward voltage drop. The structure typically uses an n⁻ epitaxial drift region to support the high voltage:

The breakdown voltage scales with the drift region:

\[
V_{\text{BD}} \approx \frac{\varepsilon_s \mathcal{E}_c^2}{2qN_D}
\]

But the on-state resistance includes the drift region resistance:

\[
R_{\text{on,drift}} = \frac{W_D}{q\mu_n N_D A} \propto V_{\text{BD}}^2
\]

This gives the fundamental trade-off: \(R_{\text{on}} \propto V_{\text{BD}}^2 / \mu \mathcal{E}_c^2\) — the denominator is Baliga's figure of merit. For silicon, this limits practical breakdown voltage to <600 V for reasonable on-resistance. For SiC and GaN (with 10× larger \(\mathcal{E}_c\)), the same on-resistance can be achieved at 10× the voltage — a 100× power density advantage.

### 20.3.2 Thyristor and SCR

The **thyristor** (or **silicon-controlled rectifier, SCR**) is a four-layer (p-n-p-n) switching device that can handle megawatts and kilovolts. Structure: anode (p) – gate (n) – p-layer – cathode (n). Under reverse bias, all junctions block. Under forward bias, the device is normally off (holding state) — the middle junction is reverse-biased. A gate current pulse triggers regenerative switching (the device "latches" on), after which gate has no control — only turning the anode current below a holding current threshold turns it off.

Thyristors are the workhorses of HVDC (high-voltage DC) transmission grids — controlling hundreds of megawatts at 500 kV or more. A single thyristor valve in a HVDC converter can handle 8 kV and 4 kA.

### 20.3.3 IGBT: The Power Electronics Swiss Army Knife

The **insulated-gate bipolar transistor (IGBT)** combines MOS gate control (like a MOSFET) with bipolar current conduction (like a BJT) in a single device. The structure is a MOSFET connected to a wide-base PNP transistor: gate control → NMOS channel → electron injection → PNP base → hole injection into drift region from p⁺ collector.

IGBT advantages:
- MOS gate → voltage-controlled, no DC gate current, easy drive circuitry
- Bipolar current → conductivity modulation reduces drift-region resistance at high current density
- Higher current density than power MOSFET at the same voltage rating

IGBT disadvantages:
- Bipolar current injection → stored minority charge → slow turn-off (reverse recovery of the p-n junction in the drift region)
- Current tail during turn-off → switching losses at high frequency

IGBTs dominate applications from 600 V to 6.5 kV: electric vehicle main inverters, industrial motor drives, railway traction, and wind turbine converters. Every electric car on the road today (except those using SiC) uses IGBTs.

### 20.3.4 Superjunction Power MOSFET

The **superjunction MOSFET** circumvents the \(R_{\text{on}} \propto V_{\text{BD}}^2\) silicon limit by using alternating n and p pillars in the drift region instead of a uniform n-layer. The charge from the n-pillars is compensated by the p-pillars, allowing higher doping in both (lower resistance) while the combined structure still supports high voltage when depleted.

The superjunction concept reduces the effective \(R_{\text{on}} \cdot V_{\text{BD}}^2\) product by 10× compared to conventional silicon power MOSFETs, enabling silicon devices competitive with SiC up to ~900 V. Infineon's CoolMOS series and other superjunction devices are standard in switch-mode power supplies (laptop chargers, server power supplies, photovoltaic inverters).

---

## 20.4 Microwave Negative-Resistance Devices

At frequencies above a few GHz, transit-time effects and negative differential resistance phenomena enable novel device operations impossible with conventional transistors.

### 20.4.1 Gunn Diode and the Transferred Electron Effect

In GaAs, the conduction band has a **lower valley** (at the Γ-point, \(m^* \approx 0.067 m_0\)) and **upper satellite valleys** (L-valleys, \(m^* \approx 0.35 m_0\)) separated by ~0.3 eV. At low electric fields, electrons populate the lower valley (high mobility). Above a threshold field (~3 kV/cm), electrons gain enough energy to scatter into the L-valleys — heavier effective mass → lower mobility → **negative differential mobility** (current decreases as field increases).

This **Gunn effect** (or transferred-electron effect) causes current oscillations in a GaAs bulk sample with DC bias above threshold. Charge accumulation forms **domains** of high field that travel from cathode to anode, producing microwave oscillations at frequency:

\[
f = \frac{v_{\text{domain}}}{L} \approx \frac{10^7 \text{ cm/s}}{L}
\]

For \(L = 100\) μm: \(f \approx 10\) GHz. Gunn diodes are used as millimeter-wave oscillators in radar (automotive, proximity sensing) at 24, 77, and 94 GHz.

### 20.4.2 IMPATT Diode

The **IMPATT diode** (Impact ionization Avalanche Transit-Time) uses avalanche multiplication and carrier transit time to achieve negative resistance at microwave frequencies. The device is a reverse-biased p-n junction in the avalanche regime with a drift region.

Operation: A slightly above-threshold AC voltage modulates the avalanche multiplication rate. Due to the statistical nature of impact ionization, the avalanche current lags the voltage by ~90°. The carriers then traverse the drift region, adding another ~90° lag. The total 180° phase shift means current is out-of-phase with voltage — i.e., negative resistance.

IMPATT diodes produce the highest output power per unit area of any solid-state microwave source (100s of mW to watts at millimeter-wave frequencies) but have high noise — limiting them to power applications where coherence is less critical.

!!! mascot-celebration "Nova Celebrates: The Full Spectrum of Semiconductor Physics"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    Chapter 20 covered everything from 0.65 nm thick monolayer MoS₂ transistors to 8 kV thyristors handling megawatts. The physics connecting these extremes is the same: band structure, carrier transport, carrier recombination, and junction electrostatics. A graphene Dirac cone, a superjunction power MOSFET, a Gunn domain oscillation, and a van der Waals heterojunction are all, at their core, electrons in a crystal potential responding to fields and interfaces. Twenty chapters of physics, and we've arrived at devices that power civilization. Chapters 21 and 22 bring us to how these things are made and measured — and that's where the rubber meets the clean-room floor.

<details markdown="1">
<summary>#### MicroSim: Graphene vs. Silicon Band Structure Comparison</summary>

**sim-id:** `graphene-silicon-band-comparison`  
**Library:** p5.js  
**Status:** specification  

**Description:** Side-by-side E-k band structure comparison. Silicon panel: parabolic conduction band minimum (indirect), valence band maximum at Γ. Graphene panel: hexagonal Brillouin zone showing linear dispersion cones at K and K' points. User can adjust energy range to zoom into the Dirac cone or out to the full zone. Mobility comparison bar chart below with graphene, Si, GaAs, InAs, CNT values.

**Controls:**
- Slider: Energy range (0.01–3 eV from Dirac/band-edge)
- Radio: Show full BZ / Show Dirac cone zoom
- Checkbox: Overlay GaAs for comparison
- Dropdown: Substrate (SiO₂, hBN — affects effective mobility)

**Key Learning Objectives:**
- L2 (Understand): Explain why graphene has linear dispersion while silicon has parabolic
- L3 (Apply): Estimate electron velocity from the Dirac cone slope
- L4 (Analyze): Explain why zero bandgap makes graphene difficult to use as a transistor

</details>

---

## Summary

This chapter covered three advanced topics:

**Strained silicon:**
- Biaxial tensile strain increases electron mobility 70–100%; uniaxial compressive strain increases hole mobility 50%
- Strain modifies band structure (valley splitting, effective mass reduction)
- Critical thickness \(h_c\) limits pseudomorphic layer thickness before dislocation formation

**2D materials:**
- Graphene: Linear Dirac dispersion, zero bandgap, mobility > 200,000 cm²/V·s
- Monolayer MoS₂: Direct bandgap of 1.8 eV (vs. indirect 1.3 eV in bulk)
- Van der Waals stacking enables arbitrary 2D heterostructures; twisted bilayer graphene shows superconductivity

**Power and microwave devices:**
- Power diodes/MOSFETs: \(R_{\text{on}} \propto V_{\text{BD}}^2\); SiC/GaN overcome silicon limits with higher breakdown field
- IGBT: MOS gate + bipolar conductance modulation; dominant 600 V–6.5 kV
- Superjunction MOSFETs: Compensated n/p pillars enable 10× lower \(R_{\text{on}}\) at given \(V_{\text{BD}}\)
- Gunn diode: Transferred-electron negative resistance at ~3 kV/cm GaAs threshold
- IMPATT: Avalanche + transit-time phase shift → 180° phase lag → negative resistance

## Key Equations

\[
E_g^{\text{strain}} = E_g^{\text{bulk}} \pm \text{(deformation potential)} \times \text{strain}, \quad h_c \propto a/f
\]

\[
E_{\text{graphene}}(k) = \pm \hbar v_F |k|, \quad v_F \approx 10^6 \text{ m/s}
\]

\[
R_{\text{on}} \cdot V_{\text{BD}}^2 = \frac{4}{\mu \varepsilon E_c^3} \quad \text{(Baliga figure of merit for power devices)}
\]
