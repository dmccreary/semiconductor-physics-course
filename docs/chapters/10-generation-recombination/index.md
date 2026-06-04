---
title: Generation, Recombination, Continuity, and Optical Processes
description: How carriers are created and destroyed through direct, SRH, and Auger recombination, optical absorption, quasi-Fermi levels, and the continuity equation
generated_by: claude skill chapter-content-generator
date: 2026-06-03 15:30:00
version: 0.08
---

# Generation, Recombination, Continuity, and Optical Processes

## Summary

Whenever the carrier concentrations depart from equilibrium, generation and recombination processes drive the system back. This chapter systematically covers all major recombination mechanisms: direct band-to-band (radiative) recombination dominant in direct-gap materials, Shockley-Read-Hall trap-assisted recombination that governs minority-carrier lifetime in indirect-gap silicon, and Auger recombination important at high carrier densities. Surface and interface recombination through dangling bonds is quantified by the surface recombination velocity. Optical absorption and the optical generation rate connect the chapter to photonic device analysis. Quasi-Fermi levels describe the non-equilibrium carrier populations under illumination or injection. The chapter closes with the continuity equation and ambipolar transport — the carrier balance laws that underpin all minority-carrier device analysis.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. Continuity Equation
2. Ambipolar Transport
3. Ambipolar Diffusion Coefficient
4. Minority Carrier Lifetime
5. Minority Carrier Diffusion Length
6. Recombination Rate
7. Generation Rate
8. Direct Recombination
9. Band-to-Band Recombination
10. Radiative Recombination
11. Radiative Recombination Coefficient
12. Shockley-Read-Hall Recombination
13. Trap-Assisted Recombination
14. Trap Density
15. Trap Energy Level
16. Capture Cross Section
17. Auger Recombination
18. Auger Coefficient
19. Surface Recombination
20. Surface Recombination Velocity
21. Optical Absorption
22. Absorption Coefficient
23. Optical Generation Rate
24. Photoconductivity
25. Quasi-Fermi Levels
26. Quasi-Fermi Level Splitting
27. Low-Level Injection
28. High-Level Injection
29. Injection Level
30. Excess Carriers

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../01-intro-semiconductors/index.md)
- [Chapter 7: Doping, Extrinsic Carriers, and the Fermi Level](../07-doping-extrinsic-carriers/index.md)
- [Chapter 9: Carrier Diffusion, Transport Theory, and Electrical Measurements](../09-carrier-diffusion-transport/index.md)

---

!!! mascot-welcome "Nova on Recombination: The Universe's Most Stubborn Trend Toward Boredom"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Equilibrium is the semiconductor's natural state — and nature is *aggressively* determined to return there. Inject excess carriers, shine a light, apply a forward bias — and within microseconds to nanoseconds, the semiconductor shoves those extra carriers right back where they came from. Today we meet the three mechanisms that enforce this cosmic rule of semiconductor mediocrity, and the equations that let us predict exactly how fast they work. The good news: controlling these rates is literally what makes solar cells efficient and LEDs bright.

## 10.1 Equilibrium, Non-Equilibrium, and Excess Carriers

In thermal equilibrium, carrier concentrations are fixed at \(n_0\) and \(p_0\), with \(n_0 p_0 = n_i^2\). The generation rate of electron-hole pairs exactly equals the recombination rate:

\[
G_0 = R_0 \quad \text{(equilibrium)}
\]

Any departure from equilibrium creates **excess carriers**: \(\delta n = n - n_0\) (excess electrons) and \(\delta p = p - p_0\) (excess holes). Since each generation/recombination event creates or destroys pairs, we always have \(\delta n = \delta p\) when no other carrier sources are present.

The **injection level** describes how large the excess is relative to the equilibrium majority carrier:

- **Low-level injection:** \(\delta n \ll n_0\) (n-type) or \(\delta p \ll p_0\) (p-type) — excess carriers are small compared to the equilibrium majority population
- **High-level injection:** \(\delta n \gg n_0\) or \(\delta p \gg p_0\) — excess carriers dominate

