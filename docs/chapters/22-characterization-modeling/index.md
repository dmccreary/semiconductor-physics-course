---
title: Device Characterization and Compact Modeling
description: Electrical and optical characterization methods, structural analysis, SPICE compact models, semiconductor noise, tunneling devices, and ballistic transport
generated_by: claude skill chapter-content-generator
date: 2026-06-03 21:30:00
version: 0.08
---

# Device Characterization and Compact Modeling

## Summary

This final chapter connects the physics developed throughout the course to the experimental and computational tools used in research and industry. Electrical characterization begins with I-V and C-V measurements for extracting device parameters, Hall measurements for bulk transport properties, four-point probe for sheet resistance, and DLTS for trap characterization. Optical techniques — photoluminescence, electroluminescence, and Raman spectroscopy — probe recombination and crystal quality. Structural analysis by TEM, SEM, SIMS, and Auger electron spectroscopy maps defects, interfaces, and dopant profiles at atomic resolution. Compact models (SPICE Level-1 MOSFET, BSIM, Ebers-Moll) translate physical device behavior into circuit-simulator parameters; small-signal and large-signal equivalent circuits enable AC and transient analysis. Noise in semiconductor devices — thermal, shot, and flicker noise, combined into a noise figure — is analyzed for circuit-level impact. The chapter closes with quantum transport phenomena: band-to-band tunneling, the Esaki tunnel diode, resonant tunneling diodes with negative differential resistance, and ballistic transport in ultra-short devices.

## Concepts Covered

This chapter covers the following 31 concepts from the learning graph:

1. Read Noise
2. Device Characterization Methods
3. I-V Measurement
4. C-V Measurement
5. Hall Measurement
6. Four-Point Probe
7. DLTS Technique
8. Optical Characterization
9. Photoluminescence Spectroscopy
10. Electroluminescence
11. Raman Spectroscopy
12. Transmission Electron Microscopy
13. Scanning Electron Microscopy
14. Secondary Ion Mass Spectrometry
15. Auger Electron Spectroscopy
16. SPICE Compact Models
17. Level-1 MOSFET Model
18. BSIM Model
19. Small-Signal Equivalent Circuit
20. Large-Signal Device Model
21. Noise in Semiconductor Devices
22. Thermal Noise
23. Shot Noise
24. Flicker Noise
25. Noise Figure
26. Band-to-Band Tunneling
27. Esaki Tunnel Diode
28. Resonant Tunneling Diode
29. Double Barrier Structure
30. Negative Differential Resistance
31. Ballistic Transport

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Quantum Mechanics: Wave Equations and Atomic Structure](../04-quantum-mechanics/index.md)
- [Chapter 9: Carrier Diffusion, Transport Theory, and Electrical Measurements](../09-carrier-diffusion-transport/index.md)
- [Chapter 13: Metal-Semiconductor Contacts and MOS Physics](../13-metal-semiconductor-mos/index.md)
- [Chapter 14: Bipolar Junction Transistors](../14-bipolar-transistors/index.md)
- [Chapter 15: JFET, MESFET, and Long-Channel MOSFET Fundamentals](../15-jfet-mesfet-mosfet/index.md)
- [Chapter 17: Optoelectronic Sources: LEDs and Laser Diodes](../17-leds-laser-diodes/index.md)
- [Chapter 20: Strained Silicon, 2D Materials, and Power/Microwave Devices](../20-strained-si-2d-power/index.md)

---

!!! mascot-welcome "Nova on the Final Chapter: Measuring What We've Built, Modeling What We Can't See"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Twenty-one chapters of semiconductor physics, and it all comes down to this: How do we know if the theory is right? How do we measure a quantum well that's 5 nm thick, or a junction buried 10 nm below the surface? How do we put the physics we've derived into a computer circuit simulator? And what's happening inside a transistor that's smaller than a virus? Welcome to the last chapter: measurement, modeling, and the quantum frontier where classical device physics finally gives way to wave mechanics. Nova is very, very excited to send you off equipped to do actual science.

