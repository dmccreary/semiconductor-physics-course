---
title: Semiconductor Fabrication Technology
description: Crystal growth, epitaxy, thermal oxidation, diffusion, ion implantation, photolithography, etching, thin-film deposition, metallization, and yield engineering
generated_by: claude skill chapter-content-generator
date: 2026-06-03 21:00:00
version: 0.08
---

# Semiconductor Fabrication Technology

## Summary

Device physics does not exist in isolation from the processes that create devices. This chapter surveys semiconductor fabrication at the level needed to understand how process choices affect device behavior. Crystal growth by the Czochralski and float-zone methods produces the starting silicon ingots; GaN growth presents unique challenges requiring specialized reactors. Epitaxial growth by MBE, MOCVD, and CVD deposits thin, precisely doped layers. Thermal oxidation (dry and wet, modeled by Deal-Grove kinetics) forms gate and field oxides. Solid-state diffusion (Fick's laws) and ion implantation introduce dopants with controllable profiles; post-implant annealing restores crystal quality. Photolithography, etching (wet, RIE, plasma), and thin-film deposition (PVD, sputtering, CVD) pattern and build up the device layers. Metallization with aluminum or copper interconnects and silicide contacts links device regions. Process-induced defects, contamination control, and a yield overview close the chapter.

## Concepts Covered

This chapter covers the following 40 concepts from the learning graph:

1. GaN Crystal Growth
2. Czochralski Crystal Growth
3. Float-Zone Crystal Growth
4. Crystal Ingot Processing
5. Wafer Preparation
6. Epitaxial Growth
7. Molecular Beam Epitaxy
8. Metal-Organic CVD
9. Chemical Vapor Deposition
10. Thermal Oxidation of Silicon
11. Deal-Grove Model
12. Dry Oxidation
13. Wet Oxidation
14. Diffusion in Solids
15. Fick First Law
16. Fick Second Law
17. Diffusion Coefficient Thermal
18. Ion Implantation
19. Ion Range Distribution
20. Channeling Effect
21. Annealing Post-Implant
22. Photolithography Process
23. Photoresist
24. Exposure and Development
25. Mask Alignment
26. Etching Processes
27. Wet Chemical Etching
28. Dry Etching RIE
29. Plasma Etching
30. Thin Film Deposition
31. Physical Vapor Deposition
32. Sputtering
33. Metallization
34. Aluminum Interconnects
35. Copper Interconnects
36. Silicide Formation
37. Contact Resistance Fabrication
38. Process-Induced Defects
39. Contamination Control
40. Yield Engineering Overview

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Crystal Lattice Structure and Symmetry](../02-crystal-lattice-structure/index.md)
- [Chapter 3: Crystal Bonding, Defects, and Surfaces](../03-crystal-bonding-defects/index.md)
- [Chapter 5: Silicon Material Properties](../01-intro-semiconductors/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)
- [Chapter 13: Metal-Semiconductor Contacts and MOS Physics](../13-metal-semiconductor-mos/index.md)
- [Chapter 19: III-V/II-VI Semiconductors, Quantum Nanostructures, and HEMTs](../19-compound-semiconductors-quantum/index.md)

---

!!! mascot-welcome "Nova on Semiconductor Fabrication: Making Theory Real (in the World's Cleanest Rooms)"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    All semester we've been working with idealized junctions, perfect crystals, and equations that assume the silicon comes pre-made. It doesn't. Someone — or rather, thousands of very precise robots and chemicals — had to grow the crystal, slice it to a wafer, oxidize it, implant it, pattern it, etch it, deposit metals on it, and verify every single step didn't go wrong. Today we follow a silicon atom from molten rock to finished transistor. It takes three months and involves about 1000 individual process steps. No pressure.

## 21.1 Crystal Growth: From Sand to Single-Crystal Ingot

The starting material for silicon devices is polycrystalline silicon (polysilicon or "polysi") purified from quartzite sand through a series of chemical reactions. Metallurgical-grade silicon (98–99% pure) is insufficient — devices require electronic-grade silicon with impurity levels below \(10^{10}\) cm\(^{-3}\) (parts-per-trillion).

### 21.1.1 Czochralski Crystal Growth

The dominant commercial method is the **Czochralski (CZ) process**:

1. Polysilicon is melted in a quartz crucible at 1414°C under inert gas (argon)
2. A precisely oriented seed crystal (~5 mm diameter) is lowered until it contacts the melt
3. The seed is slowly pulled upward (1–10 mm/hr) while rotating; silicon solidifies on the seed
4. The boule (ingot) is grown to 300 mm diameter (current standard) and 1–2 m length
5. The ingot is sliced into wafers (0.7–0.9 mm thick), lapped, polished, and cleaned

