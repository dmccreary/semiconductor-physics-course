---
title: "P-N Junction: Dynamics, Breakdown, and Heterojunctions"
description: Avalanche and Zener breakdown, junction capacitances, switching transients, and heterojunction band alignment for advanced device structures
generated_by: claude skill chapter-content-generator
date: 2026-06-03 16:30:00
version: 0.08
---

# P-N Junction: Dynamics, Breakdown, and Heterojunctions

## Summary

This chapter extends p-n junction analysis to dynamic operation and extreme bias conditions. Avalanche breakdown through impact ionization and Zener breakdown through band-to-band tunneling set the reverse-bias limits of diodes and form the basis for voltage-reference and protection devices. Junction capacitance has two components — the depletion capacitance (voltage-tunable) and diffusion capacitance — both essential for high-frequency and switching analysis. The small-signal diode model, reverse recovery time, and charge-storage transient behavior determine switching speed. The chapter closes with heterojunctions: band alignment rules (Anderson's rule), the three heterojunction types, and their band discontinuities — concepts critical to HBTs, HEMTs, quantum-well lasers, and solar cells in later chapters.

## Concepts Covered

This chapter covers the following 29 concepts from the learning graph:

1. Avalanche Breakdown
2. Impact Ionization
3. Ionization Coefficients
4. Multiplication Factor
5. Zener Breakdown
6. Zener Effect
7. Zener Voltage
8. Junction Capacitance
9. Depletion Capacitance
10. Diffusion Capacitance
11. Small-Signal Diode Model
12. Diode Conductance
13. Transient Response Diode
14. Charge Storage in Diode
15. Reverse Recovery Time
16. Minority Carrier Storage
17. Diode Switching Speed
18. Heterojunction
19. Band Alignment Types
20. Type I Heterojunction
21. Type II Heterojunction
22. Type III Heterojunction
23. Anderson Rule
24. Band Discontinuity
25. Conduction Band Offset
26. Valence Band Offset
27. Graded Heterojunction
28. Work Function
29. Electron Affinity

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Quantum Mechanics: Wave Equations and Atomic Structure](../04-quantum-mechanics/index.md)
- [Chapter 8: Carrier Drift, Mobility, and Scattering Mechanisms](../08-carrier-drift-mobility/index.md)
- [Chapter 10: Generation, Recombination, Continuity, and Optical Processes](../10-generation-recombination/index.md)
- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../11-pn-junction-equilibrium/index.md)

---

!!! mascot-welcome "Nova on Breakdown: Sometimes Electrons Just Snap"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    We ended Chapter 11 with a polite, well-behaved diode that gently saturates under reverse bias. Today we push it until it breaks — and then we learn that "breaking" can be very, very useful. Avalanche multiplication, Zener tunneling, charge-storage transients, and the elegant physics of heterojunction band alignment all await. Nova's professional advice: controlled breakdown is a feature, not a bug.

## 12.1 Avalanche Breakdown and Impact Ionization

When a reverse-biased p-n junction has a sufficiently large electric field across the depletion region, carriers can gain enough kinetic energy between collisions to ionize lattice atoms upon collision. This creates new electron-hole pairs — which are themselves accelerated by the field, creating more pairs — a self-sustaining chain reaction called **avalanche multiplication**.

The quantitative description uses the **ionization coefficients** \(\alpha_n\) and \(\alpha_p\) (units: cm\(^{-1}\)), defined such that \(\alpha_n\) is the number of electron-hole pairs created per unit length by an electron drifting through the field, and similarly for holes. These coefficients are highly field-dependent:

\[
\alpha_n, \alpha_p \propto \exp\!\left(-\frac{b}{\mathcal{E}}\right)
\]

where \(b\) is a material-dependent constant (~1.8 × 10\(^6\) V/cm for silicon electrons). Because of this exponential field dependence, avalanche multiplication turns on extremely abruptly as the field increases.

The **multiplication factor** \(M\) quantifies current amplification. For a one-sided abrupt junction (p\(^+\)n), where only electrons traverse the full depletion width \(W\):

\[
M = \frac{1}{1 - \int_0^W \alpha_n\, dx}
\]