This distinction matters because the recombination rate expressions simplify differently in the two limits, and device behavior changes qualitatively between them.

---

## 10.2 Recombination Mechanisms: The Three Paths Back to Boring

Three physically distinct mechanisms return excess carriers to equilibrium. They operate in parallel, and the fastest one controls device behavior. Before examining each, let's frame the key question: what determines the **minority carrier lifetime** \(\tau\)? The minority carrier lifetime is defined by:

\[
\frac{d(\delta p)}{dt} = -\frac{\delta p}{\tau_p} \quad \text{(n-type, excess holes)}
\]

So \(\tau_p\) sets how quickly injected minority holes disappear. Smaller \(\tau\) → faster recombination → shorter-lived excess carriers.

### 10.2.1 Direct (Band-to-Band) Recombination

In **direct recombination**, an electron in the conduction band falls directly to the valence band and recombines with a hole. Energy and momentum are conserved simultaneously — which requires that the conduction band minimum and valence band maximum occur at the same \(k\)-vector (zero momentum phonon needed). This is the condition for a **direct-gap semiconductor**.

In GaAs, InP, GaN — direct-gap materials — band-to-band recombination is the dominant mechanism and it is **radiative**: the energy difference \(E_C - E_V = E_g\) is released as a photon. This is why GaAs makes good LEDs and lasers, while silicon does not.

The recombination rate is:

\[
R_{\text{direct}} = B \cdot n \cdot p
\]

where \(B\) is the **radiative recombination coefficient** (units: cm\(^3\)/s). In equilibrium, \(G_0 = B n_0 p_0 = B n_i^2\). In non-equilibrium with excess carriers:

\[
U_{\text{direct}} = R - G = B(np - n_i^2) = B(n_0 + p_0 + \delta n)\,\delta n
\]

At low-level injection in n-type (\(\delta n \ll n_0\)):

\[
U_{\text{direct}} \approx B n_0 \, \delta p, \implies \tau_p = \frac{1}{B n_0}
\]

Representative values: for GaAs, \(B \approx 10^{-10}\) cm\(^3\)/s; for silicon, \(B \approx 10^{-15}\) cm\(^3\)/s (14,000× smaller, because the momentum mismatch suppresses direct recombination).

### 10.2.2 Shockley-Read-Hall (Trap-Assisted) Recombination

In indirect-gap silicon, band-to-band recombination is negligibly slow because momentum cannot be conserved without a phonon. Instead, recombination proceeds through **traps** — energy levels in the bandgap introduced by defects, impurities, or dangling bonds. The process was analyzed independently by Shockley, Read, and Hall in 1952 and bears their names.

The trap-assisted recombination process has four steps:
1. **Electron capture:** A conduction-band electron falls into the trap (rate ∝ capture cross section \(\sigma_n\) and electron velocity)
2. **Electron emission:** The trapped electron returns to the conduction band (thermal excitation)
3. **Hole capture:** The trapped electron falls into the valence band (equivalently, a valence hole is captured by the trap)
4. **Hole emission:** The captured hole returns to the valence band

The **SRH recombination rate** is:

\[
U_{\text{SRH}} = \frac{np - n_i^2}{\tau_p(n + n_1) + \tau_n(p + p_1)}
\]

where:
- \(\tau_n = 1/(v_{\text{th},n} \sigma_n N_t)\), \(\tau_p = 1/(v_{\text{th},p} \sigma_p N_t)\) are the fundamental electron and hole lifetimes
- \(N_t\) is the trap density (cm\(^{-3}\))
- \(n_1 = N_C e^{-(E_C - E_t)/k_BT}\), \(p_1 = N_V e^{-(E_t - E_V)/k_BT}\) are emission terms related to the trap energy \(E_t\)