CZ silicon contains:
- Interstitial oxygen (from quartz crucible): ~10¹⁸ cm⁻³, which can form oxide precipitates that getter metallic impurities
- Carbon: < 10¹⁶ cm⁻³
- Residual dopants: controlled by adding B, P, or As to the melt

**Crystal ingot processing** involves the ingot being ground to a precise cylinder, flat or notch ground for orientation reference, sliced by multi-wire saws into wafers, and then polished to atomic smoothness (~0.1 nm RMS roughness for the polished surface).

Modern 300 mm CZ wafers cost ~$100–200 each and are the substrate for all leading-edge CMOS production.

### 21.1.2 Float-Zone Crystal Growth

**Float-zone (FZ)** silicon avoids the quartz crucible (hence, much lower oxygen content). A polysilicon rod is melted locally by an RF induction coil; the molten zone is slowly traversed along the rod while impurities segregate preferentially into the melt (zone refining).

FZ silicon has:
- Oxygen concentration < 10¹⁵ cm⁻³ (100× lower than CZ)
- Higher resistivity achievable (up to 10⁵ Ω·cm)
- No oxygen-related defects

FZ silicon is preferred for: power devices (high voltage, long minority carrier lifetime), silicon solar cells (highest efficiency because low oxygen → fewer recombination centers), and precision radiation detectors.

Limitation: FZ is limited to ~200 mm diameter because the molten zone becomes unstable at larger diameters. All 300 mm and 450 mm production uses CZ.

### 21.1.3 GaN Crystal Growth

Growing bulk GaN crystals is significantly harder than silicon because GaN has:
- Very high melting point (> 2000°C with nitrogen overpressure)
- High nitrogen vapor pressure at the melting point

**Hydride vapor phase epitaxy (HVPE)** produces thick GaN layers (100–500 μm) on foreign substrates (sapphire, SiC), which can then be separated to make quasi-bulk GaN substrates. **Ammonothermal growth** (GaN dissolved in supercritical ammonia) and **sodium flux** methods are emerging for larger boules. Most GaN power devices today use GaN-on-SiC or GaN-on-Si, not bulk GaN, because substrate availability and cost.

---

## 21.2 Epitaxial Growth

**Epitaxy** (from Greek: "epi" = upon, "taxis" = arrangement) is the growth of a crystalline layer whose orientation is determined by the substrate beneath it. Epitaxial layers allow precise control of doping, composition, and thickness beyond what's achievable by bulk crystal growth.

Two cases: **homoepitaxy** (same material, e.g., Si on Si) and **heteroepitaxy** (different material, e.g., GaAs on InP, or InGaN on GaN).

### 21.2.1 Molecular Beam Epitaxy (MBE)

**MBE** deposits atoms from thermal beams in ultra-high vacuum (\(10^{-10}\) torr). Effusion cells heat elemental sources (Ga, As, Al, In, etc.) until atoms evaporate. Shutters control the beam flux with millisecond precision. The substrate is heated and slowly rotated for uniformity.

MBE advantages:
- Atomic-layer precision and abrupt interfaces
- In-situ monitoring (RHEED — reflection high-energy electron diffraction)
- No chemical precursors → ultra-pure
- Can grow single-monolayer structures

MBE disadvantages:
- Extremely slow (< 1 μm/hr for most materials)
- Very expensive capital equipment and maintenance
- Limited to research and specialty compound semiconductor production (not silicon CMOS)

### 21.2.2 Metal-Organic CVD (MOCVD)

**MOCVD** (also called MOVPE — metal-organic vapor phase epitaxy) uses organometallic precursors (e.g., trimethylgallium Ga(CH₃)₃, trimethylaluminum Al(CH₃)₃, arsine AsH₃) carried in hydrogen or nitrogen. Precursors decompose on a heated substrate (500–1100°C), depositing the semiconductor.

MOCVD advantages:
- Production-scale (multi-wafer planetary reactors)
- Essential for GaN/AlGaN (no other method scales)
- 5–10× faster than MBE for III-V compounds
- Standard for LED epitaxy

MOCVD disadvantages:
- Hazardous precursors (arsine, phosphine are highly toxic)
- Less abrupt interfaces than MBE
- Complex gas-phase reactions to control