**Avalanche breakdown** occurs when \(M \to \infty\), i.e., when:

\[
\int_0^W \alpha_n\, dx = 1
\]

The empirical approximation for the breakdown voltage of a one-sided abrupt junction in silicon:

\[
V_{\text{BD}} \approx 60 \left(\frac{E_g}{1.1}\right)^{3/2} \left(\frac{N_B}{10^{16}}\right)^{-3/4} \text{ V}
\]

where \(N_B\) is the background doping (lightly doped side) in cm\(^{-3}\). For \(N_B = 10^{16}\) cm\(^{-3}\): \(V_{\text{BD}} \approx 60\) V. For \(N_B = 10^{15}\) cm\(^{-3}\): \(V_{\text{BD}} \approx 190\) V.

The temperature coefficient of avalanche breakdown is **positive** (+0.1%/°C approximately): higher temperature → more phonon scattering → carriers lose energy more quickly → need higher field to achieve impact ionization threshold.

---

## 12.2 Zener Breakdown

In heavily doped junctions, a different breakdown mechanism operates at lower voltages: **band-to-band tunneling** (the **Zener effect**). When the conduction band on the n-side and the valence band on the p-side are brought into proximity by a thin depletion region (due to heavy doping), electrons can quantum-mechanically tunnel through the bandgap barrier.

The tunneling probability scales as:

\[
T \propto \exp\!\left(-\frac{4\sqrt{2m^* E_g^3}}{3q\hbar \mathcal{E}}\right)
\]

Zener tunneling becomes significant when the depletion width \(W \lesssim 10\) nm, which requires doping \(N \gtrsim 10^{18}\) cm\(^{-3}\). The resulting **Zener voltage** is typically 1–5 V.

The temperature coefficient of Zener breakdown is **negative**: higher temperature → narrower effective bandgap → higher tunneling probability → breakdown at lower voltage. This sign is opposite to avalanche breakdown, which provides a practical diagnostic:

| Mechanism | Voltage Range | Temperature Coefficient |
|-----------|--------------|------------------------|
| Zener tunneling | \(V_Z < 5\) V | Negative (~−2 mV/°C) |
| Avalanche | \(V_Z > 7\) V | Positive (~+2 mV/°C) |
| Mixed | 5–7 V | Near zero |

Diodes with \(V_Z \approx 5.6\) V have nearly zero temperature coefficient — useful for voltage references.

!!! mascot-thinking "Nova Thinks: Zener Diodes Are Named for the Wrong Mechanism"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    Here's a delightful industry irony: "Zener diodes" in circuit applications are mainly rated above 6 V, which means they primarily operate by **avalanche breakdown**, not Zener tunneling. The Zener effect (tunneling) dominates below ~5 V. So the diodes named after Zener mostly work by a mechanism Zener didn't discover. This is not unique in physics — Zener got the credit because the practical device came from his theoretical framework, even if avalanche multiplication (explained by McKay and McAfee a few years later) handles the heavy lifting in most commercial parts. History is complicated.

---

## 12.3 Junction Capacitance: Depletion Capacitance

The p-n junction has two distinct capacitance components that are critical for high-frequency and switching circuit analysis. We examine each in turn.

**Depletion capacitance** (also called junction capacitance or space-charge capacitance) arises from the charge stored in the depletion region. When voltage changes by \(dV\), the depletion width changes by \(dW\), changing the stored charge by \(dQ = qN_D dW \cdot A\). The resulting capacitance per unit area is:

\[
C_j = \frac{dQ}{dV} = \varepsilon_s \frac{A}{W(V)} = A\sqrt{\frac{q\varepsilon_s}{2(V_{bi} - V)} \cdot \frac{N_A N_D}{N_A + N_D}}
\]

This can be written as:

\[
C_j(V) = \frac{C_{j0}}{\left(1 - V/V_{bi}\right)^m}
\]

where \(C_{j0}\) is the zero-bias capacitance, \(V\) is the applied voltage (positive for forward), and the grading coefficient \(m = 1/2\) for an abrupt junction or \(m = 1/3\) for a linearly graded junction.

