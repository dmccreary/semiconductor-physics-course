---
title: P-N Junction Voltage Explorer
description: Interactive simulation of a silicon p-n junction under bias. Drag a voltage slider from deep reverse bias to strong forward bias and watch the depletion region, space charge, electric field, and mobile carriers respond in real time.
image: /sims/pn-junction/pn-junction.png
og:image: /sims/pn-junction/pn-junction.png
twitter:image: /sims/pn-junction/pn-junction.png
social:
   cards: false
---

# P-N Junction Voltage Explorer

<iframe src="main.html" width="100%" height="452" scrolling="no"></iframe>

[Run the P-N Junction Voltage Explorer Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js editor](https://editor.p5js.org/dmccreary/sketches/J4l53Sue4)

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/pn-junction/main.html"
        width="100%" height="452" scrolling="no"></iframe>
```

## Description

This MicroSim shows a cross section of a silicon p-n junction diode connected
to an adjustable voltage source. The p-type region (left, pink) contains
mobile holes, and the n-type region (right, cyan) contains mobile electrons.
Between them lies the depletion region (gray), where the mobile carriers have
been swept away, leaving behind the fixed ionized dopants — negative acceptor
ions on the p side and positive donor ions on the n side. This space charge
produces the built-in electric field, drawn as a purple arrow pointing from
the donor ions toward the acceptor ions.

Drag the voltage slider to bias the junction:

- **Forward bias (V > 0):** the depletion region narrows, the barrier drops,
  and majority carriers stream across the junction. Each gold ring marks an
  injected carrier recombining on the far side; the contacts resupply
  carriers, sustaining a steady current. The crossing rate grows sharply
  with voltage, echoing the exponential diode law.
- **Reverse bias (V < 0):** the depletion region widens, the field
  strengthens, and carriers are pulled *away* from the junction. Only the
  tiny reverse saturation current (about a picoampere) flows.
- **Zero bias:** drift and diffusion balance exactly and no net current
  flows.

Live readouts show the depletion width in micrometers and the diode current
from the Shockley equation — watch the current span more than twelve decades,
from picoamperes in reverse bias to amperes at +0.75 V. The animation runs
while your mouse is over the canvas; the Pause and Reset buttons control the
simulation.

## Things to Try

1. **Predict first:** before moving the slider, sketch what you expect to
   happen to the depletion width under forward and reverse bias. Then test
   your prediction.
2. Slide slowly from 0 V to +0.3 V. Almost nothing crosses. Now continue to
   +0.6 V and +0.75 V — notice how abruptly the carrier stream (and the
   current readout) turns on. This is the exponential turn-on of a diode.
3. Slide to −5 V. Count the columns of exposed ions compared to 0 V, and
   compare the depletion width readout with the value predicted by
   \(W \propto \sqrt{V_{bi} - V}\).
4. Watch the battery symbol and the contact polarity signs flip as you cross
   0 V. Which battery terminal must connect to the p side for forward bias?
5. Find the voltage where the current readout first exceeds 1 mA. How does
   it compare with the "0.7 V rule of thumb" for silicon diodes?

## The Physics Behind the Simulation

The model is a silicon step junction at room temperature with equal doping
on both sides:

| Parameter | Value |
|-----------|-------|
| Temperature \(T\) | 300 K |
| Acceptor doping \(N_A\) | \(10^{16}\ \text{cm}^{-3}\) |
| Donor doping \(N_D\) | \(10^{16}\ \text{cm}^{-3}\) |
| Intrinsic concentration \(n_i\) | \(1.5 \times 10^{10}\ \text{cm}^{-3}\) |
| Built-in potential \(V_{bi}\) | 0.695 V |
| Zero-bias depletion width \(W_0\) | 0.425 µm |
| Saturation current \(I_s\) | 1 pA |

**Built-in potential.** When the junction forms, carrier diffusion exposes
fixed dopant ions until the resulting field halts further net diffusion:

\[
V_{bi} = \frac{k_B T}{q}\ln\!\left(\frac{N_A N_D}{n_i^2}\right) \approx 0.695\ \text{V}
\]

**Depletion width.** The depletion approximation gives a width that grows
with the total band bending \(V_{bi} - V\):

\[
W(V) = \sqrt{\frac{2\varepsilon_s (V_{bi} - V)}{q}\cdot\frac{N_A + N_D}{N_A N_D}}
     = W_0\sqrt{\frac{V_{bi} - V}{V_{bi}}}
\]

Forward bias (\(V > 0\)) shrinks \(W\); reverse bias (\(V < 0\)) stretches it.
The on-screen depletion region and the micrometer readout both follow this
square-root law.

**Diode current.** The current readout evaluates the ideal Shockley diode
equation:

\[
I = I_s\!\left(e^{qV/k_B T} - 1\right)
\]

In reverse bias the exponential vanishes and \(I \to -I_s\) (the leakage
floor). In forward bias the current doubles roughly every 18 mV — the reason
the carrier stream seems to switch on so suddenly near 0.6 V.

### Simplifications and Limitations

- The carrier animation is qualitative: a few dozen dots stand in for
  \(\sim\!10^{16}\) carriers per cm³, and the visual crossing rate is a tuned
  exponential, not a calibrated current.
- The model is the *ideal* diode: no generation-recombination current
  (ideality factor \(n = 2\) region), no high-level injection, no series
  resistance, and no reverse breakdown. Real silicon diodes deviate from
  this picture below ~0.4 V and above ~0.75 V, which is why the slider
  stops at +0.75 V.
- Recombination is drawn a short distance past the junction; in a real
  diode injected minority carriers decay over a diffusion length
  (micrometers to millimeters).

## Lesson Plan

**Learning objective:** Students will be able to explain (Understand, L2)
how applied bias changes the depletion width and carrier flow in a p-n
junction, and apply (Apply, L3) the depletion-width and Shockley equations
to predict the readout values.

**Audience:** College juniors/seniors in a first semiconductor devices
course (Chapters 7–11 of this textbook).

**Duration:** 10–15 minutes.

**Prerequisites:** Doping and majority/minority carriers (Chapter 7), drift
and diffusion (Chapters 8–9), junction electrostatics (Chapter 11).

### Suggested Sequence

1. **Warm-up (2 min):** With the slider at 0 V, ask students to identify
   every element on screen: the two neutral regions, the exposed ions, the
   field arrow, and the battery. Why are there no mobile carriers in the
   gray region?
2. **Predict-test-observe (5 min):** Have students predict depletion width
   at −2 V using \(W_0\sqrt{(V_{bi}-V)/V_{bi}}\), then check the readout.
   Repeat at +0.5 V.
3. **Exponential turn-on (4 min):** Step the slider in 0.1 V increments from
   0 V and record the current readout at each step. Plot current vs. voltage
   on a log scale — the straight line is the diode law.
4. **Wrap-up discussion (3 min):** Why does reverse current saturate at
   \(-I_s\) instead of growing with voltage? What physical process supplies
   even that tiny current?

### Assessment Questions

1. Under reverse bias, which direction does the electric field in the
   depletion region point, and why does it grow stronger?
   *(From the donor ions on the n side toward the acceptor ions on the p
   side; a larger reverse voltage exposes more fixed charge, increasing the
   field.)*
2. Explain why the depletion region narrows under forward bias.
   *(The applied voltage opposes the built-in potential, reducing the band
   bending; less space charge is needed, so the ionized zone shrinks.)*
3. A student claims "no current flows below 0.7 V." Use the simulation to
   critique this statement.
   *(Current flows at any forward voltage — it is simply exponentially
   small. The readout shows microamperes near 0.45 V, well below 0.7 V.)*

## References

- [Chapter 11: P-N Junction Equilibrium](../../chapters/11-pn-junction-equilibrium/index.md) —
  derivations of \(V_{bi}\), the depletion approximation, and the Shockley equation
- [Chapter 12: P-N Junction Dynamics](../../chapters/12-pn-junction-dynamics/index.md) —
  junction capacitance and switching behavior
- [p–n junction (Wikipedia)](https://en.wikipedia.org/wiki/P%E2%80%93n_junction)
- [Depletion region (Wikipedia)](https://en.wikipedia.org/wiki/Depletion_region)
- [Shockley diode equation (Wikipedia)](https://en.wikipedia.org/wiki/Shockley_diode_equation)
