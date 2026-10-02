---
title: Carrier Mobility Explorer
description: Two log-log plots of electron or hole mobility in silicon, against temperature and against doping, with a separate curve for each scattering mechanism. Switch mechanisms on and off to see Matthiessen's rule decide the total.
image: /sims/carrier-mobility-explorer/carrier-mobility-explorer.png
og:image: /sims/carrier-mobility-explorer/carrier-mobility-explorer.png
twitter:image: /sims/carrier-mobility-explorer/carrier-mobility-explorer.png
social:
   cards: false
---

# Carrier Mobility Explorer

<iframe src="main.html" width="100%" height="670" scrolling="no"></iframe>

[Run the Carrier Mobility Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/carrier-mobility-explorer/main.html"
        width="100%" height="670" scrolling="no"></iframe>
```

## Description

Mobility in silicon is set by whichever scattering mechanism is fastest. This
MicroSim draws a partial mobility curve for each mechanism and combines them
with Matthiessen's rule.

- The **left plot** shows mobility against temperature (50–600 K) at the
  doping chosen with the slider.
- The **right plot** shows mobility against ionized impurity concentration
  (\(10^{14}\) to \(10^{19}\ \text{cm}^{-3}\)) at the probe temperature.
- Each **colored curve** is the mobility the carriers would have if that
  mechanism were the only one acting. The **thick black curve** is the total.
  It always lies below every colored curve and hugs the lowest one.
- The **strip under the plots** lists the partial mobilities at the probe
  point and each mechanism's share of the total scattering, that is, its
  share of \(1/\mu\).

Controls:

- **Carrier** switches between electrons and holes.
- The four **checkboxes** switch scattering mechanisms on and off. Their
  label colors match the curves.
- **Doping** and **Temperature** set the probe point (the dashed lines and
  black dots).
- **Reset** returns to electrons, \(10^{16}\ \text{cm}^{-3}\), 300 K, with
  every mechanism on.

Two of the checkboxes are tied to the carrier type. For electrons the
"Optical phonon" box is disabled, and for holes the "Intervalley" box is
disabled. The reason is given in the physics section below.

## Things to Try

1. **Predict first.** At 300 K and \(10^{16}\ \text{cm}^{-3}\), which
   mechanism limits electron mobility? Read the shares in the strip. Then
   predict what happens to the shares at \(10^{18}\ \text{cm}^{-3}\) and
   check.
2. On the left plot, find the temperature at which the red (impurity) and
   phonon curves cross. Mobility peaks near there. Raise the doping and watch
   the peak move.
3. Switch **Ionized impurity** off. The total now follows the phonons alone.
   Measure its slope between 200 K and 400 K on the log-log plot and compare
   with the \(T^{-2.42}\) law of Section 8.4.
4. With everything on, add the reciprocals of the partial mobilities in the
   strip by hand and confirm that they give \(1/\mu\).
5. Switch to **holes**. Which phonon mechanism replaces intervalley
   scattering, and how does the 300 K mobility compare with electrons?

## The Physics Behind the Simulation

**Matthiessen's rule** (Section 8.3) adds scattering rates, so reciprocal
mobilities add:

\[
\frac{1}{\mu} = \frac{1}{\mu_{\text{ac}}} + \frac{1}{\mu_{\text{op/iv}}} + \frac{1}{\mu_{\text{ii}}}
\]

The sim uses one semi-empirical partial mobility for each mechanism.

| Mechanism | Temperature and doping dependence | Applies to |
|-----------|-----------------------------------|------------|
| Acoustic phonon | \(\mu_{\text{ac}} \propto T^{-3/2}\) | electrons and holes |
| Intervalley phonon | \(\mu_{\text{iv}} \propto T^{-1/2}\left[e^{\theta/T} - 1\right]\), \(\theta = 630\) K | electrons |
| Optical phonon | \(\mu_{\text{op}} \propto T^{-1/2}\left[e^{\theta/T} - 1\right]\), \(\theta = 731\) K (63 meV) | holes |
| Ionized impurity | \(\mu_{\text{ii}}(T, N) = \mu_{\text{ii}}(300\,\text{K}, N)\,(T/300)^{3/2}\) | electrons and holes |

The single-phonon form \(T^{-1/2}[e^{\theta/T} - 1]\) reduces to \(T^{-3/2}\)
when \(T \gg \theta\) and rises exponentially at low temperature, where there
are too few high-energy phonons to absorb.

**Calibration at 300 K.** The total at 300 K is the empirical fit of
Section 8.4, which has the Caughey–Thomas form

\[
\mu(N) = \mu_{\min} + \frac{\mu_0 - \mu_{\min}}{1 + (N/N_{\text{ref}})^{\alpha}}
\]

| Carrier | \(\mu_{\min}\) | \(\mu_0\) | \(N_{\text{ref}}\) | \(\alpha\) | Source |
|---------|---------------|-----------|--------------------|-----------|--------|
| Electrons | 65 | 1330 cm²/V·s | \(1.26 \times 10^{17}\ \text{cm}^{-3}\) | 0.85 | Chapter 8, Section 8.4 |
| Holes | 54.3 | 461.2 cm²/V·s | \(2.35 \times 10^{17}\ \text{cm}^{-3}\) | 0.88 | Arora, Hauser, and Roulston (1982), 300 K values |

The partial mobilities are then fixed in two steps:

1. The two phonon terms are scaled so that, at 300 K, their Matthiessen sum
   equals \(\mu_0\) and its log-log slope equals the chapter's lattice
   exponent (\(-2.42\) for electrons, \(-2.20\) for holes). This gives
   \(\mu_{\text{ac}} = 3917\) and \(\mu_{\text{iv}} = 2014\) cm²/V·s for
   electrons, and \(\mu_{\text{ac}} = 794\) and \(\mu_{\text{op}} = 1100\)
   cm²/V·s for holes.
2. The ionized-impurity term at 300 K is whatever Matthiessen's rule needs to
   reproduce the fit: \(1/\mu_{\text{ii}} = 1/\mu(N) - 1/\mu_0\).

**Why two checkboxes are carrier-specific.** Silicon's conduction band has
six equivalent valleys, and the high-energy phonons scatter electrons from
one valley to another (f- and g-type processes, Section 8.3.2). Scattering by
optical phonons *within* one valley is forbidden by symmetry for these
valleys, so the sim has no separate optical term for electrons. The valence
band has its maximum at a single point, so holes have no intervalley
scattering, and optical phonons take that role.

**Worked check.** Electrons, \(N = 10^{16}\ \text{cm}^{-3}\), 300 K:

\[
\mu = 65 + \frac{1265}{1 + (10^{16}/1.26 \times 10^{17})^{0.85}}
    = 65 + \frac{1265}{1.116} = 1198\ \text{cm}^2/\text{V·s}
\]

\[
\frac{1}{\mu_{\text{ii}}} = \frac{1}{1198} - \frac{1}{1330}
\;\Rightarrow\; \mu_{\text{ii}} \approx 1.21 \times 10^{4}\ \text{cm}^2/\text{V·s}
\]

and \(1/3917 + 1/2014 + 1/12117 = 1/1198\). These are the numbers in the
readout strip.

### Simplifications and Limitations

- **The split between phonon mechanisms is a model, not a measurement.** Only
  the total mobility is measured. The acoustic and optical or intervalley
  shares depend on the single-phonon form and the calibration above.
- **Reliable near room temperature.** The 300 K totals are the published
  fits. At other temperatures the curves show the correct trends
  (\(T^{-3/2}\), phonon freeze-out, \(T^{+3/2}\)) but are extrapolations. As a
  spot check, the model gives about \(2.2 \times 10^{4}\) cm²/V·s for
  electrons in lightly doped silicon at 77 K, in line with measured values
  of roughly \(2 \times 10^{4}\) cm²/V·s.
- **Heavy doping at low temperature.** The \(T^{3/2}\) impurity law assumes
  non-degenerate carriers and a fixed number of ionized impurities. For
  \(N \gtrsim 10^{18}\ \text{cm}^{-3}\) the carriers are degenerate and real
  mobility is nearly independent of temperature, so the sim underestimates
  it at low temperature and shows a caution. Freeze-out, screening, neutral
  impurity scattering, and carrier-carrier scattering are not modeled.
- **Chapter table.** The sim evaluates the formula of Section 8.4. The
  rounded table in the same section lists somewhat higher electron values at
  \(10^{17}\) and \(10^{18}\ \text{cm}^{-3}\) (900 and 400 against 759 and
  250 cm²/V·s from the formula).
- Surface roughness and alloy scattering (Sections 8.3.5 and 8.3.6) do not
  occur in bulk silicon and are left out.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) which scattering mechanism dominates at a given
  temperature and doping,
- use (Apply, L3) Matthiessen's rule to combine partial mobilities, and
- predict (Analyze, L4) how a change in temperature or doping changes the
  net mobility.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 15 minutes.

**Prerequisites:** Drift velocity and the definition of mobility
(Sections 8.1–8.2); the scattering mechanisms of Section 8.3.

### Suggested Sequence

1. **Warm-up (3 min):** With the defaults, have students match each colored
   curve to a mechanism and state its temperature dependence.
2. **Matthiessen by hand (4 min):** Students read the three partial
   mobilities from the strip, add the reciprocals, and compare with the
   displayed total.
3. **Predict-test-observe (5 min):** Before moving a slider, students predict
   the dominant mechanism at (77 K, \(10^{17}\)), (300 K, \(10^{14}\)), and
   (450 K, \(10^{16}\)). Then they check each case.
4. **Design question (3 min):** A sensor must keep its resistance stable from
   250 K to 350 K. Would light or heavy doping give the flatter mobility?
   Use the left plot to justify the answer.

### Assessment Questions

1. Why is the total mobility always lower than the lowest partial mobility?
   *(Scattering rates add. Every extra mechanism adds a positive term to
   \(1/\mu\).)*
2. At \(10^{18}\ \text{cm}^{-3}\) and 300 K, cooling the sample lowers the
   mobility in this model. Why?
   *(Impurity scattering dominates, and slower carriers are deflected more
   strongly by the ions.)*
3. A sample shows mobility rising with temperature below 100 K and falling
   above 200 K. What does that tell you?
   *(Ionized impurities limit it at low temperature and phonons at high
   temperature.)*

## References

- [Chapter 8: Carrier Drift and Mobility](../../chapters/08-carrier-drift-mobility/index.md) —
  scattering mechanisms, Matthiessen's rule, and the doping and temperature fits
- D. M. Caughey and R. E. Thomas, "Carrier mobilities in silicon empirically
  related to doping and field," *Proceedings of the IEEE*, vol. 55,
  pp. 2192–2193, 1967.
- N. D. Arora, J. R. Hauser, and D. J. Roulston, "Electron and hole
  mobilities in silicon as a function of concentration and temperature,"
  *IEEE Transactions on Electron Devices*, vol. ED-29, pp. 292–295, 1982.
- C. Jacoboni and L. Reggiani, "The Monte Carlo method for the solution of
  charge transport in semiconductors with applications to covalent
  materials," *Reviews of Modern Physics*, vol. 55, pp. 645–705, 1983.
- [Electron mobility (Wikipedia)](https://en.wikipedia.org/wiki/Electron_mobility)
