---
title: Photodetectors, Solar Cells, and Imaging Devices
description: PIN photodiodes, APDs, solar cell I-V characteristics, Shockley-Queisser limit, multi-junction cells, CCDs, and CMOS image sensors
generated_by: claude skill chapter-content-generator
date: 2026-06-03 19:30:00
version: 0.08
---

# Photodetectors, Solar Cells, and Imaging Devices

## Summary

This chapter covers semiconductor devices that convert light into electrical signals or power. Photodiodes begin with the basic PIN structure optimized for wide depletion and fast collection, quantified by responsivity, quantum efficiency, dark current, and bandwidth. Avalanche photodiodes exploit impact ionization to achieve internal gain at the expense of excess noise. Solar cells operate as photodiodes under illumination: the I-V curve under illumination yields short-circuit current, open-circuit voltage, fill factor, and power conversion efficiency. The Shockley-Queisser limit establishes the fundamental single-junction efficiency bound; multi-junction and tandem cell architectures circumvent it. Recombination and thermalization loss mechanisms are analyzed. The chapter closes with imaging arrays: charge-coupled devices (CCD) and CMOS image sensors with their pixel architectures.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Photodiode Structure
2. PIN Photodiode
3. Photodiode Responsivity
4. Quantum Efficiency Photodiode
5. Photodiode Dark Current
6. Photodiode Bandwidth
7. Avalanche Photodiode
8. APD Gain
9. APD Noise
10. Solar Cell Operation
11. Photovoltaic Effect
12. Solar Cell I-V Curve
13. Short-Circuit Current
14. Open-Circuit Voltage
15. Fill Factor Solar Cell
16. Power Conversion Efficiency
17. Shockley-Queisser Limit
18. Single-Junction Solar Cell
19. Multi-Junction Solar Cell
20. Tandem Solar Cell
21. Solar Cell Losses
22. Recombination Losses Solar Cell
23. Thermalization Losses
24. Charge-Coupled Device
25. CCD Operation
26. CMOS Image Sensor
27. Pixel Architecture

## Prerequisites

This chapter builds on concepts from:

- [Chapter 10: Generation, Recombination, Continuity, and Optical Processes](../10-generation-recombination/index.md)
- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../11-pn-junction-equilibrium/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)
- [Chapter 16: Short-Channel Effects, CMOS, and Advanced FET Structures](../16-short-channel-cmos/index.md)

---

!!! mascot-welcome "Nova on Photodetectors: Converting Light to Electrons, One Photon at a Time"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Chapter 17 made electrons into light. Now Chapter 18 reverses the trick: turning light back into electrons. Photodetectors power fiber optics, scientific instruments, medical imaging, and camera sensors. Solar cells power civilization (or will, if we let them). The physics is the same p-n junction you know, running in reverse — but the applications are staggering. Let's convert some photons.

## 18.1 The Photodiode: Reverse-Biased Junction Under Illumination

A **photodiode** is a p-n junction operated in reverse bias (or at zero bias) that generates current when illuminated. The operating principle:

1. A photon with \(h\nu \geq E_g\) is absorbed in the semiconductor, creating an electron-hole pair
2. If the pair is generated in or near the depletion region, the built-in field separates them: electrons swept to n-side, holes swept to p-side
3. Separated charges flow in the external circuit as photocurrent

The **photocurrent density**:

\[
J_{\text{ph}} = q \int_0^\infty G_{\text{opt}}(x) \cdot \eta_{\text{coll}}(x)\, dx
\]

where \(\eta_{\text{coll}}(x)\) is the collection efficiency for carriers generated at depth \(x\) — essentially the probability that a generated carrier is collected rather than recombining. Within the depletion region, \(\eta_{\text{coll}} \approx 1\) (field sweeps carriers). In the neutral regions, collection depends on the minority carrier diffusion length:

\[
J_{\text{ph}} = q \int_{\text{depletion}} G_{\text{opt}}\, dx + q \int_{\text{neutral}} G_{\text{opt}} e^{-d/L}\, dx
\]

The total current of an illuminated diode (I-V under illumination):

\[
I = I_s\!\left(e^{qV/k_BT} - 1\right) - I_{\text{ph}}
\]

