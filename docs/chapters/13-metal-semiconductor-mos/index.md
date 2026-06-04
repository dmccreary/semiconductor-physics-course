---
title: Metal-Semiconductor Contacts and MOS Physics
description: Schottky barriers, thermionic emission, ohmic contacts, Fermi-level pinning, MOS capacitor physics, C-V characteristics, and gate oxide reliability
generated_by: claude skill chapter-content-generator
date: 2026-06-03 17:00:00
version: 0.08
---

# Metal-Semiconductor Contacts and MOS Physics

## Summary

This chapter covers two essential semiconductor-metal interfacial structures. Metal-semiconductor contacts begin with the Schottky-Mott rule relating barrier height to work function difference, followed by the thermionic emission model of Schottky diode current, image-force barrier lowering, ohmic contacts formed by tunneling through thin barriers (quantified by specific contact resistance and the transfer-length method), and Fermi-level pinning by metal-induced gap states. The second half develops the MOS capacitor in full: the three bias regimes (accumulation, depletion, strong and weak inversion), flat-band and threshold voltages, the body effect, four categories of oxide charge, high- and low-frequency C-V curves, deep depletion, and oxide reliability (gate oxide breakdown, TDDB, and hot-carrier oxide degradation). These results feed directly into MOSFET analysis in Chapters 15 and 16.

## Concepts Covered

This chapter covers the following 43 concepts from the learning graph:

1. Schottky-Mott Rule
2. Metal-Semiconductor Junction
3. Schottky Barrier
4. Schottky Barrier Height
5. Thermionic Emission
6. Thermionic Emission Current
7. Image Force Lowering
8. Barrier Lowering
9. Ohmic Contact
10. Tunneling Ohmic Contact
11. Specific Contact Resistance
12. Transfer Length Method
13. Fermi Level Pinning
14. Metal-Induced Gap States
15. Interface Trap Density
16. MOS Capacitor
17. MOS Structure
18. Metal-Oxide-Semiconductor
19. Gate Oxide
20. Silicon Dioxide Properties
21. High-K Dielectrics
22. Accumulation Region MOS
23. Depletion Region MOS
24. Inversion Region MOS
25. Strong Inversion
26. Weak Inversion
27. Flat-Band Condition
28. Flat-Band Voltage
29. Threshold Voltage
30. Body Effect
31. Oxide Charge
32. Fixed Oxide Charge
33. Interface Trapped Charge
34. Mobile Ionic Charge
35. Oxide Trapped Charge
36. C-V Characteristic MOS
37. High-Frequency C-V
38. Low-Frequency C-V
39. Deep Depletion
40. Gate Oxide Breakdown
41. Oxide Reliability
42. Time-Dependent Dielectric Breakdown
43. Hot Carrier Oxide Degradation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: Crystal Bonding, Defects, and Surfaces](../03-crystal-bonding-defects/index.md)
- [Chapter 8: Carrier Drift, Mobility, and Scattering Mechanisms](../08-carrier-drift-mobility/index.md)
- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../11-pn-junction-equilibrium/index.md)
- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../12-pn-junction-dynamics/index.md)

---

!!! mascot-welcome "Nova on Metal-Semiconductor Interfaces: The Boundary Conditions of Real Devices"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Here's a truth that textbooks sometimes bury: every real transistor is bounded by two metal contacts on one end and a metal-oxide-semiconductor stack on top. The beautiful theory we've built for p-n junctions lives inside the device, but what happens at the *edges* — where metal meets silicon — determines whether you have an ohmic contact or a rectifying diode, whether your gate controls the channel or accumulates charge at an interface trap. Today: the boundaries matter.

## 13.1 Metal-Semiconductor Contacts: The Schottky-Mott Rule

When a metal is placed in contact with a semiconductor, charge redistributes at the interface until the Fermi levels align — exactly as in a p-n junction, but now involving the metal Fermi level and the semiconductor band structure.

The **work function** \(\phi_m\) of the metal is the energy required to remove an electron from the metal Fermi level to vacuum. The semiconductor work function \(\phi_s = \chi + (E_C - E_F)/q\) similarly depends on the electron affinity \(\chi\) and the Fermi level position.

