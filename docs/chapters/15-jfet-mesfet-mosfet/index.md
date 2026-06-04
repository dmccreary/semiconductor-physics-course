---
title: JFET, MESFET, and Long-Channel MOSFET Fundamentals
description: Field-effect transistor family from JFET and MESFET through long-channel MOSFET I-V model, transconductance, subthreshold behavior, and channel-length modulation
generated_by: claude skill chapter-content-generator
date: 2026-06-03 18:00:00
version: 0.08
---

# JFET, MESFET, and Long-Channel MOSFET Fundamentals

## Summary

This chapter introduces the field-effect transistor family, beginning with the junction FET (JFET) — where a reverse-biased p-n junction controls channel conductance — and the MESFET, which replaces the p-n junction with a Schottky barrier and dominates GaAs microwave circuits. The chapter then develops the MOSFET in full detail: device structure and terminal definitions, N- and P-channel variants, enhancement and depletion modes, and the threshold voltage derived from MOS capacitor physics. The gradual channel approximation yields the long-channel I-V model across the triode, saturation, and cutoff regions. Transconductance, output conductance, channel-charge and inversion-charge-density expressions, subthreshold conduction and its slope, and channel-length modulation complete the long-channel MOSFET analysis that serves as the baseline for short-channel corrections in Chapter 16.

## Concepts Covered

This chapter covers the following 31 concepts from the learning graph:

1. JFET Structure
2. JFET Operation
3. JFET Pinch-Off
4. JFET I-V Characteristics
5. MESFET Structure
6. MESFET Operation
7. MOSFET Structure
8. MOSFET Gate
9. MOSFET Source
10. MOSFET Drain
11. MOSFET Substrate
12. N-Channel MOSFET
13. P-Channel MOSFET
14. Enhancement Mode MOSFET
15. Depletion Mode MOSFET
16. Triode Region MOSFET
17. Linear Region MOSFET
18. Saturation Region MOSFET
19. Cutoff Region MOSFET
20. MOSFET Threshold Voltage
21. MOSFET I-V Long Channel
22. MOSFET Transconductance
23. MOSFET Output Conductance
24. Subthreshold Conduction
25. Subthreshold Slope
26. Subthreshold Swing
27. Channel Charge
28. Inversion Charge Density
29. Gradual Channel Approximation
30. Channel-Length Modulation
31. Pinch-Off Point

## Prerequisites

This chapter builds on concepts from:

- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../11-pn-junction-equilibrium/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)
- [Chapter 13: Metal-Semiconductor Contacts and MOS Physics](../13-metal-semiconductor-mos/index.md)

---

!!! mascot-welcome "Nova on MOSFETs: Three Billion on a Chip, and We're Going to Understand All of Them"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Every smartphone contains roughly 10–15 billion transistors. Every modern CPU has tens of billions. Almost all of them are MOSFETs. This chapter derives the MOSFET I-V equations from first principles — the gradual channel approximation, threshold voltage from MOS capacitor physics, transconductance, and subthreshold slope. We also meet the JFET and MESFET, the field-effect transistor's older cousins who still rule in compound semiconductor microwave circuits. Fasten your seatbelts — this is the chapter where semiconductor physics becomes computing history.

## 15.1 The JFET: Earliest Field-Effect Transistor

The **junction field-effect transistor (JFET)** uses a reverse-biased p-n junction to control the width of a conducting channel. It is the conceptually simplest FET and helps build intuition before the more complex MOSFET.

**JFET structure:** An n-type channel (current flows from drain to source) is sandwiched between p-type gate regions on top and bottom. The device is normally ON — applying a reverse bias to the gate pinches the channel closed.

**JFET operation:** With no gate bias (\(V_{GS} = 0\)), the channel is wide and conducts a large current. As reverse gate bias \(|V_{GS}|\) increases, the depletion regions from the gate-channel junctions extend into the channel, narrowing it and increasing resistance.

The channel width at position \(x\) along the channel (for a simple symmetric structure):

\[
a_{\text{eff}}(x) = a - 2\sqrt{\frac{2\varepsilon_s(V_{bi} - V_{GS} + V(x))}{qN_D}}
\]

where \(a\) is the total channel half-width and \(V(x)\) is the local channel voltage.

