---
title: Carrier Drift, Mobility, and Scattering Mechanisms
description: Microscopic scattering physics that underlies macroscopic mobility, velocity saturation, and hot-carrier phenomena in semiconductor transport
generated_by: claude skill chapter-content-generator
date: 2026-06-03 14:30:00
version: 0.08
---

# Carrier Drift, Mobility, and Scattering Mechanisms

## Summary

This chapter develops the drift component of carrier transport. The macroscopic mobility parameter is shown to arise from microscopic scattering events that randomize carrier momentum. Students analyze each major scattering mechanism — acoustic and optical phonon scattering, intervalley scattering, ionized impurity scattering, neutral impurity scattering, surface roughness scattering, and alloy scattering — understanding the temperature and doping dependences of each. Matthiessen's rule combines these mechanisms into a net mobility. At high electric fields, velocity saturation and hot-carrier phenomena deviate from the simple linear drift-velocity relationship, with important consequences for short-channel devices.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Drift Current
2. Drift Velocity
3. Carrier Mobility
4. Electron Mobility
5. Hole Mobility
6. Low-Field Mobility
7. High-Field Mobility
8. Velocity Saturation
9. Saturation Velocity
10. Hot Carriers
11. Lattice Scattering
12. Phonon Scattering
13. Acoustic Phonon Scattering
14. Optical Phonon Scattering
15. Intervalley Scattering
16. Ionized Impurity Scattering
17. Neutral Impurity Scattering
18. Surface Roughness Scattering
19. Alloy Scattering
20. Matthiessen Rule
21. Mobility Temperature Dependence
22. Mobility Doping Dependence

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Bloch's Theorem, Band Formation, and E-k Diagrams](../05-bloch-theorem-band-theory/index.md)
- [Chapter 7: Doping, Extrinsic Carriers, and the Fermi Level](../07-doping-extrinsic-carriers/index.md)

---

!!! mascot-welcome "Nova Reports for Drift Duty"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Good news: electrons in silicon move! Bad news: they can't go two nanometers without getting knocked off course by a vibrating atom, an ionized impurity, or a rough interface. Today we're going to understand *why* electrons and holes stumble around like they're at a physics department holiday party — and more importantly, how to calculate exactly how slowly they stumble. Welcome to mobility: the quantity that makes a MOSFET fast or slow.

## 8.1 Drift Current and the Electric Field Response

When an electric field \(\mathcal{E}\) is applied to a semiconductor, free carriers experience a force and begin to accelerate. But unlike electrons in vacuum, carriers in a crystal can't accelerate indefinitely — they continuously scatter off imperfections, losing momentum and reaching a terminal drift velocity. This steady-state drift is what produces current in resistors, diodes, and transistors.

The **drift current density** is the product of carrier charge, concentration, and drift velocity:

\[
J_n^{\text{drift}} = q \, n \, v_{d,n}
\]

\[
J_p^{\text{drift}} = q \, p \, v_{d,p}
\]

where \(v_{d,n}\) and \(v_{d,p}\) are the drift velocities of electrons and holes, respectively. Note the sign convention: electrons drift *opposite* to \(\mathcal{E}\) (negative charge), but their current contribution is in the same direction as \(\mathcal{E}\) because current is defined as positive charge flow.

At low electric fields, drift velocity is proportional to the field — a linear regime where the proportionality constant is called **mobility** \(\mu\):

\[
v_{d,n} = -\mu_n \mathcal{E}, \quad v_{d,p} = +\mu_p \mathcal{E}
\]

(Electron drift is opposite to \(\mathcal{E}\); hole drift is along \(\mathcal{E}\).)

Combining, the total drift current density is:

\[
J^{\text{drift}} = (q n \mu_n + q p \mu_p) \mathcal{E} = \sigma \mathcal{E}
\]

where \(\sigma = q(n\mu_n + p\mu_p)\) is the **conductivity** (units: S/cm or (Ω·cm)\(^{-1}\)). The resistivity is \(\rho = 1/\sigma\).

---

## 8.2 Carrier Mobility: Definition and Physical Origin

**Mobility** \(\mu\) (units: cm\(^2\)/V·s) is defined as the drift velocity per unit electric field in the low-field limit. It is the single most important transport parameter in semiconductor devices.

Before we state the formal definition, we need to understand the microscopic picture. Carriers in thermal equilibrium move at high thermal velocities — roughly \(v_{\text{th}} \approx \sqrt{3k_BT/m^*} \approx 10^7\) cm/s at room temperature. This random thermal motion averages to zero net drift. When a field is applied, it adds a small systematic drift on top of this chaotic thermal background.

