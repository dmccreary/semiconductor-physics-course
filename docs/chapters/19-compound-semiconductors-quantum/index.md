---
title: "III-V/II-VI Semiconductors, Quantum Nanostructures, and HEMTs"
description: GaAs, InP, GaN, SiC material properties, quantum well/wire/dot energy levels, 2DEG formation, and HEMT structure and operation
generated_by: claude skill chapter-content-generator
date: 2026-06-03 20:00:00
version: 0.08
---

# III-V/II-VI Semiconductors, Quantum Nanostructures, and HEMTs

## Summary

This chapter moves beyond silicon to the compound semiconductors and quantum-confined structures that enable high-speed electronics and advanced photonics. III-V and II-VI compound semiconductors — GaAs, InP, InGaAs, AlGaAs, InGaAsP, GaN, AlGaN, and SiC — are surveyed for their bandgaps, carrier mobilities, and structural properties. Quantum wells, wires, and dots are analyzed as systems where carrier motion is confined to fewer than three dimensions, quantizing energy into subbands and producing the step-like density-of-states functions introduced in Chapter 5. The two-dimensional electron gas (2DEG) that forms at an AlGaAs/GaAs or AlGaN/GaN heterointerface provides the high-mobility channel for high electron mobility transistors (HEMTs), including pseudomorphic and metamorphic variants. Quantum well lasers are introduced as devices that exploit the modified density of states for lower threshold currents.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. Quantum Well Laser
2. III-V Semiconductor Compounds
3. GaAs Properties
4. InP Properties
5. InGaAs Properties
6. AlGaAs Properties
7. InGaAsP Properties
8. II-VI Semiconductor Compounds
9. Wide-Bandgap Semiconductors
10. GaN Material Properties
11. AlGaN Alloy
12. AlGaN/GaN Heterostructure
13. SiC Polytypes
14. SiC Properties
15. Quantum Well Structure
16. Quantum Well Energy Levels
17. Quantum Well Wave Functions
18. Subband Structure
19. Quantum Wire
20. Quantum Dot
21. Quantum Dot Energy Levels
22. Size Quantization
23. Confinement Energy
24. 2D Electron Gas
25. 2DEG Formation
26. High Electron Mobility Transistor
27. HEMT Structure
28. HEMT Operation
29. Pseudomorphic HEMT
30. Metamorphic HEMT

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../01-intro-semiconductors/index.md)
- [Chapter 4: Quantum Mechanics: Wave Equations and Atomic Structure](../04-quantum-mechanics/index.md)
- [Chapter 5: Bloch's Theorem, Band Formation, and E-k Diagrams](../05-bloch-theorem-band-theory/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)
- [Chapter 13: Metal-Semiconductor Contacts and MOS Physics](../13-metal-semiconductor-mos/index.md)
- [Chapter 15: JFET, MESFET, and Long-Channel MOSFET Fundamentals](../15-jfet-mesfet-mosfet/index.md)
- [Chapter 17: Optoelectronic Sources: LEDs and Laser Diodes](../17-leds-laser-diodes/index.md)

---

!!! mascot-welcome "Nova on Compound Semiconductors: When Silicon Just Isn't Enough"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Silicon is a marvel. But silicon is slow (relatively), absorbs light poorly, can't glow efficiently, and breaks down at high voltages faster than competing materials. For the cases where silicon falls short — high-frequency amplifiers, blue LEDs, power electronics, quantum computing — we turn to compound semiconductors. Welcome to the periodic table's broader neighborhood: GaAs, InP, GaN, SiC, and their quantum-confined cousins. The physics you know still applies — but now with tuneable bandgaps, 2D electron gases, and quantum boxes the size of a few atoms.

## 19.1 The III-V Compound Semiconductor Family

**III-V semiconductors** are binary, ternary, and quaternary compounds formed from elements in groups III and V of the periodic table. They offer tunable bandgaps across the visible and near-infrared spectrum, often with direct bandgaps (unlike silicon's indirect gap), and frequently with superior electron mobility.

### 19.1.1 GaAs (Gallium Arsenide)

- **Bandgap:** 1.42 eV direct (300 K)
- **Electron mobility:** 8500 cm²/V·s (6× silicon)
- **Hole mobility:** 400 cm²/V·s
- **Substrate:** 6-inch semi-insulating GaAs ($150–300/wafer)

GaAs was the first compound semiconductor to achieve practical devices. Its combination of high electron mobility and direct gap makes it ideal for microwave amplifiers (MESFET, HEMT, HBT), laser diodes (800–1000 nm), and solar cells (space applications, concentrators). The semi-insulating substrate provides natural isolation — no need for well implants or SOI.

Limitation: GaAs lacks a stable native oxide (unlike Si/SiO₂), making it incompatible with conventional MOS processing. GaAs MOSFETs were elusive for decades; modern approaches use ALD-deposited Al₂O₃ as the gate dielectric.

### 19.1.2 InP (Indium Phosphide)

- **Bandgap:** 1.35 eV direct (300 K)
- **Electron mobility:** 5400 cm²/V·s
- **Key property:** Lattice-matched to InGaAs (0.53 In fraction) at \(\lambda\) = 1310/1550 nm

InP is the substrate for telecommunication laser diodes and photodetectors at the fiber-optic wavelengths. The InGaAs/InP material system lattice-match enables high-efficiency detectors and low-threshold lasers. InP-based HEMTs (using In-rich InGaAs channels) achieve the highest electron mobilities and transistor speeds of any commercial semiconductor — 633 GHz \(f_T\) has been demonstrated.

### 19.1.3 InGaAs and AlGaAs

**In\(_x\)Ga\(_{1-x}\)As:** Ternary alloy with continuously tunable bandgap from 1.42 eV (GaAs, x=0) to 0.36 eV (InAs, x=1). At x=0.53, lattice-matched to InP with \(E_g = 0.74\) eV — absorbs 1.55 μm and all shorter wavelengths.

**Al\(_x\)Ga\(_{1-x}\)As:** Ternary alloy with bandgap from 1.42 eV (GaAs, x=0) to 2.16 eV (AlAs, x=1). Lattice-matched to GaAs for all compositions (rare and valuable property — strain-free heterostructures). The GaAs/AlGaAs heterojunction is the workhorse of HEMT and quantum well laser physics.

### 19.1.4 InGaAsP

The quaternary In\(_{1-x}\)Ga\(_x\)As\(_y\)P\(_{1-y}\) system provides two degrees of freedom (x and y) to simultaneously control bandgap and lattice constant. This enables lattice-matched growth on InP substrates at any wavelength from 0.92–1.65 μm — covering both telecom windows (1310 and 1550 nm). DFB lasers for DWDM are fabricated in this material system.

---

## 19.2 II-VI and Wide-Bandgap Semiconductors

**II-VI semiconductors** (group II cation + group VI anion) include ZnS, ZnSe, ZnTe, CdTe, CdS, and HgCdTe. Key applications:

- **HgCdTe (MCT):** The dominant mid-wave and long-wave infrared detector material for thermal imaging and spectroscopy
- **CdTe:** Thin-film solar cells (13–15% module efficiency, low cost)
- **ZnSe, ZnO:** Wide-gap materials for UV emitters and transparent conducting oxides

### 19.2.1 GaN

- **Bandgap:** 3.4 eV direct (300 K)
- **Breakdown field:** ~3 MV/cm (10× silicon)
- **Electron mobility:** 900–2000 cm²/V·s (bulk), 1500–2000 cm²/V·s (2DEG in HEMT)
- **Substrate:** Sapphire (6-inch), SiC (4-inch), GaN-on-Si (6-8 inch)

GaN's wide bandgap gives a large breakdown voltage, making it dominant for power electronics (HV switching at 650 V–1200 V) and microwave power amplifiers (5G base stations, radar). The nitride system (GaN/AlGaN) also enabled the blue LED revolution (Nakamura's discovery of p-type GaN, 1994).

Peculiar to GaN: it is piezoelectric (due to the wurtzite crystal structure), and piezoelectric polarization charges create a spontaneous 2DEG at AlGaN/GaN interfaces even without intentional doping — a unique property exploited in GaN HEMTs.

### 19.2.2 SiC (Silicon Carbide)

- **Bandgap:** 3.26 eV (4H polytype) or 3.02 eV (6H polytype) — indirect gap
- **Breakdown field:** 2.5 MV/cm
- **Thermal conductivity:** 4.9 W/cm·K (3× silicon, enables high-temperature operation)
- **Polytypes:** Over 200 known; 4H-SiC and 6H-SiC are commercially available

The **SiC polytypes** (4H, 6H, 3C) differ in the stacking sequence of Si-C bilayers. 4H-SiC has superior electron mobility and is the standard for power device substrates. SiC MOSFETs and Schottky diodes operate at 1200–10,000 V — powering electric vehicles (Tesla, BMW, Mercedes use SiC inverters), grid-level power converters, and industrial motor drives.

!!! mascot-thinking "Nova Thinks: GaN and SiC Are the Silicon of Power Electronics"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    The power electronics revolution — electric vehicles, solar inverters, wind turbines, data center power supplies — is being enabled by GaN and SiC replacing silicon in switching applications. The key metric is the Baliga figure of merit: \(\text{BFM} = \varepsilon \mu E_g^3\). For silicon: 1. For GaN: 1400. For 4H-SiC: 330. This 1000× material advantage translates directly into smaller, lighter, and more efficient power converters. A GaN charger for your laptop is smaller than a deck of cards; the equivalent silicon charger would be the size of a brick. Wide-bandgap power semiconductors represent arguably the most significant materials transition in electronics since silicon replaced germanium in 1960.

---

## 19.3 Quantum Well Structures

A **quantum well** is a thin layer (2–20 nm) of lower-bandgap semiconductor sandwiched between wider-bandgap barrier layers. Electrons (and holes) confined in the thin layer have quantized motion perpendicular to the layer (the quantum direction) but free motion in the plane.

Before examining energy levels, let's define the relevant length scales. The de Broglie wavelength of a thermal electron:

\[
\lambda_{\text{dB}} = \frac{h}{\sqrt{2m^* k_BT}} \approx \frac{1240 \text{ nm}}{\sqrt{2 \times 0.067 m_0 \times 0.026 \text{ eV}}} \approx 21 \text{ nm (GaAs, 300 K)}
\]

When the quantum well width \(L_z \lesssim \lambda_{\text{dB}}\), quantum effects dominate. For GaAs, this means wells narrower than ~20 nm show pronounced quantization.

### 19.3.1 Quantum Well Energy Levels

The confined energy levels in a finite-depth square quantum well (width \(L_z\), depth \(\Delta E_C\)) are solutions to:

\[
k_n \tan\!\left(\frac{k_n L_z}{2}\right) = \kappa_n \quad \text{(even solutions)}
\]

where \(k_n = \sqrt{2m_w^* E_n}/\hbar\) (wave vector in well) and \(\kappa_n = \sqrt{2m_b^*(V_0-E_n)}/\hbar\) (decay constant in barrier). The energy levels \(E_n\) must be found numerically.

For an infinite-depth well (exact):

\[
E_n = \frac{\hbar^2}{2m^*}\!\left(\frac{n\pi}{L_z}\right)^2, \quad n = 1, 2, 3, \ldots
\]

This particle-in-a-box formula (from Chapter 4) applies directly. For a 10 nm GaAs well (\(m^* = 0.067 m_0\)):

\[
E_1 = \frac{(1.055\times10^{-34})^2}{2 \times 0.067 \times 9.11\times10^{-31}}\!\left(\frac{\pi}{10\times10^{-9}}\right)^2 = 56 \text{ meV}
\]

The second level \(E_2 = 4 E_1 = 224\) meV. Only \(E_1\) and \(E_2\) fit inside the GaAs/Al₀.₃Ga₀.₇As conduction band offset of ~250 meV.

### 19.3.2 Subband Structure and Density of States

In a quantum well, motion is quantized in the z-direction but free in the x-y plane. For each quantized level \(E_n\), there is a 2D subband with dispersion:

\[
E(k_x, k_y) = E_n + \frac{\hbar^2(k_x^2 + k_y^2)}{2m^*}
\]

The 2D density of states for each subband is **constant** (independent of energy):

\[
g_{2D}(E) = \frac{m^*}{\pi\hbar^2 L_z} \quad \text{per subband}
\]

The total 3D-equivalent density of states for a quantum well is a **staircase function**: each step appears at a subband energy \(E_n\). This contrasts with the smooth \(\sqrt{E}\) dependence of bulk (3D) materials.

The step-like DOS has profound consequences for laser threshold: all carriers at a given subband minimum contribute to gain at the same energy (sharp transition), unlike bulk where carriers spread over a continuous distribution. Quantum well lasers have 5–10× lower threshold current density than bulk lasers and narrower emission linewidth.

---

## 19.4 Quantum Wires and Quantum Dots

Extending quantum confinement to more dimensions:

**Quantum wire** (1D): Electrons confined in y and z, free in x. Two sets of quantum numbers \((n_y, n_z)\) → subbands. Density of states is **1D** (van Hove singularities at each subband edge: \(g_{1D} \propto 1/\sqrt{E-E_{n_y,n_z}}\)).

**Quantum dot** (0D): Electrons confined in all three dimensions. No free motion → completely discrete energy levels (\(\delta\)-function DOS). Like an artificial atom.

**Quantum dot energy levels** (spherical dot, radius \(R\), simple approximation):

\[
E_{nl} \approx \frac{\hbar^2 \chi_{nl}^2}{2m^* R^2}
\]

where \(\chi_{nl}\) are the zeros of spherical Bessel functions. For the ground state: \(E_{10} = \hbar^2 \pi^2/(2m^* R^2)\) — the same \(1/R^2\) dependence as a 1D particle-in-a-box, but now in all directions. A 3 nm radius CdSe quantum dot has \(E_{10} \approx 0.8\) eV above the bulk bandgap — making it emit at ~530 nm (green) instead of bulk CdSe's ~720 nm (near-IR). **Quantum dot LEDs** exploit this size-tunable emission to produce saturated colors in displays (Samsung, Amazon Fire TV use QD-enhanced LCD and QD-OLED displays).

The **size quantization** energy \(E_{\text{conf}} \propto 1/R^2\): smaller dot → larger confinement → bluer emission. This is the celebrated **quantum confinement effect** — the reason quantum dot color is a direct indicator of dot size, and the reason quantum dot synthesis requires atomic-precision size control.

---

## 19.5 The 2D Electron Gas and HEMT

### 19.5.1 2DEG Formation

The **two-dimensional electron gas (2DEG)** is a sheet of electrons confined at a heterojunction interface but free to move in the plane. It forms spontaneously at AlGaAs/GaAs or AlGaN/GaN interfaces through a mechanism that makes it more remarkable than a simple quantum well:

**In AlGaAs/GaAs (modulation doping):**
Donors are placed in the wider-gap AlGaAs layer (spacer + doped region), not in the GaAs channel. At the interface, the conduction band of GaAs dips below \(E_F\) due to the band offset — forming a triangular quantum well. Electrons from AlGaAs donors transfer to this well. Now the electrons are spatially separated from their parent donors — the **ionized impurity scattering** that would normally limit mobility is eliminated. The 2DEG electrons in GaAs see a nearly impurity-free environment and achieve mobilities of 10,000–10,000,000 cm²/V·s at low temperature. At 300 K: ~8000–15,000 cm²/V·s.

**In AlGaN/GaN:**
The 2DEG forms spontaneously without intentional doping, driven by the spontaneous and piezoelectric polarization discontinuity at the AlGaN/GaN interface. Polarization-induced positive charge at the AlGaN surface attracts electrons from surface donors, which then accumulate at the interface. This "polarization doping" gives 2DEG densities of \(10^{13}\) cm\(^{-2}\) — 10× larger than AlGaAs/GaAs.

### 19.5.2 HEMT Structure and Operation

The **High Electron Mobility Transistor (HEMT)** (also called MODFET or TEGFET) uses the 2DEG as the transistor channel. The structure:

- **Cap layer:** n\(^+\) GaAs or n\(^+\) InGaAs for ohmic contact formation
- **Barrier layer:** n-doped AlGaAs (or AlGaN) — provides donor electrons to 2DEG
- **Spacer:** Undoped AlGaAs (3–10 nm) — separates ionized donors from channel for high mobility
- **Channel:** Undoped GaAs (or GaN) containing the 2DEG
- **Buffer/substrate:** Semi-insulating GaAs (or SiC for GaN HEMT)

Gate voltage modulates the 2DEG density (similar to a MOSFET modulating an inversion layer), controlling drain current. The HEMT I-V characteristics are similar to MOSFET (triode and saturation regions) but with much higher transconductance per gate width:

\[
g_m = \frac{qv_{\text{sat}} \varepsilon_b}{d_b + \Delta d} \quad \text{(saturated HEMT)}
\]

where \(d_b\) is the barrier thickness and \(\Delta d\) is the centroid distance of the 2DEG (~3–5 nm).

**Pseudomorphic HEMT (pHEMT):** Uses a strained InGaAs channel (higher In fraction than lattice-matched) for even higher electron mobility. The strain is accommodated elastically (no dislocations) if the channel is thin enough (pseudomorphic). InGaAs pHEMTs on GaAs substrates reach \(f_T > 150\) GHz and power GHz-range satellite communications.

**Metamorphic HEMT (mHEMT):** Grows a compositionally graded buffer layer to gradually change the lattice constant from GaAs substrate to a lattice constant matching high-In InGaAs. Allows very high In-fraction channels (>70% In) on GaAs substrates without a premium InP substrate. mHEMTs achieve \(f_T > 500\) GHz.

!!! mascot-warning "Nova Warns: Depletion Mode vs. Enhancement Mode HEMT Matters for Circuits"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    Most HEMTs are **depletion-mode** (normally on) — the 2DEG exists at zero gate bias and must be depleted by negative gate voltage to turn off. This complicates digital circuits (need negative power supplies or special logic). Enhancement-mode (normally off) HEMTs require careful control of AlGaAs barrier thickness and doping — the 2DEG must be depleted at \(V_{GS} = 0\) and appear only at positive bias. GaN e-mode HEMTs are actively commercialized for power switching (can operate with standard 0–3.3 V logic, no negative supply needed). The battle between d-mode and e-mode GaN is one of the major applications debates in power electronics today.

<details markdown="1">
<summary>#### MicroSim: Quantum Well Energy Level Explorer</summary>

**sim-id:** `quantum-well-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive quantum well band structure visualizer. Shows a finite square well potential with adjustable width and depth. Calculates and displays the first 3–4 bound state wavefunctions and energy levels. Also shows the step-like 2D density of states for each subband. A comparison panel shows bulk 3D density of states vs. quantum well staircase.

**Controls:**
- Slider: Well width \(L_z\) (1–20 nm)
- Slider: Conduction band offset \(\Delta E_C\) (0.1–0.5 eV)
- Dropdown: Material system (GaAs/AlGaAs, InGaAs/InP, GaN/AlGaN)
- Checkbox: Show wavefunctions / probability densities

**Key Learning Objectives:**
- L2 (Understand): Explain why confinement raises energy above bulk band edges
- L3 (Apply): Calculate ground-state energy for a given well width and material
- L4 (Analyze): Compare quantum well DOS to bulk DOS and explain threshold current improvement in QW lasers

</details>

---

## Summary

This chapter covered compound semiconductors and quantum structures:

- **III-V materials:** GaAs (high mobility, direct gap), InP (telecom wavelengths), AlGaAs (lattice-matched to GaAs), InGaAsP (tunable telecom), all enabling high-speed photonics and electronics
- **Wide-bandgap:** GaN (blue LEDs, power HEMTs, 5G), SiC (power MOSFETs for EVs); breakdown fields 10× silicon
- **Quantum wells:** Confined motion in z, free in x-y; energy levels \(E_n \propto n^2/L_z^2\); step-like 2D DOS → lower laser threshold
- **Quantum wires/dots:** Additional confinement → 1D/0D DOS; quantum dot size controls emission wavelength (quantum confinement)
- **2DEG** forms at modulation-doped AlGaAs/GaAs or polarization-induced AlGaN/GaN interfaces; spatial separation from donors gives very high mobility
- **HEMT** uses 2DEG as channel; pseudomorphic (strained InGaAs) and metamorphic (graded buffer) variants reach 300–600 GHz \(f_T\)

## Key Equations

\[
E_n = \frac{\hbar^2 n^2 \pi^2}{2m^* L_z^2} \quad \text{(infinite quantum well)}, \quad g_{2D} = \frac{m^*}{\pi\hbar^2 L_z} \text{ per subband (constant)}
\]

\[
E_{QD} \propto \frac{\hbar^2 \pi^2}{2m^* R^2} \quad \text{(quantum dot confinement energy} \propto R^{-2}\text{)}
\]