The **Schottky-Mott rule** predicts the Schottky barrier height from these quantities:

\[
\phi_B^n = \phi_m - \chi \quad \text{(barrier for electrons, n-type semiconductor)}
\]

\[
\phi_B^p = E_g/q - (\phi_m - \chi) \quad \text{(barrier for holes, p-type semiconductor)}
\]

For n-type silicon (\(\chi = 4.05\) eV) in contact with titanium (\(\phi_m = 4.33\) eV):

\[
\phi_B^n = 4.33 - 4.05 = 0.28 \text{ eV} \quad \text{(relatively low barrier)}
\]

For platinum (\(\phi_m = 5.65\) eV):

\[
\phi_B^n = 5.65 - 4.05 = 1.60 \text{ eV} \quad \text{(very high barrier, excellent Schottky diode)}
\]

**Rectifying vs. ohmic behavior:**

- If \(\phi_m > \phi_s\) (n-type): electrons must overcome \(\phi_B^n\) to flow from metal to semiconductor. **Schottky (rectifying) contact.**
- If \(\phi_m < \phi_s\) (n-type): no barrier, easy current flow in both directions. Technically ohmic — but this idealized case rarely occurs cleanly.

!!! mascot-warning "Nova Warns: Schottky-Mott Is a Beautiful Theory That Real Interfaces Mostly Ignore"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    The Schottky-Mott rule predicts that barrier height should vary linearly with metal work function. Experimental data for silicon shows the barrier height varies by only ~0.1–0.2 eV despite metal work functions spanning 1.5 eV — a phenomenon called **Fermi-level pinning** (Section 13.5). The pinning is so strong in silicon that the metal choice barely matters for barrier height. GaAs is even more pinned: nearly all metals give \(\phi_B \approx 0.8\) eV. The elegant Schottky-Mott theory is the right framework for thinking about contacts — but in practice, interface chemistry and metal-induced gap states control the outcome.

---

## 13.2 Thermionic Emission: Schottky Diode Current

Unlike p-n junctions where current flows by minority carrier diffusion, Schottky diode current is dominated by majority carriers with enough thermal energy to surmount the barrier — **thermionic emission**. Carriers that reach the barrier top are swept across by the electric field; the rate is governed by the Maxwell-Boltzmann tail of the carrier energy distribution.

The **thermionic emission current density** from semiconductor to metal is:

\[
J_{S \to M} = A^* T^2 \exp\!\left(-\frac{q\phi_B}{k_BT}\right) \exp\!\left(\frac{qV}{k_BT}\right)
\]

where \(A^* = 4\pi q m^* k_B^2 / h^3\) is the **Richardson constant** (modified for semiconductor effective mass). For silicon electrons: \(A^* \approx 110\) A/cm\(^2\)K\(^2\).

The total Schottky diode current (combining forward and reverse directions):

\[
J = J_s^{\text{Sch}}\!\left(e^{qV/k_BT} - 1\right), \quad J_s^{\text{Sch}} = A^* T^2 e^{-q\phi_B/k_BT}
\]

This looks identical in form to the Shockley diode equation — but the saturation current \(J_s^{\text{Sch}}\) is typically \(10^5\)–\(10^8\) times larger than for an equivalent p-n junction. The result: **Schottky diodes turn on at 0.2–0.4 V** compared to 0.6–0.7 V for silicon p-n junctions — lower forward voltage makes them preferred for low-loss rectification.

Another consequence: since Schottky current is by majority carriers, **there is no minority carrier storage**. Schottky diodes have essentially zero reverse recovery time — they switch off as fast as the RC time constant of the circuit. This is the physics behind Schottky rectifiers in switching power supplies.

### Image-Force Barrier Lowering

In an electric field, the Coulomb attraction between an electron and its "image charge" in the metal reduces the effective barrier height by:

\[
\Delta\phi_B = \sqrt{\frac{q\mathcal{E}_{\max}}{4\pi\varepsilon_s}}
\]

