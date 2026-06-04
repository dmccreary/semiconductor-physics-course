---
title: Carrier Diffusion, Transport Theory, and Electrical Measurements
description: Diffusion currents, the Einstein relation, drift-diffusion model, Hall effect, and van der Pauw measurements for semiconductor characterization
generated_by: claude skill chapter-content-generator
date: 2026-06-03 15:00:00
version: 0.08
---

# Carrier Diffusion, Transport Theory, and Electrical Measurements

## Summary

This chapter completes the carrier transport picture by adding diffusion to drift. Fick's first law applied to carriers yields the diffusion current; the Einstein relation connects diffusion coefficient to mobility through the thermal voltage. The total drift-diffusion current density and the full drift-diffusion model provide the equations used in virtually all semiconductor device simulators. Resistivity, conductivity, and sheet resistance are derived for practical measurement contexts. The Hall effect — with its associated Hall coefficient, Hall voltage, and Hall mobility — is developed as the standard technique for extracting carrier type, concentration, and mobility from experimental samples; the Van der Pauw method enables measurements on arbitrarily shaped specimens. Magnetoresistance, piezoelectric effect, and piezoresistance complete the coverage of transport phenomena.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Diffusion Current
2. Diffusion Coefficient
3. Einstein Relation
4. Total Current Density
5. Drift-Diffusion Model
6. Resistivity
7. Conductivity
8. Sheet Resistance
9. Hall Effect
10. Hall Coefficient
11. Hall Voltage
12. Hall Mobility
13. Van der Pauw Method
14. Magnetoresistance
15. Piezoelectric Effect
16. Piezoresistance Effect

## Prerequisites

This chapter builds on concepts from:

- [Chapter 7: Doping, Extrinsic Carriers, and the Fermi Level](../07-doping-extrinsic-carriers/index.md)
- [Chapter 8: Carrier Drift, Mobility, and Scattering Mechanisms](../08-carrier-drift-mobility/index.md)

---

!!! mascot-welcome "Nova on Diffusion: When Carriers Wander Without a Map"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    In Chapter 8 we gave electrons and holes a GPS (the electric field) and watched them drift purposefully toward their destination. Today we study what happens when there's no field but there *is* a concentration gradient — carriers wander randomly until they spread out evenly, like perfume diffusing across a room, or like physicists spreading toward the free coffee at a conference. Welcome to diffusion: random motion with a direction.

## 9.1 Diffusion Current Density

Drift is only half of the carrier transport story. Even with zero electric field, carriers in non-uniform distributions will flow from regions of high concentration to low concentration — not because of any force, but because random thermal motion statistically moves more carriers "outward" than "inward" when there are more to start with. This is **diffusion**, and it produces a net current.

Fick's first law, applied to charge carriers, gives the **diffusion current density**:

\[
J_n^{\text{diff}} = q D_n \frac{dn}{dx}
\]

\[
J_p^{\text{diff}} = -q D_p \frac{dp}{dx}
\]

where \(D_n\) and \(D_p\) are the diffusion coefficients (units: cm²/s) for electrons and holes, and \(dn/dx\), \(dp/dx\) are the carrier concentration gradients. The sign difference between electrons and holes reflects the charge sign: both carrier types diffuse from high to low concentration, but electrons flowing in the \(-x\) direction carry current in the \(+x\) direction (conventional current opposite to electron flow).

The diffusion coefficients for silicon at 300 K are approximately:

\[
D_n \approx 36 \text{ cm}^2/\text{s}, \quad D_p \approx 12 \text{ cm}^2/\text{s}
\]

Notice that these are roughly proportional to the corresponding mobilities — which is not a coincidence.

---

## 9.2 The Einstein Relation

The connection between the diffusion coefficient and mobility is one of the most elegant results in transport theory. Before stating it, we need a physical argument.

Consider a semiconductor in thermal equilibrium with no applied electric field but with a doping gradient (hence a carrier concentration gradient). Even in equilibrium, there is simultaneously a diffusion current (driven by the concentration gradient) and a built-in electric field (arising from the charge separation due to the doping gradient). In thermal equilibrium, these two currents must exactly cancel — the total current must be zero.

Setting \(J_n = J_n^{\text{drift}} + J_n^{\text{diff}} = 0\):