**Pinch-off** occurs when \(a_{\text{eff}} = 0\) at the drain end — the channel is just "closed." The pinch-off voltage:

\[
V_P = \frac{qN_D a^2}{2\varepsilon_s} - V_{bi} \quad \text{(for depletion mode, N-channel JFET)}
\]

At pinch-off, the drain current saturates — further increase in \(V_{DS}\) doesn't increase \(I_D\) significantly, because the pinch-off point moves toward the source while the current remains approximately constant.

**JFET I-V characteristics:**

- **Triode region** (\(V_{DS} < V_{GS} - V_P\)):

\[
I_D = I_{DSS}\!\left[2\!\left(\frac{V_{GS}}{V_P}\right)\!\left(\frac{V_{DS}}{V_P}\right) - \left(\frac{V_{DS}}{V_P}\right)^2\right]
\]

- **Saturation region** (\(V_{DS} \geq V_{GS} - V_P\)):

\[
I_D = I_{DSS}\!\left(1 - \frac{V_{GS}}{V_P}\right)^2
\]

where \(I_{DSS}\) is the saturation current at \(V_{GS} = 0\).

JFETs are used in low-noise amplifiers (their gate current is essentially zero — only the reverse leakage of the gate junction), audio input stages, and analog switches. They're quiet, but they can't be scaled to modern CMOS dimensions.

---

## 15.2 The MESFET: Schottky Gate for Compound Semiconductors

The **metal-semiconductor FET (MESFET)** replaces the p-n junction gate with a Schottky barrier contact. It operates on the same depletion principle as the JFET: reverse-biasing the Schottky gate depletes the channel and pinches it off.

The MESFET became the transistor of choice for GaAs microwave and high-frequency applications because:

1. GaAs has \(\mu_n \approx 8500\) cm²/V·s (vs. 1400 for silicon) — inherently faster electrons
2. GaAs is a semi-insulating substrate (undoped GaAs has resistivity \(> 10^7\) Ω·cm) — no junction isolation needed, lower parasitic capacitance
3. GaAs MOS is impractical (no stable native oxide) — but Schottky gates work beautifully

**MESFET structure:** A thin n-type channel (100–300 nm) on a semi-insulating GaAs substrate, with source and drain ohmic contacts and a Schottky gate metal.

MESFET I-V expressions are analogous to JFET but use the Schottky barrier height \(\phi_B\) instead of \(V_{bi}\). The device operates identically in triode and saturation.

The MESFET dominated microwave ICs (MICs) and MMICs from the 1970s through the 1990s. It has largely been displaced by HEMTs (Chapter 19) in ultra-high-frequency applications, but remains in use for medium-complexity compound semiconductor circuits.

---

## 15.3 MOSFET Structure and Terminal Definitions

The **metal-oxide-semiconductor field-effect transistor (MOSFET)** is the dominant transistor in all digital and most analog ICs. It uses an insulated gate (oxide between metal and semiconductor) to modulate the inversion layer (channel) conductance.

**N-channel MOSFET (NMOS) structure:**
- p-type silicon substrate (body/bulk)
- n\(^+\) source and drain regions (heavily doped, ohmic contacts)
- Gate oxide (SiO\(_2\) or high-k dielectric, 1–5 nm in modern devices)
- Gate metal or doped polysilicon

**Terminal convention:**
- **Gate (G):** Controls channel through electric field; nominally no DC current
- **Source (S):** Reference terminal; typically lowest potential for NMOS
- **Drain (D):** Output terminal; collects current from channel
- **Body (B) / Substrate:** Bulk silicon; connected to most negative supply in NMOS

**PMOS** uses n-type substrate, p\(^+\) source/drain, and operates with negative gate voltages. CMOS (complementary MOS) uses both NMOS and PMOS on the same chip.

**Enhancement vs. depletion mode:**

- **Enhancement mode (normally off):** No channel at \(V_{GS} = 0\); requires gate voltage above threshold to form inversion layer. Standard for digital CMOS.
- **Depletion mode (normally on):** A built-in channel exists at \(V_{GS} = 0\); requires negative gate voltage to pinch off. Used in JFETs and some specialty MOS.

---

## 15.4 MOSFET Threshold Voltage

