---
title: "P-N Junction: Equilibrium, Bias, and the Ideal Diode"
description: Built-in potential, depletion approximation, forward/reverse bias band diagrams, minority carrier injection, and the Shockley diode equation
generated_by: claude skill chapter-content-generator
date: 2026-06-03 16:00:00
version: 0.08
---

# P-N Junction: Equilibrium, Bias, and the Ideal Diode

## Summary

The p-n junction is the fundamental building block of nearly every semiconductor device. This chapter derives the junction physics from first principles using the depletion approximation: the built-in electric field and potential that form when p- and n-type regions are joined, the charge distribution and its dependence on doping, and the depletion width. Forward and reverse bias band diagrams illustrate how applied voltage modulates the barrier. Under forward bias, minority carrier injection leads to excess carrier profiles; solving the diffusion equation yields the Shockley diode equation, quantifying the exponential I-V characteristic. Generation-recombination current, tunneling current, and ohmic-region behavior complete the picture of real diode I-V curves.

## Concepts Covered

This chapter covers the following 29 concepts from the learning graph:

1. P-N Junction
2. Junction Formation
3. Depletion Region
4. Depletion Approximation
5. Built-In Potential
6. Contact Potential
7. Electric Field in Depletion Region
8. Potential Distribution in Junction
9. Charge Distribution in Junction
10. Depletion Width
11. One-Sided Abrupt Junction
12. Linearly Graded Junction
13. Forward Bias
14. Reverse Bias
15. Zero Bias Equilibrium
16. Band Diagram Forward Bias
17. Band Diagram Reverse Bias
18. Minority Carrier Injection
19. Ideal Diode Equation
20. Shockley Equation
21. Diode Saturation Current
22. Diode Ideality Factor
23. Generation-Recombination Current
24. Diffusion Current in Diode
25. Tunneling Current in Diode
26. Ohmic Region Diode
27. Forward Voltage Drop
28. Reverse Saturation Current
29. Reverse Breakdown

## Prerequisites

This chapter builds on concepts from:

- [Chapter 7: Doping, Extrinsic Carriers, and the Fermi Level](../07-doping-extrinsic-carriers/index.md)
- [Chapter 9: Carrier Diffusion, Transport Theory, and Electrical Measurements](../09-carrier-diffusion-transport/index.md)
- [Chapter 10: Generation, Recombination, Continuity, and Optical Processes](../10-generation-recombination/index.md)

---

!!! mascot-welcome "Nova on the P-N Junction: Where the Magic Begins (Finally)"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Twelve chapters of foundation physics, and now we build something. The p-n junction is where a semiconductor stops being a material and starts being a *device*. Two doped regions, one interface, and an astonishing amount of physics spontaneously organizing itself into a built-in electric field, a depletion layer, and an exponential current-voltage relationship that has defined electronics for 75 years. Let's get excited — this is the chapter where everything from Chapter 1 through 10 clicks together.

## 11.1 Junction Formation: What Happens When P Meets N

Consider two separate semiconductor regions: one n-type (high electron concentration \(n_0 \approx N_D\), low hole concentration) and one p-type (high hole concentration \(p_0 \approx N_A\), low electron concentration). When these regions are brought into electrical contact, three things happen simultaneously:

1. **Carrier diffusion begins:** Electrons from the n-side diffuse toward the p-side (high \(n\) → low \(n\)). Holes from the p-side diffuse toward the n-side. This is simple diffusion driven by concentration gradients — the same physics as Chapter 9.

2. **Charge separation creates an electric field:** As electrons leave the n-side near the interface, they expose the positively charged donor ions (\(N_D^+\)). As holes leave the p-side, they expose the negatively charged acceptor ions (\(N_A^-\)). A dipole charge layer forms at the junction — positive on the n-side, negative on the p-side. This creates a built-in electric field \(\mathcal{E}_{\text{bi}}\) pointing from n to p.

