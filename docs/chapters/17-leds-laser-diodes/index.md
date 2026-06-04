---
title: "Optoelectronic Sources: LEDs and Laser Diodes"
description: Radiative recombination, LED efficiency chain, laser threshold, Fabry-Perot and DFB cavities, VCSELs, double heterostructures, and white LED phosphor conversion
generated_by: claude skill chapter-content-generator
date: 2026-06-03 19:00:00
version: 0.08
---

# Optoelectronic Sources: LEDs and Laser Diodes

## Summary

Optoelectronic sources convert electrical energy into light through radiative recombination in forward-biased p-n junctions. This chapter opens with light-emitting diodes: the direct-bandgap material requirement, the efficiency chain from internal quantum efficiency through external quantum efficiency and light extraction efficiency, LED wavelength selection from the bandgap, and white LED technology via phosphor conversion. Laser diodes add optical feedback and the requirement for population inversion to achieve stimulated emission. The chapter derives optical gain, threshold current density, and the behavior of Fabry-Perot, distributed Bragg reflector (DBR), distributed feedback (DFB), and vertical-cavity surface-emitting laser (VCSEL) cavities. Double heterostructure lasers and semiconductor optical amplifiers complete the treatment of optical sources, setting the stage for quantum-well lasers covered in Chapter 19.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Light-Emitting Diode
2. LED Operation Principle
3. LED Materials
4. Direct Bandgap LED Requirement
5. LED Efficiency
6. Internal Quantum Efficiency
7. External Quantum Efficiency
8. Light Extraction Efficiency
9. LED Wavelength Selection
10. White LED Technology
11. Phosphor Conversion LED
12. Laser Diode
13. Laser Operation Principle
14. Population Inversion
15. Optical Gain
16. Threshold Current Density
17. Laser Cavity
18. Fabry-Perot Cavity
19. Distributed Bragg Reflector
20. Distributed Feedback Laser
21. Vertical Cavity Surface Emitting Laser
22. VCSEL Structure
23. Double Heterostructure Laser
24. Semiconductor Optical Amplifier

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../01-intro-semiconductors/index.md)
- [Chapter 10: Generation, Recombination, Continuity, and Optical Processes](../10-generation-recombination/index.md)
- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../11-pn-junction-equilibrium/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)

---

!!! mascot-welcome "Nova on LEDs and Lasers: When Electrons Get REALLY Excited"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Everything we've studied so far has been about *controlling* electrons. Now we're going to make them *perform*. When an electron falls from the conduction band to the valence band and emits a photon — that's an LED. When a trillion photons do it together, coherently, in phase — that's a laser. Today we learn how semiconductor physics, which started with a boring bar of silicon, lit up the entire world. LEDs: the reason you can read this. Lasers: the reason it arrives over fiber at 400 Gb/s. Let's get excited!

## 17.1 Radiative Recombination: The Photon Factory

In Chapter 10, we catalogued the three recombination mechanisms. **Radiative recombination** — the direct band-to-band process — is the star of this chapter. When an electron in the conduction band and a hole in the valence band recombine directly, energy conservation requires that the bandgap energy be released. In a direct-gap material, momentum conservation can be satisfied without a phonon, and the energy goes into a **photon** with:

\[
h\nu = E_g + \Delta E
\]

where \(\Delta E\) is a small correction from the carrier thermal energy above the band edges (typically a few \(k_BT\)). For practical purposes, the emitted photon wavelength is:

\[
\lambda \approx \frac{hc}{E_g} = \frac{1240 \text{ nm·eV}}{E_g \text{ (eV)}}
\]

This simple equation is the design rule for LED wavelength selection:

| Material | Bandgap (eV) | Peak Wavelength | Color |
|----------|--------------|-----------------|-------|
| InGaN (x=0.15) | ~2.9 | ~430 nm | Violet |
| InGaN (x=0.3) | ~2.5 | ~500 nm | Blue/Green |
| GaAs | 1.42 | ~870 nm | Near-IR |
| InGaAsP (for fiber) | 0.95 | ~1310 nm | Telecom |
| GaSb | 0.72 | ~1720 nm | Mid-IR |