SRH recombination is most effective when the trap level sits near midgap (\(E_t \approx E_i\)), because both carrier types have comparable capture rates. Gold in silicon (trap near midgap) is intentionally added in fast diodes to deliberately reduce minority carrier lifetime and speed up switching.

At low-level injection in n-type, SRH simplifies to:

\[
U_{\text{SRH}} \approx \frac{\delta p}{\tau_p}, \quad \tau_p \approx \frac{1}{v_{\text{th}} \sigma_p N_t}
\]

!!! mascot-thinking "Nova Thinks: SRH Lifetime Is Trap Control"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    The SRH lifetime equation \(\tau = 1/(v_{\text{th}} \sigma N_t)\) has a beautiful message: lifetime is inversely proportional to trap density. This means you can *engineer* the lifetime by controlling defects. Solar cell manufacturers obsessively minimize \(N_t\) (using float-zone silicon, careful anneals, and passivation layers) to maximize \(\tau\) to milliseconds. Fast-switching diode engineers do the opposite — they diffuse gold into silicon to add midgap traps and drive \(\tau\) down to nanoseconds. Same material, opposite defect strategies, for opposite lifetime targets.

### 10.2.3 Auger Recombination

In **Auger recombination**, an electron and hole recombine, but instead of emitting a photon, the released energy is transferred to a third carrier (either another electron or another hole) that then thermalizes through phonon emission. A three-particle process, Auger recombination scales as \(n^2 p\) or \(np^2\):

\[
U_{\text{Auger}} = (C_n n + C_p p)(np - n_i^2)
\]

where \(C_n\) and \(C_p\) are the Auger coefficients (~\(10^{-30}\)–\(10^{-31}\) cm\(^6\)/s for silicon).

Auger recombination is negligible at normal carrier densities but dominates at:
1. **Very high injection** (solar concentrators, pulsed lasers)
2. **Very heavy doping** (\(N_D > 10^{18}\) cm\(^{-3}\))

In degenerate emitter regions of silicon BJTs and at the front surface of concentrator solar cells, Auger recombination is the primary performance limiter. The **Auger limit** for solar cell efficiency (at 1-sun illumination in silicon) contributes a fundamental loss floor of ~0.2% absolute efficiency.

---

## 10.3 Surface Recombination

At semiconductor surfaces and interfaces, the crystal periodicity terminates — creating **dangling bonds** with energy states distributed across the bandgap. These surface states act as a dense continuum of SRH traps, and carriers near the surface recombine much faster than in the bulk.

Surface recombination is characterized by the **surface recombination velocity** \(S\) (units: cm/s), defined such that the excess minority carrier flux to the surface equals:

\[
J_p\big|_{\text{surface}} = q S \cdot \delta p\big|_{\text{surface}}
\]

For silicon/SiO\(_2\) interfaces with good thermal oxidation, \(S \approx 10\)–\(100\) cm/s. For unpassivated silicon surfaces (bare silicon in air), \(S \approx 10^4\)–\(10^5\) cm/s. Surface passivation — using SiO\(_2\), Si\(_3\)N\(_4\), or atomic-layer deposited Al\(_2\)O\(_3\) — is critical for solar cells and is the reason cell manufacturers spend enormous effort on surface treatment.

The surface acts as a boundary condition on the minority carrier diffusion equation (Section 10.6):

\[
D_p \frac{d(\delta p)}{dx}\bigg|_{\text{surface}} = S \cdot \delta p\big|_{\text{surface}} \quad \text{(excess holes at surface)}
\]

---

## 10.4 Optical Absorption and Optical Generation Rate

When photons with energy \(h\nu \geq E_g\) illuminate a semiconductor, they are absorbed and create electron-hole pairs. This is **optical generation** — the inverse of radiative recombination.

The optical intensity \(I(x)\) (power per unit area) decays exponentially with depth:

\[
I(x) = I_0 e^{-\alpha x}
\]