This is the standard diode equation with an additive photocurrent source. The light shifts the I-V curve downward by \(I_{\text{ph}}\).

---

## 18.2 PIN Photodiode

The standard photodiode structure for communications and detection is the **PIN (p-i-n) diode**: a wide intrinsic (lightly doped) region between p and n contacts. The intrinsic region is fully depleted under modest reverse bias, providing:

1. **Wide absorption volume:** More of the photon absorption depth is in the high-field region → higher quantum efficiency
2. **Reduced junction capacitance:** \(C_j = \varepsilon_s A / W\) where \(W\) is the wide intrinsic region → lower capacitance → faster bandwidth
3. **Fast collection:** Carriers drift at near-saturation velocity through the field-swept intrinsic region

**Responsivity** \(R_\lambda\) (units: A/W) is the primary figure of merit for a photodetector:

\[
R_\lambda = \frac{I_{\text{ph}}}{P_{\text{opt}}} = \frac{q\eta_{\text{QE}}}{h\nu} = \frac{\eta_{\text{QE}} \lambda(\text{μm})}{1.24} \text{ A/W}
\]

where **quantum efficiency (QE)** \(\eta_{\text{QE}}\) is the number of electron-hole pairs collected per incident photon. For a well-designed PIN at 850 nm with \(\eta_{\text{QE}} = 0.9\): \(R_\lambda = 0.9 \times 0.85/1.24 \approx 0.62\) A/W.

**Dark current** \(I_{\text{dark}}\) is the reverse current flowing in the absence of light — it sets the noise floor and limits sensitivity in low-light detection:

\[
I_{\text{dark}} = I_{\text{gen}} + I_{\text{diff}} = \frac{qn_i A W}{\tau_g} + qA n_i^2\!\left(\frac{D_p}{L_p N_D} + \frac{D_n}{L_n N_A}\right)
\]

At room temperature, dark current is dominated by generation in the depletion region (\(I_{\text{gen}}\)). Cooling the detector reduces \(n_i(T)\) exponentially and dramatically reduces dark current — the motivation for thermoelectrically cooled scientific detectors.

**Bandwidth** of a PIN photodiode has two limits that must both be satisfied:

1. **Transit time bandwidth:** Carriers must drift across the intrinsic region in time \(\tau_{tr} = W_i/v_{\text{sat}}\). Bandwidth \(f_{tr} = 0.44/\tau_{tr}\). For \(W_i = 3\) μm at \(v_{\text{sat}} = 10^7\) cm/s: \(\tau_{tr} = 30\) ps, \(f_{tr} \approx 15\) GHz.

2. **RC bandwidth:** The junction capacitance \(C_j\) charged through load resistance \(R_L\) (typically 50 Ω): \(f_{RC} = 1/(2\pi R_L C_j)\).

The 3 dB bandwidth is approximately: \(f_{3dB} \approx \sqrt{f_{tr}^2 + f_{RC}^2}^{-1}\) — the slower limit dominates. High-speed fiber receivers use flip-chip bonded PIN diodes with \(W_i = 2\)–3 μm and on-chip transimpedance amplifiers achieving >100 GHz bandwidth.

---

## 18.3 Avalanche Photodiodes (APDs)

An **avalanche photodiode (APD)** operates at high reverse bias (near, but below, avalanche breakdown) to exploit impact ionization as an internal gain mechanism. Each photogenerated carrier triggers a multiplication cascade, amplifying the photocurrent before any electronic noise from the amplifier is added.

The **APD gain** \(M\):

\[
M = \frac{I_{\text{APD}}}{I_{\text{primary}}} = \frac{1}{1-\int_0^W \alpha_n\, dx}
\]

Typical APD gains: \(M = 10\)–100 for silicon (wavelengths 400–1000 nm); \(M = 5\)–20 for InGaAs (1310/1550 nm).

The gain comes at a price: **excess noise**. The multiplication process is statistical — not every primary carrier triggers exactly \(M\) secondaries. The **excess noise factor** \(F\):

\[
\langle i_{\text{noise}}^2 \rangle = 2q I_{\text{APD}} M^2 F B
\]