**The direct-bandgap requirement** for efficient LEDs is absolute: in silicon (indirect gap, \(E_g = 1.12\) eV), momentum mismatch suppresses radiative recombination by a factor of \(B_{\text{Si}}/B_{\text{GaAs}} \approx 10^{-5}\). Silicon glows, technically, but with efficiency so low it's useless. Every bright LED you've ever seen uses GaAs, GaN, or another direct-gap compound semiconductor.

---

## 17.2 LED Efficiency Chain

The path from input electrical power to useful output light involves four cascaded efficiency factors. Before examining each, we define the overall **wall-plug efficiency (WPE)** — the ratio of optical output power to electrical input power:

\[
\eta_{\text{WPE}} = \eta_{\text{inj}} \times \eta_{\text{IQE}} \times \eta_{\text{EQE}} / \eta_{\text{inj}} \approx \eta_{\text{IQE}} \times \eta_{\text{LEE}}
\]

Actually, the clean decomposition is:

\[
\eta_{\text{WPE}} = \eta_{\text{inj}} \cdot \eta_{\text{rad}} \cdot \eta_{\text{LEE}}
\]

**Current injection efficiency** \(\eta_{\text{inj}}\): Fraction of injected carriers that enter the active region (quantum well or p-n junction) rather than recombining in the contacts, cladding, or outside the active volume. Well-designed LEDs achieve \(\eta_{\text{inj}} > 0.95\).

**Internal quantum efficiency (IQE)** \(\eta_{\text{IQE}}\): Fraction of electron-hole pairs in the active region that recombine radiatively (emitting photons) rather than non-radiatively (emitting heat via SRH or Auger). The ABC model describes radiative and non-radiative rates:

\[
\eta_{\text{IQE}} = \frac{B n^2}{A n + B n^2 + C n^3}
\]

where:
- \(A\) = Shockley-Read-Hall recombination coefficient (non-radiative, defect-related)
- \(B\) = Bimolecular radiative coefficient (~\(10^{-10}\) cm\(^3\)/s for GaN)
- \(C\) = Auger coefficient (non-radiative, carrier-density-cubed)

IQE peaks at an intermediate carrier density where \(Bn^2\) dominates. At low injection: SRH dominates (IQE rises with current). At high injection: Auger dominates (IQE drops). This **efficiency droop** at high current density is one of the central challenges in high-brightness LED design — particularly for InGaN/GaN blue LEDs.

**Light extraction efficiency (LEE)** \(\eta_{\text{LEE}}\): Fraction of internally generated photons that escape the semiconductor (rather than being trapped by total internal reflection). This is surprisingly low for a flat interface:

\[
\theta_c = \arcsin\!\left(\frac{n_{\text{air}}}{n_{\text{semi}}}\right) \approx \arcsin\!\left(\frac{1}{3.5}\right) \approx 16.6°
\]

The solid angle within the escape cone is \(\Omega_{\text{escape}} = 2\pi(1 - \cos\theta_c) \approx 0.21\) sr, compared to \(4\pi\) sr total. Only about 1/30 of the light escapes through a flat top surface (\(\eta_{\text{LEE,flat}} \approx 1/4n^2 \approx 2\%\) for \(n = 3.5\)).

LED packaging engineers spend enormous effort improving LEE through:
- **Surface texturing**: Roughening the surface to randomize internal reflection angles
- **Flip-chip bonding**: Emit light through the substrate instead of through the metal contacts
- **Chip shaping**: Hexagonal or truncated pyramid geometries eliminate total-internal-reflection trapping
- **Photonic crystal structures**: Distributed Bragg structures that redirect guided modes

Modern high-brightness LEDs achieve \(\eta_{\text{LEE}} > 0.8\) with sophisticated packaging.

!!! mascot-thinking "Nova Thinks: The LED Revolution Required Three Impossible Materials"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    The 2014 Nobel Prize in Physics went to Nakamura, Akasaki, and Amano for the blue LED — specifically for making p-type GaN, which had been "impossible" for 20 years. For white LED lighting to exist, you need red (AlGaInP), green (InGaN), and blue (InGaN) LEDs. Red and green existed by the 1990s; blue required GaN, which couldn't be grown defect-free and couldn't be made p-type. The Nobel committee called it "the LED lamp holds great promise for increasing the quality of life for over 1.5 billion people who lack access to electricity grids." Three decades of persistent research against pessimistic consensus, and now your phone screen and your LED lightbulb owe their existence to it.

