---
title: Bipolar Junction Transistors
description: NPN/PNP device physics, current gain derivation, Ebers-Moll and Gummel-Poon models, Early effect, Kirk effect, and heterojunction bipolar transistors
generated_by: claude skill chapter-content-generator
date: 2026-06-03 17:30:00
version: 0.08
---

# Bipolar Junction Transistors

## Summary

The bipolar junction transistor was the first transistor and remains essential in high-speed analog and mixed-signal circuits. This chapter covers NPN and PNP device structures, the three operating regions (active, saturation, cutoff), and the three circuit configurations (common-emitter, common-base, common-collector). The current-gain components — emitter injection efficiency and base transport factor — are derived from minority-carrier physics, yielding α and β. The Ebers-Moll model provides a unified large-signal description; the Gummel-Poon model adds base-width modulation (Early effect), high-current degradation (Kirk effect), and series resistances needed for circuit simulation. High-frequency behavior is characterized by the transition frequency ft and maximum oscillation frequency fmax. The chapter closes with heterojunction bipolar transistors, which exploit band-gap engineering to achieve both high β and high speed.

## Concepts Covered

This chapter covers the following 32 concepts from the learning graph:

1. Bipolar Junction Transistor
2. NPN Transistor
3. PNP Transistor
4. BJT Regions of Operation
5. Active Region BJT
6. Saturation Region BJT
7. Cutoff Region BJT
8. Common-Emitter Configuration
9. Common-Base Configuration
10. Common-Collector Configuration
11. Emitter Injection Efficiency
12. Base Transport Factor
13. Current Gain Beta
14. Current Gain Alpha
15. Collector Current
16. Base Current
17. Emitter Current
18. Ebers-Moll Model
19. Gummel-Poon Model
20. Early Effect
21. Base-Width Modulation
22. Early Voltage
23. Kirk Effect
24. High-Current Effects BJT
25. Base Resistance
26. Collector Resistance
27. Emitter Resistance
28. Transition Frequency ft
29. Maximum Oscillation Frequency fmax
30. Heterojunction Bipolar Transistor
31. HBT Band Diagram
32. Emitter-Base Heterojunction

## Prerequisites

This chapter builds on concepts from:

- [Chapter 10: Generation, Recombination, Continuity, and Optical Processes](../10-generation-recombination/index.md)
- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../11-pn-junction-equilibrium/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)

---

!!! mascot-welcome "Nova on BJTs: Minority Carriers Finally Get Their Moment in the Spotlight"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    The bipolar junction transistor has one job: take a tiny base current and amplify it into a large collector current. To understand *why* that works requires everything from minority carrier lifetime to double p-n junction physics — all the minority-carrier machinery we've been building for six chapters. The payoff: gain, speed, and a transistor that still outperforms MOSFETs for radio-frequency and ultra-low-noise applications. Let's get bipolar.

## 14.1 BJT Structure and Operating Regions

An **NPN bipolar junction transistor** consists of three alternately doped regions: a heavily doped n-type **emitter** (E), a thin lightly doped p-type **base** (B), and a moderately doped n-type **collector** (C). The structural convention and notation for PNP transistors is identical with n and p swapped.

The key dimensional parameter is the **base width** \(W_B\): the physical distance between the emitter-base and base-collector depletion edges. In a modern silicon NPN: \(W_B \approx 0.05\)–0.5 μm.

The three terminals' biasing conditions define three operating regions:

| Region | E-B Junction | B-C Junction | Application |
|--------|-------------|-------------|-------------|
| Active (forward-active) | Forward biased | Reverse biased | Amplification |
| Saturation | Forward biased | Forward biased | Logic switch (on) |
| Cutoff | Reverse biased | Reverse biased | Logic switch (off) |
| Reverse-active | Reverse biased | Forward biased | Rarely used |

In the **active region**, the NPN transistor acts as a current-controlled current source: a small base current \(I_B\) controls a much larger collector current \(I_C = \beta I_B\). This is the amplification regime.

In **saturation**, both junctions are forward biased — the transistor is "fully on" and current flow is limited by the circuit, not the device. \(V_{CE,\text{sat}} \approx 0.1\)–0.2 V.