## 22.1 Electrical Characterization Methods

The most direct window into semiconductor device behavior is the electrical measurement. Before choosing an appropriate measurement, define what parameter you're extracting and which combination of terminal voltages provides the most direct measurement.

### 22.1.1 I-V Measurement

The **current-voltage (I-V) characteristic** is the foundational measurement for every two-terminal and multi-terminal device. For a MOSFET:

- **Transfer characteristic** (\(I_D\) vs. \(V_{GS}\) at fixed \(V_{DS}\)): Extracts threshold voltage (linear extrapolation at peak \(g_m\)), subthreshold slope, and ON/OFF ratio
- **Output characteristic** (\(I_D\) vs. \(V_{DS}\) at multiple \(V_{GS}\)): Extracts saturation current, channel-length modulation \(\lambda\) (from slope in saturation), and Early voltage

Semiconductor parameter analyzers (e.g., Keysight B1500A, Tektronix 4200-SCS) simultaneously source voltage, measure current, and sweep parameters. Modern precision: sub-fA current measurement, 1 μV voltage resolution.

**MOSFET parameter extraction from I-V:**

- **\(V_T\)**: Linear extrapolation of \(\sqrt{I_D}\) vs. \(V_{GS}\) (at constant \(V_{DS}\) in saturation); x-intercept gives \(V_T\)
- **\(\mu_{\text{eff}}(V_{GS})\)**: Extracted from gm/(C_ox W/L) in the triode region
- **\(\lambda\)**: Slope of \(I_D\) vs. \(V_{DS}\) in saturation divided by \(I_D\)
- **Subthreshold slope S**: Slope of \(\log(I_D)\) vs. \(V_{GS}\) below threshold

**Diode I-V** reveals: ideality factor n from slope (\(\partial V/\partial(\log I) = n \times 60\) mV/decade), saturation current \(I_s\) from extrapolation, and series resistance \(R_s\) from high-current deviation from exponential.

### 22.1.2 C-V Measurement

Already detailed in Chapter 13. Key extractions from MOS C-V:

- \(C_{\text{ox}} = C_{\text{max}}\) in accumulation → \(t_{\text{ox}} = \varepsilon_{\text{ox}}/C_{\text{ox}}\)
- \(C_{\text{min}}\) → maximum depletion depth → substrate doping
- \(V_{FB}\) → flatband voltage → oxide charge and work function difference
- **Stretch-out** in the depletion region → interface trap density \(D_{it}\)

**Four-point probe:** A linear array of four equally spaced metal probes measures sheet resistance of a doped layer without knowing contact resistance. Two outer probes source current \(I\); two inner probes measure voltage \(V\):

\[
R_\square = \frac{\pi}{\ln 2} \cdot \frac{V}{I} \approx 4.532 \frac{V}{I}
\]

Four-point probe is used daily in every fab to monitor implant and diffusion uniformity.

### 22.1.3 DLTS: Deep Level Transient Spectroscopy

**DLTS** (Deep Level Transient Spectroscopy) maps energy levels of traps and deep defects in the bandgap. The technique applies a voltage pulse to a reverse-biased junction to fill traps, then monitors the capacitance transient as traps emit carriers at thermal rates.

The emission rate:

\[
e_n = \sigma_n v_{\text{th}} N_C \exp\!\left(-\frac{E_C - E_t}{k_BT}\right)
\]

By measuring the transient time constant vs. temperature (Arrhenius plot), both the trap energy \(E_t\) and capture cross-section \(\sigma\) are extracted. DLTS identifies specific point defects (e.g., the E-center in silicon: phosphorus-vacancy pair at \(E_t = E_C - 0.44\) eV) and characterizes radiation damage in space electronics.

---

## 22.2 Optical Characterization Methods

### 22.2.1 Photoluminescence Spectroscopy