where \(F = k_{\text{eff}} M + (2 - 1/M)(1 - k_{\text{eff}})\) for \(k_{\text{eff}} = \alpha_p/\alpha_n\) (ratio of hole to electron ionization coefficients).

For silicon (\(k_{\text{eff}} \approx 0.02\) — electron ionization dominates): \(F \approx 2\)–3, relatively low noise. For InGaAs (\(k_{\text{eff}} \approx 0.4\)): \(F \approx 8\)–15, higher noise. This is why silicon APDs are preferred for photon counting, while InP-based APDs (with a silicon-like amplification layer and separate InGaAs absorption layer — SACM structure) are used for 1310/1550 nm fiber detection.

APDs power long-haul fiber receivers, LIDAR distance sensors (autonomous vehicles!), PET scanners in medical imaging, and photon-counting astronomy instruments.

!!! mascot-tip "Nova Tips: APDs vs. SiPMs — The Detection Revolution"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova with tip pose">
    A **silicon photomultiplier (SiPM)** is a 2D array of micro-APD cells (each typically 20–50 μm), each operated above breakdown (in Geiger mode). Each cell fires with a binary "click" when a photon arrives, then recharges. The array output is the count of cells fired, which linearly maps to photon number at low flux. SiPMs have replaced vacuum-tube photomultipliers in most new particle physics detectors (LHC experiments use millions of SiPM channels) and in PET/SPECT medical scanners. The gain is 10⁵–10⁶, the power supply is 25–30 V (not 1000 V for PMTs), and the device is a solid-state chip the size of a fingernail. This is semiconductor physics directly powering particle astrophysics.

---

## 18.4 Solar Cell Physics: The Photovoltaic Effect

A **solar cell** is a large-area photodiode optimized for power generation rather than signal detection. The **photovoltaic effect** (Becquerel, 1839) is the generation of a voltage when light generates carriers that are separated by the built-in field of a p-n junction.

The I-V characteristic of an illuminated solar cell:

\[
I = I_s\!\left(e^{qV/k_BT} - 1\right) - I_{\text{ph}}
\]

This is identical to the photodiode equation, but the solar cell operates in the fourth quadrant (\(V > 0\), \(I < 0\)) — delivering power to an external load.

Key parameters from the I-V curve (defined with the convention that current is positive when flowing into the external circuit):

**Short-circuit current** \(I_{sc}\): Current at \(V = 0\) (output shorted). Equals \(I_{\text{ph}}\) when series resistance is negligible. Scales linearly with illumination intensity and cell area.

**Open-circuit voltage** \(V_{oc}\): Voltage at \(I = 0\) (output open). Setting \(I = 0\):

\[
V_{oc} = \frac{k_BT}{q}\ln\!\left(\frac{I_{sc}}{I_s} + 1\right) \approx \frac{k_BT}{q}\ln\!\left(\frac{I_{sc}}{I_s}\right)
\]

\(V_{oc}\) increases logarithmically with illumination and decreases with temperature (because \(I_s \propto n_i^2 \propto e^{-E_g/k_BT}\) increases with T). For silicon at one sun: \(V_{oc} \approx 0.6\)–0.68 V. For GaAs: \(V_{oc} \approx 1.0\)–1.1 V.

**Fill factor** \(FF\): A measure of I-V curve "squareness." The maximum power rectangle on the I-V curve:

\[
FF = \frac{I_{mp} V_{mp}}{I_{sc} V_{oc}}
\]

where \((I_{mp}, V_{mp})\) is the maximum power point. For good silicon cells: \(FF \approx 0.78\)–0.85. Fill factor is degraded by series resistance (contact and bulk) and shunt resistance (leakage paths).

**Power conversion efficiency**:

\[
\eta_{\text{PCE}} = \frac{P_{\max}}{P_{\text{in}}} = \frac{I_{sc} V_{oc} FF}{P_{\text{in}}}
\]

For standard AM1.5G illumination (\(P_{\text{in}} = 100\) mW/cm\(^2\)):