From Chapter 13, the threshold voltage for NMOS (p-substrate) is:

\[
V_T = V_{FB} + 2\phi_F + \frac{Q_{dep,\max}}{C_{\text{ox}}} = V_{FB} + 2\phi_F + \frac{\sqrt{4q\varepsilon_s N_A \phi_F}}{C_{\text{ox}}}
\]

Three levers control \(V_T\):

1. **Oxide thickness \(t_{\text{ox}}\)**: Thinner oxide → larger \(C_{\text{ox}}\) → smaller \(Q_{dep}/C_{\text{ox}}\) term → lower \(V_T\)
2. **Substrate doping \(N_A\)**: Higher \(N_A\) → larger \(\phi_F\) and larger depletion charge → higher \(V_T\)
3. **Flat-band voltage \(V_{FB}\)**: Controlled by gate work function, oxide charges

Ion implantation of a "threshold adjust" implant under the gate is used routinely in CMOS fabrication to set \(V_T\) precisely — typically 0.2–0.5 V for digital CMOS.

Body bias effect (from Chapter 13): \(V_T(V_{SB}) = V_{T0} + \gamma(\sqrt{2\phi_F + V_{SB}} - \sqrt{2\phi_F})\)

---

## 15.5 Long-Channel MOSFET I-V: The Gradual Channel Approximation

The long-channel MOSFET I-V model assumes:
1. **Gradual channel approximation (GCA):** The lateral electric field \(\mathcal{E}_y\) (source to drain) is much smaller than the vertical gate field \(\mathcal{E}_x\). The gate-controlled charge density at each lateral position is determined locally by the local voltage \(V(y)\) as if it were in a MOS capacitor at that voltage.
2. **No velocity saturation** (valid for \(L > 1\) μm; Chapter 16 corrects this)
3. **Complete ionization and low-level injection**

The inversion charge density at position \(y\) along the channel:

\[
Q_{\text{inv}}(y) = -C_{\text{ox}}\!\left[V_{GS} - V_T - V(y)\right]
\]

(This is zero when \(V_{GS} - V_T = V(y)\) — the local pinch-off condition.)

The drain current (charge per unit time per unit width):

\[
I_D = W \mu_n Q_{\text{inv}}(y) \cdot \mathcal{E}_y = W \mu_n Q_{\text{inv}}(y) \frac{dV}{dy}
\]

Integrating from source (\(y = 0\), \(V = 0\)) to drain (\(y = L\), \(V = V_{DS}\)):

\[
\int_0^L I_D\, dy = W \mu_n C_{\text{ox}} \int_0^{V_{DS}} (V_{GS} - V_T - V)\, dV
\]

\[
\boxed{I_D = \frac{W\mu_n C_{\text{ox}}}{2L}\!\left[2(V_{GS} - V_T)V_{DS} - V_{DS}^2\right]} \quad \text{(triode region)}
\]

**Saturation** occurs when the inversion charge at the drain end goes to zero: \(V_{DS} = V_{GS} - V_T \equiv V_{DSAT}\) (pinch-off). For \(V_{DS} > V_{DSAT}\):

\[
\boxed{I_D = \frac{W\mu_n C_{\text{ox}}}{2L}(V_{GS} - V_T)^2} \quad \text{(saturation region)}
\]

The saturation current is quadratic in overdrive voltage \(V_{OD} = V_{GS} - V_T\) — the defining "square-law" relationship of the long-channel MOSFET.

| Region | Condition | I-V Expression |
|--------|-----------|----------------|
| Cutoff | \(V_{GS} < V_T\) | \(I_D \approx 0\) (subthreshold leakage) |
| Triode | \(0 < V_{DS} < V_{GS}-V_T\) | \(I_D \propto (2V_{OD}V_{DS} - V_{DS}^2)\) |
| Saturation | \(V_{DS} \geq V_{GS}-V_T\) | \(I_D \propto V_{OD}^2\) |

!!! mascot-thinking "Nova Thinks: The Square-Law Is Beautiful and Almost Always Wrong Now"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    The \(I_D \propto (V_{GS}-V_T)^2\) square-law is one of the most celebrated results in semiconductor device physics. It's also approximately accurate only for devices with gate lengths above about 500 nm. For the 5 nm, 3 nm, and 2 nm transistors in current production, velocity saturation makes the I-V more linear in \(V_{GS}\). But here's the dirty secret: every analog circuit designer still uses the square-law as a first-order model and then corrects with simulation. Understanding where the model comes from makes you wise enough to know when to trust it — and when to open your SPICE deck.