**Photoluminescence (PL)** illuminates the semiconductor with above-bandgap laser light, exciting carriers that then recombine and emit photons. The emission spectrum reveals:

- **Bandgap energy** (from peak emission wavelength)
- **Exciton energies** (bound states of electrons and holes, important in quantum wells and 2D materials)
- **Defect/impurity levels** (sub-bandgap emission from trap states)
- **Carrier lifetime** (time-resolved PL measures decay rate → \(\tau\))

Low-temperature PL (4–77 K) resolves fine structure obscured by thermal broadening at room temperature. A liquid nitrogen-cooled InGaAs detector and a spectrometer are the core equipment.

PL is non-destructive and extremely sensitive — detecting impurity concentrations of \(10^{12}\) cm\(^{-3}\) or less. It is the first characterization step for every III-V epitaxial wafer.

### 22.2.2 Electroluminescence

**Electroluminescence (EL)** maps the spatial distribution of light emission from a forward-biased LED or laser diode under electrical injection. Unlike PL (which probes material quality uniformly), EL images reveal:

- Non-uniform current injection (contact problems)
- Regions of high recombination (active layer quality variation)
- Dark spots and dark lines (propagating dislocations)

EL combined with lock-in detection provides sub-mV sensitivity to threshold voltage uniformity in laser arrays.

### 22.2.3 Raman Spectroscopy

**Raman spectroscopy** measures the inelastic scattering of photons from phonons, giving:

- **Strain**: Raman peak position shifts linearly with uniaxial or biaxial strain (~1 cm⁻¹ per 200 MPa in silicon)
- **Crystal quality**: Amorphous vs. crystalline silicon (broad vs. sharp 520 cm⁻¹ peak)
- **Temperature**: Stokes/anti-Stokes ratio gives local temperature (useful for thermal resistance mapping)
- **Composition**: In SiGe alloys, Ge-Ge and Si-Ge phonon frequencies indicate alloy composition

Micro-Raman systems focus to ~1 μm spot size and can map stress fields around contacts, vias, and gate edges in packaged devices.

---

## 22.3 Structural Analysis Methods

### 22.3.1 Transmission Electron Microscopy (TEM)

**TEM** transmits a high-energy electron beam (100–300 kV) through a thin sample (~50 nm) and forms an image from transmitted and diffracted electrons. Resolution: 0.05–0.2 nm — easily resolves atomic columns.

Applications:
- Gate oxide thickness measurement (3–4 nm oxides measured to ±0.1 nm)
- Interface quality at heterostructures (abruptness < 1 monolayer)
- Dislocation imaging in strained layers
- HAADF-STEM (high-angle annular dark field) images heavy atoms brighter — composition mapping

TEM requires destructive sample preparation: focused ion beam (FIB) milling thins a cross-section from the device. Each TEM sample takes 2–4 hours to prepare.

### 22.3.2 Scanning Electron Microscopy (SEM)

**SEM** scans a focused electron beam across the sample surface and detects secondary electrons emitted. SEM provides high-resolution surface imaging (< 5 nm resolution) without thinning:

- **Critical dimension (CD) SEM**: Measures line widths and feature sizes after lithography and etch (automated in-fab monitoring)
- **Failure analysis**: Locates opens, shorts, voids in metal interconnects
- **Voltage contrast**: Secondary electron yield varies with local surface potential (can detect leaking junctions without probing)

### 22.3.3 Secondary Ion Mass Spectrometry (SIMS)

**SIMS** bombards the surface with primary ions (Cs⁺ or O₂⁺), sputtering atoms from the surface. The sputtered ions are mass-analyzed in a spectrometer, giving element-specific signals vs. depth:

- **Dopant depth profiles**: B, P, As, Ge concentrations vs. depth with sub-nm depth resolution and sub-10¹⁴ cm⁻³ detection limit
- **Interface sharpness**: Oxygen at Si/SiO₂ interfaces, Al at AlGaN/GaN
- **Contamination analysis**: Na, Fe, Cu at ppt levels

