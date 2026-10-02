---
title: P-N Junction Explorer
description: Four linked plots for a silicon p-n junction. Set the bias, the doping on each side, and the temperature, and watch the band diagram, the charge and field, the current-voltage curve, and the carrier profiles change together.
image: /sims/pn-junction-explorer/pn-junction-explorer.png
og:image: /sims/pn-junction-explorer/pn-junction-explorer.png
twitter:image: /sims/pn-junction-explorer/pn-junction-explorer.png
social:
   cards: false
---

# P-N Junction Explorer

<iframe src="main.html" width="100%" height="702" scrolling="no"></iframe>

[Run the P-N Junction Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/pn-junction-explorer/main.html"
        width="100%" height="702" scrolling="no"></iframe>
```

## Description

This MicroSim shows an abrupt silicon p-n junction from four angles at once.
The p side is on the left and the n side is on the right in every plot.

- **Band diagram.** \(E_C\) and \(E_V\) bend across the depletion region
  (gray). The step between the two sides is the barrier
  \(q(V_{bi} - V)\). The dashed lines are the Fermi level at equilibrium
  and the two quasi-Fermi levels \(F_n\) and \(F_p\) under bias. They are
  separated by \(qV\).
- **Charge density and electric field.** The depletion approximation gives
  a block of charge \(-qN_A\) of width \(x_p\) and a block \(+qN_D\) of
  width \(x_n\). The two blocks have equal areas. The field is a triangle
  that peaks at the junction.
- **Current density.** \(|J|\) against voltage on a logarithmic scale. The
  thick black curve is the total. The dashed curves are the diffusion
  current (blue) and the recombination-generation current (orange). The
  shaded bands mark where each one dominates in forward bias, with slopes
  that correspond to ideality factors near 2 and near 1. The reverse side
  of the voltage axis is compressed.
- **Carrier concentrations.** Majority and minority concentrations on each
  side, on a logarithmic scale. Distance is measured from the depletion
  edges in diffusion lengths. The depletion region is the narrow gray band
  and is not to scale.

The strip under the plots gives \(V_{bi}\), \(W\), the peak field, the
current density, the share of the dominant current component, and the local
ideality factor.

Controls:

- **Temperature** sets 200, 250, 300, 350, or 400 K.
- **Carrier profiles** switches the fourth panel between the concentration
  plot and a worked calculation that substitutes the present numbers into
  the chapter formulas.
- **Quasi-Fermi levels** draws \(F_n\) and \(F_p\) across the whole band
  diagram. With the box cleared, only the majority-carrier Fermi level of
  each neutral region is drawn.
- **Applied voltage** runs from −5 V to +0.9 V.
- **p-side doping** and **n-side doping** each run from \(10^{14}\) to
  \(10^{18}\ \text{cm}^{-3}\).
- **Reset** returns to 300 K, 0 V, \(N_A = 10^{17}\) and
  \(N_D = 10^{16}\ \text{cm}^{-3}\).

## Things to Try

1. **Predict first.** Before you move the voltage slider, sketch how the
   depletion width changes from −5 V to +0.6 V. Then check. By what factor
   does \(W\) change when \(V_{bi} - V\) is quadrupled?
2. Clear the **Carrier profiles** box and work out \(V_{bi}\) and \(W\) by
   hand for the default doping. Compare with the worked calculation panel.
3. Make the junction one-sided: set \(N_A = 10^{18}\) and
   \(N_D = 10^{15}\ \text{cm}^{-3}\). Which side holds nearly all of the
   depletion region? Why are the two charge blocks still equal in area?
4. Sweep the forward voltage from 0.1 V to 0.7 V and watch the local
   ideality factor. At what voltage does the diffusion current overtake the
   recombination current? Does that voltage move when you raise the
   temperature to 400 K?
5. In reverse bias, read the current at −1 V and at −5 V. The ideal diode
   equation says the two should be equal. Why are they not?
6. Push the forward voltage to 0.9 V. Read the caution and explain in your
   own words why the ideal-diode model stops being valid.

## The Physics Behind the Simulation

All equations are from Chapter 11.

**Built-in potential (Section 11.2)**

\[
V_{bi} = \frac{k_BT}{q} \ln\!\left(\frac{N_A N_D}{n_i^2}\right)
\]

**Depletion approximation (Sections 11.3 and 11.4)**

\[
W = \sqrt{\frac{2\varepsilon_s (V_{bi} - V)}{q} \cdot \frac{N_A + N_D}{N_A N_D}},
\qquad x_n = W\frac{N_A}{N_A + N_D}, \qquad x_p = W\frac{N_D}{N_A + N_D}
\]

\[
|\mathcal{E}|_{\max} = \frac{qN_D x_n}{\varepsilon_s} = \frac{2(V_{bi} - V)}{W}
\]

with \(\varepsilon_s = 11.7\,\varepsilon_0\).

**Current (Sections 11.5 and 11.6)**

\[
J = J_s\left(e^{qV/k_BT} - 1\right) + \frac{q n_i W}{2\tau_0}\left(e^{qV/2k_BT} - 1\right),
\qquad
J_s = q n_i^2 \left(\frac{D_p}{L_p N_D} + \frac{D_n}{L_n N_A}\right)
\]

The first term is the Shockley diffusion current. The second term is the
recombination-generation current of the depletion region. In reverse bias
it tends to the chapter's generation current \(-q n_i W / 2\tau_0\), and in
forward bias it grows as \(e^{qV/2k_BT}\). The **local ideality factor** in
the readout is the slope of the total curve,
\(n = (q/k_BT)\,dV/d(\ln J)\).

**Minority carriers (Section 11.5)**

\[
p_n(x) = p_{n0}\left[1 + \left(e^{qV/k_BT} - 1\right)e^{-(x - x_n)/L_p}\right],
\qquad p_{n0} = \frac{n_i^2}{N_D}
\]

and the same form for electrons on the p side.

| Parameter | Value | Source |
|-----------|-------|--------|
| \(n_i\)(300 K) | \(9.65 \times 10^{9}\ \text{cm}^{-3}\) | Chapters 6, 7 and 11 |
| \(N_C\), \(N_V\) at 300 K | \(2.86 \times 10^{19}\), \(3.10 \times 10^{19}\ \text{cm}^{-3}\), scaled as \(T^{3/2}\) | Chapter 6 |
| \(E_g(T)\) | Varshni form, \(\alpha = 4.73 \times 10^{-4}\) eV/K, \(\beta = 636\) K, with \(E_g(0)\) set so that \(n_i\)(300 K) has the value above | same as the Chapter 7 MicroSims |
| Electron mobility | \(65 + 1265/[1 + (N/1.26 \times 10^{17})^{0.85}]\) cm²/V·s | Chapter 8, Section 8.4 |
| Hole mobility | \(54.3 + 406.9/[1 + (N/2.35 \times 10^{17})^{0.88}]\) cm²/V·s | Arora, Hauser, and Roulston (1982), 300 K |
| \(D = \mu k_BT/q\), \(L = \sqrt{D\tau}\) | Einstein relation | Chapter 9 |
| \(\tau_n = \tau_p = \tau_0\) | 1 µs | assumed |

**Worked check.** 300 K, \(N_A = 10^{17}\), \(N_D = 10^{16}\ \text{cm}^{-3}\), \(V = 0\):

\[
V_{bi} = 0.02585\ \text{V} \times \ln\!\left(\frac{10^{17} \times 10^{16}}{(9.65 \times 10^{9})^2}\right)
= 0.02585 \times \ln(1.07 \times 10^{13}) = 0.776\ \text{V}
\]

\[
W = \sqrt{\frac{2 (1.036 \times 10^{-12}\ \text{F/cm})(0.776\ \text{V})}{1.602 \times 10^{-19}\ \text{C}}
\cdot \frac{1.1 \times 10^{17}}{10^{33}}\ \text{cm}^{3}} = 3.32 \times 10^{-5}\ \text{cm} = 0.332\ \mu\text{m}
\]

Then \(x_n = 0.302\ \mu\text{m}\), \(x_p = 0.030\ \mu\text{m}\), and
\(|\mathcal{E}|_{\max} = 2 \times 0.776 / 3.32 \times 10^{-5} = 4.67 \times 10^{4}\)
V/cm. The mobility fits give \(D_p = 11.3\) and \(D_n = 19.6\) cm²/s, so
\(L_p = 33.6\ \mu\text{m}\), \(L_n = 44.3\ \mu\text{m}\), and
\(J_s = 5.68 \times 10^{-12}\) A/cm². These are the numbers the sim shows.
Section 11.2 quotes about 0.76 V for the same doping. The formula gives
0.776 V with \(k_BT/q = 25.85\) mV.

### Simplifications and Limitations

- **Depletion approximation.** The charge blocks have sharp edges and the
  neutral regions are field-free.
- **Low-level injection only.** The model is valid while the injected
  minority density stays well below the doping of the lighter side. The
  sim shades the forward range beyond that limit gray and shows a caution.
  It also stops the plots at \(V_{bi} - 0.05\) V, because the junction
  voltage can never reach \(V_{bi}\). A real diode is limited by series
  resistance in this range.
- **No breakdown.** Avalanche and Zener breakdown (Chapter 12) are not
  modeled. A caution appears when the reverse bias exceeds the avalanche
  estimate of Section 12.1 for the lighter doping.
- **Recombination-generation current.** The single expression used here is
  the standard estimate for traps at midgap. It has the correct limits in
  reverse bias and in forward bias, but it is not exact in between.
- **Mobility and lifetime.** The mobilities are the 300 K fits at every
  temperature, and both lifetimes are fixed at 1 µs. The temperature
  dependence of the current is dominated by \(n_i\), so the trends are
  right, but the absolute currents away from 300 K are estimates.
- **Complete ionization and non-degenerate statistics.** Both are good
  assumptions up to \(10^{18}\ \text{cm}^{-3}\) at 300 K. At 200 K and
  \(10^{18}\ \text{cm}^{-3}\) some dopants are frozen out, which the sim
  ignores.
- **Quasi-Fermi levels** are drawn flat across the whole band diagram. In
  a real diode each one returns to the majority Fermi level over a few
  diffusion lengths, which is far outside the region shown.

## Lesson Plan

**Learning objectives:** Students will be able to

- explain (Understand, L2) how forward and reverse bias change the
  depletion width,
- calculate (Apply, L3) the built-in potential and depletion width for
  given doping values,
- identify (Analyze, L4) which current component dominates at a given
  forward voltage, and
- predict (Evaluate, L5) how the current-voltage curve changes with doping
  and temperature.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 20 minutes.

**Prerequisites:** Carrier statistics and doping (Chapter 7); drift,
diffusion, and the Einstein relation (Chapters 8 and 9); recombination and
lifetime (Chapter 10).

### Suggested Sequence

1. **Equilibrium (4 min):** With the defaults, students identify the
   barrier, the depletion edges, and the flat Fermi level. They check
   \(N_A x_p = N_D x_n\) from the readouts.
2. **Hand calculation (5 min):** Students compute \(V_{bi}\) and \(W\) for
   \(N_A = N_D = 10^{16}\ \text{cm}^{-3}\), then set the sliders and
   compare.
3. **Bias (5 min):** Predict-test-observe for the depletion width, the
   peak field, and the minority carrier profiles at +0.5 V and −3 V.
4. **Current components (6 min):** Students find the crossover voltage
   between recombination and diffusion at 300 K and at 400 K and explain
   the shift.

### Assessment Questions

1. Doubling \(N_D\) on the lightly doped side changes \(W\) by about what
   factor in a one-sided junction?
   *(About \(1/\sqrt{2}\), apart from the small rise in \(V_{bi}\).)*
2. Why does the reverse current keep rising slowly with reverse voltage?
   *(Generation in the depletion region is proportional to \(W\), which
   grows as \(\sqrt{V_{bi} - V}\).)*
3. Why does the crossover from \(n \approx 2\) to \(n \approx 1\) move to
   lower voltage at higher temperature?
   *(Diffusion current scales as \(n_i^2\) and recombination current as
   \(n_i\), so diffusion gains on recombination as \(n_i\) rises.)*

## References

- [Chapter 11: P-N Junction: Equilibrium, Bias, and the Ideal Diode](../../chapters/11-pn-junction-equilibrium/index.md) —
  built-in potential, depletion approximation, and the diode equation
- [P-N Junction Voltage Explorer](../pn-junction/index.md) — a companion
  MicroSim that animates the carriers in the device cross section
- W. Shockley, "The theory of p-n junctions in semiconductors and p-n
  junction transistors," *Bell System Technical Journal*, vol. 28,
  pp. 435–489, 1949.
- C.-T. Sah, R. N. Noyce, and W. Shockley, "Carrier generation and
  recombination in p-n junctions and p-n junction characteristics,"
  *Proceedings of the IRE*, vol. 45, pp. 1228–1243, 1957.
- N. D. Arora, J. R. Hauser, and D. J. Roulston, "Electron and hole
  mobilities in silicon as a function of concentration and temperature,"
  *IEEE Transactions on Electron Devices*, vol. ED-29, pp. 292–295, 1982.
- [p–n junction (Wikipedia)](https://en.wikipedia.org/wiki/P%E2%80%93n_junction)
