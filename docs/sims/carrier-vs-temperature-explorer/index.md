---
title: Carrier Concentration vs. Temperature
description: Log-scale plot of the electron and hole concentrations in doped silicon from 50 K to 1000 K, with the freeze-out, extrinsic, and intrinsic regimes shaded. Change the doping type and concentration to see the regime boundaries move.
image: /sims/carrier-vs-temperature-explorer/carrier-vs-temperature-explorer.png
og:image: /sims/carrier-vs-temperature-explorer/carrier-vs-temperature-explorer.png
twitter:image: /sims/carrier-vs-temperature-explorer/carrier-vs-temperature-explorer.png
social:
   cards: false
---

# Carrier Concentration vs. Temperature

<iframe src="main.html" width="100%" height="607" scrolling="no"></iframe>

[Run the Carrier Concentration vs. Temperature Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/carrier-vs-temperature-explorer/main.html"
        width="100%" height="607" scrolling="no"></iframe>
```

## Description

This MicroSim plots the electron concentration \(n(T)\) (blue) and the hole
concentration \(p(T)\) (red) in doped silicon from 50 K to 1000 K. Both axes
are logarithmic: the concentration axis covers \(10^{2}\) to
\(10^{20}\ \text{cm}^{-3}\), and the temperature axis is stretched at the
cold end so the freeze-out region is wide enough to see.

Three shaded bands mark the regimes of Section 7.5:

- **Freeze-out** (blue): fewer than 90 % of the dopant atoms are ionized, so
  the majority carrier concentration falls below the doping level.
- **Extrinsic** (green): the majority carrier concentration sits on the
  plateau \(n \approx N_D\) or \(p \approx N_A\).
- **Intrinsic** (orange): \(n_i(T)\) exceeds the doping concentration, and
  both carrier concentrations climb toward \(n_i\).

The thicker curve is the majority carrier. The dotted horizontal line is the
doping level, and the gray dashed curve is \(n_i(T)\). The panel on the right
gives \(n\), \(p\), \(n_i\), the ionized fraction, and the regime at the probe
temperature, followed by the two boundary temperatures for the current
doping.

Controls:

- **N-type / P-type** selects phosphorus donors or boron acceptors (both
  45 meV).
- **Doping** sets \(N_D\) or \(N_A\) from \(10^{14}\) to
  \(10^{18}\ \text{cm}^{-3}\).
- **Temperature** moves the probe line.
- **Show ni(T) curve** and **Show regime labels** toggle the reference curve
  and the band labels.

## Things to Try

1. **Predict first.** At \(N_D = 10^{15}\ \text{cm}^{-3}\), over what range of
   temperature would you expect \(n \approx N_D\)? Compare your answer with
   the extrinsic band and with the "roughly 100–600 K" quoted in Section 7.5.
2. Slide the temperature probe from 50 K to 1000 K and watch the regime name
   change. Record \(n\) and \(p\) at 77 K, 300 K, and 700 K.
3. At 300 K, check the law of mass action: multiply the \(n\) and \(p\)
   readouts and compare with \(n_i^2\).
4. Raise the doping from \(10^{14}\) to \(10^{17}\ \text{cm}^{-3}\). Which
   boundary moves more, and in which direction? Why can a heavily doped power
   device run hotter before it "forgets" its doping?
5. Switch to P-type at the same doping. The hole curve now sits on the
   plateau. Is the freeze-out boundary the same as for N-type? (The acceptor
   level has degeneracy 4 instead of 2.)

## The Physics Behind the Simulation

At every temperature the sim solves the charge-neutrality condition

\[
n + N_A^- = p + N_D^+
\]

for the Fermi level, using

\[
n = N_C(T)\,e^{-(E_C - E_F)/k_BT}, \qquad p = N_V(T)\,e^{-(E_F - E_V)/k_BT}
\]

\[
\frac{N_D^+}{N_D} = \frac{1}{1 + g_D\,e^{(E_F - E_d)/k_BT}}, \qquad
\frac{N_A^-}{N_A} = \frac{1}{1 + g_A\,e^{(E_a - E_F)/k_BT}}
\]

The intrinsic concentration follows from the same quantities:

\[
n_i(T) = \sqrt{N_C N_V}\,\exp\!\left(-\frac{E_g(T)}{2k_BT}\right)
\]

No regime is assumed in advance. The three regimes appear as limits of the
one numerical solution.

| Parameter | Value used |
|-----------|------------|
| \(N_C\), \(N_V\) at 300 K | \(2.86 \times 10^{19}\), \(3.10 \times 10^{19}\ \text{cm}^{-3}\), scaled as \(T^{3/2}\) |
| \(n_i\) at 300 K | \(9.65 \times 10^{9}\ \text{cm}^{-3}\) |
| Bandgap \(E_g(T)\) | Varshni form with \(\alpha = 4.73 \times 10^{-4}\) eV/K, \(\beta = 636\) K |
| Dopants | Phosphorus (\(g_D = 2\)) and boron (\(g_A = 4\)), both 45 meV |

**Regime boundaries.** The boundaries are conventions, and this sim uses two
common ones. The freeze-out boundary is the temperature at which 90 % of the
dopants are ionized. The intrinsic boundary is the temperature at which
\(n_i(T)\) equals the doping concentration.

**Worked check.** For \(N_D = 10^{15}\ \text{cm}^{-3}\) at 300 K the donors
are fully ionized, so \(n = 1.00 \times 10^{15}\ \text{cm}^{-3}\) and

\[
p = \frac{n_i^2}{n} = \frac{(9.65 \times 10^{9})^2}{10^{15}}
  = 9.3 \times 10^{4}\ \text{cm}^{-3}
\]

which matches the readout. The model gives \(n_i = 10^{15}\ \text{cm}^{-3}\)
at 547 K and \(n_i = 10^{14}\ \text{cm}^{-3}\) at 472 K, which is where the
intrinsic band begins for those two doping levels.

### Simplifications and Limitations

- **Bandgap offset.** The 0 K gap in the Varshni expression is set to
  1.175 eV rather than the accepted 1.170 eV, so that the formula for
  \(n_i\) returns the chapter's \(9.65 \times 10^{9}\ \text{cm}^{-3}\) at
  300 K with the chapter's \(N_C\) and \(N_V\).
- **High-temperature values.** The model gives
  \(n_i \approx 2.6 \times 10^{14}\ \text{cm}^{-3}\) at 500 K and
  \(3.7 \times 10^{15}\ \text{cm}^{-3}\) at 600 K. The rounded entries in the
  table of Section 7.10 are larger: about 4 times at 500 K and more than
  10 times at 600 K.
- **Isolated dopant levels.** Above roughly \(10^{18}\ \text{cm}^{-3}\) the
  dopant levels broaden into a band that merges with the band edge
  (Section 7.8), and degenerately doped silicon shows no freeze-out at all.
  The doping slider therefore stops at \(10^{18}\ \text{cm}^{-3}\), and a
  caution appears from \(3 \times 10^{17}\ \text{cm}^{-3}\) upward.
- **Boltzmann statistics** are used for the bands, and compensation (donors
  and acceptors together) is not modeled.
- The temperature axis is logarithmic. The specification called for a plot
  against temperature without naming the scale; a linear axis would squeeze
  freeze-out into a sliver at the left edge.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) the freeze-out, extrinsic, and intrinsic regimes
  on a plot of \(n(T)\),
- predict (Apply, L3) the operating regime for a given doping level and
  temperature, and
- explain (Analyze, L4) why heavier doping extends the extrinsic regime to
  higher temperature.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 10–15 minutes.

**Prerequisites:** Intrinsic carrier concentration and the law of mass action
(Chapter 6); donors, acceptors, and complete ionization (Sections 7.2–7.4).

### Suggested Sequence

1. **Warm-up (2 min):** With the defaults, have students name the three
   bands and state what limits the majority carrier concentration in each.
2. **Predict-test-observe (5 min):** Students predict the regime at 77 K,
   300 K, and 600 K for \(N_D = 10^{15}\ \text{cm}^{-3}\), then check with
   the probe.
3. **Doping sweep (5 min):** Tabulate the two boundary temperatures for
   \(10^{14}\), \(10^{15}\), \(10^{16}\), and \(10^{17}\ \text{cm}^{-3}\).
   Plot the width of the extrinsic window against doping.
4. **Wrap-up (3 min):** Which devices care about the upper boundary
   (automotive and power electronics) and which about the lower boundary
   (cryogenic electronics)?

### Assessment Questions

1. A silicon sensor doped at \(10^{14}\ \text{cm}^{-3}\) must work at 200 °C
   (473 K). Is it still extrinsic?
   *(It is at the edge: \(n_i\) reaches \(10^{14}\ \text{cm}^{-3}\) at about
   472 K.)*
2. Why does the minority carrier curve rise so steeply with temperature in
   the extrinsic regime while the majority curve is flat?
   *(The majority concentration is pinned at the doping level, so
   \(p = n_i^2/N_D\) follows \(n_i^2\), which is exponential in
   \(-E_g/k_BT\).)*
3. Explain why raising the doping moves the intrinsic boundary to a higher
   temperature.
   *(\(n_i\) must grow to a larger value before it matches the doping, and
   \(n_i\) only grows with temperature.)*

## References

- [Chapter 7: Doping, Extrinsic Carriers, and the Fermi Level](../../chapters/07-doping-extrinsic-carriers/index.md) —
  the three temperature regimes and the charge-neutrality condition
- [Dopant Ionization Fraction vs. Temperature MicroSim](../dopant-ionization-explorer/index.md) —
  the same model, showing the ionized fraction and the Fermi level
- [Temperature Dependence of n_i Explorer](../intrinsic-concentration-temperature/index.md)
- [Extrinsic semiconductor (Wikipedia)](https://en.wikipedia.org/wiki/Extrinsic_semiconductor)
- S. M. Sze and K. K. Ng, *Physics of Semiconductor Devices*, 3rd ed., Wiley, 2007, Section 1.4.