SIMS is the definitive dopant profiling technique. Its depth resolution is limited by ion mixing (surface atoms knocked deeper by primary ions): typically 1–2 nm for best-case conditions.

### 22.3.4 Auger Electron Spectroscopy

**Auger electron spectroscopy (AES)** uses a focused electron beam to excite core-level electrons; subsequent Auger transitions emit characteristic electrons used for elemental analysis. Lateral resolution ~5 nm makes AES useful for:

- **Silicide phase identification** (TiSi₂ vs. C49/C54 phase transition)
- **Contact analysis** (composition at metal-semiconductor interfaces)
- **Thin film composition profiling** (combined with sputter etching)

---

## 22.4 Compact Models: From Physics to SPICE

**Compact models** are mathematical descriptions of device behavior that run in circuit simulators (SPICE, Cadence Spectre, Synopsys HSPICE). They must:

1. Accurately capture device physics across all operating regions
2. Be computationally efficient (millions of evaluations per simulation)
3. Include process variation and temperature dependence

### 22.4.1 SPICE Level-1 MOSFET Model

The **Level-1 SPICE MOSFET model** implements the long-channel gradual-channel approximation directly:

- Triode: \(I_D = \mu_n C_{\text{ox}} (W/L)[(V_{GS}-V_T)V_{DS} - V_{DS}^2/2]\)
- Saturation: \(I_D = (\mu_n C_{\text{ox}}/2)(W/L)(V_{GS}-V_T)^2(1+\lambda V_{DS})\)
- Subthreshold: exponential \(I_D \propto e^{V_{GS}/nV_T}\)

Level-1 has ~17 parameters (VTO, KP, LAMBDA, PHI, GAMMA, etc.) extracted from measured I-V data. It's adequate for first-order analog design but inaccurate for short-channel devices.

### 22.4.2 BSIM Model

The **BSIM (Berkeley Short-channel IGFET Model)** model family (now BSIM4, BSIM-CMG for FinFETs) captures short-channel physics through dozens to hundreds of parameters:

- Velocity saturation, carrier heating
- DIBL, short-channel \(V_T\) roll-off
- Gate current (tunneling at ultra-thin oxides)
- Quantum mechanical confinement in the channel
- Process variation (local and global \(V_T\) mismatch)
- Self-heating

BSIM parameters are extracted by fitting simultaneously to thousands of I-V and C-V curves for multiple channel lengths and widths at multiple temperatures. A complete BSIM4 parameter set for a production technology node has ~200 model parameters per transistor type.

### 22.4.3 Small-Signal Equivalent Circuit

For RF and analog design, devices are characterized by a **small-signal equivalent circuit** that linearizes around an operating point. The MOSFET small-signal model includes:

- \(g_m\): Transconductance
- \(r_o = 1/\lambda I_D\): Output resistance
- \(C_{gs}\), \(C_{gd}\): Gate-to-source, gate-to-drain capacitances
- \(C_{ds}\): Drain-to-source capacitance
- \(R_g\), \(R_s\), \(R_d\): Gate, source, drain resistances

From these, key RF figures of merit:

\[
f_T = \frac{g_m}{2\pi(C_{gs}+C_{gd})} \quad \text{(transition frequency)}
\]

\[
f_{\max} = \frac{f_T}{2\sqrt{g_{ds}(R_g + R_s) + g_m R_g C_{gd}/(C_{gs}+C_{gd})}}
\]

---

## 22.5 Noise in Semiconductor Devices

All semiconductor devices generate electrical noise — random fluctuations in current and voltage that limit signal detectability. Before examining individual noise types, we define the **noise spectral density** \(S(f)\) (V²/Hz or A²/Hz) — the mean-square noise per unit bandwidth.

### 22.5.1 Thermal (Johnson-Nyquist) Noise