The **voltage-tunable** capacitance makes p-n junctions useful as **varactor diodes** (voltage-variable capacitors) for frequency synthesis, tunable filters, and RF oscillators. A reverse-biased varactor spans a capacitance ratio of ~4–10× over its usable voltage range.

For a one-sided abrupt junction (\(N_A \gg N_D\)):

\[
\frac{1}{C_j^2} = \frac{2(V_{bi} - V)}{q\varepsilon_s N_D A^2}
\]

Plotting \(1/C_j^2\) vs. reverse voltage \(V_R\) gives a straight line — the classic **C-V measurement** technique for extracting doping profile from the slope and \(V_{bi}\) from the x-intercept.

---

## 12.4 Diffusion Capacitance

Under forward bias, minority carriers are stored in the neutral regions near the depletion edges. This stored minority charge \(Q_{\text{stored}}\) changes with forward voltage, contributing a **diffusion capacitance**:

\[
C_d = \frac{dQ_{\text{stored}}}{dV}
\]

The minority charge stored in the n-side (holes) is:

\[
Q_p = q A \int_{x_n}^{\infty} \delta p(x)\, dx = q A \cdot \delta p(x_n) \cdot L_p = q A \cdot p_{n0}(e^{qV/k_BT} - 1) L_p
\]

Taking the derivative with respect to \(V\):

\[
C_d = \frac{q^2}{k_BT} \cdot A \cdot p_{n0} L_p \cdot e^{qV/k_BT} = \frac{\tau_p}{V_T} \cdot \frac{I}{2} \propto I
\]

The diffusion capacitance is **proportional to forward current** and can be enormous at high forward bias. For a diode carrying 1 mA with \(\tau_p = 1\) μs, \(C_d \approx 40\) nF — roughly 1000× larger than a typical depletion capacitance.

The **small-signal diode model** combines both capacitances:

\[
r_d = \frac{dV}{dI} = \frac{n k_BT}{qI} = \frac{n V_T}{I}
\]

\[
C_{\text{total}} = C_j + C_d
\]

At low frequencies or DC, diffusion capacitance dominates in forward bias. At reverse bias and high frequencies, only depletion capacitance matters. The transition frequency \(f_T\) where the reactive impedance equals \(r_d\) sets the bandwidth of a diode in a circuit.

---

## 12.5 Switching Transients: Charge Storage and Reverse Recovery

When a forward-biased diode is switched off by applying reverse voltage, the stored minority charge doesn't disappear instantaneously. The stored charge must be removed by:
1. **Extraction**: Reverse current flows to sweep out minority carriers
2. **Recombination**: Stored carriers recombine within lifetime \(\tau\)

This process is described by the **reverse recovery time** \(t_{rr}\) — the time required for the diode current to fall to 10% of its reverse current value after turn-off. Reverse recovery has two phases:

- **Storage phase** (\(t_s\)): Current is still flowing in reverse, sweeping out stored charge
- **Recovery phase** (\(t_r\)): Current decays as remaining charge recombines

The total reverse recovery time is:

\[
t_{rr} = t_s + t_r \approx \tau_p \ln\!\left(\frac{I_F + I_R}{I_R}\right) + \sqrt{\frac{2\tau_p}{\pi} \cdot \frac{I_R}{I_F + I_R}} \cdot \tau_p
\]

For a power diode with \(\tau_p = 1\) μs and switching between \(I_F = 1\) A and \(I_R = 10\) A: \(t_{rr} \sim 0.5\)–\(1\) μs. This sets the maximum switching frequency for a rectifier.

**Fast recovery diodes** intentionally use gold or platinum doping to reduce \(\tau_p\) to nanoseconds, enabling operation at MHz frequencies. The tradeoff: lower lifetime means higher leakage current (larger \(I_s\)), since \(\tau_p\) appears in both places.

