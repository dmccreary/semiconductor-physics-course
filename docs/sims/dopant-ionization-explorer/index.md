---
title: Dopant Ionization Fraction vs. Temperature
description: Interactive plot of the fraction of ionized donors or acceptors in silicon from 50 K to 600 K, with a band diagram showing how the Fermi level moves relative to the dopant level. Choose the dopant, the doping concentration, and a probe temperature.
image: /sims/dopant-ionization-explorer/dopant-ionization-explorer.png
og:image: /sims/dopant-ionization-explorer/dopant-ionization-explorer.png
twitter:image: /sims/dopant-ionization-explorer/dopant-ionization-explorer.png
social:
   cards: false
---

# Dopant Ionization Fraction vs. Temperature

<iframe src="main.html" width="100%" height="629" scrolling="no"></iframe>

[Run the Dopant Ionization Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/dopant-ionization-explorer/main.html"
        width="100%" height="629" scrolling="no"></iframe>
```

## Description

This MicroSim answers one question: at a given temperature, what fraction of
the dopant atoms in silicon have actually given up their carrier?

- The **top plot** shows the ionized fraction, \(N_D^+/N_D\) for donors (blue)
  or \(N_A^-/N_A\) for acceptors (red), from 50 K to 600 K. The green dashed
  line marks the 300 K operating point and the orange dashed line marks 90 %.
- The **bottom plot** is a band diagram on the same temperature axis. It
  shows the conduction band edge \(E_C\), the valence band edge \(E_V\), the
  intrinsic level \(E_i\), the dopant level (\(E_d\) or \(E_a\)), and the
  Fermi level \(E_F\).
- The **panel on the right** lists the values at the probe temperature and
  zooms in on the 0.36 eV of the gap next to the band edge. Ten circles on
  the dopant level stand for ten dopant atoms. An open circle with a charge
  sign is an ionized dopant, and a filled circle is a neutral one. With the
  Fermi-Dirac checkbox on, the purple curve is the occupation probability
  \(f(E)\) at the probe temperature.

Controls:

- **Dopant** selects one of the seven dopants from Chapter 7 (P, As, Sb, B,
  Ga, Al, In) with its ionization energy.
- **Doping** sets the dopant concentration from \(10^{14}\) to
  \(10^{18}\ \text{cm}^{-3}\) on a logarithmic scale.
- **Temperature** moves the probe line. **Sweep T** animates the probe from
  its current position up to 600 K.
- **Show Fermi-Dirac tail** toggles the \(f(E)\) curve in the zoom panel.

## Things to Try

1. **Predict first.** Phosphorus sits 45 meV below \(E_C\) and
   \(k_BT \approx 26\) meV at 300 K, so the level is less than two \(k_BT\)
   from the band. Would you expect most donors to be ionized? Check the
   readout at \(N_D = 10^{16}\ \text{cm}^{-3}\).
2. Look at the zoom panel at 300 K. The Fermi level is far below the donor
   level, so \(f(E_d)\) is tiny and nearly every donor is empty (ionized).
   The depth of the level compared with \(k_BT\) is not what decides
   ionization. The position of \(E_F\) relative to the level is.
3. Press **Sweep T** from 50 K. Watch \(E_F\) start between \(E_d\) and
   \(E_C\) (freeze-out) and fall toward \(E_i\) at high temperature.
4. Switch to **indium** (160 meV). What fraction is ionized at 300 K for
   \(N_A = 10^{16}\ \text{cm}^{-3}\)? At what temperature does it reach 90 %?
5. Keep phosphorus and raise the doping to \(10^{18}\ \text{cm}^{-3}\). The
   ionized fraction at 300 K drops well below 100 %. Use the zoom panel to
   explain why heavier doping makes ionization *less* complete in this model.

## The Physics Behind the Simulation

The sim solves the charge-neutrality condition from Section 7.5 for a single
dopant species at each temperature:

\[
n + N_A^- = p + N_D^+
\]

with Boltzmann statistics for the bands,

\[
n = N_C \exp\!\left(-\frac{E_C - E_F}{k_BT}\right), \qquad
p = N_V \exp\!\left(-\frac{E_F - E_V}{k_BT}\right)
\]

and the occupancy of the dopant level, including its degeneracy factor:

\[
\frac{N_D^+}{N_D} = \frac{1}{1 + g_D \exp\!\left(\dfrac{E_F - E_d}{k_BT}\right)}, \qquad
\frac{N_A^-}{N_A} = \frac{1}{1 + g_A \exp\!\left(\dfrac{E_a - E_F}{k_BT}\right)}
\]

The equation is solved for \(E_F\) by bisection. Nothing is assumed about
which regime the material is in, so the same calculation covers freeze-out,
the extrinsic plateau, and the approach to intrinsic behavior.

| Parameter | Value used |
|-----------|------------|
| \(N_C\), \(N_V\) at 300 K | \(2.86 \times 10^{19}\), \(3.10 \times 10^{19}\ \text{cm}^{-3}\), scaled as \(T^{3/2}\) |
| \(n_i\) at 300 K | \(9.65 \times 10^{9}\ \text{cm}^{-3}\) |
| Bandgap \(E_g(T)\) | Varshni form, \(E_g(0) - \alpha T^2/(T+\beta)\) with \(\alpha = 4.73 \times 10^{-4}\) eV/K, \(\beta = 636\) K |
| Donor degeneracy \(g_D\) | 2 |
| Acceptor degeneracy \(g_A\) | 4 |
| Ionization energies | P 45, As 54, Sb 43, B 45, Ga 72, Al 69, In 160 meV (Chapter 7 tables) |

**Worked check.** For phosphorus at \(N_D = 10^{16}\ \text{cm}^{-3}\) and
300 K, neglecting holes, the neutrality condition becomes a quadratic in
\(n\) with \(N^* = (N_C/g_D)\,e^{-45\,\text{meV}/k_BT} =
2.5 \times 10^{18}\ \text{cm}^{-3}\):

\[
n = \frac{N^*}{2}\left(\sqrt{1 + \frac{4N_D}{N^*}} - 1\right)
  = 9.96 \times 10^{15}\ \text{cm}^{-3}
\]

so 99.6 % of the donors are ionized, and
\(E_C - E_F = k_BT \ln(N_C/n) = 0.206\) eV. Both match the readouts.

### Simplifications and Limitations

- **Bandgap offset.** The 0 K gap in the Varshni expression is set to
  1.175 eV rather than the accepted 1.170 eV, so that
  \(\sqrt{N_C N_V}\,e^{-E_g/2k_BT}\) returns the chapter's
  \(n_i = 9.65 \times 10^{9}\ \text{cm}^{-3}\) at 300 K with the chapter's
  \(N_C\) and \(N_V\). The 5 meV shift is invisible on the plots.
- **Isolated dopant levels.** Each dopant is treated as a single sharp level.
  Above roughly \(10^{18}\ \text{cm}^{-3}\) the levels broaden into an
  impurity band that merges with the band edge (Section 7.8), and real
  silicon becomes *more* fully ionized than this model predicts. The doping
  slider therefore stops at \(10^{18}\ \text{cm}^{-3}\), and the sim shows a
  caution from \(3 \times 10^{17}\ \text{cm}^{-3}\) upward.
- **Boltzmann statistics** are used for the bands, which is consistent with
  the non-degenerate doping range of the slider.
- **Acceptor degeneracy** \(g_A = 4\) is the standard value for silicon
  (spin times the heavy- and light-hole bands). The chapter text quotes only
  \(g_D = 2\).
- Excited dopant states and the temperature dependence of the ionization
  energies are ignored.

## Lesson Plan

**Learning objectives:** Students will be able to

- explain (Understand, L2) why shallow dopants are almost fully ionized at
  300 K,
- predict (Apply, L3) the ionized fraction for a given dopant, doping level,
  and temperature, and
- identify (Analyze, L4) the conditions under which the complete-ionization
  approximation breaks down.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 10–15 minutes.

**Prerequisites:** Fermi-Dirac statistics and the effective density of states
(Chapter 6); donor and acceptor levels (Sections 7.2–7.4).

### Suggested Sequence

1. **Warm-up (2 min):** With the defaults (phosphorus,
   \(10^{16}\ \text{cm}^{-3}\), 300 K), have students name every line in the
   band diagram and read the ionized fraction.
2. **Predict-test-observe (5 min):** Students predict whether cooling to
   77 K changes the ionized fraction by a little or a lot, then move the
   temperature slider to check. Repeat for 150 K.
3. **Compare dopants (4 min):** Record the 300 K ionized fraction for B, Ga,
   Al, and In at \(10^{16}\ \text{cm}^{-3}\). Plot fraction against
   ionization energy.
4. **Wrap-up (3 min):** Students list the three situations in which
   \(n \approx N_D\) fails (low temperature, deep level, heavy doping) and
   point to the evidence for each in the sim.

### Assessment Questions

1. The phosphorus level is only 45 meV below \(E_C\), which is less than
   \(2k_BT\) at 300 K. Why are more than 99 % of the donors ionized at
   \(10^{16}\ \text{cm}^{-3}\)?
   *(The Fermi level lies about 0.2 eV below \(E_C\), far below \(E_d\), so
   the probability that the donor level holds an electron is very small.)*
2. Why does the ionized fraction fall when the doping is raised at fixed
   temperature?
   *(More carriers move \(E_F\) toward the band edge and so toward the dopant
   level, which raises the occupancy of the level.)*
3. A power device uses indium at \(10^{16}\ \text{cm}^{-3}\). Estimate the
   hole concentration at 300 K.
   *(About 70 % ionized, so \(p \approx 7 \times 10^{15}\ \text{cm}^{-3}\),
   not \(10^{16}\).)*

## References

- [Chapter 7: Doping, Extrinsic Carriers, and the Fermi Level](../../chapters/07-doping-extrinsic-carriers/index.md) —
  ionization energies, complete ionization, and the charge-neutrality condition
- [Chapter 6: Fermi-Dirac Statistics and Intrinsic Carrier Concentrations](../../chapters/06-fermi-dirac-statistics/index.md) —
  \(N_C\), \(N_V\), and \(n_i\)
- [Doping (semiconductor) (Wikipedia)](https://en.wikipedia.org/wiki/Doping_(semiconductor))
- [Varshni's empirical expression, in Band gap (Wikipedia)](https://en.wikipedia.org/wiki/Band_gap)
- S. M. Sze and K. K. Ng, *Physics of Semiconductor Devices*, 3rd ed., Wiley, 2007, Section 1.4.