Any resistor R at temperature T generates voltage noise with spectral density:

\[
S_V = 4k_BT R \quad \text{or} \quad S_I = \frac{4k_BT}{R}
\]

This noise is **white** (flat spectrum), fundamental (cannot be reduced without cooling), and present in all resistive elements — including the channel resistance of a MOSFET. The thermal noise of the MOSFET channel:

\[
\overline{i_{nd}^2} = 4k_BT \gamma g_{m0} \Delta f
\]

where \(\gamma\) is a process-dependent factor (~2/3 for long-channel, larger for short-channel due to hot electrons).

### 22.5.2 Shot Noise

**Shot noise** arises from the discrete nature of current — current is not a continuous flow but a stream of individual electrons arriving at random times. A DC current \(I\) has shot noise:

\[
S_I^{\text{shot}} = 2qI
\]

Shot noise is present in: p-n junction diodes, photodetectors (limiting sensitivity), and any device where carriers are injected across a barrier. In a reverse-biased photodiode, the shot noise of the photocurrent \(I_{\text{ph}}\) sets the quantum limit of detection.

**Read noise** in image sensors is dominated by shot noise at high illumination and by flicker noise plus reset noise (kTC noise) at low illumination.

### 22.5.3 Flicker (1/f) Noise

**Flicker noise** (also called 1/f noise or pink noise) has a spectral density that decreases inversely with frequency:

\[
S_V(f) = \frac{K_f V_{GS}^a I_D^b}{f C_{\text{ox}} L^2}
\]

(empirical form; many variants exist). The physical origin: traps at or near the gate oxide interface randomly capture and release channel electrons, modulating the local threshold voltage. The trap emission time constants span many decades → \(1/f\) power law.

Flicker noise is critical in:
- Low-frequency analog circuits (audio, baseband sensors, accelerometers)
- Phase noise in oscillators (flicker noise upconverts to close-in phase noise)
- CMOS image sensors (flicker noise in source follower amplifiers)

PMOS transistors typically have lower flicker noise than NMOS (buried channel in PMOS reduces interface trap interaction). This is why precision analog circuits often use PMOS input stages.

### 22.5.4 Noise Figure

The **noise figure** NF (units: dB) of an amplifier or device characterizes how much noise it adds relative to the signal:

\[
\text{NF} = 10\log_{10}\!\left(\frac{S_{\text{in}}/N_{\text{in}}}{S_{\text{out}}/N_{\text{out}}}\right) = 10\log_{10}(F)
\]

For cascaded stages (Friis formula):

\[
F_{\text{total}} = F_1 + \frac{F_2 - 1}{G_1} + \frac{F_3 - 1}{G_1 G_2} + \cdots
\]

The first stage dominates total noise figure — hence the obsession with low-noise amplifiers (LNAs) at the front of RF receivers. Modern GaAs and InP HEMTs achieve NF < 0.5 dB at 10 GHz — within a factor of 5 of the quantum limit.

---

## 22.6 Tunneling Devices and Ballistic Transport

### 22.6.1 Band-to-Band Tunneling and the Esaki Tunnel Diode

**Band-to-band tunneling** was discussed briefly in Chapter 12 as Zener breakdown. Leo Esaki's 1957 discovery of the **tunnel diode** exploited this quantum-mechanical process to create a device with **negative differential resistance** — current decreasing as voltage increases.

In a heavily doped p\(^+\)-n\(^+\) junction (both sides > \(10^{19}\) cm\(^{-3}\)):
- The depletion region is only 2–5 nm wide — thin enough for significant tunneling
- At equilibrium: filled electron states on the n-side are across from empty states (holes) on the p-side at the same energy — high tunneling probability
- At small forward bias: bands align → maximum tunneling current (the "peak current")
- At moderate forward bias: bands misalign (conduction band n-side vs. bandgap p-side) → minimum tunneling → **valley current** (region of NDR)
- At large forward bias: normal injection current dominates → current rises again