### 21.2.3 Chemical Vapor Deposition (CVD) for Silicon

Silicon epitaxy uses **CVD** with silane (SiH₄) or dichlorosilane (SiH₂Cl₂) at atmospheric or reduced pressure:

\[
\text{SiH}_4 \xrightarrow{900\text{-}1150°C} \text{Si} + 2\text{H}_2
\]

Silicon CVD is used for:
- Blanket n⁺ or p⁺ epitaxial layers (bipolar, power devices)
- Selective epitaxial silicon (SiGe in MOSFET source/drain regions)
- Polysilicon deposition (gate electrode, resistors)

---

## 21.3 Thermal Oxidation and the Deal-Grove Model

Silicon's unique advantage is its ability to form a high-quality SiO₂ gate dielectric by direct oxidation:

\[
\text{Si} + \text{O}_2 \to \text{SiO}_� \quad \text{(dry oxidation)}
\]
\[
\text{Si} + 2\text{H}_2\text{O} \to \text{SiO}_2 + 2\text{H}_2 \quad \text{(wet oxidation)}
\]

**Dry oxidation** produces denser oxide with fewer defects and better Si/SiO₂ interface quality — used for gate oxides.

**Wet oxidation** (water vapor or pyrogenic steam) is 5–10× faster and produces thicker but lower-quality oxides — used for isolation (field oxide, LOCOS, STI).

**Consuming silicon:** The oxide consumes silicon from the surface. Growing 100 nm of SiO₂ consumes 44 nm of silicon (oxide is ~2.27× denser in volume than equivalent silicon).

### 21.3.1 The Deal-Grove Model

The kinetics of thermal oxidation are described by the **Deal-Grove model** (1965), which considers three sequential steps: gas-phase transport (fast), oxide surface reaction, and diffusion through the growing oxide (rate-limiting for thick oxides).

The oxide thickness \(x_o(t)\) satisfies:

\[
x_o^2 + A x_o = B(t + \tau)
\]

where \(A\) and \(B\) are temperature-dependent parameters and \(\tau\) accounts for any initial oxide. Two limiting cases:

- **Short times (thin oxides):** \(x_o \approx (B/A)(t + \tau)\) — linear in time; surface reaction limited
- **Long times (thick oxides):** \(x_o \approx \sqrt{B(t + \tau)}\) — parabolic in time; diffusion limited

The **parabolic rate constant** \(B \propto D_{\text{ox}} C^*\) where \(D_{\text{ox}}\) is the oxidant diffusivity through SiO₂ and \(C^*\) is the oxidant solubility. Wet oxidation has larger \(B\) (higher water solubility in SiO₂).

Typical values at 1000°C for silicon:

| Oxidation type | B/A (μm/hr) | B (μm²/hr) |
|----------------|-------------|------------|
| Dry O₂ | 0.068 | 0.0117 |
| Wet H₂O | 0.75 | 0.324 |

!!! mascot-thinking "Nova Thinks: The 0.3 nm Thermal Oxide Is a Miracle"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    At 5 nm node CMOS, the EOT gate oxide is ~0.6–0.7 nm — roughly 2–3 atomic layers. A thermally grown SiO₂ film this thin is essentially a monolayer of oxide on top of the silicon, barely distinguishable from the Si/SiO₂ interface itself. The interface trap density of a good thermal oxide is \(D_{it} \approx 10^{10}\) cm\(^{-2}\)eV\(^{-1}\) — out of 6.8 × 10¹⁴ Si surface atoms per cm², this means roughly 1 in 68,000 atoms has a dangling bond. That's the quality that makes silicon unique. No compound semiconductor has ever achieved anything close to this — it's the interface that built the information age.

---

## 21.4 Diffusion and Ion Implantation

Two methods introduce controlled dopant atoms into silicon: **solid-state diffusion** and **ion implantation**. Modern CMOS uses almost exclusively ion implantation, but diffusion physics remains important for understanding dopant redistribution during annealing.

### 21.4.1 Diffusion in Solids: Fick's Laws

**Fick's first law:** The flux of dopant atoms is proportional to the concentration gradient:

\[
J = -D \frac{\partial C}{\partial x}
\]

**Fick's second law:** The time evolution of the concentration profile:

\[
\frac{\partial C}{\partial t} = D \frac{\partial^2 C}{\partial x^2}
\]

(valid when D is concentration-independent — a useful approximation for low concentrations)

**Gaussian diffusion** (from an implanted surface layer): \(C(x,t) = \frac{Q}{\sqrt{\pi D t}} e^{-x^2/(4Dt)}\)