---

## 15.6 Transconductance and Output Conductance

The two key small-signal parameters of the MOSFET are:

**Transconductance** \(g_m\): rate of change of \(I_D\) with \(V_{GS}\) at constant \(V_{DS}\):

\[
g_m = \frac{\partial I_D}{\partial V_{GS}}\bigg|_{V_{DS}} = \frac{W\mu_n C_{\text{ox}}}{L}(V_{GS} - V_T) = \sqrt{2\mu_n C_{\text{ox}} \frac{W}{L} I_D}
\]

Transconductance scales with \(\sqrt{I_D}\) for a long-channel device. Higher W/L ratio → more current capability → higher \(g_m\) → more voltage gain in an amplifier.

**Output conductance** \(g_{ds}\): rate of change of \(I_D\) with \(V_{DS}\) at constant \(V_{GS}\):

\[
g_{ds} = \frac{\partial I_D}{\partial V_{DS}}\bigg|_{V_{GS}} = \lambda I_D \quad \text{(in saturation with channel-length modulation)}
\]

Ideally \(g_{ds} = 0\) in saturation (horizontal \(I_D\) lines). In practice, the pinch-off point moves toward the source as \(V_{DS}\) increases, modulating the effective channel length — **channel-length modulation** — giving a finite output resistance:

\[
r_o = \frac{1}{g_{ds}} = \frac{1}{\lambda I_D} = \frac{V_A}{I_D}
\]

where \(\lambda\) is the channel-length modulation coefficient (units: V\(^{-1}\)) and \(V_A = 1/\lambda\) is the Early voltage analog for MOSFETs. Short channel → larger \(\lambda\) → lower \(r_o\) → less ideal current source behavior.

The intrinsic voltage gain of a MOSFET amplifier stage:

\[
A_v = -g_m r_o = -g_m V_A / I_D = -\frac{2V_A}{V_{GS} - V_T}
\]

For a 0.5 μm MOSFET with \(V_A = 5\) V and \(V_{OD} = 0.3\) V: \(A_v \approx 33\) — modest, but achievable without any resistors, using only the transistor's intrinsic output resistance.

---

## 15.7 Subthreshold Conduction and Subthreshold Slope

Below threshold (\(V_{GS} < V_T\)), the inversion charge is not zero — it's exponentially small. The subthreshold current follows:

\[
I_D^{\text{sub}} = I_0 \exp\!\left(\frac{V_{GS} - V_T}{n_{\text{sub}} V_T}\right)\!\left(1 - e^{-V_{DS}/V_T}\right)
\]

where \(n_{\text{sub}} = 1 + C_{dep}/C_{\text{ox}} \geq 1\) is the subthreshold slope factor (also called the body factor or n-factor).

The **subthreshold slope** (also called subthreshold swing) \(S\) is defined as the gate voltage change required to change the current by one decade:

\[
S = \frac{\partial V_{GS}}{\partial(\log_{10} I_D)} = n_{\text{sub}} \cdot V_T \cdot \ln(10) = n_{\text{sub}} \times 60 \text{ mV/decade at 300 K}
\]

In the ideal limit \(C_{dep} \to 0\) (very thin gate oxide, full gate control): \(n_{\text{sub}} \to 1\) and \(S \to 60\) mV/decade.

This **60 mV/decade limit** is fundamental — set by Boltzmann statistics — and cannot be beaten by a conventional MOSFET at room temperature. It is the key constraint on how low the supply voltage can go in digital logic:

- To switch from OFF to ON while maintaining \(10^4\)–\(10^6\) ON/OFF current ratio requires \(4\)–\(6 \times S \approx 0.24\)–0.36 V of gate swing
- Any supply reduction below ~0.4 V makes switching impractically slow (the transistor never fully turns off — leakage power explodes)