The I-V curve has a characteristic **peak-valley-rise** shape. The **peak-to-valley current ratio (PVCR)** is the key quality metric: PVCR > 10 for GaAs tunnel diodes, > 20 for InAs/AlSb, but < 2 for silicon (weak tunneling due to indirect gap).

Applications: microwave oscillators (NDR used in oscillator circuits), ultra-low-power switching logic (tunnel FETs), and non-volatile memory (TFET-based).

### 22.6.2 Resonant Tunneling Diode

The **resonant tunneling diode (RTD)** uses a quantum well sandwiched between two tunnel barriers. The current through the device peaks sharply when the injected electron energy matches one of the quantum well eigenstates — **resonant tunneling**.

The **double-barrier structure** (barrier-well-barrier) transmits electrons at near-100% efficiency when the incident energy matches a quasi-bound state of the quantum well. The transmission resonance is:

\[
T(E) = \frac{T_1 T_2}{(T_1/2 + T_2/2)^2 + (k L + \phi)^2} \approx 1 \text{ at resonance (for } T_1 = T_2\text{)}
\]

At voltages that shift the resonant level out of alignment, transmission drops — producing **negative differential resistance** (NDR):

\[
\frac{dI}{dV} < 0 \quad \text{(NDR region)}
\]

RTDs have demonstrated oscillation frequencies up to ~1 THz and PVCRs of 2–3 at room temperature in InAs/AlSb material systems. They are used in millimeter-wave oscillators and as non-linear elements in frequency multipliers.

!!! mascot-thinking "Nova Thinks: Quantum Transport Is the Future of Electronics"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    The tunnel diode, the RTD, and quantum transport in general represent the limit where the semi-classical drift-diffusion model breaks down completely. When the device is smaller than the carrier mean free path, electrons don't scatter before reaching the other side — this is **ballistic transport**, and the device is more like a quantum waveguide than a resistor. The conductance of a ballistic 1D conductor (a carbon nanotube, a quantum wire) is quantized: \(G = 2e^2/h \approx 77\) μS per mode. These phenomena were once exotic physics demonstrations. As transistors approach 1 nm, they become engineering reality. The same Schrödinger equation you met in Chapter 4 governs the 1 nm transistor being designed today.

### 22.6.3 Ballistic Transport

In devices shorter than the mean free path (\(L < \lambda_{\text{mfp}} \approx 10\)–50 nm for electrons in silicon at 300 K), carriers travel ballistically — with no scattering. The conventional Ohm's law and drift-diffusion model fail.

Ballistic transport modifies the drain current:

\[
I_D^{\text{ballistic}} = q W C_{\text{ox}}(V_{GS} - V_T) v_{\text{inj}}
\]

where \(v_{\text{inj}}\) is the **injection velocity** at the virtual source (top of the source-channel barrier) — determined by the carrier thermal velocity rather than the saturation velocity. For electrons in silicon: \(v_{\text{inj}} \approx 1.1 \times 10^7\) cm/s. For InAs with \(m^* = 0.023 m_0\): \(v_{\text{inj}} \approx 6 \times 10^7\) cm/s — explaining why InAs is attractive for ultra-short channel devices.

At the ultimate quantum limit (fully ballistic, 1D conductors), the Landauer-Büttiker formalism applies:

\[
G = \frac{2e^2}{h} \sum_n T_n
\]

where \(T_n\) is the transmission probability of the nth conduction channel. Conductance is quantized in units of \(2e^2/h \approx 77.5\) μS (observed in semiconductor quantum point contacts cooled to millikelvin temperatures).