The systematic drift is interrupted by **scattering events** — random momentum-randomizing collisions that reset the carrier's direction. After each collision, the carrier starts fresh, being accelerated by the field again. The average time between collisions is the **mean free time** (or momentum relaxation time) \(\tau_m\).

Between collisions, a carrier accelerates freely:

\[
m^* \frac{dv}{dt} = q\mathcal{E} \implies v = \frac{q\mathcal{E}}{m^*} t
\]

Averaging over time up to the next collision gives:

\[
\langle v_d \rangle = \frac{q\mathcal{E}}{m^*} \cdot \frac{\tau_m}{2} \quad \text{(uniform $\tau_m$ distribution)}
\]

But the proper quantum-mechanical average (using exponentially distributed scattering times) gives:

\[
\langle v_d \rangle = \frac{q \tau_m}{m^*} \mathcal{E}
\]

Therefore:

\[
\boxed{\mu = \frac{q \tau_m}{m^*}}
\]

This is the central result: **mobility increases with longer mean free time and decreases with larger effective mass.** The two engineering levers for improving mobility are (1) reducing scattering to increase \(\tau_m\), and (2) using materials with smaller \(m^*\).

!!! mascot-thinking "Nova Thinks: Effective Mass Is Not Just Mass"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    Electrons in GaAs have an effective mass of only \(0.067\, m_0\) — about 15× lighter than silicon's \(0.26\, m_0\) for conduction electrons. This is why GaAs electron mobility (~8500 cm²/V·s) absolutely trounces silicon's (~1400 cm²/V·s). The electron isn't actually lighter — it's moving through a lattice whose periodic potential curves the E-k band into a very tight parabola at the minimum. Light curvature = large effective mass; tight curvature = small effective mass. Band structure engineering is mass engineering.

**Reference values for silicon at 300 K:**

| Parameter | Electrons | Holes |
|-----------|-----------|-------|
| Mobility \(\mu\) (cm²/V·s) | 1400 | 450 |
| Effective mass \(m^*\) | \(0.26\, m_0\) | \(0.37\, m_0\) (avg) |
| Mean free time \(\tau_m\) (ps) | ~0.27 | ~0.19 |

Electrons are roughly 3× more mobile than holes in silicon, primarily because of effective mass differences and valley degeneracy in the E-k band structure.

---

## 8.3 Scattering Mechanisms: The Cast of Culprits

Mobility is limited by scattering, and there are many ways to scatter a carrier in a real crystal. Before examining each, we state **Matthiessen's rule**: when multiple independent scattering mechanisms act simultaneously, the total scattering rate is the sum of individual rates:

\[
\frac{1}{\tau_m} = \frac{1}{\tau_1} + \frac{1}{\tau_2} + \frac{1}{\tau_3} + \cdots
\]

Since \(\mu \propto \tau_m\), Matthiessen's rule for mobilities reads:

\[
\frac{1}{\mu} = \frac{1}{\mu_1} + \frac{1}{\mu_2} + \frac{1}{\mu_3} + \cdots
\]

The **lowest** individual mobility dominates the total. This is a profound (and somewhat depressing) result: even if you reduce phonon scattering to near zero by cooling, a single bad impurity scattering mechanism can cap your mobility. Improving mobility means improving the *worst* bottleneck.

### 8.3.1 Lattice (Phonon) Scattering

The crystal lattice vibrates at all temperatures above 0 K. These quantized lattice vibrations — **phonons** — scatter carriers by modulating the local crystal potential. Lattice scattering is the dominant mechanism in pure silicon at room temperature.

Two phonon types scatter differently:

**Acoustic phonon scattering** involves carriers interacting with long-wavelength, low-energy lattice vibrations (sound waves). The deformation potential couples carrier energy to the local strain field. The scattering rate increases with temperature (more phonons at higher T), giving:

\[
\mu_{\text{ac}} \propto T^{-3/2}
\]

This \(T^{-3/2}\) dependence is a signature: if you measure mobility vs. temperature in a pure semiconductor and see a \(-3/2\) slope on a log-log plot, acoustic phonon scattering is ruling.

**Optical phonon scattering** involves higher-energy phonons (energy \(\hbar\omega_{\text{op}} \approx 63\) meV in silicon) that can be absorbed or emitted only when the carrier has enough energy. Below the optical phonon energy threshold, optical phonon emission is suppressed. Above threshold — for hot carriers — optical phonon emission is extremely effective at removing energy. The threshold behavior is nonlinear and becomes important at high fields.

