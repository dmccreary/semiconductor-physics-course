---
title: Minority Carrier Diffusion Length Visualizer
description: Watch minority holes random-walk into an n-type semiconductor and recombine. A histogram of the walkers is compared with the analytical exponential profile, and sliders for lifetime and diffusion coefficient show how the diffusion length changes. Includes a pulse-injection mode and uniform illumination with a recombining surface.
image: /sims/minority-carrier-diffusion/minority-carrier-diffusion.png
og:image: /sims/minority-carrier-diffusion/minority-carrier-diffusion.png
twitter:image: /sims/minority-carrier-diffusion/minority-carrier-diffusion.png
social:
   cards: false
---

# Minority Carrier Diffusion Length Visualizer

<iframe src="main.html" width="100%" height="574" scrolling="no"></iframe>

[Run the Minority Carrier Diffusion Length Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/minority-carrier-diffusion/main.html"
        width="100%" height="574" scrolling="no"></iframe>
```

## Description

Holes injected into n-type material wander by diffusion until they meet an
electron and recombine. The average distance they cover is the minority
carrier diffusion length \(L_p = \sqrt{D_p\tau_p}\). This MicroSim shows that
distance in two ways at once.

- The **strip at the top** is the semiconductor. Each red dot is a hole doing
  a random walk. Holes enter at the left face (\(x = 0\)) and vanish when
  they recombine. Only a fraction of the simulated holes is drawn.
- The **plot** shows the density of all the simulated holes as a histogram,
  with the **analytical solution** of the diffusion equation drawn on top.
  The dashed orange line marks one diffusion length.
- The **panel** on the right gives \(D_p\), \(\tau_p\), and \(L_p\), and a
  short account of the current mode.

The depth axis rescales in 1-2-5 steps so the profile always fits. Read the
tick labels: when you change \(\tau_p\) by a factor of 100, the picture may
look similar but the axis has changed by a factor of 10.

Three situations are available:

1. **Steady injection** (the default). Holes enter continuously at
   \(x = 0\), and the profile settles to an exponential.
2. **Pulse injection.** Press the button to inject one burst at \(x = 0\).
   The burst spreads out and decays; the panel compares the fraction of holes
   left with \(e^{-t/\tau_p}\). After six lifetimes the sim returns to steady
   injection.
3. **Uniform illumination.** Light generates holes everywhere, and the left
   face becomes a surface with recombination velocity \(S\). The profile dips
   near the surface.

Controls:

- **Start / Pause** runs the random walk. The analytical curve, the
  \(L_p\) marker, and the readouts respond to the sliders even while paused.
- **Minority carrier lifetime** \(\tau_p\), 1 ns to 1 ms (logarithmic).
- **Diffusion coefficient** \(D_p\), 1 to 25 cm²/s.
- **Surface recombination** \(S\), 1 to \(10^{6}\) cm/s (logarithmic),
  active only under uniform illumination.
- **Show analytical solution** toggles the black curve.

## Things to Try

1. **Predict first.** With \(D_p = 12\) cm²/s and \(\tau_p = 100\ \mu\)s,
   calculate \(L_p\) before reading it from the panel.
2. Increase \(\tau_p\) by a factor of 100. By what factor does \(L_p\) grow?
   Do the same for \(D_p\) by a factor of 4.
3. Press **Start** and follow a single dot. Its path is random, yet the
   histogram settles onto a smooth exponential. Where does the regularity
   come from?
4. Press **Pulse injection**. Compare "Holes left" with \(e^{-t/\tau_p}\) as
   the pulse decays. How far has the pulse spread after one lifetime?
5. Switch on **Uniform illumination** and raise \(S\) from \(10\) to
   \(10^{5}\) cm/s. How deep does the surface damage reach? What value of
   \(S L_p / D_p\) makes the surface density half the bulk density?
6. A solar cell needs carriers generated 150 µm from the junction to reach
   it. What lifetime does that require if \(D_p = 12\) cm²/s?

## The Physics Behind the Simulation

In steady state with low-level injection and no electric field, the excess
hole density in n-type material obeys (Section 10.6)

\[
D_p \frac{d^2(\delta p)}{dx^2} - \frac{\delta p}{\tau_p} + G = 0,
\qquad L_p = \sqrt{D_p\,\tau_p}
\]

**Steady injection at \(x = 0\)** (\(G = 0\) in the bulk):

\[
\delta p(x) = \delta p(0)\,e^{-x/L_p}
\]

**Pulse of \(N\) holes per unit area at \(x = 0\), \(t = 0\)**, with no flow
through the left face:

\[
\delta p(x, t) = \frac{N}{\sqrt{\pi D_p t}}\,
\exp\!\left(-\frac{x^2}{4 D_p t}\right) e^{-t/\tau_p}
\]

**Uniform generation \(G\) with a recombining surface.** The boundary
condition \(D_p\,d(\delta p)/dx = S\,\delta p\) at \(x = 0\) gives

\[
\delta p(x) = G\tau_p\left[1 - \frac{S L_p}{D_p + S L_p}\,e^{-x/L_p}\right],
\qquad
\frac{\delta p(0)}{\delta p(\infty)} = \frac{1}{1 + S L_p/D_p}
\]

**The random walk.** Each time step every hole moves by a random distance
with standard deviation \(\sqrt{2 D_p \Delta t}\) and recombines with
probability \(\Delta t/\tau_p\). The left face reflects holes, except under
illumination, where a hole that reaches the surface recombines there with a
probability set by \(S\). The simulation runs in the normalized units
\(x/L_p\) and \(t/\tau_p\), so one lifetime takes about 1.5 s on screen
whatever its real value.

**Worked check.** \(D_p = 12\) cm²/s and \(\tau_p = 100\ \mu\)s:

\[
L_p = \sqrt{(12\ \text{cm}^2/\text{s})(10^{-4}\ \text{s})} = 3.46 \times 10^{-2}\ \text{cm} = 346\ \mu\text{m}
\]

(Section 10.6 quotes about 1.1 mm for these numbers. That figure corresponds
to \(\tau_p = 1\) ms: \(\sqrt{12 \times 10^{-3}} = 0.110\) cm.)
With \(S = 10^{3}\) cm/s, \(S L_p/D_p = (10^{3})(0.0346)/12 = 2.9\), so the
density at the surface is \(1/(1 + 2.9) = 0.26\) of the bulk value.

### Simplifications and Limitations

- **One dimension, low-level injection, no electric field.** The dots are
  spread vertically only so they can be seen. The physics depends on depth
  alone.
- **Semi-infinite sample.** There is no back contact; the material extends
  far beyond the plotted depth.
- **Statistical noise.** The histogram comes from a few hundred to a few
  thousand walkers, so it fluctuates around the analytical curve. While the
  sim runs, the bars are averaged over about ten frames.
- **Surface rule.** The probability of surface recombination per encounter
  is a first-order approximation. For very large \(S\) the surface simply
  absorbs every hole that reaches it, and the histogram sits slightly above
  the analytical curve in the first bin.
- **The specification's "illuminated region"** is implemented as uniform
  illumination of the whole sample, the case solved in Section 10.6. A
  surface recombination slider was added so that the surface question in the
  learning objectives can be explored.

## Lesson Plan

**Learning objectives:** Students will be able to

- explain (Understand, L2) how minority carrier lifetime and diffusivity
  determine the diffusion length,
- calculate (Apply, L3) the diffusion length for given material parameters,
  and
- predict (Analyze, L4) how surface recombination changes the minority
  carrier profile.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 15 minutes.

**Prerequisites:** Diffusion current and the Einstein relation (Chapter 9);
minority carrier lifetime (Section 10.2); the continuity equation
(Section 10.6).

### Suggested Sequence

1. **Warm-up (3 min):** Start the random walk with the defaults. Students
   describe what one hole does and what the population does.
2. **Square-root scaling (4 min):** Students tabulate \(L_p\) for
   \(\tau_p\) = 1 µs, 10 µs, 100 µs, and 1 ms at fixed \(D_p\), and plot
   \(L_p\) against \(\tau_p\) on log-log axes. The slope is one half.
3. **Pulse decay (4 min):** Students run a pulse, pause it near
   \(t = \tau_p\), and compare the walker count with \(e^{-1}\).
4. **Surface recombination (4 min):** Under illumination, students predict
   the surface-to-bulk ratio for \(S = 10^{2}\), \(10^{3}\), and
   \(10^{4}\) cm/s from \(1/(1 + SL_p/D_p)\), then check the panel.

### Assessment Questions

1. Silicon has \(D_p = 12\) cm²/s. What lifetime gives \(L_p = 100\ \mu\)m?
   *(\(\tau_p = L_p^2/D_p = 8.3\ \mu\)s.)*
2. Gold doping reduces \(\tau_p\) from 100 µs to 100 ns. By what factor does
   the diffusion length change?
   *(\(\sqrt{1000} \approx 32\) times shorter.)*
3. Why does passivating the surface of a solar cell matter more when the
   bulk lifetime is long?
   *(A longer \(L_p\) raises \(S L_p/D_p\), so the same surface drains
   carriers from a deeper layer and lowers the surface density further.)*

## References

- [Chapter 10: Generation and Recombination](../../chapters/10-generation-recombination/index.md) —
  Section 10.3, surface recombination, and Section 10.6, the continuity
  equation and the minority carrier diffusion length
- [Chapter 9: Carrier Diffusion and Transport](../../chapters/09-carrier-diffusion-transport/index.md) —
  diffusion current and the Einstein relation
- [Recombination Lifetime Explorer MicroSim](../recombination-lifetime-explorer/index.md) —
  what sets \(\tau_p\)
- [Carrier lifetime (Wikipedia)](https://en.wikipedia.org/wiki/Carrier_lifetime)
- [Fick's laws of diffusion (Wikipedia)](https://en.wikipedia.org/wiki/Fick%27s_laws_of_diffusion)