!!! mascot-celebration "Nova's Grand Finale: From a Crystal to a Quantum"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    We started Chapter 1 with a crystal of silicon and the concept of a bandgap. Twenty-two chapters later, you have: statistical mechanics of electrons (Fermi-Dirac), transport theory (drift-diffusion), junction physics (p-n, MOS, Schottky), transistor operation (MOSFET, BJT, HEMT), optoelectronics (LED, laser, photodetector), power devices, fabrication technology, and now quantum transport. The physics of a semiconductor device spans 10 orders of magnitude in length — from the 0.1 nm bond length to the 100 mm wafer — and connects quantum mechanics to circuit design. Nova's parting advice: when you're confused by a circuit, go back to the physics. When the physics doesn't apply, remember this chapter. And always — always — let's get excited.

<details markdown="1">
<summary>#### MicroSim: Resonant Tunneling Diode I-V Simulator</summary>

**sim-id:** `resonant-tunneling-diode`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive simulation of a resonant tunneling diode. Left panel: double-barrier quantum well band diagram showing conduction band profile, quasi-bound state energy levels, and electron wave functions. The bias voltage shifts the band alignment. Right panel: I-V characteristic showing peak current, valley, NDR region, and rising current at high bias. Quantum mechanical tunneling calculation updates in real-time as voltage is adjusted.

**Controls:**
- Slider: Applied voltage (0 to 0.5 V)
- Slider: Barrier width (1–5 nm)
- Slider: Well width (2–10 nm)
- Slider: Barrier height \(\Delta E_C\) (0.1–1.0 eV)
- Dropdown: Material system (GaAs/AlAs, InGaAs/AlAs, InAs/AlSb)
- Checkbox: Show transmission coefficient T(E)

**Key Learning Objectives:**
- L2 (Understand): Explain why current peaks when the resonant level aligns with the Fermi level
- L3 (Apply): Predict peak voltage from quantum well energy levels and barrier heights
- L4 (Analyze): Explain the origin of negative differential resistance in terms of transmission probability
- L5 (Evaluate): Compare RTD performance metrics (PVCR, peak current density) for different material systems

</details>

---

## Summary

This final chapter connected semiconductor physics to measurement, simulation, and the quantum frontier:

**Electrical characterization:**
- I-V: Extracts \(V_T\), \(\mu_{\text{eff}}\), subthreshold slope, channel-length modulation
- C-V: Extracts \(t_{\text{ox}}\), \(N_A\), \(V_{FB}\), \(D_{it}\)
- DLTS: Maps trap energy levels and capture cross-sections

**Optical characterization:**
- PL: Bandgap, excitons, defects, carrier lifetime
- EL: Spatial emission uniformity, dark spot detection
- Raman: Strain, crystal quality, local temperature

**Structural characterization:**
- TEM: Atomic-resolution cross-sections, oxide thickness
- SEM: Surface imaging, CD measurement, failure analysis
- SIMS: Dopant depth profiles (sub-nm, sub-10¹⁴ cm⁻³)
- AES: Elemental analysis at interfaces

**Compact models:**
- Level-1 SPICE: Simple, long-channel equations (~17 parameters)
- BSIM4/BSIM-CMG: Short-channel physics, 200+ parameters

**Noise:** Thermal (\(4k_BT R\)), shot (\(2qI\)), and flicker (\(\propto 1/f\)) noise; noise figure from Friis formula

**Quantum transport:**
- Esaki tunnel diode: NDR from band-to-band tunneling; PVCR indicates material quality
- RTD: Resonant tunneling through QW states; NDR at de-tuned voltages; THz oscillation potential
- Ballistic transport: Sub-mean-free-path devices; conductance quantization \(G = 2e^2/h\) per channel

## Key Equations

\[
S_V = 4k_BT R \quad \text{(thermal noise)}, \quad S_I = 2qI \quad \text{(shot noise)}
\]

\[
f_T = \frac{g_m}{2\pi(C_{gs}+C_{gd})}, \quad F_{\text{total}} = F_1 + \frac{F_2-1}{G_1} + \cdots \quad \text{(Friis)}
\]

\[
G = \frac{2e^2}{h} \sum_n T_n \quad \text{(Landauer-Büttiker, ballistic transport)}
\]