### 8.3.2 Intervalley Scattering

Silicon has six equivalent conduction band minima (valleys) in the \(\langle 100 \rangle\) directions. An electron can scatter from one valley to another via high-energy phonon processes (f-type and g-type intervalley scattering). Intervalley scattering has a phonon energy threshold and increases sharply with temperature. It effectively couples all six valleys together, making silicon behave as if the valleys share a common scattering pool.

### 8.3.3 Ionized Impurity Scattering

Ionized donors (\(N_D^+\)) and acceptors (\(N_A^-\)) create long-range Coulomb potentials that deflect passing carriers. Unlike phonon scattering, ionized impurity scattering is most effective at **low temperatures** — a slow carrier (low thermal velocity) spends more time near the Coulomb center and gets deflected more strongly.

The mobility limited by ionized impurity scattering follows the Brooks-Herring model:

\[
\mu_{\text{ii}} \propto \frac{T^{3/2}}{N_I}
\]

where \(N_I = N_D^+ + N_A^-\) is the total ionized impurity concentration. This temperature dependence is the *opposite* of phonon scattering, making it easy to distinguish the two mechanisms experimentally: if mobility *increases* with increasing temperature, ionized impurity scattering is dominant (typical at low T or very high doping).

!!! mascot-warning "Nova Warns: Mobility vs. Doping Is a Two-Mechanism Story"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    When you look up "mobility vs. doping" curves for silicon (Sze Fig. 1.17 is the classic), you see mobility dropping monotonically as doping increases — from ~1400 cm²/V·s at low doping to ~100 cm²/V·s at \(10^{19}\) cm\(^{-3}\). This drop is caused by ionized impurity scattering, not by some mysterious property of heavily doped silicon. The Matthiessen rule sum of phonon + ionized impurity gives the observed curve. Understanding the *mechanism* tells you how to fight it: high-temperature annealing can "activate" dopants without adding excess ionized impurities beyond what you intend.

### 8.3.4 Neutral Impurity Scattering

Unionized (neutral) dopant atoms and other neutral defects also scatter carriers, via short-range quantum-mechanical perturbation of the local potential. Neutral impurity scattering is temperature-independent (unlike phonon and ionized impurity scattering) and matters primarily at very low temperatures where phonons are frozen out and most impurities are neutral (freeze-out regime).

\[
\mu_{\text{ni}} \propto \frac{1}{N_{\text{neutral}}} \quad \text{(temperature-independent)}
\]

### 8.3.5 Surface Roughness Scattering

At a Si/SiO\(_2\) interface in a MOSFET, the interface is atomically rough on the scale of 0.1–0.5 nm. Carriers in the inversion layer (the conducting channel) are confined within ~1–2 nm of the interface and scatter strongly off this roughness. Surface roughness scattering increases at high gate fields (which push carriers harder against the interface) and limits the channel mobility in advanced MOSFETs.

\[
\mu_{\text{sr}} \propto \frac{1}{\mathcal{E}_{\perp}^2} \quad \text{(at high perpendicular field)}
\]

This field dependence is why MOSFET channel mobility decreases at high gate voltage — counterintuitive but unavoidable.

### 8.3.6 Alloy Scattering

In compound semiconductors like AlGaAs or SiGe, the random arrangement of different atoms (e.g., Al and Ga sharing the cation sites) creates random potential fluctuations even in a defect-free crystal. This **alloy scattering** is fundamental to alloy materials and cannot be eliminated by purification.

\[
\mu_{\text{alloy}} \propto \frac{1}{x(1-x)} \quad \text{(x = alloy fraction)}
\]

Alloy scattering is maximized at \(x = 0.5\) (50% composition) and vanishes at \(x = 0\) or \(x = 1\) (pure materials).

---

## 8.4 Mobility Temperature and Doping Dependence

Combining all the scattering mechanisms via Matthiessen's rule gives characteristic dependences on temperature and doping that are well-established empirically for silicon:

**Temperature dependence of low-field mobility (lightly doped Si):**

\[
\mu_n(T) \approx \mu_{n,300} \left(\frac{T}{300}\right)^{-2.42}, \quad \mu_p(T) \approx \mu_{p,300} \left(\frac{T}{300}\right)^{-2.20}
\]

The exponent near \(-2.4\) is close to but not exactly \(-3/2\) because multiple phonon mechanisms contribute with different power laws.