In **cutoff**, both junctions are reverse biased — the transistor is "off" and only tiny leakage currents flow.

The three standard circuit configurations — **common-emitter, common-base, and common-collector** — connect the three terminals differently to input and output, resulting in different impedance levels and voltage/current gains. Common-emitter is the most widely used: it provides both voltage and current gain (power gain) and has moderate input/output impedances.

---

## 14.2 Minority Carrier Physics in the BJT

The mechanism behind BJT current flow is the injection and transport of minority carriers through the base. Here's the physics step by step for an NPN in active mode:

1. **Emitter injection:** The forward-biased E-B junction injects minority electrons into the p-type base from the n-type emitter (just like a forward-biased p-n junction). The electron concentration at the emitter edge of the base is:

\[
n_B(0) = n_{B0} e^{qV_{BE}/k_BT}, \quad n_{B0} = \frac{n_i^2}{N_{AB}}
\]

2. **Base transport:** Injected electrons diffuse across the thin base toward the reverse-biased B-C junction. With base width \(W_B \ll L_n\) (the minority carrier diffusion length), the minority carrier profile is approximately linear — most electrons cross without recombining. A small fraction recombine with majority holes in the base.

3. **Collector collection:** At the B-C junction, the reverse-biased electric field sweeps the electrons from the base into the collector — they are "collected" and flow as collector current \(I_C\).

The minority electron profile across the base (assuming \(W_B \ll L_n\)):

\[
\delta n_B(x) \approx n_{B0}\!\left(e^{qV_{BE}/k_BT} - 1\right)\!\left(1 - \frac{x}{W_B}\right)
\]

The diffusion current at \(x = 0\) (injected from emitter into base):

\[
J_C = qD_n \frac{\delta n_B(0)}{W_B} = \frac{qD_n n_{B0}}{W_B}\!\left(e^{qV_{BE}/k_BT} - 1\right)
\]

This exponential dependence on \(V_{BE}\) — the "diode equation for collector current" — is the fundamental BJT characteristic.

---

## 14.3 Current Gain: α and β

Not all the emitter current becomes useful collector current. Two efficiency factors reduce the gain:

**Emitter injection efficiency** \(\gamma\) is the fraction of emitter current carried by the desired minority carrier (electrons, for NPN):

\[
\gamma = \frac{I_{nE}}{I_E} = \frac{I_{nE}}{I_{nE} + I_{pE}}
\]