---

## 17.3 White LED Technology: The Phosphor Trick

Blue LEDs can power **white LEDs** via **phosphor conversion**. A single InGaN blue LED (450–460 nm) illuminates a phosphor layer (typically cerium-doped yttrium aluminum garnet, Ce:YAG) that absorbs blue photons and re-emits a broad yellow band. The combination of blue (transmitted) and yellow (phosphor-converted) creates the perception of white.

The efficiency of phosphor conversion:

\[
\eta_{\text{Stokes}} = \frac{h\nu_{\text{blue}}}{h\nu_{\text{yellow}}} \times \eta_{\text{QY}} \approx \frac{460}{560} \times 0.9 \approx 0.74
\]

where \(\eta_{\text{QY}}\) is the phosphor quantum yield (~0.9 for good YAG). The Stokes shift (energy loss from blue to yellow) is a fundamental thermodynamic loss that limits white LED efficiency.

White LED performance (at 2024):
- **Best lab devices:** >300 lm/W efficiency
- **Commercial production:** 150–200 lm/W (vs. 15 lm/W for incandescent, 80 lm/W for fluorescent)
- **Lifespan:** 25,000–50,000 hours (vs. 1,000 hours incandescent)
- **Color rendering index (CRI):** 80–95 (excellent for most applications)

The shift to LED lighting represents one of the most rapid and impactful materials transitions in history — estimated to save 2.2 billion tonnes of CO₂ annually compared to incandescent technology.

---

## 17.4 From LED to Laser: Population Inversion

An LED emits light by **spontaneous emission** — photons produced randomly when electron-hole pairs recombine. The photons have random phases, directions, and (somewhat) random frequencies. A **laser** (Light Amplification by Stimulated Emission of Radiation) produces coherent light through **stimulated emission**.

Stimulated emission occurs when an existing photon (of frequency \(\nu\)) encounters an excited electron that is ready to recombine at energy \(h\nu\). The photon "stimulates" the electron to emit another photon — a perfect copy, with the same frequency, phase, polarization, and direction. Two photons in → two photons out (plus the stimulated photon). The new photon is cloned from the original.

For stimulated emission to dominate over absorption, we need more electrons in excited states (conduction band) than in ground states (valence band at the relevant energy) — **population inversion**. In semiconductors, this requires the quasi-Fermi level separation to exceed the photon energy:

\[
F_n - F_p > h\nu
\]

Population inversion in semiconductors requires heavy carrier injection — equivalent to requiring the quasi-Fermi level splitting to exceed \(E_g\). This is achieved in a forward-biased p\(^+\)-n\(^+\) junction at high current densities.

---

## 17.5 Optical Gain and Threshold Current

The **optical gain** \(g\) (units: cm\(^{-1}\)) describes how much a wave is amplified per unit length. For a semiconductor at carrier density \(n\):

\[
g(n) = g_0 \ln\!\left(\frac{n}{n_{\text{tr}}}\right) \approx a(n - n_{\text{tr}}) \quad \text{(linear approximation)}
\]

where \(n_{\text{tr}}\) is the **transparency carrier density** (gain = 0, absorption = stimulated emission) and \(a\) is the differential gain coefficient. For GaAs quantum wells: \(n_{\text{tr}} \approx 10^{18}\) cm\(^{-3}\) and \(a \approx 3 \times 10^{-16}\) cm\(^2\).

**Threshold condition:** In a laser cavity, gain must overcome losses (absorption, scattering, and mirror loss) for lasing to begin:

\[
\Gamma g_{\text{th}} = \alpha_i + \alpha_m
\]

where:
- \(\Gamma\) = optical confinement factor (fraction of optical mode in the gain region)
- \(\alpha_i\) = internal loss (absorption, scattering) per unit length
- \(\alpha_m = \frac{1}{2L}\ln\!\left(\frac{1}{R_1 R_2}\right)\) = mirror loss (for a Fabry-Perot cavity of length \(L\) with mirror reflectivities \(R_1\), \(R_2\))

The **threshold current density** \(J_{\text{th}}\):

\[
J_{\text{th}} = \frac{q d}{\eta_i \tau} \cdot n_{\text{th}}
\]