| Cell Type | \(V_{oc}\) (V) | \(I_{sc}\) (mA/cm²) | \(FF\) | \(\eta_{\text{PCE}}\) |
|-----------|--------------|--------------------|----|---------|
| Silicon (commercial) | 0.64 | 38 | 0.80 | 20–22% |
| Silicon (record lab) | 0.74 | 42 | 0.84 | 26.1% |
| GaAs (record lab) | 1.13 | 29 | 0.87 | 29.1% |
| Perovskite-Si tandem | 1.99 | 20 | 0.82 | 33.9% |

---

## 18.5 The Shockley-Queisser Limit

In 1961, William Shockley and Hans-Joachim Queisser derived the **fundamental efficiency limit** for a single-junction solar cell under blackbody (AM0) or AM1.5 illumination, considering only radiative recombination as the loss mechanism.

Their analysis showed that for a given bandgap \(E_g\):

1. **Photons below \(E_g\)** are not absorbed → transmission loss
2. **Photons above \(E_g\)** generate carriers, but excess energy \(h\nu - E_g\) is lost to **thermalization** (carrier heating and phonon emission) → thermalization loss
3. **\(V_{oc}\)** is always less than \(E_g/q\) (fundamental thermodynamic limit)
4. **Radiative recombination** is unavoidable (detailed balance)

The Shockley-Queisser (SQ) limit has a maximum around \(E_g \approx 1.1\)–1.4 eV:

\[
\eta_{\text{SQ,max}} \approx 33.7\% \quad \text{at } E_g \approx 1.34 \text{ eV (under AM1.5)}
\]

Silicon (\(E_g = 1.12\) eV) has SQ limit ~33%. GaAs (\(E_g = 1.42\) eV) has SQ limit ~31%. The SQ limit is a thermodynamic bound — no single-junction cell can exceed it (without concentrating sunlight).

**Solar cell loss mechanisms** that reduce efficiency below SQ:

- **Thermalization:** Carriers excited far above band edge lose energy to phonons; responsible for ~30% relative loss
- **Sub-bandgap transmission:** Photons below \(E_g\) not absorbed; ~25% relative loss for silicon
- **Recombination:** SRH, Auger, surface recombination reduce \(V_{oc}\) and \(J_{sc}\)
- **Optical losses:** Reflection, grid shading, incomplete absorption
- **Series resistance:** Reduces fill factor and peak power

---

## 18.6 Multi-Junction Solar Cells

**Multi-junction (tandem) solar cells** circumvent the SQ limit by stacking multiple sub-cells with different bandgaps. The top cell absorbs high-energy photons; photons below its bandgap pass through to lower sub-cells. This reduces both thermalization and transmission losses.

For a two-junction stack (SQ limit):

\[
\eta_{2J} \lesssim 42\% \quad \text{(theoretical), } \approx 33\text{--}35\% \text{ (practical)}
\]

For infinite junctions:

\[
\eta_{\infty J} \lesssim 86.8\% \quad \text{(theoretical Carnot-like limit)}
\]

The **record multi-junction efficiency** (2024): 47.6% for a six-junction III-V cell under 665-sun concentrated illumination (Space applications).

Practical multi-junction designs:

- **III-V triple junction** (GaInP/GaAs/Ge): ~32% at 1 sun; standard for space satellites and concentrated photovoltaics (CPV)
- **Perovskite-silicon tandem**: ~34% at 1 sun (lab record 2024); combining cheap silicon bottom cell with printable perovskite top cell — potentially game-changing for terrestrial power

---

## 18.7 Charge-Coupled Devices and CMOS Image Sensors

Before closing, we note that the same photodetector physics enables imaging arrays:

**Charge-Coupled Devices (CCDs):** An array of MOS capacitors that collect photogenerated charge in potential wells under the gate. Charge is transferred ("bucket-brigade" style) from pixel to pixel using clock voltage sequences, then read out at the array edge. CCDs offer very low noise (charge transfer efficiency > 0.9999) and high fill factor but require specialized fabrication (no standard CMOS) and high power for charge transfer.