where \(I_{nE}\) is the electron current (minority in base, wanted) and \(I_{pE}\) is the hole current (minority in emitter, wasted — holes injected from base into emitter don't contribute to \(I_C\)). To maximize \(\gamma \to 1\), the emitter is doped much more heavily than the base: \(N_{DE} \gg N_{AB}\). This makes hole injection into the emitter negligible.

\[
\gamma \approx 1 - \frac{D_p N_{AB} W_B}{D_n N_{DE} L_{pE}} \approx 1 - \frac{N_{AB} W_B}{N_{DE} L_{pE}}
\]

**Base transport factor** \(\alpha_T\) is the fraction of minority carriers injected by the emitter that actually reach the collector (without recombining in the base):

\[
\alpha_T = \frac{I_C}{I_{nE}} \approx 1 - \frac{W_B^2}{2L_n^2} = 1 - \frac{W_B^2}{2D_n\tau_n}
\]

For \(W_B \ll L_n\): \(\alpha_T \approx 1\). Thin base → nearly all injected carriers are collected.

The **common-base current gain** is:

\[
\alpha = \gamma \cdot \alpha_T \lesssim 1
\]

The **common-emitter current gain** is the critical figure of merit:

\[
\beta = \frac{\alpha}{1 - \alpha} = \frac{I_C}{I_B}
\]

For \(\alpha = 0.99\): \(\beta = 99\). For \(\alpha = 0.995\): \(\beta = 199\). Since \(\beta = \alpha/(1-\alpha)\), small changes in \(\alpha\) near unity cause dramatic changes in \(\beta\) — which is why BJT gain is notoriously variable between devices.

!!! mascot-thinking "Nova Thinks: The Base Width Is Everything in a BJT"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    The base transport factor \(\alpha_T \approx 1 - W_B^2/(2L_n^2)\) reveals the central design tension in all BJT engineering. Thin base: high \(\alpha_T\) (good for gain) and short transit time (good for speed). But a thin base also has high base resistance (bad for high-frequency noise) and is harder to fabricate uniformly. Modern SiGe HBTs solve this by grading the Ge content across the base, creating a quasi-electric field that accelerates electrons without requiring an ultra-thin physical base. The HBT design is essentially "let the band structure do the work instead of the geometry" — which is a beautiful example of materials-physics co-design.

---

## 14.4 The Ebers-Moll Model

The **Ebers-Moll (EM) model** is the fundamental large-signal BJT model. It describes all four operating regions using superposition of two diode-like current sources:

\[
I_E = I_{ES}\!\left(e^{qV_{BE}/k_BT} - 1\right) - \alpha_R I_{CS}\!\left(e^{qV_{BC}/k_BT} - 1\right)
\]

\[
I_C = \alpha_F I_{ES}\!\left(e^{qV_{BE}/k_BT} - 1\right) - I_{CS}\!\left(e^{qV_{BC}/k_BT} - 1\right)
\]

where:
- \(I_{ES}\), \(I_{CS}\): emitter and collector saturation currents
- \(\alpha_F\): forward current gain (active mode, typical 0.99–0.9999)
- \(\alpha_R\): reverse current gain (reverse-active mode, much smaller, 0.01–0.5)
- \(\beta_F = \alpha_F/(1-\alpha_F)\): forward common-emitter gain

The Ebers-Moll model predicts:
- **Active mode** (\(V_{BE} > 0\), \(V_{BC} < 0\)): \(I_C \approx \alpha_F I_{ES} e^{qV_{BE}/k_BT} = I_S e^{qV_{BE}/k_BT}\)
- **Saturation**: Both exponentials contribute; \(V_{CE,\text{sat}} = V_T \ln((\beta_F+1)/\beta_R)\)
- **Cutoff**: Both exponential terms → −1; only leakage currents

The reciprocity condition \(\alpha_F I_{ES} = \alpha_R I_{CS} = I_S\) (the transport saturation current) reduces the four EM parameters to three independent ones.

---

## 14.5 The Gummel-Poon Model: Second-Order Effects

The Ebers-Moll model assumes a fixed base width and ignores several physical effects that become important at circuit operating points. The **Gummel-Poon (GP) model** adds these corrections and forms the basis for SPICE BJT simulation.

### 14.5.1 Early Effect (Base-Width Modulation)

As the reverse bias on the B-C junction increases (\(V_{CE}\) increases), the B-C depletion region widens, eating into the neutral base region. This reduces the effective base width \(W_B\), which increases \(\beta\) and shifts \(I_C\) upward. On an \(I_C\) vs. \(V_{CE}\) characteristic, the lines are not horizontal but have a positive slope, all extrapolating back to a common point on the negative voltage axis: the **Early voltage** \(V_A\).

\[
I_C(V_{CE}) = I_S e^{qV_{BE}/k_BT} \cdot \left(1 + \frac{V_{CE}}{V_A}\right)
\]

The output resistance in the active region is:

\[
r_o = \frac{V_A}{I_C}
\]

For silicon NPN: \(V_A \approx 50\)–200 V. For HBTs with graded base: \(V_A\) can be negative (Early voltage "goes the wrong way") but this is an artifact of the model — the device is still well-behaved.

!!! mascot-warning "Nova Warns: Early Voltage Matters in Analog Circuits (and Often Gets Ignored)"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    In digital logic, the Early effect is a footnote — transistors switch quickly and never linger in linear mode. But in analog circuits, output resistance \(r_o = V_A/I_C\) is the key specification. A current mirror (used in every analog IC) has output resistance \(r_o\). A differential pair's gain is \(g_m r_o = V_A/V_T\) — entirely determined by the Early voltage and temperature. If your textbook problem gives you \(V_A = \infty\) to simplify, understand you're ignoring a first-order effect in any real analog design.

### 14.5.2 Kirk Effect (Base Push-Out at High Current)

At very high collector current densities, the concentration of electrons crossing the base becomes comparable to or exceeds the collector doping concentration. The space-charge neutrality of the collector region is disrupted: the "base" effectively extends into the collector. This is the **Kirk effect** (or base push-out). The effective base width increases dramatically, degrading \(\beta\) and \(f_T\).

The Kirk threshold current density:

\[
J_C^{\text{Kirk}} = q v_{\text{sat}} N_C + \frac{2\varepsilon_s v_{\text{sat}} V_{CB}}{W_C^2}
\]

where \(N_C\) is the collector doping and \(W_C\) is the collector width. The Kirk effect sets the **maximum useful operating current** for a given BJT. Exceeding it causes the device to slow down and lose gain even as the current continues to increase.

### 14.5.3 Series Resistances

Real BJTs have three parasitic resistances:

- **Base resistance** \(r_b\): Resistance of the base region between the base contact and the active base under the emitter. Most significant — limits high-frequency gain and causes voltage drops that reduce effective \(V_{BE}\).
- **Collector resistance** \(r_c\): Resistance of the lightly doped collector drift region. Causes ohmic \(V_{CE,\text{sat}}\) increase at high current.
- **Emitter resistance** \(r_e\): Resistance of the emitter contact and emitter bulk. Small but increases the effective transconductance denominator.

---

## 14.6 High-Frequency Performance: f_T and f_max

The speed of a BJT is characterized by two frequencies:

**Transition frequency \(f_T\)** is the frequency at which the common-emitter short-circuit current gain equals unity:

\[
f_T = \frac{g_m}{2\pi(C_{BE} + C_{BC})} \approx \frac{1}{2\pi \tau_F}
\]

where \(\tau_F\) is the forward transit time — the time for minority carriers to traverse the device. It has contributions from:

\[
\tau_F = \tau_{BE} + \tau_B + \tau_{BC} + \tau_C
\]

- \(\tau_{BE} = C_{BE}/g_m\): E-B depletion charging time
- \(\tau_B = W_B^2/(2D_n)\): base transit time (dominant in wide-base BJTs)
- \(\tau_{BC}\): B-C junction charging time
- \(\tau_C\): collector depletion traversal time (\(W_C/2v_{\text{sat}}\))

For a modern SiGe HBT, \(f_T\) can exceed 500 GHz.

**Maximum oscillation frequency \(f_{\max}\)** is the frequency at which the unilateral power gain equals unity — a more practical metric for RF circuit designers:

\[
f_{\max} = \sqrt{\frac{f_T}{8\pi r_b C_{BC}}}
\]

High \(f_{\max}\) requires both high \(f_T\) (thin base, fast transit) and low \(r_b C_{BC}\) (low base resistance and collector capacitance). These are competing requirements — thin base means higher base resistance — requiring careful layout and epitaxial design.

---

## 14.7 Heterojunction Bipolar Transistors (HBTs)

The standard silicon BJT faces a fundamental tradeoff: high \(\beta\) requires heavy emitter doping relative to base (\(N_{DE} \gg N_{AB}\)), but heavily doped emitters have high resistivity and high capacitance. The base must be lightly doped, which means high base resistance and slow devices.

The **heterojunction bipolar transistor (HBT)** breaks this tradeoff using a wider-bandgap emitter material. In a SiGe HBT, the emitter is silicon and the base is Si\(_{1-x}\)Ge\(_x\) (typically \(x = 0.15\)–0.25). The Ge in the base lowers the bandgap slightly, creating a valence band offset \(\Delta E_V\) at the E-B junction.

The **HBT band diagram** shows that the valence band offset suppresses hole injection from base to emitter — even without heavy emitter doping. The emitter injection efficiency:

\[
\gamma_{\text{HBT}} \approx \gamma_{\text{homojunction}} \times \exp\!\left(\frac{\Delta E_g}{k_BT}\right)
\]

With \(\Delta E_g \approx 100\) meV for \(x = 0.15\): \(\exp(0.1/0.026) \approx 46\times\) improvement in injection efficiency. This allows the base to be doped 10–100× more heavily than in a standard BJT — dramatically reducing base resistance — while maintaining or improving \(\beta\).

The Ge grading across the base creates an additional quasi-electric field:

\[
\mathcal{E}_{\text{quasi}} = -\frac{1}{q}\frac{dE_C}{dx} = \frac{\Delta E_g}{q W_B} \quad \text{(linearly graded Ge)}
\]

This aids electron transport across the base, reducing \(\tau_B\) without requiring a thinner physical base. SiGe HBTs with \(f_T > 300\) GHz and \(f_{\max} > 500\) GHz are commercially available and enable millimeter-wave communications (5G, automotive radar) that were impossible with silicon BJTs.

!!! mascot-celebration "Nova Celebrates: From Diffusion to 300 GHz"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    The bipolar transistor was invented in 1947 using point-contact metal on germanium. Modern SiGe HBTs operate at 300+ GHz using atomic-precision epitaxial Ge grading in a base thinner than 10 nm. The physics connecting these two devices is the *same* minority carrier diffusion theory you derived from the continuity equation. The engineering has become extraordinarily precise, but the physics underneath — minority carriers, quasi-Fermi levels, diffusion lengths — is exactly what you've been learning. That's the power of fundamental physics: it scales from 1947 germanium to 2024 sub-terahertz silicon.

<details markdown="1">
<summary>#### MicroSim: BJT Operating Regions Explorer</summary>

**sim-id:** `bjt-operating-regions`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive BJT characteristic curves viewer. Shows I-C vs. V-CE curves for multiple I-B values (output characteristics), with operating regions shaded (active, saturation, cutoff). A load line overlay shows the DC operating point for a user-adjustable collector resistor and supply voltage. The band diagram updates to show minority carrier profiles in the base at the selected operating point.

**Controls:**
- Sliders: \(\beta\), \(I_{B}\) step, \(V_{CC}\), \(R_C\)
- Slider: Early voltage \(V_A\) (50–500 V) to show output conductance effect
- Checkbox: Show load line
- Dropdown: NPN / PNP

**Key Learning Objectives:**
- L2 (Understand): Identify active, saturation, and cutoff regions on I-V characteristics
- L3 (Apply): Determine DC operating point from load line intersection
- L4 (Analyze): Explain how Early voltage affects current mirror accuracy

</details>

---

## Summary

This chapter covered bipolar junction transistor physics and models:

- **BJT operation** relies on minority carrier injection, base transport, and collector collection; thin base (\(W_B \ll L_n\)) gives high transport factor
- **Current gain** \(\beta = \gamma \cdot \alpha_T / (1 - \gamma \cdot \alpha_T)\) is determined by emitter injection efficiency and base transport factor
- **Ebers-Moll model** provides a unified four-region large-signal description using two coupled diode equations
- **Early effect** (base-width modulation) causes finite output resistance \(r_o = V_A/I_C\)
- **Kirk effect** (base push-out) degrades gain at high collector current densities
- **Transition frequency** \(f_T = 1/(2\pi\tau_F)\) and **maximum oscillation frequency** \(f_{\max} = \sqrt{f_T/(8\pi r_b C_{BC})}\) characterize RF performance
- **HBTs** use wider-bandgap emitters to achieve high \(\beta\) with heavy base doping and Ge grading to accelerate base transit; SiGe HBTs reach 300–500 GHz

## Key Equations

\[
\beta = \frac{I_C}{I_B}, \quad \alpha = \frac{I_C}{I_E} = \frac{\beta}{\beta+1}, \quad I_C = I_S e^{qV_{BE}/k_BT}
\]

\[
\alpha_T \approx 1 - \frac{W_B^2}{2D_n\tau_n}, \quad \gamma \approx 1 - \frac{D_p N_{AB} W_B}{D_n N_{DE} L_{pE}}
\]

\[
f_T = \frac{g_m}{2\pi(C_{BE}+C_{BC})}, \quad f_{\max} = \sqrt{\frac{f_T}{8\pi r_b C_{BC}}}
\]

\[
I_C(V_{CE}) = I_S e^{qV_{BE}/k_BT}\!\left(1 + \frac{V_{CE}}{V_A}\right)
\]