This **image-force lowering** (Schottky effect) increases with field (hence with reverse voltage), making the Schottky barrier somewhat voltage-dependent and causing a soft "leakage" that rises gradually with reverse voltage rather than the sharp avalanche of a p-n junction.

---

## 13.3 Ohmic Contacts

An **ohmic contact** is a metal-semiconductor junction with negligible contact resistance — it should not limit current and should not rectify. True ohmic contacts are achieved by one of two mechanisms:

1. **Heavy surface doping (tunneling ohmic contact):** If the semiconductor is doped heavily enough (\(N \gtrsim 10^{19}\)–\(10^{20}\) cm\(^{-3}\)) near the metal interface, the depletion width \(W \propto 1/\sqrt{N}\) becomes thin enough (\(<5\) nm) for carriers to tunnel through the barrier quantum-mechanically, even if the barrier height is large. This is the dominant mechanism for ohmic contacts in practical silicon CMOS.

2. **Low barrier height:** Choosing a metal with \(\phi_m < \phi_s\) theoretically gives no barrier. Difficult in practice due to Fermi-level pinning.

The **specific contact resistance** \(\rho_c\) (units: Ω·cm\(^2\)) characterizes contact quality:

\[
\rho_c = \left(\frac{\partial J}{\partial V}\right)^{-1}\bigg|_{V=0}
\]

For tunneling-dominated ohmic contacts at high doping:

\[
\rho_c \propto \exp\!\left(\frac{2\phi_B}{\hbar}\sqrt{\frac{\varepsilon_s m^*}{N}}\right)
\]

\(\rho_c\) decreases exponentially with \(\sqrt{N}\) — heavier doping gives dramatically lower contact resistance. For \(N = 10^{20}\) cm\(^{-3}\): \(\rho_c \sim 10^{-7}\)–\(10^{-8}\) Ω·cm\(^2\). For modern gate contacts in advanced nodes, \(\rho_c \sim 10^{-9}\) Ω·cm\(^2\) is the target.

The **transfer length method (TLM)** uses a pattern of rectangular contacts at varying spacings on a semiconductor strip. Four-probe resistance measurements vs. contact spacing allow extraction of both \(\rho_c\) and the semiconductor sheet resistance, separating the contact resistance from bulk contributions.

---

## 13.4 Fermi-Level Pinning and Metal-Induced Gap States

The observed independence of Schottky barrier height from metal work function in many semiconductor systems — particularly GaAs and InP — is explained by **metal-induced gap states (MIGS)**.

When a metal is brought into intimate contact with a semiconductor, the metal's electron wavefunctions do not abruptly stop at the interface — they decay exponentially into the semiconductor bandgap (evanescent modes). These states have energies within the semiconductor bandgap and are associated with the metal's Fermi level. They act as an effective charge reservoir that pins the semiconductor's surface Fermi level at a **charge neutrality level** (CNL) that is an intrinsic property of the semiconductor, independent of the metal.

The barrier height becomes:

\[
\phi_B \approx \phi_{\text{CNL}} + S(\phi_m - \phi_{\text{CNL}})
\]

where \(S\) is the **slope parameter** (Fermi-level pinning parameter, 0 = fully pinned, 1 = unpinned). For silicon: \(S \approx 0.27\) (moderately pinned). For GaAs: \(S \approx 0.09\) (strongly pinned). For ionic semiconductors like SiC or GaN: \(S \approx 0.4\)–0.6 (less pinned, Schottky-Mott more applicable).

**Interface trap density** \(D_{\text{it}}\) (units: cm\(^{-2}\)eV\(^{-1}\)) quantifies the density of interface states, which contribute both to Fermi-level pinning (if large) and to scattering and threshold voltage instability in MOSFETs. For the Si/SiO\(_2\) interface achieved by thermal oxidation: \(D_{\text{it}} \approx 10^{10}\)–\(10^{11}\) cm\(^{-2}\)eV\(^{-1}\) — remarkably low, and a key reason silicon became dominant despite not being the highest-mobility or highest-bandgap semiconductor.

---

## 13.5 The MOS Capacitor: Structure and Bias Regimes