3. **Equilibrium establishes itself:** The built-in field opposes further diffusion. At equilibrium, the drift current (due to \(\mathcal{E}_{\text{bi}}\)) exactly cancels the diffusion current for both carrier types. No net current flows. The Fermi level is uniform throughout.

The region near the junction that is depleted of free carriers (the exposed ion layers) is the **depletion region** (also called the space-charge region). It has:
- No free electrons or free holes (approximately)
- Net positive charge on the n-side (\(+qN_D\))
- Net negative charge on the p-side (\(-qN_A\))

This is the equilibrium starting point from which all biased-junction physics flows.

---

## 11.2 Built-In Potential

The energy difference between the n-side and p-side Fermi levels in the disconnected state is the source of the **built-in potential** (also called the **contact potential** or **diffusion potential**) \(V_{bi}\). When joined, this energy difference is "paid for" by the band bending across the depletion region.

Setting the Fermi level equal on both sides at equilibrium (mandatory condition — no current flows if \(E_F\) is uniform):

\[
V_{bi} = \frac{k_BT}{q} \ln\!\left(\frac{N_A N_D}{n_i^2}\right)
\]

This is derived from requiring \(E_F\) alignment, using the expressions for \(n_0\) and \(p_0\) from Chapter 7. For silicon with \(N_A = 10^{17}\) cm\(^{-3}\) and \(N_D = 10^{16}\) cm\(^{-3}\):

\[
V_{bi} = 0.0259 \times \ln\!\left(\frac{10^{17} \times 10^{16}}{(9.65\times10^9)^2}\right) = 0.0259 \times \ln(1.07 \times 10^{17}) \approx 0.76 \text{ V}
\]

Built-in potentials in silicon typically range from 0.5–0.95 V depending on doping levels.

!!! mascot-thinking "Nova Thinks: Why Can't We Harvest Built-In Potential?"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova in thinking pose">
    Every thermodynamics student eventually asks: "If there's a built-in voltage across the junction, why can't I connect wires and get free power?" The answer is subtle and important. When you connect metal wires to the n and p sides, *additional* contact potentials form at each metal-semiconductor interface. The built-in potential of the p-n junction is exactly cancelled by the sum of the two contact potentials at the metal-semiconductor interfaces. The loop of voltages always sums to zero in equilibrium — which is just the first law of thermodynamics in disguise. There is no free lunch, even in a junction. You can only extract energy if you do work to move the Fermi levels apart (i.e., apply a forward bias or shine light on it).

---

## 11.3 The Depletion Approximation

To find the electric field and potential distributions analytically, we use the **depletion approximation**: the depletion region is entirely free of mobile carriers (\(n \approx 0\), \(p \approx 0\)), and outside the depletion region carriers are at their equilibrium concentrations. This step-function simplification makes Poisson's equation tractable.

Let the junction be at \(x = 0\), with the depletion region extending from \(-x_p\) (into the p-side) to \(+x_n\) (into the n-side). The charge density within the depletion region is:

\[
\rho(x) = \begin{cases} -qN_A & -x_p < x < 0 \\ +qN_D & 0 < x < x_n \end{cases}
\]

Poisson's equation (\(d\mathcal{E}/dx = \rho/\varepsilon_s\)) integrates to give the electric field:

\[
\mathcal{E}(x) = \begin{cases} -\frac{qN_A}{\varepsilon_s}(x + x_p) & -x_p < x < 0 \\ \frac{qN_D}{\varepsilon_s}(x - x_n) & 0 < x < x_n \end{cases}
\]

The field is linear in each region and peaks at \(x = 0\):

\[
\mathcal{E}_{\max} = -\frac{qN_D x_n}{\varepsilon_s} = -\frac{qN_A x_p}{\varepsilon_s}
\]

**Charge neutrality** requires that the total positive charge equals total negative charge:

\[
N_D x_n = N_A x_p
\]