where \(d\) is the active region thickness, \(\eta_i\) is the injection efficiency, and \(n_{\text{th}}\) is the carrier density at threshold. For double heterostructure lasers: \(J_{\text{th}} \approx 500\)–2000 A/cm\(^2\). For quantum well lasers: \(J_{\text{th}} \approx 50\)–200 A/cm\(^2\).

Above threshold, stimulated emission dominates — additional injected carriers go entirely into additional photons. The laser output power increases linearly with current above threshold:

\[
P_{\text{out}} = \eta_d \cdot \frac{h\nu}{q} \cdot (I - I_{\text{th}})
\]

where \(\eta_d\) is the differential quantum efficiency (fraction of above-threshold carriers that become output photons).

---

## 17.6 Laser Cavity Types

### Fabry-Perot Cavity

The simplest laser cavity: a cleaved semiconductor bar with flat parallel end faces. The cleaved faces act as partially reflective mirrors (reflectivity \(R = ((n-1)/(n+1))^2 \approx 0.30\) for GaAs). Resonant modes are those for which the cavity length is a multiple of half-wavelengths:

\[
L = m \frac{\lambda}{2n}
\]

Multiple modes can lase simultaneously — the Fabry-Perot laser has a **multi-mode spectrum** with mode spacing \(\Delta\lambda = \lambda^2/(2nL)\). For \(L = 300\) μm: \(\Delta\lambda \approx 0.3\) nm. Multi-mode emission limits coherence and dispersion in fiber transmission.

### Distributed Bragg Reflector (DBR) Laser

A DBR laser replaces one or both cleaved facets with a **distributed Bragg reflector** — a periodic grating etched into the waveguide region, with period \(\Lambda = \lambda/(2n))\). The grating reflects selectively at the Bragg wavelength, providing high reflectivity (\(R > 0.99\)) for a narrow wavelength band. This creates single-frequency lasing without external mode selection.

### Distributed Feedback (DFB) Laser

In a **DFB laser**, the grating runs along the entire length of the gain region (not just at the ends). The grating provides both frequency selection and distributed feedback. DFB lasers have excellent single-mode behavior with side-mode suppression ratios (SMSR) > 40 dB and linewidths of ~1–100 MHz. They are the dominant laser type for dense wavelength-division multiplexing (DWDM) fiber communications — every modern data center uses hundreds to thousands of DFB lasers.

### Vertical-Cavity Surface-Emitting Laser (VCSEL)

The **VCSEL** emits light perpendicular to the wafer surface (unlike all previous lasers, which emit edge-on). The VCSEL structure from bottom to top:

1. n-type GaAs substrate
2. Bottom DBR mirror (20–30 pairs of AlAs/Al\(_{0.3}\)Ga\(_{0.7}\)As quarter-wavelength layers, \(R > 0.999\))
3. Active region (3–5 InGaAs quantum wells in a 1λ cavity)
4. Top DBR mirror (15–20 pairs, partially transmitting, \(R \approx 0.99\))
5. Metal contact ring

VCSEL advantages:
- Circular beam (easy fiber coupling, no lens needed)
- On-wafer testability (no cleaving required)
- 2D arrays possible (thousands of VCSELs on a single chip)
- Low threshold current (1–2 mA) → low power
- High modulation bandwidth (>25 Gb/s per channel)

VCSELs at 850 nm are the light source for virtually all short-range (< 300 m) data center interconnects (100GbE, 400GbE, 800GbE). VCSELs at 940 nm power Face ID (3D sensing) on iPhones — tens of millions of phones per year.

---

## 17.7 Double Heterostructure Lasers and SOAs

The **double heterostructure (DH) laser** was the breakthrough that made practical semiconductor lasers possible (Alferov and Kroemer shared the 2000 Nobel Prize partly for this). The DH structure uses wider-bandgap cladding layers on both sides of a thin active region, accomplishing two things simultaneously:

1. **Carrier confinement:** The wider-bandgap cladding creates potential barriers that confine carriers (electrons and holes) in the thin active layer, dramatically increasing carrier density and gain efficiency
2. **Optical confinement:** The higher refractive index of the lower-bandgap active layer acts as a waveguide core, confining the optical mode and maximizing the overlap between photons and carriers