Real MOSFETs have \(S = 65\)–80 mV/decade due to interface traps (\(D_{it}\)) and body effect (\(n_{\text{sub}} > 1\)). Tunnel FETs and negative-capacitance FETs (using ferroelectric gates) are being researched as ways to beat the 60 mV/decade limit.

!!! mascot-warning "Nova Warns: Subthreshold Slope Governs Battery Life"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    Every MOSFET in your phone — all 15 billion of them — draws some subthreshold leakage current even when "off." For a chip with billions of transistors, this adds up to tens of milliamps of static current just from leakage. Managing subthreshold slope, \(V_T\), and leakage is the central challenge of low-power design. High-threshold-voltage devices leak less but switch slower; low-threshold devices switch faster but leak more. Modern SoCs use multi-\(V_T\) design: high-\(V_T\) cells in non-critical paths for leakage reduction, low-\(V_T\) cells in the critical path for speed. This is the subthreshold slope limit, manifesting in every $500 smartphone.

<details markdown="1">
<summary>#### MicroSim: Long-Channel MOSFET I-V Explorer</summary>

**sim-id:** `mosfet-iv-long-channel`  
**Library:** p5.js  
**Status:** specification  

**Description:** Complete MOSFET I-V characteristic simulator. Left panel: I-D vs. V-DS family of curves (multiple V-GS values), with triode, saturation, and cutoff regions shaded. Right panel: log I-D vs. V-GS curve showing subthreshold, threshold, and above-threshold regions, with S (subthreshold slope) and V-T labeled. Channel cross-section diagram shows charge density evolution.

**Controls:**
- Slider: Threshold voltage \(V_T\) (0.2–1.0 V)
- Slider: W/L ratio (1–100)
- Slider: \(\mu_n C_{\text{ox}}\) product (100–500 μA/V²)
- Slider: Channel-length modulation \(\lambda\) (0 to 0.1 V\(^{-1}\))
- Slider: Subthreshold slope factor \(n_{\text{sub}}\) (1 to 2)
- Dropdown: NMOS / PMOS

**Key Learning Objectives:**
- L2 (Understand): Identify triode, saturation, and cutoff regions from I-V curves
- L3 (Apply): Calculate transconductance and output conductance from I-V data
- L4 (Analyze): Explain the physical meaning of subthreshold slope and why 60 mV/decade is a fundamental limit
- L5 (Evaluate): Compare long-channel model predictions to realistic short-channel behavior

</details>

---

## Summary

This chapter covered the field-effect transistor family:

- **JFET:** Depletion-mode device; gate p-n junction controls channel width; pinch-off at \(V_{DS} = V_{GS} - V_P\); used for low-noise applications
- **MESFET:** Schottky gate FET; dominant in GaAs microwave ICs; same pinch-off physics as JFET
- **MOSFET structure:** Gate-oxide-semiconductor stack; source, drain (n\(^+\)), body terminals; threshold voltage from MOS capacitor analysis
- **Enhancement mode:** Normally off, requires positive overdrive; depletion mode has built-in channel
- **Long-channel I-V** from gradual channel approximation: triode \(\propto (2V_{OD}V_{DS} - V_{DS}^2)\); saturation \(\propto V_{OD}^2\)
- **Transconductance** \(g_m = \sqrt{2\mu_n C_{\text{ox}} (W/L) I_D}\); output conductance \(g_{ds} = \lambda I_D\)
- **Subthreshold slope** \(S = n_{\text{sub}} \times 60\) mV/decade at 300 K; ideal limit 60 mV/dec sets minimum supply voltage for logic

## Key Equations

\[
I_D^{\text{triode}} = \mu_n C_{\text{ox}} \frac{W}{L}\!\left[(V_{GS}-V_T)V_{DS} - \frac{V_{DS}^2}{2}\right]
\]

\[
I_D^{\text{sat}} = \frac{\mu_n C_{\text{ox}}}{2}\frac{W}{L}(V_{GS}-V_T)^2(1 + \lambda V_{DS})
\]

\[
g_m = \frac{\partial I_D}{\partial V_{GS}} = \mu_n C_{\text{ox}} \frac{W}{L}(V_{GS}-V_T), \quad r_o = \frac{1}{\lambda I_D}
\]

\[
S = n_{\text{sub}} V_T \ln(10) \geq 60 \text{ mV/dec at 300 K}
\]