**Erfc diffusion** (from a constant surface source): \(C(x,t) = C_s \text{erfc}(x/2\sqrt{Dt})\)

The thermal **diffusion coefficient** follows an Arrhenius law:

\[
D = D_0 \exp\!\left(-\frac{E_a}{k_BT}\right)
\]

For boron in silicon: \(D_0 = 10.5\) cm²/s, \(E_a = 3.69\) eV. At 1000°C: \(D_B \approx 2 \times 10^{-14}\) cm²/s. Diffusing for 1 hour gives characteristic length \(\sqrt{Dt} \approx 8.5\) nm — consistent with junction depths of 10–50 nm in modern transistors.

### 21.4.2 Ion Implantation

**Ion implantation** fires dopant ions (P⁺, As⁺, B⁺) accelerated to 1–500 keV into the silicon wafer. Ions slow down through nuclear (elastic collisions with Si nuclei) and electronic (inelastic collisions with electrons) stopping mechanisms, coming to rest at a depth called the **projected range** \(R_p\):

The implanted dopant distribution is approximately Gaussian:

\[
C(x) = \frac{Q}{\sqrt{2\pi}\Delta R_p} \exp\!\left(-\frac{(x - R_p)^2}{2\Delta R_p^2}\right)
\]

where \(Q\) is the dose (ions/cm²) and \(\Delta R_p\) is the straggle (standard deviation of the range).

Advantages of ion implantation:
- Precise, reproducible dose (monitor with Faraday cups)
- Room-temperature process (no dopant redistribution during implant)
- Tilted implants can dope under gate edges (halo, pocket implants)
- Masks (photoresist, oxide, nitride) block implants

The **channeling effect** occurs when ions travel along crystal symmetry axes or planes — channeled ions travel much deeper than predicted. To prevent channeling, wafers are typically tilted 7° during implant and/or a thin amorphous screen oxide is used.

### 21.4.3 Post-Implant Annealing

Ion implantation creates crystal damage — the silicon lattice is disordered by nuclear collisions. To activate the dopants (move them to substitutional sites) and repair the damage, **annealing** at 800–1100°C is required.

**Rapid thermal annealing (RTA)** heats the wafer for seconds using tungsten-halogen lamps, activating dopants while minimizing diffusion (which would spread the sharp implant profile).

**Spike anneal** and **laser annealing** further reduce the thermal budget (milliseconds to nanoseconds) for the most aggressive short-channel devices where even RTA allows too much dopant movement.

---

## 21.5 Photolithography

**Photolithography** (or simply "lithography") transfers geometric patterns from a mask to the silicon wafer. It is the most expensive and technologically demanding step in semiconductor fabrication.

The process sequence:

1. **Surface preparation:** Clean wafer, bake to desorb moisture, apply adhesion promoter (HMDS)
2. **Photoresist coating:** Spin-coat liquid photoresist at 2000–6000 RPM → 50–500 nm uniform film
3. **Soft bake:** Drive out solvent (90°C, 60 seconds)
4. **Exposure:** UV or extreme UV (EUV) light through mask selectively exposes resist
5. **Post-exposure bake (PEB):** Necessary for chemically amplified resists
6. **Development:** Immerse in developer; exposed (positive resist) or unexposed (negative resist) areas dissolve
7. **Inspection and hard bake**
8. **Etch or implant:** Pattern transferred to underlying film
9. **Resist strip:** Remove remaining resist (oxygen plasma or wet chemicals)

The minimum feature size achievable is given by the **Rayleigh criterion**:

\[
\text{CD}_{\min} = k_1 \frac{\lambda}{\text{NA}}
\]

where \(\lambda\) is the exposure wavelength, NA is the numerical aperture of the lens, and \(k_1\) is a process-dependent factor (historically ~0.5–0.8, now pushed to ~0.25 with multiple patterning).

**Technology evolution:**
- 436 nm (g-line mercury): Used through 500 nm nodes
- 365 nm (i-line): Used through 250 nm
- 248 nm (KrF excimer): 250–130 nm nodes
- 193 nm (ArF excimer): 90–7 nm nodes (with immersion and multiple patterning)
- **13.5 nm EUV:** 7 nm and below; requires reflective optics, plasma-driven light source

EUV lithography represents one of the most complex machines ever built: ASML's NXE:3400 EUV scanner weighs 180 tons, costs ~$150 million, contains 100,000 parts, and must be positioned to nanometer accuracy.