This is crucial: the more heavily doped side has a narrower depletion extension. In a one-sided junction (\(N_A \gg N_D\), i.e., a p\(^+\)n junction), almost all the depletion extends into the lightly doped n-side.

Integrating the field gives the potential, and requiring the total potential drop across the depletion region to equal \(V_{bi}\) gives the **depletion widths**:

\[
x_n = \sqrt{\frac{2\varepsilon_s V_{bi}}{q} \cdot \frac{N_A}{N_D(N_A + N_D)}}, \quad x_p = \sqrt{\frac{2\varepsilon_s V_{bi}}{q} \cdot \frac{N_D}{N_A(N_A + N_D)}}
\]

The **total depletion width** is:

\[
W = x_n + x_p = \sqrt{\frac{2\varepsilon_s V_{bi}}{q} \cdot \frac{N_A + N_D}{N_A N_D}}
\]

For a one-sided abrupt junction (\(N_A \gg N_D\)):

\[
W \approx x_n \approx \sqrt{\frac{2\varepsilon_s V_{bi}}{q N_D}}
\]

For silicon with \(N_D = 10^{16}\) cm\(^{-3}\) and \(V_{bi} = 0.7\) V: \(W \approx 0.3\) μm. The junction depletion region is submicron — compact and intense.

---

## 11.4 Forward and Reverse Bias

Applying an external voltage modifies the junction potential barrier and hence the depletion width and carrier injection.

**Zero bias (equilibrium):** Barrier = \(V_{bi}\). No net current. Drift and diffusion exactly cancel.

**Forward bias** (\(V > 0\) applied to p-side): The external voltage reduces the barrier to \(V_{bi} - V\). The depletion region narrows:

\[
W(V) = \sqrt{\frac{2\varepsilon_s (V_{bi} - V)}{q} \cdot \frac{N_A + N_D}{N_A N_D}}
\]

With a lower barrier, many more carriers have sufficient thermal energy to cross. The minority carrier concentration at the depletion edge increases exponentially — **minority carrier injection**.

**Reverse bias** (\(V < 0\), i.e., \(|V_R|\) applied to n-side): The barrier increases to \(V_{bi} + |V_R|\). The depletion region widens. Very few carriers cross. Only the small thermal generation current within the depletion region flows.

The band diagram tells the story visually. At forward bias, the quasi-Fermi levels split: \(F_n\) and \(F_p\) are separated by \(qV\). At reverse bias, the quasi-Fermi levels are pressed closer together in the depletion region, making \(np < n_i^2\) there — which drives net carrier generation rather than recombination.

| Condition | Barrier Height | Depletion Width | Majority Current | Minority Injection |
|-----------|---------------|-----------------|------------------|-------------------|
| Equilibrium | \(V_{bi}\) | \(W_0\) | Balanced | None |
| Forward bias \(V > 0\) | \(V_{bi} - V\) | Narrower | Exponential surge | Heavy |
| Reverse bias \(V < 0\) | \(V_{bi} + |V|\) | Wider | Negligible | Extraction |

---

## 11.5 Minority Carrier Injection and the Ideal Diode Equation

Under forward bias \(V\), the minority carrier concentration at the depletion edge increases by the **law of the junction**:

\[
p_n(x_n) = p_{n0} \exp\!\left(\frac{qV}{k_BT}\right), \quad n_p(-x_p) = n_{p0} \exp\!\left(\frac{qV}{k_BT}\right)
\]

where \(p_{n0} = n_i^2/N_D\) and \(n_{p0} = n_i^2/N_A\) are the equilibrium minority carrier concentrations on the n- and p-sides, respectively.

This boundary condition drives excess minority carriers into the neutral regions, where they diffuse away and recombine. Solving the minority carrier diffusion equation in each neutral region (with ohmic contacts as boundaries where \(\delta p = 0\)):

\[
\delta p(x) = p_{n0}\!\left(e^{qV/k_BT} - 1\right) e^{-(x - x_n)/L_p}, \quad x \geq x_n
\]