**CMOS Image Sensors (CIS):** Each pixel contains a photodiode plus in-pixel readout transistors (3T, 4T pixel architectures). The "4T pixel" includes a transfer gate that moves charge from the photodiode to a floating diffusion node, achieving noise levels near CCD performance while using standard CMOS processes. CIS has replaced CCD in all consumer applications (smartphone cameras, security cameras, automotive cameras) due to lower cost, lower power, and better on-chip integration.

**Pixel architecture** tradeoffs:
- More transistors per pixel → better noise, more control → smaller fill factor (less light collected)
- Backside-illuminated (BSI) sensors move wiring to the "back" of the silicon → full fill factor
- Stacked CMOS (image sensor + logic die bonded) → dedicated sensor process + advanced logic, no compromise

!!! mascot-celebration "Nova Celebrates: From One Photon to Terabyte Images"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    The same minority carrier physics that produces a p-n junction diode curve also determines whether your phone captures a usable image in a dark restaurant, whether a solar farm generates enough power to charge a city, and whether a detector aboard a space telescope spots a photon from a galaxy 13 billion light-years away. Semiconductor devices don't just compute — they sense the entire electromagnetic universe. From single photons to terawatt-scale energy harvesting, the p-n junction has done it all. Nova is officially very excited about that.

<details markdown="1">
<summary>#### MicroSim: Solar Cell I-V Curve Explorer</summary>

**sim-id:** `solar-cell-iv-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive solar cell I-V and P-V curve simulator. Shows the I-V curve (first and fourth quadrant), maximum power point rectangle, \(I_{sc}\), \(V_{oc}\), and fills the maximum power rectangle. Power-voltage (P-V) curve shown below, with MPP labeled. User adjusts irradiance, temperature, series resistance, and shunt resistance to see effects on efficiency.

**Controls:**
- Slider: Irradiance (0.1–5 suns)
- Slider: Cell temperature (−20°C to +80°C)
- Slider: Series resistance \(R_s\) (0–2 Ω·cm²)
- Slider: Shunt resistance \(R_{sh}\) (100–10,000 Ω·cm²)
- Dropdown: Cell material (Si, GaAs, Perovskite-Si tandem)
- Checkbox: Show Shockley-Queisser limit line

**Key Learning Objectives:**
- L2 (Understand): Identify \(I_{sc}\), \(V_{oc}\), MPP, and fill factor on I-V curve
- L3 (Apply): Calculate efficiency and fill factor for given I-V parameters
- L4 (Analyze): Explain how temperature and irradiance affect \(V_{oc}\) and \(I_{sc}\) differently
- L5 (Evaluate): Compare single-junction vs. tandem cell efficiency advantages

</details>

---

## Summary

This chapter covered semiconductor light-detection and power-generation devices:

- **PIN photodiode:** Wide intrinsic region for high QE and bandwidth; responsivity \(R_\lambda = q\eta_{\text{QE}}/h\nu\); bandwidth limited by transit time and RC product
- **APD:** Internal gain \(M\) from avalanche multiplication; excess noise factor \(F\) limits SNR improvement
- **Solar cell I-V:** Photocurrent shifts ideal diode curve; key parameters: \(I_{sc}\), \(V_{oc}\), \(FF\), \(\eta_{\text{PCE}}\)
- **\(V_{oc}\)** = \((k_BT/q)\ln(I_{sc}/I_s)\) — increases with illumination, decreases with temperature
- **Shockley-Queisser limit:** Single-junction maximum ~33.7% at \(E_g \approx 1.34\) eV; silicon achieves 26% in lab
- **Multi-junction cells:** Stack sub-cells to capture broader spectrum; >47% under concentrated illumination
- **CCD vs. CMOS sensors:** Charge-bucket transfer vs. in-pixel readout; CMOS dominates modern imaging

## Key Equations

\[
R_\lambda = \frac{q\eta_{\text{QE}}}{h\nu}, \quad I = I_s(e^{qV/k_BT}-1) - I_{\text{ph}}
\]

\[
V_{oc} = \frac{k_BT}{q}\ln\!\left(\frac{I_{sc}}{I_s}\right), \quad FF = \frac{I_{mp}V_{mp}}{I_{sc}V_{oc}}, \quad \eta = \frac{I_{sc}V_{oc}FF}{P_{\text{in}}}
\]