where \(\alpha\) (cm\(^{-1}\)) is the **absorption coefficient**. The absorption coefficient depends strongly on photon energy and on whether the material has a direct or indirect bandgap:

- **Direct-gap materials** (GaAs): \(\alpha\) rises sharply above \(E_g\) as \(\alpha \propto (h\nu - E_g)^{1/2}\). Values reach \(10^4\)–\(10^5\) cm\(^{-1}\) within 0.1 eV above the bandgap. Absorption depths of 0.1–1 μm.

- **Indirect-gap silicon**: Absorption requires a phonon for momentum conservation. \(\alpha\) rises much more gradually above \(E_g = 1.12\) eV: only \(\sim 10^2\) cm\(^{-1}\) at 1.2 eV, reaching \(10^4\) cm\(^{-1}\) at 1.7 eV. Absorption depth for AM1.5 solar spectrum ranges from 300 μm (near-bandgap photons) to <0.01 μm (UV photons). This is why silicon solar cells must be 100–200 μm thick.

The **optical generation rate** \(G_{\text{opt}}\) (pairs/cm\(^3\)/s) relates to the absorbed intensity:

\[
G_{\text{opt}}(x) = \frac{\alpha I(x)}{h\nu} = \frac{\alpha I_0 e^{-\alpha x}}{h\nu}
\]

**Photoconductivity** is the increase in conductivity due to optically generated excess carriers:

\[
\Delta\sigma = q(\Delta n \mu_n + \Delta p \mu_p) = q \Delta n (\mu_n + \mu_p) \quad \text{(equal excess pairs)}
\]

Time-resolved photoconductivity decay after a light pulse is a standard technique (TRMC, microwave photoconductance) for measuring minority carrier lifetime in silicon wafers.

<details markdown="1">
<summary>#### MicroSim: Recombination Lifetime Explorer</summary>