\[
\delta n(x) = n_{p0}\!\left(e^{qV/k_BT} - 1\right) e^{(x + x_p)/L_n}, \quad x \leq -x_p
\]

The diffusion current at each edge of the depletion region is \(J = -qD\, d(\delta)/dx\) evaluated at the edge. Summing both contributions:

\[
\boxed{J = J_s \left(\exp\!\left(\frac{qV}{k_BT}\right) - 1\right)}
\]

This is the **Shockley diode equation** (or ideal diode equation), where the **saturation current density** is:

\[
J_s = q n_i^2 \left(\frac{D_p}{L_p N_D} + \frac{D_n}{L_n N_A}\right)
\]

The total current is \(I = J \cdot A\), where \(A\) is the junction area. For \(V \gg k_BT/q\) (forward bias), the exponential dominates and \(I \propto e^{qV/k_BT}\). For \(V < 0\) (reverse bias), \(I \approx -I_s\) — a small, negative saturation current.

!!! mascot-tip "Nova Tips: The Saturation Current Temperature Trap"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova with tip pose">
    \(J_s \propto n_i^2 \propto e^{-E_g/k_BT}\), so diode saturation current doubles approximately every 10°C in silicon. This means a diode that leaks 1 nA at 25°C will leak ~1 μA at 85°C and ~100 μA at 125°C. For a circuit designed to work over the automotive temperature range (−40°C to +125°C), this 5-order-of-magnitude change in leakage current is *not* a small perturbation — it's the dominant design constraint for analog circuits and for battery-backed CMOS retention. Always check \(I_s(T)\) before declaring your analog design "done."

The **diode ideality factor** \(n\) (not to be confused with carrier density) appears in real devices:

\[
I = I_s \left(\exp\!\left(\frac{qV}{n k_BT}\right) - 1\right)
\]

The ideal Shockley equation predicts \(n = 1\) (diffusion-limited). Real diodes show:

- \(n \approx 1\): Diffusion current dominates (high forward bias, good-quality junction)
- \(n \approx 2\): Generation-recombination current dominates (low forward bias, depletion region recombination via traps)
- \(n > 2\): Tunneling or unusual recombination mechanisms

The crossover from \(n = 2\) to \(n = 1\) typically occurs around 0.3–0.5 V in silicon — visible as a change in slope on a semi-log current-voltage plot.

---

## 11.6 Beyond Ideal: Real Diode Behavior

The Shockley equation predicts four distinct current components actually present in a real silicon diode:

**1. Diffusion current (ideal):** \(I_{\text{diff}} = I_{s,\text{diff}}\,(e^{qV/k_BT} - 1)\) — dominates at moderate to high forward bias. Ideality factor \(n = 1\).

**2. Generation-recombination (G-R) current:** In reverse bias, the depleted region has \(np < n_i^2\), driving carrier generation via SRH traps. This additional reverse current is:

\[
J_{\text{gen}} = \frac{q n_i W}{2\tau_0} \quad \text{(reverse bias G-R current)}
\]

where \(\tau_0\) is the generation lifetime. In forward bias, the same traps cause excess recombination with ideality factor \(n = 2\):

\[
J_{\text{rec}} \propto n_i \exp\!\left(\frac{qV}{2k_BT}\right)
\]

G-R current dominates at low forward voltages (below ~0.4 V in silicon) and in the reverse bias regime.

**3. Tunneling current:** At high doping or in narrow junctions, carriers can quantum-mechanically tunnel through the thin depletion barrier. Band-to-band tunneling becomes important in heavily doped junctions (\(N \gtrsim 10^{18}\) cm\(^{-3}\)) and is the mechanism behind Zener breakdown and tunnel diodes.