The **metal-oxide-semiconductor (MOS) capacitor** is the foundational structure of CMOS technology. It consists of a gate metal (or doped polysilicon), a gate oxide (SiO\(_2\) or high-k dielectric), and a doped semiconductor substrate. Understanding the MOS capacitor is a prerequisite for all MOSFET analysis.

We will analyze an n-channel configuration: **p-type silicon** substrate with a gate metal on top. Before applying bias, consider the equilibrium band diagram: the metal Fermi level, the oxide gap (no states inside), and the semiconductor bands all must be consistent with no charge flow.

**Gate oxide properties:**
- **Silicon dioxide (SiO\(_2\))**: Bandgap ~9 eV, dielectric constant \(\varepsilon_{\text{ox}} = 3.9\), breakdown field ~10 MV/cm. Thermally grown SiO\(_2\)/Si interface has historically low \(D_{\text{it}}\).
- **High-k dielectrics**: HfO\(_2\) (\(k \approx 25\)), Al\(_2\)O\(_3\) (\(k \approx 9\)), ZrO\(_2\) (\(k \approx 25\)). Required for sub-45 nm nodes where SiO\(_2\) became too thin (tunneling leakage). High-k allows physically thicker dielectric for same capacitance.

The **equivalent oxide thickness (EOT)** normalizes high-k oxides to their equivalent SiO\(_2\) thickness:

\[
t_{\text{EOT}} = t_{\text{high-k}} \cdot \frac{\varepsilon_{\text{SiO}_2}}{\varepsilon_{\text{high-k}}}
\]

A 4 nm HfO\(_2\) film has \(t_{\text{EOT}} = 4 \times (3.9/25) = 0.62\) nm — much thinner than any physically stable SiO\(_2\) film.

### Three Bias Regimes

Applying a gate voltage \(V_G\) creates three distinct regions of semiconductor behavior:

**Accumulation (\(V_G < V_{FB}\)):** Negative gate voltage (on p-type substrate) attracts majority carriers (holes) toward the oxide interface. The semiconductor surface is in accumulation — more holes than the equilibrium bulk concentration. The semiconductor surface behaves as a good conductor; the system looks like two capacitors in series (oxide capacitance \(C_{\text{ox}}\) dominates).

**Depletion (\(V_{FB} < V_G < V_T\)):** A positive gate voltage repels holes from the surface, leaving a depletion region of exposed ionized acceptors (negative charges). The system looks like oxide capacitance in series with the depletion capacitance of the semiconductor — total capacitance decreases.

**Inversion (\(V_G > V_T\)):** As the gate voltage increases further, the bands bend enough to bring the intrinsic level below the Fermi level at the surface — the surface becomes n-type locally, forming an **inversion layer** of electrons. This is the channel of a MOSFET.

The transition from depletion to strong inversion is defined by the **threshold condition**: the surface potential equals twice the Fermi potential:

\[
\psi_s = 2\phi_F, \quad \phi_F = \frac{k_BT}{q}\ln\!\left(\frac{N_A}{n_i}\right)
\]

**Weak inversion** is the regime just below threshold (\(\psi_s < 2\phi_F\)) where the inversion charge is small and the current is exponentially sensitive to gate voltage — the subthreshold regime of MOSFETs.

**Strong inversion** is the regime above threshold (\(\psi_s \geq 2\phi_F\)) where the inversion charge density increases linearly with gate voltage.

---

## 13.6 Flat-Band Voltage and Threshold Voltage

**Flat-band condition** is the gate voltage at which there is no band bending in the semiconductor — the bands are "flat." For an ideal MOS structure with no oxide charges and work-function-matched metal and semiconductor, \(V_{FB} = 0\). In practice:

\[
V_{FB} = \phi_{ms} - \frac{Q_{\text{ox}}}{C_{\text{ox}}}
\]

where \(\phi_{ms} = \phi_m - \phi_s\) is the metal-semiconductor work function difference, and \(Q_{\text{ox}}\) is the total effective oxide charge density (C/cm\(^2\)).