**sim-id:** `recombination-lifetime-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Three-panel visualization showing all recombination mechanisms. Left panel: band diagram with animated carrier transitions showing direct, SRH, and Auger paths. Middle panel: excess carrier decay \(\delta p(t)\) for different recombination dominances. Right panel: minority carrier lifetime vs. doping concentration showing where each mechanism dominates.

**Controls:**
- Sliders: Trap density \(N_t\) (\(10^{10}\) to \(10^{14}\) cm\(^{-3}\))
- Slider: Trap energy level \(E_t\) (within bandgap)
- Dropdown: Material (Si, GaAs, GaN)
- Slider: Injection level \(\delta n/n_0\)

**Key Learning Objectives:**
- L2 (Understand): Identify which recombination mechanism dominates at a given doping and injection level
- L3 (Apply): Calculate minority carrier lifetime from trap density and capture cross section
- L4 (Analyze): Explain why trap energy position affects SRH efficiency

</details>

---

## 10.5 Quasi-Fermi Levels

In equilibrium, the single Fermi level \(E_F\) describes both electron and hole populations: \(n_0 = N_C e^{-(E_C - E_F)/k_BT}\) and \(p_0 = N_V e^{-(E_F - E_V)/k_BT}\).

Under non-equilibrium conditions (illumination, injection), there is no single Fermi level that describes both carriers simultaneously. Instead, we define separate **quasi-Fermi levels** (or imref levels):

\[
n = N_C \exp\!\left(-\frac{E_C - F_n}{k_BT}\right), \quad p = N_V \exp\!\left(-\frac{F_p - E_V}{k_BT}\right)
\]

where \(F_n\) is the quasi-Fermi level for electrons and \(F_p\) is the quasi-Fermi level for holes. In equilibrium, \(F_n = F_p = E_F\). Under non-equilibrium:

- Illumination or forward bias → \(F_n > F_p\) (quasi-Fermi levels split)
- Reverse bias → \(F_n < F_p\) (quasi-Fermi levels come closer together, even crossing each other in depletion)

The **quasi-Fermi level splitting** \(\Delta F = F_n - F_p\) is directly related to the excess carrier product:

\[
np = n_i^2 \exp\!\left(\frac{F_n - F_p}{k_BT}\right)
\]

In a forward-biased p-n junction at voltage \(V\): \(F_n - F_p = qV\), giving \(np = n_i^2 e^{qV/k_BT}\) — the fundamental relationship that drives the diode equation.

Quasi-Fermi levels are also the physically meaningful quantity for electrochemical potential in solar cells. The **open-circuit voltage** of a solar cell is:

\[
V_{\text{oc}} = \frac{F_n - F_p}{q}\bigg|_{\text{illuminated, open circuit}}
\]

The maximum achievable \(V_{\text{oc}}\) is limited by recombination processes — which is why minimizing all three recombination mechanisms directly increases solar cell voltage.

!!! mascot-warning "Nova Warns: np > n_i^2 Means Injection; np < n_i^2 Means Depletion"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    The product \(np\) relative to \(n_i^2\) is the universal non-equilibrium indicator. Forward bias: \(np > n_i^2\) — quasi-Fermi levels split outward, system has excess energy. Reverse bias in depletion: \(np < n_i^2\) — quasi-Fermi levels squeeze together, system is carrier-depleted. Equilibrium: \(np = n_i^2\). Every semiconductor equation you'll ever write for a biased device secretly involves this comparison. When \(np > n_i^2\), net recombination is occurring (\(U > 0\)); when \(np < n_i^2\), net generation is occurring (\(U < 0\)). The sign of \(U\) tells you which way the system is pushing.

---

## 10.6 The Continuity Equation and Ambipolar Transport

The **continuity equation** is the master balance law for carrier populations. It states that the rate of carrier change in a volume equals: (drift-diffusion current divergence) + (net generation rate):

\[
\frac{\partial n}{\partial t} = \frac{1}{q}\frac{\partial J_n}{\partial x} + G - R = D_n\frac{\partial^2 n}{\partial x^2} + \mu_n\frac{\partial(n\mathcal{E})}{\partial x} + G - R
\]

\[
\frac{\partial p}{\partial t} = -\frac{1}{q}\frac{\partial J_p}{\partial x} + G - R = D_p\frac{\partial^2 p}{\partial x^2} - \mu_p\frac{\partial(p\mathcal{E})}{\partial x} + G - R
\]

These are the full, coupled nonlinear equations that govern all carrier dynamics in a semiconductor device.

### Minority Carrier Diffusion Length

In the steady state with low-level injection, no electric field, and uniform illumination \(G_{\text{opt}}\), the minority carrier equation in n-type reduces to:

\[
D_p \frac{d^2(\delta p)}{dx^2} - \frac{\delta p}{\tau_p} + G_{\text{opt}} = 0
\]

This has solutions of the form \(\delta p(x) \propto e^{\pm x/L_p}\), where the **minority carrier diffusion length** is:

\[
\boxed{L_p = \sqrt{D_p \tau_p}}
\]

The diffusion length is the average distance a minority carrier travels before recombining. It is the single most important parameter for minority-carrier devices:

- p-n junction diode current \(\propto 1/L_p\) (shorter diffusion length → more recombination → less current)
- Solar cell efficiency \(\propto L_p\) (longer \(L_p\) → more carriers collected)
- BJT base transit time \(\propto L_p^2\) (longer \(L_p\) relative to base width → higher gain)

For high-quality silicon at low doping: \(\tau_p \approx 100\) μs, \(D_p \approx 12\) cm²/s, giving \(L_p = \sqrt{12 \times 100\times10^{-6}} \approx 1.1\) mm. Minority carriers in silicon can survive for a millimeter of travel before recombining — which is why silicon solar cells work at all despite the slow optical absorption.

### Ambipolar Transport

When excess carriers are created uniformly (e.g., by uniform illumination), electrons and holes must move together to maintain local charge neutrality. The system behaves as a single combined carrier with an **ambipolar diffusion coefficient**:

\[
D_a = \frac{D_n D_p (n + p)}{D_n n + D_p p}
\]

and an **ambipolar mobility**:

\[
\mu_a = \frac{\mu_n \mu_p (p - n)}{\mu_n n + \mu_p p}
\]

In n-type material at low-level injection (\(n \gg p, \delta n\)):

\[
D_a \approx D_p, \quad \mu_a \approx 0
\]

The minority carrier (holes) controls the ambipolar motion — electrons are so abundant that the minority hole population is the bottleneck. This is why "minority carrier physics" is the dominant framework for p-n junction and BJT analysis: the minority carriers are doing the heavy lifting, even though they're outnumbered by millions to one.

<details markdown="1">
<summary>#### MicroSim: Minority Carrier Diffusion Length Visualizer</summary>

**sim-id:** `minority-carrier-diffusion`  
**Library:** p5.js  
**Status:** specification  

**Description:** Animated visualization of minority carriers injected at x = 0 diffusing into a doped semiconductor bulk. Shows the spatial decay profile \(\delta p(x) = \delta p_0 e^{-x/L_p}\) and animates individual carriers performing random walk. User can adjust \(D_p\) and \(\tau_p\) independently to see how \(L_p = \sqrt{D_p \tau_p}\) changes. An illuminated region can be activated to show bulk generation and steady-state profile.

**Controls:**
- Slider: Minority carrier lifetime \(\tau_p\) (1 ns to 1 ms)
- Slider: Diffusion coefficient \(D_p\) (1–25 cm²/s)
- Checkbox: Show analytical solution overlay
- Button: Pulse injection (see time decay animation)

**Key Learning Objectives:**
- L2 (Understand): Explain how minority carrier lifetime and diffusivity determine diffusion length
- L3 (Apply): Calculate diffusion length for given material parameters
- L4 (Analyze): Predict how surface recombination affects minority carrier profile

</details>

---

## Summary

This chapter covered the processes that govern carrier dynamics beyond equilibrium:

- **Three recombination mechanisms:** Direct (radiative, dominant in direct-gap materials), SRH (trap-assisted, dominant in indirect-gap silicon), and Auger (dominant at high carrier density)
- **Surface recombination velocity** \(S\) quantifies recombination at interfaces; passivation reduces \(S\) from \(10^5\) to \(<100\) cm/s
- **Optical absorption** follows Beer-Lambert law \(I = I_0 e^{-\alpha x}\); absorption coefficient \(\alpha\) distinguishes direct from indirect-gap materials
- **Quasi-Fermi levels** \(F_n\), \(F_p\) describe non-equilibrium carrier populations; their splitting equals \(qV\) under forward bias
- **Continuity equation** is the carrier balance law combining drift, diffusion, generation, and recombination
- **Minority carrier diffusion length** \(L = \sqrt{D\tau}\) determines how far minority carriers travel before recombining — the key metric for diodes, BJTs, and solar cells
- **Ambipolar transport** shows that minority carriers control coupled electron-hole motion in doped material

## Key Equations

\[
U_{\text{SRH}} = \frac{np - n_i^2}{\tau_p(n+n_1) + \tau_n(p+p_1)}, \quad \tau = \frac{1}{v_{\text{th}} \sigma N_t}
\]

\[
G_{\text{opt}}(x) = \frac{\alpha I_0 e^{-\alpha x}}{h\nu}
\]

\[
n = N_C e^{-(E_C-F_n)/k_BT}, \quad p = N_V e^{-(F_p-E_V)/k_BT}, \quad np = n_i^2 e^{(F_n-F_p)/k_BT}
\]

\[
L_p = \sqrt{D_p \tau_p}, \quad D_p\frac{d^2(\delta p)}{dx^2} - \frac{\delta p}{\tau_p} + G = 0
\]