**Doping dependence (Caughey-Thomas empirical model at 300 K):**

\[
\mu_n(N_I) = \mu_{n,\min} + \frac{\mu_{n,0} - \mu_{n,\min}}{1 + (N_I/N_{\text{ref},n})^{\alpha_n}}
\]

For silicon electrons: \(\mu_{n,\min} = 65\) cm\(^2\)/V·s, \(\mu_{n,0} = 1330\) cm\(^2\)/V·s, \(N_{\text{ref},n} = 1.26 \times 10^{17}\) cm\(^{-3}\), \(\alpha_n = 0.85\).

| \(N_I\) (cm\(^{-3}\)) | \(\mu_n\) (cm\(^2\)/V·s) | \(\mu_p\) (cm\(^2\)/V·s) |
|-----------------------|--------------------------|--------------------------|
| \(10^{13}\) | 1350 | 480 |
| \(10^{15}\) | 1280 | 460 |
| \(10^{16}\) | 1200 | 420 |
| \(10^{17}\) | 900 | 290 |
| \(10^{18}\) | 400 | 150 |
| \(10^{19}\) | 130 | 70 |

<details markdown="1">
<summary>#### MicroSim: Carrier Mobility Explorer</summary>

**sim-id:** `carrier-mobility-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Two-panel interactive visualization. Left panel: log-log plot of mobility vs. temperature (50–600 K) showing total mobility and contributions from each scattering mechanism (acoustic phonon, optical phonon, intervalley, ionized impurity). Right panel: log-log plot of mobility vs. doping at 300 K. User can toggle individual mechanisms on/off to see Matthiessen's rule in action.

**Controls:**
- Dropdown: Carrier type (electrons / holes)
- Slider: Doping concentration (logarithmic, \(10^{14}\) to \(10^{19}\) cm\(^{-3}\))
- Checkboxes: Toggle each scattering mechanism on/off
- Button: Reset to defaults

**Key Learning Objectives:**
- L2 (Understand): Identify which scattering mechanism dominates at a given T and doping
- L3 (Apply): Use Matthiessen's rule to combine partial mobilities
- L4 (Analyze): Predict how a design change (e.g., increasing temperature or doping) affects net mobility

</details>

---

## 8.5 High-Field Transport: Velocity Saturation and Hot Carriers

At low electric fields, \(v_d = \mu \mathcal{E}\) — drift velocity scales linearly with field. This is the regime we've been working in. But as the field increases beyond roughly \(10^3\)–\(10^4\) V/cm in silicon, something breaks the linearity: velocity saturation.

The **low-field mobility** \(\mu_0\) describes the linear regime. The **high-field mobility** is field-dependent and is defined as the differential ratio:

\[
\mu_{\text{HF}}(\mathcal{E}) = \frac{dv_d}{d\mathcal{E}}
\]

As the field increases, \(\mu_{\text{HF}}\) decreases, and \(v_d\) approaches a constant maximum called the **saturation velocity** \(v_{\text{sat}}\). In silicon:

\[
v_{\text{sat},n} \approx 1.07 \times 10^7 \text{ cm/s}, \quad v_{\text{sat},p} \approx 8.4 \times 10^6 \text{ cm/s at 300 K}
\]

A widely used empirical model for the velocity-field relationship is:

\[
v_d(\mathcal{E}) = \frac{\mu_0 \mathcal{E}}{\left[1 + \left(\frac{\mathcal{E}}{\mathcal{E}_c}\right)^n\right]^{1/n}}
\]

where \(\mathcal{E}_c = v_{\text{sat}}/\mu_0\) is the critical field and \(n = 1\) (electrons in GaAs-type) or \(n = 2\) (electrons in silicon, giving a smoother transition).

For silicon electrons: \(\mathcal{E}_c = v_{\text{sat}}/\mu_n = 10^7/1400 \approx 7100\) V/cm. Modern MOSFETs with 10 nm gate lengths and \(V_{DS} = 0.8\) V have average channel fields of ~80,000 V/cm — well above \(\mathcal{E}_c\). Velocity saturation is not a curious high-field phenomenon for these devices; it is the normal operating condition.

### Hot Carriers

When carriers travel at high fields, they absorb energy from the field faster than they can dissipate it through phonon scattering. Their energy distribution is no longer in equilibrium with the lattice; carriers have an effective temperature \(T_e > T_L\) (lattice temperature). These are **hot carriers**.

Hot carriers cause several important effects:

1. **Impact ionization:** A carrier with energy exceeding \(E_g\) (the bandgap) can knock a valence electron into the conduction band, creating an electron-hole pair. This is the mechanism behind avalanche breakdown in reverse-biased junctions.

2. **Hot-carrier injection into gate oxide:** In MOSFETs, hot electrons can gain enough energy to surmount the Si/SiO\(_2\) barrier (~3.1 eV) and become trapped in the gate oxide. Trapped charge shifts the threshold voltage over time — this is **hot-carrier degradation (HCI)**, a reliability failure mode that limits device lifetime.

3. **Carrier heating and velocity overshoot:** In ultrashort transistors (sub-20 nm), carriers can briefly exceed \(v_{\text{sat}}\) before the optical phonon scattering mechanisms catch up — **velocity overshoot** — giving a transient current boost. This is one reason ultrashort MOSFETs can outperform predictions based on bulk mobility.

!!! mascot-tip "Nova Tips: The Modern MOSFET Lives in Velocity Saturation"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova with tip pose">
    When you're analyzing a 5 nm node MOSFET and you see \(V_{DS} = 0.6\) V across an 8 nm channel, the average field is ~7.5 MV/m = 75 kV/cm. Compare that to silicon's critical field of ~7 kV/cm: you're 10× into saturation. The drive current in these devices is essentially \(I_D \approx q \cdot n_{\text{inv}} \cdot v_{\text{sat}} \cdot W\), not \(\mu_0 \cdot C_{\text{ox}} \cdot (V_{GS} - V_T)^2/2L\). The long-channel MOSFET equations you'll learn in Chapter 15 are a historical curiosity for modern devices — but they are the foundation you need before understanding why they fail.

<details markdown="1">
<summary>#### MicroSim: Velocity-Field Relationship Explorer</summary>

**sim-id:** `velocity-field-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive plot of drift velocity vs. electric field for electrons and holes in silicon (and optionally GaAs for comparison). Shows low-field linear regime, transition region, and saturation plateau. User can adjust temperature and see how \(v_{\text{sat}}\) changes. An inset diagram shows the energy distribution of carriers (Maxwellian at low field, heated distribution at high field).