The **threshold voltage** for an NMOS (p-substrate):

\[
V_T = V_{FB} + 2\phi_F + \frac{qN_A W_{\text{dep,max}}}{C_{\text{ox}}}
\]

where \(W_{\text{dep,max}} = \sqrt{4\varepsilon_s \phi_F / qN_A}\) is the maximum depletion width at threshold.

The third term — \(Q_{\text{dep,max}}/C_{\text{ox}} = qN_A W_{\text{dep,max}}/C_{\text{ox}}\) — is the voltage needed to support the fully depleted depletion charge before inversion can form. This term grows with doping and with oxide thickness (through \(C_{\text{ox}} = \varepsilon_{\text{ox}}/t_{\text{ox}}\)).

**Body effect:** When a source-to-body voltage \(V_{SB}\) is applied (bulk terminal biased relative to source), the threshold voltage increases:

\[
V_T(V_{SB}) = V_{T0} + \gamma\!\left(\sqrt{2\phi_F + V_{SB}} - \sqrt{2\phi_F}\right)
\]

where the **body effect coefficient** \(\gamma = \sqrt{2q\varepsilon_s N_A}/C_{\text{ox}}\). The body effect is why NMOS transistors in a circuit have higher threshold voltages than the device measured at \(V_{SB} = 0\) — a common source of confusion in analog circuit design.

---

## 13.7 Oxide Charges: The Four Categories

Decades of experimental work identified four distinct types of charge associated with the gate oxide stack:

| Category | Symbol | Location | Cause | Temperature Dependent? |
|----------|--------|----------|-------|------------------------|
| Fixed oxide charge | \(Q_f\) | Within 2 nm of Si/SiO\(_2\) | Excess Si or broken Si-O bonds at interface | No |
| Interface trapped charge | \(Q_{it}\) | At Si/SiO\(_2\) interface | Dangling Si bonds, can be charged/discharged | Yes (capture/emission) |
| Mobile ionic charge | \(Q_m\) | Within oxide bulk | Na\(^+\), K\(^+\), Li\(^+\) contamination | Yes (moves at high T) |
| Oxide trapped charge | \(Q_{ot}\) | Within oxide bulk | Trapped electrons/holes from radiation or hot carriers | Yes (can be annealed) |

**Fixed oxide charge** \(Q_f\) is positive and arises from the oxidation process. It is located very close to the Si surface (~1–2 nm) and is essentially immobile under normal electric fields. Its primary effect is to shift \(V_{FB}\) and \(V_T\). Typical values: \(Q_f/q \sim 10^{10}\)–\(10^{11}\) cm\(^{-2}\) for good thermal oxides.

**Interface trapped charge** \(Q_{it}\) has states distributed through the bandgap that can exchange charge with the semiconductor. Occupancy changes with gate voltage (frequency-dependent!), causing C-V stretch-out and degrading subthreshold slope. Annealing in forming gas (H\(_2\)/N\(_2\)) passivates most dangling bonds with hydrogen, reducing \(D_{it}\) to ~\(10^{10}\) cm\(^{-2}\)eV\(^{-1}\).

**Mobile ionic charge** \(Q_m\) was the plague of early MOS transistors. Sodium contamination from handling and chemicals drifts through SiO\(_2\) at elevated temperatures and electric fields, causing threshold voltage instability. Modern fab cleanliness protocols have reduced this to negligible levels, but it remains a concern for non-silicon CMOS and in reliability testing.

**Oxide trapped charge** \(Q_{ot}\) is injected during radiation exposure (space electronics, particle physics detectors) or by hot carriers (device aging). It causes \(V_T\) shift and transconductance degradation over the device lifetime.

---

## 13.8 C-V Characteristics of the MOS Capacitor

The most powerful characterization tool for the MOS capacitor is the **capacitance-voltage (C-V) measurement**. C-V curves reveal threshold voltage, flat-band voltage, oxide thickness, interface trap density, and oxide charge — all from a single electrical measurement.

The total MOS capacitance is:

\[
\frac{1}{C_{\text{total}}} = \frac{1}{C_{\text{ox}}} + \frac{1}{C_s(\psi_s)}
\]