---

## 21.6 Etching Processes

After lithography, exposed areas must be etched away. Two classes:

**Wet chemical etching:** Liquid chemicals dissolve the exposed material. For silicon: \(\text{KOH}\) etches anisotropically (preferring the (100) plane over (111)); \(\text{HF}\) removes SiO₂ selectively. Wet etching is isotropic (etches in all directions equally) for most materials — the undercut equals the etch depth.

**Dry etching (RIE and plasma etching):** Ion bombardment and reactive radicals remove material anisotropically (primarily in the vertical direction). This enables the sub-10 nm features required in modern CMOS.

**Reactive ion etching (RIE):** Low-pressure plasma of fluorine-based gases (CF₄, SF₆, C₄F₈) bombards the wafer with ions. Ion bombardment combined with chemical reactions etches directionally. The ratio of physical sputtering to chemical etching controls the anisotropy.

**Deep reactive ion etching (DRIE):** Alternates between etching and passivation cycles (Bosch process) to achieve aspect ratios > 50:1 for MEMS structures.

---

## 21.7 Thin-Film Deposition

After etching, new layers are deposited. Three main methods:

**Physical vapor deposition (PVD):** Target material is vaporized by sputtering (ion bombardment) or evaporation, and deposits on the wafer. Used for: aluminum, titanium, tungsten, and barrier metals. Low substrate temperatures (~25–300°C). Poor conformality for deep features.

**Sputtering:** Inert gas (Ar) ions accelerated into a target material — atoms are physically knocked off and deposit on the wafer. Used for metals, alloys, and refractory materials.

**CVD (Chemical Vapor Deposition):** Gaseous precursors react at the wafer surface to deposit a solid film. Better conformality than PVD. Used for: SiO₂, Si₃N₄, polysilicon, tungsten, low-k dielectrics.

**Atomic Layer Deposition (ALD):** Sequential, self-limiting half-reactions deposit films one atomic monolayer at a time. Used for: high-k gate dielectrics (HfO₂, Al₂O₃), conformal coatings in high-aspect-ratio features. Enables angstrom-precision film thickness control.

---

## 21.8 Metallization and Interconnects

**Metallization** provides electrical connections between device regions (contacts) and between devices (interconnects).

**Silicide formation:** Directly contacting silicon with aluminum or tungsten is problematic — the metal/silicon reaction can cause spiking (aluminum dissolves into silicon at contact). The modern approach deposits a refractory metal (Ti, Co, Ni) on silicon and anneals — the metal reacts with silicon to form a metal silicide (TiSi₂, CoSi₂, NiSi) with low resistivity (~10–20 μΩ·cm) and good junction integrity. Unreacted metal on SiO₂ is selectively removed. This self-aligned silicide ("salicide") process works without a mask.

**Aluminum interconnects:** Used from 1970 through early 2000s. Aluminum sputtered into contact holes and trenches, patterned by RIE. Aluminum has resistivity ~2.7 μΩ·cm. Problems: electromigration failure (Al atoms move under high current density), and limited scalability below 180 nm.

**Copper interconnects:** Introduced at 180 nm node (IBM/Motorola 1997). Copper has 40% lower resistivity (~1.7 μΩ·cm) and better electromigration resistance. Copper cannot be etched easily (no volatile Cu fluorides), so it uses **damascene** processing: etch trenches and vias in the dielectric, deposit copper (electroplating), then chemical-mechanical polish (CMP) to remove excess copper. A diffusion barrier (TaN, TiN) prevents copper from diffusing into silicon.

**Contact resistance** is the resistance between metal and the silicon or silicide surface. For advanced nodes, contact resistance is a leading limiter — the very small contact area (< 20 nm × 20 nm) means even 10\(^{-9}\) Ω·cm² specific contact resistance contributes hundreds of Ω to the source/drain resistance. Minimizing contact resistance through materials selection, surface preparation, and heavy doping is critical.

---

## 21.9 Process-Induced Defects, Contamination, and Yield

**Process-induced defects** include:

- **Crystalline defects:** Dislocations from thermal stress, stacking faults from oxidation, ESD damage
- **Oxide defects:** Pinhole shorts, trapped charge from plasma damage, interface state creation
- **Lithography defects:** Pattern bridging, open circuits, resist residue
- **Metal defects:** Voids in copper lines, incomplete fill in contact holes