\[
q n \mu_n \mathcal{E} + q D_n \frac{dn}{dx} = 0
\]

In equilibrium, \(n = N_C \exp(-(E_C - E_F)/k_BT)\), and the built-in field relates to the band-edge gradient as \(q\mathcal{E} = -dE_C/dx\). Working through the algebra (which is encouraged as a problem set exercise):

\[
\boxed{\frac{D_n}{\mu_n} = \frac{k_BT}{q} \equiv V_T}
\]

This is the **Einstein relation**, where \(V_T = k_BT/q\) is the **thermal voltage**. At room temperature (300 K):

\[
V_T = \frac{0.0259 \text{ eV}}{e} = 25.9 \text{ mV}
\]

The same relation holds for holes: \(D_p/\mu_p = V_T\). Given the standard silicon mobilities:

\[
D_n = \mu_n V_T = 1400 \times 0.0259 \approx 36.3 \text{ cm}^2/\text{s}
\]
\[
D_p = \mu_p V_T = 450 \times 0.0259 \approx 11.6 \text{ cm}^2/\text{s}
\]

!!! mascot-thinking "Nova Thinks: The Thermal Voltage Is Everywhere"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    \(V_T = 26\) mV at 300 K is one of the most ubiquitous constants in all of semiconductor device physics. It appears in the diode equation (\(I = I_0(e^{V/V_T} - 1)\)), the MOSFET subthreshold slope (60 mV/decade = \(V_T \ln 10\)), the Einstein relation, and dozens of other places. When in doubt about whether a voltage is "large" or "small" in a semiconductor context, compare it to \(V_T\). If \(V \gg V_T\), the exponentials dominate. If \(V \ll V_T\), you can linearize. This comparison is the semiconductor equivalent of Reynolds number reasoning in fluid mechanics — it tells you which physics dominates.

---

## 9.3 Total Current Density and the Drift-Diffusion Model

The complete carrier current densities are the sums of drift and diffusion contributions:

\[
J_n = q n \mu_n \mathcal{E} + q D_n \frac{dn}{dx}
\]

\[
J_p = q p \mu_p \mathcal{E} - q D_p \frac{dp}{dx}
\]

\[
J_{\text{total}} = J_n + J_p
\]

These two equations, combined with Poisson's equation (\(d\mathcal{E}/dx = \rho/\varepsilon_s\)) and the continuity equations (Chapter 10), form the **drift-diffusion model** — the coupled PDE system solved by virtually every semiconductor device simulator from SPICE to TCAD tools like Sentaurus and Silvaco.

The drift-diffusion model makes several assumptions worth noting:

1. **Quasi-equilibrium:** Carriers have a well-defined local quasi-Fermi level (they're not far from equilibrium)
2. **Non-degenerate statistics:** Boltzmann approximation applies (corrections needed for degenerate material)
3. **Low field or moderate field:** No velocity overshoot or ballistic transport (corrections needed for sub-10 nm devices)
4. **Instantaneous scattering response:** No memory effects or non-local transport

Despite these limitations, the drift-diffusion model gives engineering-accurate results for devices larger than ~20 nm and is the workhorse of the semiconductor industry.

Using the Einstein relation, the electron current can be rewritten in a compact form using the **quasi-Fermi level** \(F_n\):

\[
J_n = q \mu_n n \frac{dF_n}{dx}, \quad \text{where } F_n \equiv E_C + k_BT \ln\!\left(\frac{n}{N_C}\right)
\]

In equilibrium, \(F_n = E_F\) and \(J_n = 0\). In non-equilibrium, gradients in \(F_n\) drive current. This form is powerful because it naturally handles both drift and diffusion through a single potential gradient.

---

## 9.4 Resistivity, Conductivity, and Sheet Resistance

Before discussing measurement techniques, we need precise definitions of the macroscopic transport parameters engineers actually measure.

**Conductivity** \(\sigma\) and **resistivity** \(\rho\) are related by \(\rho = 1/\sigma\), where:

\[
\sigma = q(n\mu_n + p\mu_p) \quad [\text{S/cm or (Ω·cm)}^{-1}]
\]

\[
\rho = \frac{1}{q(n\mu_n + p\mu_p)} \quad [\text{Ω·cm}]
\]

For n-type material where \(n \gg p\):

\[
\rho \approx \frac{1}{q n \mu_n} \approx \frac{1}{q N_D \mu_n}
\]

Resistivity spans roughly 13 orders of magnitude in silicon: from \(\sim 10^3\) Ω·cm for ultra-pure intrinsic silicon down to \(\sim 10^{-4}\) Ω·cm for degenerate doping.

**Sheet resistance** \(R_\square\) is used for thin layers where the full three-dimensional resistivity is less useful. For a layer of thickness \(t\), length \(L\), and width \(W\):

\[
R = \rho \frac{L}{W \cdot t} = \frac{\rho}{t} \cdot \frac{L}{W} \equiv R_\square \cdot \frac{L}{W}
\]

where \(R_\square = \rho/t\) is the sheet resistance in units of Ω/□ (ohms per square). The "per square" notation reflects that \(R = R_\square\) for any square of material (regardless of size) because \(L/W = 1\). Sheet resistance is measured by four-point probe or van der Pauw methods and is the standard specification for doped silicon layers, polysilicon interconnects, and metal films.

| Silicon Doping Level | Typical Sheet Resistance | Typical Resistivity |
|----------------------|--------------------------|---------------------|
| Intrinsic (\(n_i\)) | N/A (too high) | ~2300 Ω·cm |
| \(N_D = 10^{14}\) cm\(^{-3}\) | ~40 kΩ/□ (100 nm film) | 44 Ω·cm |
| \(N_D = 10^{16}\) cm\(^{-3}\) | ~440 Ω/□ (100 nm film) | 0.44 Ω·cm |
| \(N_D = 10^{18}\) cm\(^{-3}\) | ~25 Ω/□ (100 nm film) | 0.0025 Ω·cm |

---

## 9.5 The Hall Effect

The **Hall effect**, discovered by Edwin Hall in 1879, is the cornerstone of semiconductor characterization. It simultaneously determines carrier type (n or p), carrier concentration, and mobility from a single measurement — essentially a simultaneous read-out of three key semiconductor parameters. Hall effect remains the gold standard for characterizing new semiconductor materials.

Here's the physics. Apply a current \(I\) in the x-direction through a rectangular semiconductor bar, and a magnetic field \(B\) in the z-direction (perpendicular to the current). The magnetic force on the moving carriers is:

\[
\mathbf{F} = q(\mathbf{v} \times \mathbf{B})
\]

For electrons moving in the \(-x\) direction (producing current in \(+x\)), the force is in the \(-y\) direction:

\[
F_y = -qv_x B_z \quad \text{(for electrons)}
\]

Electrons accumulate on the \(-y\) face, holes accumulate on the \(+y\) face. This charge accumulation creates a transverse electric field \(\mathcal{E}_H\) (the **Hall field**) that opposes further carrier deflection. In steady state:

\[
q\mathcal{E}_H = qv_{d} B
\]

The transverse voltage across the sample (the **Hall voltage**) is:

\[
V_H = \mathcal{E}_H \cdot W = v_d B W = \frac{IB}{q n t}
\]

where \(W\) is the sample width, \(t\) is the thickness, and we used \(I = qnv_d W t\).

The **Hall coefficient** is defined as:

\[
R_H \equiv \frac{\mathcal{E}_H}{J B} = \frac{V_H \cdot t}{I \cdot B}
\]

For a simple single-carrier semiconductor:

\[
R_H = -\frac{1}{qn} \quad \text{(n-type, negative)}
\]
\[
R_H = +\frac{1}{qp} \quad \text{(p-type, positive)}
\]

The sign of \(R_H\) immediately tells you the carrier type. The magnitude gives the carrier concentration:

\[
n \text{ or } p = \frac{1}{|R_H| q}
\]

!!! mascot-tip "Nova Tips: Hall Effect Is the Carrier Concentration Calculator"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova with tip pose">
    The Hall effect is how researchers first confirmed that holes are *real* — positive charge carriers with positive Hall coefficient, not just absent electrons. When germanium was first doped p-type and showed a positive \(R_H\), it was experimental proof that the Dirac-style "hole" concept was physically meaningful. Today, any time you have a new material (a new 2D material, a new oxide semiconductor, a novel perovskite) and want to know "is it n-type or p-type, and how many carriers does it have?" — you do a Hall measurement. It's been the answer for 145 years.

The **Hall mobility** is defined from the measured quantities:

\[
\mu_H = |R_H| \cdot \sigma = \frac{|R_H|}{\rho}
\]

Hall mobility differs slightly from the drift mobility (\(\mu_H = r_H \mu_{\text{drift}}\) where \(r_H\) is the Hall factor, typically 1.15 for acoustic phonon scattering and 1.93 for ionized impurity scattering), but for most practical purposes \(\mu_H \approx \mu_{\text{drift}}\).

---

## 9.6 The Van der Pauw Method

The classic Hall measurement requires a long rectangular bar with well-defined geometry. What if your sample is an irregularly shaped wafer piece, or a thin film deposited on a substrate? The **Van der Pauw method** (1958) enables Hall and resistivity measurements on samples of arbitrary shape — a crucial capability for real-world characterization.

The method requires:
1. A thin, flat sample of uniform thickness
2. Four small ohmic contacts placed on the perimeter (not interior)
3. The contacts must be small (ideally point contacts) relative to the sample size

The Van der Pauw resistivity formula uses two four-probe resistance measurements:

\[
R_{12,34} = \frac{V_{34}}{I_{12}}, \quad R_{23,41} = \frac{V_{41}}{I_{23}}
\]

These satisfy the transcendental Van der Pauw equation:

\[
e^{-\pi R_{12,34} t/\rho} + e^{-\pi R_{23,41} t/\rho} = 1
\]

which is solved numerically for \(\rho\). For a symmetric sample (square or circular with symmetric contact placement), a simple average formula applies:

\[
\rho = \frac{\pi t}{\ln 2} \cdot \frac{R_{12,34} + R_{23,41}}{2} \quad \text{(symmetric samples only)}
\]

The Hall coefficient is obtained by applying a magnetic field and measuring:

\[
R_H = \frac{t \cdot \Delta R_{13,24}}{B}
\]

where \(\Delta R_{13,24} = R_{13,24}(+B) - R_{13,24}(-B)\) is the field-reversed Hall resistance.

The Van der Pauw method is now standard in all semiconductor characterization labs. A "Van der Pauw cloverleaf" — a four-lobed sample geometry that minimizes contact-placement errors — is a common test structure on silicon wafers.

---

## 9.7 Magnetoresistance and Piezoresistance

### Magnetoresistance

In the Hall effect setup, the magnetic field also increases the effective resistance of the sample — **magnetoresistance**. Physical magnetoresistance arises because not all carriers travel at the average velocity; the spread of velocities means that Lorentz force deflection is not perfectly cancelled by the Hall field for all carriers simultaneously. The fractional resistance change is:

\[
\frac{\Delta\rho}{\rho_0} = (\mu_H B)^2 \cdot f(\text{geometry})
\]

For small fields, \(\Delta\rho/\rho_0 \propto (\mu B)^2\). Magnetoresistance is significant only when \(\mu B \geq 1\), i.e., for high-mobility materials (GaAs, InSb) in strong magnetic fields. For silicon at typical fields, it is a small correction.

**Geometric magnetoresistance** occurs when the Hall voltage is short-circuited by contact geometry. In a wide, short sample, or in materials with a large carrier pileup inhibited by contacts, effective magnetoresistance can be much larger than the physical value.

### Piezoelectric Effect

In crystals without a center of inversion symmetry (like GaAs, AlN, ZnO), mechanical strain creates an electric polarization through the ionic displacement — the **piezoelectric effect**. The piezoelectric constitutive equations couple the strain tensor \(S_{ij}\) to the polarization \(P_k\):

\[
P_k = e_{kij} S_{ij}
\]

where \(e_{kij}\) is the third-rank piezoelectric tensor. Silicon (cubic, centrosymmetric) is NOT piezoelectric. GaN, AlN, and ZnO are strongly piezoelectric — a critical consideration in nitride-based HEMTs where piezoelectric charges at heterointerfaces contribute to the 2D electron gas density.

### Piezoresistance Effect

Even in silicon (which lacks piezoelectricity), mechanical stress changes the resistivity through the **piezoresistance effect**. Strain modifies the band structure: band minima shift in energy, effective masses change, and intervalley scattering rates are altered. The fractional resistivity change is:

\[
\frac{\Delta\rho}{\rho} = \pi_l \sigma_l + \pi_t \sigma_t
\]

where \(\pi_l\) and \(\pi_t\) are the longitudinal and transverse piezoresistance coefficients (units: Pa\(^{-1}\)), and \(\sigma_l\), \(\sigma_t\) are the applied stresses parallel and perpendicular to the current.

Piezoresistance coefficients in silicon are large and anisotropic:
- p-type silicon: \(\pi_{44} \approx +138 \times 10^{-11}\) Pa\(^{-1}\) (dominant)
- n-type silicon: \(\pi_{11} \approx -102 \times 10^{-11}\) Pa\(^{-1}\) (dominant)

Piezoresistance is the operating principle of **silicon pressure sensors and accelerometers** — some of the first commercial MEMS (microelectromechanical systems) devices. Strained silicon technology (Chapter 20) deliberately applies piezoresistive effects to boost MOSFET mobility by 30–50%.

!!! mascot-celebration "Nova Celebrates: Transport Physics, Complete!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    Look how far we've come in three chapters! Chapter 7 gave us the carrier concentrations. Chapter 8 gave us drift and scattering. Chapter 9 gives us diffusion, the complete current equations, and the measurement tools to verify all of it. The drift-diffusion model is now in your hands — and it's the same set of equations that runs inside every semiconductor process simulator in the world. From here, we move to generation and recombination, then to the p-n junction, where this transport machinery produces transistors, LEDs, and solar cells. Time to jump bands!

<details markdown="1">
<summary>#### MicroSim: Hall Effect Measurement Simulator</summary>

**sim-id:** `hall-effect-simulator`  
**Library:** p5.js  
**Status:** specification  

**Description:** Interactive visualization of the Hall effect experiment. Shows a rectangular semiconductor bar with current flow, magnetic field (adjustable direction and magnitude), carrier drift trajectories, charge accumulation on transverse faces, and the resulting Hall voltage. Displays calculated \(R_H\), carrier concentration, and Hall mobility. User can switch between n-type and p-type and observe sign flip.

**Controls:**
- Radio buttons: N-type / P-type
- Slider: Carrier concentration (\(10^{14}\) to \(10^{17}\) cm\(^{-3}\))
- Slider: Magnetic field B (0 to 1 T)
- Slider: Applied current (1 to 10 mA)
- Button: Flip B-field direction (observe Hall voltage sign flip)

**Key Learning Objectives:**
- L2 (Understand): Explain why Hall voltage sign depends on carrier type
- L3 (Apply): Calculate carrier concentration from Hall measurement data
- L4 (Analyze): Distinguish n-type from p-type from sign of Hall coefficient

</details>

---

## Summary

This chapter completed the carrier transport framework:

- **Diffusion current** arises from concentration gradients: \(J_n^{\text{diff}} = qD_n (dn/dx)\)
- **Einstein relation** connects diffusion and drift: \(D/\mu = k_BT/q = V_T\)
- **Drift-diffusion model** combines drift and diffusion into a coupled PDE system — the basis of all device simulators
- **Resistivity** \(\rho = 1/q(n\mu_n + p\mu_p)\) and **sheet resistance** \(R_\square = \rho/t\) are measurable bulk/thin-film transport parameters
- **Hall effect** gives carrier type (from sign of \(R_H\)), concentration (from magnitude of \(R_H\)), and mobility (from \(\mu_H = |R_H|\sigma\))
- **Van der Pauw method** extends Hall measurement to arbitrary sample geometries using four perimeter contacts
- **Magnetoresistance** and **piezoresistance** are secondary transport phenomena with important MEMS and strained-silicon applications

## Key Equations

\[
J_n = qn\mu_n\mathcal{E} + qD_n\frac{dn}{dx}, \quad J_p = qp\mu_p\mathcal{E} - qD_p\frac{dp}{dx}
\]

\[
\frac{D_n}{\mu_n} = \frac{D_p}{\mu_p} = V_T = \frac{k_BT}{q} = 25.9 \text{ mV at 300 K}
\]

\[
\rho = \frac{1}{q(n\mu_n + p\mu_p)}, \quad R_\square = \frac{\rho}{t}
\]

\[
R_H = \frac{-1}{qn} \text{ (n-type)}, \quad R_H = \frac{+1}{qp} \text{ (p-type)}, \quad \mu_H = |R_H|\sigma
\]