**4. Reverse breakdown:** At sufficiently large reverse bias, the electric field causes:
- **Avalanche breakdown** (impact ionization): Carriers gain enough energy to create additional electron-hole pairs, producing exponential current multiplication
- **Zener breakdown** (tunneling): In highly doped junctions, direct band-to-band tunneling dominates; Zener voltage \(V_Z \lesssim 5\) V

The combined I-V characteristic of a real silicon diode spans roughly 20 decades of current — from femtoamperes to amperes — making it one of the most nonlinear and wide-dynamic-range components in all of electronics.

!!! mascot-warning "Nova Warns: 0.7 V Is a Silicon Myth (Sort Of)"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova with warning pose">
    The ubiquitous "0.7 V diode drop" is a useful circuit approximation but physically misleading. The actual forward voltage depends on current level — a silicon diode at 1 μA drops ~0.45 V; at 1 mA it's ~0.6 V; at 10 A it's ~0.85 V. The 0.7 V comes from historical convention for small-signal operation at milliamp currents. For power electronics, LED drivers, or low-power IoT devices, always calculate the actual operating point from the diode equation. Using 0.7 V blindly in a solar cell or a nanowatt sensor circuit will cost you the design.

<details markdown="1">
<summary>#### MicroSim: P-N Junction Explorer</summary>

**sim-id:** `pn-junction-explorer`  
**Library:** p5.js  
**Status:** specification  

**Description:** Comprehensive p-n junction visualization with three linked panels: (1) Band diagram showing \(E_C\), \(E_V\), \(E_F\) (or quasi-Fermi levels under bias), depletion region shading; (2) Charge density and electric field distributions; (3) I-V characteristic with ideality factor regions marked. User adjusts bias voltage with a slider and watches all three panels update simultaneously.

**Controls:**
- Slider: Applied voltage V (−5 V to +0.9 V)
- Sliders: N-side doping \(N_D\) and P-side doping \(N_A\) (independently, \(10^{14}\)–\(10^{18}\) cm\(^{-3}\))
- Dropdown: Temperature (200–400 K)
- Checkbox: Show minority carrier injection profiles
- Checkbox: Show quasi-Fermi levels vs. equilibrium Fermi level

**Key Learning Objectives:**
- L2 (Understand): Explain how forward/reverse bias modifies the depletion width
- L3 (Apply): Calculate built-in potential and depletion width for given doping values
- L4 (Analyze): Identify which current component dominates at a given forward voltage
- L5 (Evaluate): Predict I-V curve shape changes with doping and temperature

</details>

---

## Summary

This chapter derived the p-n junction from first principles:

- **Junction formation** creates a built-in field and depletion region by diffusion-induced charge separation
- **Built-in potential** \(V_{bi} = (k_BT/q)\ln(N_A N_D/n_i^2)\) balances drift and diffusion at equilibrium
- **Depletion approximation** gives linear \(\mathcal{E}(x)\), quadratic \(\phi(x)\), and depletion widths scaling as \(\sqrt{V_{bi}/N}\)
- **Forward bias** reduces the barrier, narrows the depletion region, and exponentially increases minority carrier injection
- **Shockley diode equation** \(I = I_s(e^{qV/k_BT} - 1)\) follows from solving the minority carrier diffusion equation in each neutral region
- **Real diodes** show G-R current (\(n=2\) at low bias), diffusion current (\(n=1\) at moderate bias), and breakdown at high reverse bias

## Key Equations

\[
V_{bi} = \frac{k_BT}{q}\ln\!\left(\frac{N_A N_D}{n_i^2}\right)
\]

\[
W = \sqrt{\frac{2\varepsilon_s (V_{bi} - V)}{q} \cdot \frac{N_A + N_D}{N_A N_D}}, \quad N_D x_n = N_A x_p
\]

\[
I = I_s\!\left(e^{qV/nk_BT} - 1\right), \quad I_s = qAn_i^2\!\left(\frac{D_p}{L_p N_D} + \frac{D_n}{L_n N_A}\right)
\]