**Contamination control:** Semiconductor fabs operate as Class 1–10 cleanrooms (1–10 particles > 0.5 μm per cubic foot of air, vs. 350,000 in normal air). Workers wear full bunny suits. Particle counts are monitored continuously. Metallic contamination (Na⁺, Fe, Cu) is controlled at parts-per-trillion in all process chemicals (DI water: 18.2 MΩ·cm, < 1 ppb metal). Even a single metal atom in a completed gate oxide can create a leakage path.

**Yield engineering:** Chip yield (fraction of die on a wafer that function correctly) is modeled by the Poisson or negative-binomial distribution:

\[
Y = e^{-AD_0} \quad \text{(Poisson model)}
\]

where \(A\) is the die area and \(D_0\) is the defect density (defects/cm²). A die with \(A = 100\) mm² at \(D_0 = 0.1\) cm\(^{-2}\): \(Y = e^{-0.1 \times 1} \approx 90\%\). At \(D_0 = 1\) cm\(^{-2}\): \(Y \approx 37\%\). Reducing defect density and die area are the two levers for improving yield — which directly determines revenue and profitability.

!!! mascot-celebration "Nova Celebrates: 1000 Steps to a Transistor"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    A modern leading-edge chip requires 3–4 months and approximately 1000 individual process steps. The wafer visits 200+ pieces of equipment. Each step must be controlled to nanometer precision, parts-per-trillion chemical purity, and angstrom-scale film uniformity across the entire 300 mm wafer. The fact that it works consistently — that TSMC ships 13 million wafers per year at 3–5 nm — is arguably the most extraordinary manufacturing achievement in human history. And you now understand enough physics to know why each step matters. That's not a small thing.

<details markdown="1">
<summary>#### MicroSim: CMOS Process Flow Visualizer</summary>

**sim-id:** `cmos-process-flow`  
**Library:** p5.js  
**Status:** specification  

**Description:** Step-by-step cross-sectional visualization of a simplified CMOS process flow. Shows the silicon wafer cross-section updating after each major step: wafer start → field oxide → well implants → gate oxidation → gate poly → LDD implants → spacer formation → source/drain implants → silicide → dielectric → contacts → metal. User can step forward/backward through the process.

**Controls:**
- Button: Step forward / Step backward
- Slider: Jump to step N (1 to 20)
- Checkbox: Label all materials
- Dropdown: Show NMOS / PMOS / Both

**Key Learning Objectives:**
- L2 (Understand): Identify the purpose of each major fabrication step
- L3 (Apply): Trace how a single transistor's structure builds up through the process flow
- L4 (Analyze): Explain why step ordering matters (e.g., why implants come before activation anneal)

</details>

---

## Summary

This chapter covered semiconductor fabrication from crystal to chip:

- **Crystal growth:** Czochralski (300 mm, oxygen-doped) and float-zone (ultra-pure, power/solar) for silicon; HVPE/ammonothermal for GaN
- **Epitaxy:** MBE (atomic precision, compound semiconductors), MOCVD (production-scale III-V/GaN), CVD (silicon epi, polysilicon)
- **Thermal oxidation:** Deal-Grove model — linear (reaction-limited) then parabolic (diffusion-limited) kinetics; dry oxide for gate, wet for isolation
- **Diffusion:** Fick's laws → Gaussian or erfc profiles; \(D \propto e^{-E_a/k_BT}\); modern devices use ion implantation + RTA
- **Ion implantation:** Precise dose control, Gaussian \(C(x)\) profile centered at range \(R_p\); channeling prevented by wafer tilt
- **Photolithography:** Spin → expose → develop → etch cycle; minimum CD = \(k_1\lambda/\text{NA}\); EUV at 13.5 nm enables < 7 nm nodes
- **Etching:** Wet (isotropic, selective) vs. RIE (anisotropic, plasma-ion bombardment)
- **Metallization:** Salicide (self-aligned silicide) for contacts; aluminum → copper (lower resistivity, damascene process)
- **Yield:** \(Y = e^{-AD_0}\) — die area and defect density determine chip economics

## Key Equations

\[
x_o^2 + A x_o = B(t + \tau) \quad \text{(Deal-Grove)} \implies x_o \approx \sqrt{Bt} \text{ (parabolic limit)}
\]

\[
C(x,t) = \frac{Q}{\sqrt{2\pi}\Delta R_p}\exp\!\left(-\frac{(x-R_p)^2}{2\Delta R_p^2}\right) \quad \text{(implant profile)}
\]

\[
\text{CD}_{\min} = k_1 \frac{\lambda}{\text{NA}}, \quad Y = e^{-AD_0}
\]