**Controls:**
- Dropdown: Material (Si, GaAs, Ge)
- Dropdown: Carrier type (electrons, holes)
- Slider: Temperature (200–400 K)
- Checkbox: Show critical field marker
- Checkbox: Show low-field tangent line

**Key Learning Objectives:**
- L2 (Understand): Identify the transition from linear to saturated velocity-field regimes
- L3 (Apply): Calculate drift velocity given a field using the two-piece linear model
- L4 (Analyze): Explain why short-channel MOSFETs operate in velocity saturation

</details>

---

## Summary

This chapter developed the physics of carrier drift from first principles:

- **Drift current** arises from the systematic momentum imparted by the electric field, superimposed on random thermal motion
- **Mobility** \(\mu = q\tau_m/m^*\) is determined by the mean free time between scattering events and the effective mass
- **Scattering mechanisms** include acoustic phonons (\(\mu \propto T^{-3/2}\)), ionized impurities (\(\mu \propto T^{3/2}/N_I\)), optical phonons, intervalley scattering, neutral impurities, surface roughness, and alloy scattering
- **Matthiessen's rule** combines all mechanisms: \(1/\mu = \sum_i 1/\mu_i\); the worst mechanism wins
- **High-field transport** departs from linearity as velocity saturates at \(v_{\text{sat}} \approx 10^7\) cm/s; modern short-channel MOSFETs operate in this regime
- **Hot carriers** with excess energy cause impact ionization (avalanche breakdown) and oxide damage (HCI reliability degradation)

## Key Equations

\[
J^{\text{drift}} = q(n\mu_n + p\mu_p)\mathcal{E} = \sigma\mathcal{E}
\]

\[
\mu = \frac{q\tau_m}{m^*}, \quad \frac{1}{\mu_{\text{total}}} = \sum_i \frac{1}{\mu_i} \quad \text{(Matthiessen's rule)}
\]

\[
\mu_{\text{ac}} \propto T^{-3/2}, \quad \mu_{\text{ii}} \propto \frac{T^{3/2}}{N_I}
\]

\[
v_d(\mathcal{E}) = \frac{\mu_0 \mathcal{E}}{\left[1 + (\mathcal{E}/\mathcal{E}_c)^2\right]^{1/2}}, \quad v_{\text{sat}} \approx 10^7 \text{ cm/s (Si electrons)}
\]