where \(C_s\) is the semiconductor capacitance (depletion capacitance plus inversion capacitance).

Two measurement frequencies give qualitatively different results:

**High-frequency C-V:** At frequencies above ~1 MHz, inversion layer electrons cannot follow the AC signal (they can't be created/annihilated fast enough). Above threshold, \(C_{\text{total}}\) stays at \(C_{\text{min}}\) (the oxide capacitance in series with the maximum depletion capacitance). The high-frequency curve shows a minimum in the inversion region.

**Low-frequency (quasi-static) C-V:** At very low frequencies (<10 Hz) or DC sweep, inversion charge can respond. Above threshold, \(C \to C_{\text{ox}}\) again (inversion charge screens the semiconductor). The low-frequency curve rises back to \(C_{\text{ox}}\) in inversion — a characteristic S-shape with accumulation → minimum → \(C_{\text{ox}}\) rise.

**Deep depletion:** If the gate voltage is swept rapidly into inversion (sweep rate faster than minority carrier generation), inversion charge can't form. The depletion region grows beyond \(W_{\text{dep,max}}\), and capacitance continues to decrease below \(C_{\text{min}}\). Deep depletion only exists transiently — thermally generated minority carriers eventually fill the inversion layer (the "thermal equilibration time" is the generation lifetime, ~microseconds to milliseconds).

!!! mascot-tip "Nova Tips: The C-V Shift Is Your Diagnostic Fingerprint"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova with tip pose">
    Each oxide charge type leaves a different fingerprint on the C-V curve. A **parallel shift** of the entire C-V curve along the voltage axis (without shape change) indicates fixed charge \(Q_f\) or mobile charge \(Q_m\). A **stretch-out** (the curve spreads over a wider voltage range without shifting its midpoint) indicates interface trap charge \(Q_{it}\). Temperature-dependent shifts during bias-temperature stress (BTS) measurement reveal mobile ionic charges. Knowing these signatures lets you diagnose oxide quality from a single C-V measurement — which is why MOS C-V is one of the most frequently performed measurements in any semiconductor fab.

<details markdown="1">
<summary>#### MicroSim: MOS Capacitor C-V Explorer</summary>

**sim-id:** `mos-cv-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive MOS C-V simulator showing accumulation, depletion, and inversion regions. Two curves shown: high-frequency and low-frequency. User can adjust oxide thickness, substrate doping, oxide charge, interface trap density, and metal work function. The band diagram updates simultaneously with the C-V curve position. Labels identify \(V_{FB}\), \(V_T\), \(C_{\text{ox}}\), and \(C_{\text{min}}\).

**Controls:**
- Slider: Gate oxide thickness \(t_{\text{ox}}\) (1–20 nm)
- Slider: Substrate doping \(N_A\) (\(10^{15}\)–\(10^{18}\) cm\(^{-3}\))
- Slider: Oxide charge \(Q_f\) (shift charge: \(-10^{12}\) to \(+10^{12}\) cm\(^{-2}\))
- Slider: Interface trap density \(D_{it}\) (0 to \(10^{12}\) cm\(^{-2}\)eV\(^{-1}\))
- Radio: High-freq / Low-freq / Both curves
- Checkbox: Show deep depletion curve

**Key Learning Objectives:**
- L2 (Understand): Identify accumulation, depletion, and inversion regions from C-V shape
- L3 (Apply): Extract \(V_{FB}\), \(V_T\), \(t_{\text{ox}}\), and \(N_A\) from a C-V curve
- L4 (Analyze): Diagnose oxide charge type from C-V shifts vs. stretch-out

</details>

---

## 13.9 Gate Oxide Reliability

The thin gate oxide is under enormous electric stress — up to 5–15 MV/cm in modern transistors. At these fields, several reliability failure mechanisms operate:

**Gate oxide breakdown (hard breakdown):** At sufficiently high field, SiO\(_2\) experiences catastrophic bond rupture, creating a conductive path through the oxide. Breakdown is typically modeled by the **E-model** or the **1/E model**:

\[
t_{\text{BD}} \propto \exp\!\left(\frac{-E_{\text{ox}}}{E_0}\right) \quad \text{(E-model)} \quad \text{or} \quad \exp\!\left(\frac{A}{E_{\text{ox}}}\right) \quad \text{(1/E model)}
\]

where \(t_{\text{BD}}\) is the time to breakdown, \(E_{\text{ox}} = V_G/t_{\text{ox}}\) is the oxide field, and \(E_0\), \(A\) are material constants.

**Time-Dependent Dielectric Breakdown (TDDB):** Even at normal operating fields, defects accumulate stochastically over time. Electron trapping, hole-generated interface damage, and percolation of defect clusters eventually create a conductive path. TDDB is characterized by the Weibull distribution and sets the 10-year reliability specification for gate oxides. The Weibull slope \(\beta > 1\) for TDDB (failure rate increases with age) — meaning old oxides are more likely to fail than young ones, unlike random failures (\(\beta = 1\)).

**Hot-carrier oxide degradation (HCI):** Hot electrons injected from the silicon channel into the gate oxide (Section 8.5) create interface traps and trapped charge. Over millions of switching cycles, this shifts \(V_T\) and degrades transconductance. HCI sets the AC operating lifetime limit for short-channel MOSFETs.

!!! mascot-celebration "Nova Celebrates: You Now Understand the Transistor's Foundation"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    With metal-semiconductor contacts and MOS physics in hand, you have the complete foundation for MOSFET analysis. The Schottky barrier physics (Chapter 13) governs the ohmic source/drain contacts and the Schottky-barrier FETs used in low-power and carbon nanotube transistors. The MOS capacitor analysis (also Chapter 13) is the direct precursor to long-channel MOSFET operation (Chapter 15) and short-channel effects (Chapter 16). Chapters 11–13 together form the complete interface physics toolkit for the semiconductor industry. Time to jump bands into transistors!

---

## Summary

This chapter covered the physics of semiconductor interfaces:

- **Schottky-Mott rule** predicts barrier height from work function difference; Fermi-level pinning by MIGS reduces sensitivity to metal choice
- **Thermionic emission** gives Schottky diode I-V with large \(I_s\); no minority carrier storage → zero reverse recovery
- **Ohmic contacts** require heavy doping (\(N > 10^{19}\) cm\(^{-3}\)) so carriers tunnel through the thin barrier; characterized by specific contact resistance \(\rho_c\)
- **TLM** separates contact and sheet resistance from multi-contact resistance measurements
- **MOS capacitor** has three bias regimes: accumulation, depletion, inversion; threshold defined by \(\psi_s = 2\phi_F\)
- **Threshold voltage** depends on work function difference, oxide charges, and body bias (body effect coefficient \(\gamma\))
- **Four oxide charge types:** fixed, interface trapped, mobile ionic, oxide trapped — each with distinct C-V signatures
- **C-V measurement** reveals \(V_{FB}\), \(V_T\), \(C_{\text{ox}}\), \(D_{it}\), and oxide charge from a single sweep
- **Reliability mechanisms:** hard breakdown, TDDB (Weibull statistics), and HCI degrade gate oxide with use and time

## Key Equations

\[
\phi_B^n = \phi_m - \chi, \quad J = A^*T^2 e^{-q\phi_B/k_BT}(e^{qV/k_BT} - 1)
\]

\[
V_{FB} = \phi_{ms} - \frac{Q_{\text{ox}}}{C_{\text{ox}}}
\]

\[
V_T = V_{FB} + 2\phi_F + \frac{qN_A W_{\text{dep,max}}}{C_{\text{ox}}}, \quad \phi_F = \frac{k_BT}{q}\ln\!\left(\frac{N_A}{n_i}\right)
\]

\[
V_T(V_{SB}) = V_{T0} + \gamma\!\left(\sqrt{2\phi_F + V_{SB}} - \sqrt{2\phi_F}\right), \quad \gamma = \frac{\sqrt{2q\varepsilon_s N_A}}{C_{\text{ox}}}
\]