The combination reduced threshold current density by 100× compared to early homojunction lasers, making room-temperature CW operation possible for the first time (demonstrated by Alferov in 1970).

A **semiconductor optical amplifier (SOA)** is a laser diode operated below threshold (no sustained lasing) with anti-reflection coatings on both facets. Incident optical signals are amplified by stimulated emission as they propagate through the gain medium. SOAs are used in photonic integrated circuits, optical switching, and wavelength conversion in fiber networks. Unlike erbium-doped fiber amplifiers (EDFAs), SOAs can be integrated on-chip and operate at arbitrary wavelengths determined by the semiconductor bandgap.

!!! mascot-celebration "Nova Celebrates: Physics That Lights the World"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    Everything in this chapter — from the photon emission rate to VCSEL mode spacing to the Stokes shift in phosphors — is direct applications of the physics we've built over 17 chapters. Fermi-Dirac statistics determines population inversion. Band structure determines emission wavelength. Minority carrier lifetime determines IQE. Heterojunction band offsets enable the DH laser. The physics wasn't invented for optoelectronics — it was just *applied* there, with spectacular results. LEDs and lasers together represent probably $500 billion per year of economic activity. Let's get excited about that.

<details markdown="1">
<summary>#### MicroSim: LED Efficiency and Laser Threshold Explorer</summary>

**sim-id:** `led-laser-efficiency-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Two-mode interactive simulation. LED mode: ABC model efficiency curve showing IQE vs. current density with A, B, C coefficients adjustable (demonstrates efficiency droop). Light output vs. current (L-I curve) for both LED (sublinear, no threshold) and laser (kink at threshold, linear above). Laser mode: Shows threshold condition graphically (gain vs. loss curves), threshold carrier density, and L-I curve above threshold.

**Controls:**
- Radio: LED mode / Laser mode
- Sliders: A (SRH), B (radiative), C (Auger) coefficients
- Slider: Mirror reflectivity \(R_1 = R_2\) (0.3–0.99)
- Slider: Cavity length L (50–500 μm)
- Checkbox: Show single QW vs. bulk gain curves

**Key Learning Objectives:**
- L2 (Understand): Explain the efficiency droop in LEDs from the ABC model
- L3 (Apply): Calculate threshold current density from gain-loss threshold condition
- L4 (Analyze): Compare L-I curves for LEDs, lasers, and VCSELs
- L5 (Evaluate): Choose appropriate light source for a given application

</details>

---

## Summary

This chapter covered semiconductor light sources:

- **Radiative recombination** requires direct-gap materials; emitted photon wavelength \(\lambda = 1240/E_g\) nm
- **LED efficiency chain:** \(\eta_{\text{WPE}} = \eta_{\text{inj}} \cdot \eta_{\text{IQE}} \cdot \eta_{\text{LEE}}\); LEE limited by total internal reflection to ~2% flat surface, improved to >80% with packaging
- **Efficiency droop** (IQE decrease at high injection) from Auger recombination limits high-brightness LED performance
- **White LEDs:** Blue InGaN + Ce:YAG phosphor (Stokes shift loss); > 200 lm/W commercial, > 300 lm/W lab
- **Population inversion** requires \(F_n - F_p > h\nu\); heavy forward bias injection in DH structure
- **Threshold condition:** \(\Gamma g_{\text{th}} = \alpha_i + \alpha_m\)
- **Fabry-Perot:** Multi-mode, simple, low cost. **DFB:** Single mode, narrow linewidth, DWDM standard. **VCSEL:** Surface-emitting, circular beam, 2D arrays, data center workhorses
- **DH lasers:** Simultaneous carrier and optical confinement → 100× lower threshold than homojunction

## Key Equations

\[
\lambda \approx \frac{1240 \text{ nm}}{E_g \text{ (eV)}}, \quad \eta_{\text{IQE}} = \frac{Bn^2}{An + Bn^2 + Cn^3}
\]

\[
\Gamma g_{\text{th}} = \alpha_i + \frac{1}{2L}\ln\!\left(\frac{1}{R_1 R_2}\right), \quad P_{\text{out}} = \eta_d \frac{h\nu}{q}(I - I_{\text{th}})
\]