!!! mascot-warning "Nova Warns: Reverse Recovery Kills High-Frequency Power Converters"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    In switching power supplies operating at 100 kHz–1 MHz, diode reverse recovery is the dominant source of switching loss. During recovery, the diode simultaneously conducts reverse current and supports voltage — the overlap is power loss. SiC Schottky diodes (which have essentially zero minority carrier storage — they're majority-carrier devices) have revolutionized power electronics precisely because their recovery loss is nearly zero. Understanding why bipolar diodes have reverse recovery — and why Schottky diodes don't — explains one of the biggest materials transitions in 21st century power electronics.

---

## 12.6 Heterojunctions: Joining Different Semiconductors

So far we've analyzed junctions between p-type and n-type regions of the *same* semiconductor. **Heterojunctions** are interfaces between two different semiconductor materials — for example, GaAs/AlGaAs, Si/SiGe, or GaN/AlGaN. They are the basis for high-performance transistors (HBTs, HEMTs), quantum-well lasers, and multijunction solar cells.

The key challenge with heterojunctions is that the two materials have different bandgaps, electron affinities, and work functions, so the band alignment at the interface is non-trivial and has enormous consequences for device behavior.

### 12.6.1 Electron Affinity, Work Function, and Anderson's Rule

Two quantities characterize the energy scale of a semiconductor:

- **Electron affinity** \(\chi\): Energy gained by adding an electron to the conduction band minimum from the vacuum level. Measured at the surface.
- **Work function** \(\phi_s\): Energy required to remove an electron from the Fermi level to vacuum. For a semiconductor: \(\phi_s = \chi + (E_C - E_F)/q\).

**Anderson's rule** (1960) predicts the band alignment at a heterojunction by assuming the vacuum level is continuous across the interface:

\[
\Delta E_C = \chi_1 - \chi_2 \quad \text{(conduction band offset)}
\]

\[
\Delta E_V = (E_{g,2} - E_{g,1}) - \Delta E_C \quad \text{(valence band offset)}
\]

For the GaAs/AlGaAs system with \(x = 0.3\):
- \(\Delta E_C \approx 0.67 \times \Delta E_g \approx 0.67 \times 0.37 \approx 0.25\) eV
- \(\Delta E_V \approx 0.33 \times \Delta E_g \approx 0.12\) eV

Anderson's rule is a useful first estimate but not highly accurate — interface dipoles, strain, and polar surface orientation all modify the true offsets. Experimental measurements (XPS, C-V, internal photoemission) are needed for precise values.

### 12.6.2 Three Types of Band Alignment

Based on the relative positions of the conduction and valence bands, heterojunctions fall into three types:

**Type I (straddling gap):** The wider-gap semiconductor's conduction band is above the narrow-gap's \(E_C\), and the valence band is below the narrow-gap's \(E_V\). The narrow-gap material is "inside" — its band gap is straddled. Both electrons and holes are confined in the narrow-gap layer.

*Example:* GaAs/AlGaAs, InGaAs/InP, GaN/AlGaN. Used in quantum-well lasers (both carriers confined → high optical gain), quantum well infrared photodetectors, and HEMTs.

**Type II (staggered gap):** Both the conduction band and valence band offset in the same direction. Electrons and holes are confined in *different* spatial layers, creating spatially indirect transitions. Radiative recombination is slowed (carriers must tunnel or overcome the spatial separation).

*Example:* InAs/GaSb, Si/SiGe (in some configurations). Used in hot-carrier solar cells, cascade lasers (QCL), and novel tunnel FETs.

**Type III (broken gap or misaligned gap):** The conduction band of one material overlaps with the valence band of the other. The semiconductor with the higher conduction band has its conduction band edge *below* the valence band edge of the other. Carriers can transfer from one material to another without crossing any barrier.

*Example:* InAs/GaSb (extreme case). Creates semi-metallic interfaces with very high carrier densities. Basis for some III-V tunnel diodes.

| Type | Common Name | Band Offset Geometry | Typical Use |
|------|------------|----------------------|-------------|
| Type I | Straddling | Both offsets contain narrow-gap | Lasers, QWIPs, HEMTs |
| Type II | Staggered | Same-direction offsets, electrons and holes separated | QCLs, interband tunneling |
| Type III | Broken gap | Conduction band overlaps valence band | Tunnel transistors, semimetals |

### 12.6.3 Graded Heterojunctions and Band-Edge Engineering

A sharp heterojunction has a discontinuous conduction band step that can impede electron transport — a "speed bump" in the conduction band. **Graded heterojunctions** smooth this transition by compositionally grading the alloy over a distance of 10–100 nm, converting the abrupt step into a quasi-electric field that actually *aids* transport:

\[
\mathcal{E}_{\text{quasi}} = -\frac{1}{q}\frac{dE_C}{dx}
\]

In a compositionally graded AlGaAs/GaAs heterojunction, the grading creates a built-in quasi-field pointing toward the GaAs base — which is exactly the direction of minority electron flow in an HBT. The result: a "ballistic launching ramp" that accelerates minority carriers across the base, dramatically increasing transistor speed.

!!! mascot-celebration "Nova Celebrates: Heterojunctions Unlock the Zoo of Compound Devices"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    With heterojunctions in your toolkit, you can now think about confining specific carrier types in specific layers, bending bands with composition gradients, and engineering optical transitions at designed energies. Everything you've learned — band structure, effective mass, quasi-Fermi levels, minority carrier transport, generation-recombination — applies to these structures, but now with spatial composition as an additional design variable. The result: HBTs that operate at hundreds of GHz, quantum-cascade lasers that emit at terahertz frequencies, and solar cells that capture the entire solar spectrum. Heterojunctions are where semiconductor physics meets materials science, and the view is spectacular.

<details markdown="1">
<summary>#### MicroSim: Heterojunction Band Alignment Visualizer</summary>

**sim-id:** `heterojunction-band-alignment`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive band alignment tool. User selects two semiconductor materials from a dropdown (Si, Ge, GaAs, AlAs, InAs, InP, GaN, AlN, ZnO, CdTe) and the tool calculates and displays the band diagram at their interface using tabulated electron affinities and bandgaps. Shows Anderson's rule calculation, labels \(\Delta E_C\) and \(\Delta E_V\), and identifies the heterojunction type (I, II, or III). An alloy composition slider allows exploring the AlGaAs system continuously.

**Controls:**
- Dropdown: Semiconductor 1 (material A)
- Dropdown: Semiconductor 2 (material B)
- Slider: Alloy composition (for AlGaAs: 0 to 1 Al fraction)
- Dropdown: Doping type (n/p) for each side
- Checkbox: Show vacuum level reference

**Key Learning Objectives:**
- L2 (Understand): Identify Type I, II, III alignment from the band diagram
- L3 (Apply): Calculate band offsets using Anderson's rule
- L4 (Analyze): Predict where electrons and holes are confined in a Type I system

</details>

---

## Summary

This chapter extended p-n junction physics into dynamic and exotic regimes:

- **Avalanche breakdown** occurs when the impact ionization integral equals unity; breakdown voltage scales as \(N_D^{-3/4}\); positive temperature coefficient
- **Zener breakdown** (band-to-band tunneling) operates at \(V < 5\) V in heavily doped junctions; negative temperature coefficient
- **Depletion capacitance** \(C_j \propto (V_{bi} - V)^{-1/2}\) enables voltage-tunable varactors; C-V profiling extracts doping
- **Diffusion capacitance** \(C_d \propto I\) dominates at high forward bias and determines switching bandwidth
- **Reverse recovery time** limits diode switching speed; set by minority carrier lifetime \(\tau\)
- **Anderson's rule** predicts band offsets from electron affinity differences; heterojunction type (I/II/III) determines carrier confinement geometry
- **Graded heterojunctions** convert band steps into quasi-electric fields that aid carrier transport

## Key Equations

\[
C_j = \frac{C_{j0}}{(1-V/V_{bi})^m}, \quad m = 1/2 \text{ (abrupt)}, \quad m = 1/3 \text{ (graded)}
\]

\[
C_d = \frac{\tau_p}{V_T} \cdot \frac{I_F}{2} \quad \text{(diffusion capacitance ∝ current)}
\]

\[
\Delta E_C = \chi_1 - \chi_2 \quad \text{(Anderson's rule, conduction band offset)}
\]
