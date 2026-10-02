---
title: Long-Channel MOSFET I-V Explorer
description: Output and transfer characteristics of a long-channel MOSFET from the square-law model. See the triode, saturation, and subthreshold regions, read the transconductance and output conductance at any operating point, and watch the channel pinch off.
image: /sims/mosfet-iv-long-channel/mosfet-iv-long-channel.png
og:image: /sims/mosfet-iv-long-channel/mosfet-iv-long-channel.png
twitter:image: /sims/mosfet-iv-long-channel/mosfet-iv-long-channel.png
social:
   cards: false
---

# Long-Channel MOSFET I-V Explorer

<iframe src="main.html" width="100%" height="634" scrolling="no"></iframe>

[Run the Long-Channel MOSFET I-V Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/mosfet-iv-long-channel/main.html"
        width="100%" height="634" scrolling="no"></iframe>
```

## Description

This MicroSim draws the current-voltage curves of a long-channel MOSFET
from the model of Chapter 15.

- The **left plot** shows the drain current \(I_D\) against the drain
  voltage \(V_{DS}\) for gate voltages of 1.0, 1.5, 2.0, 2.5, and 3.0 V.
  The thick dark curve is the curve for the gate voltage chosen with the
  slider, and the red dot is the operating point. The dashed orange
  parabola is the boundary \(V_{DS} = V_{GS} - V_T\). The triode region is
  to its left and the saturation region to its right. The gray strip at
  the bottom is cutoff.
- The **right plot** shows \(I_D\) against the gate voltage \(V_{GS}\) on
  a logarithmic scale, at the drain voltage of the operating point. Below
  the threshold voltage (gray area) the curve is a straight line, whose
  slope is the subthreshold slope \(S\). The two thin dashed curves are
  the square law and the exponential subthreshold law on their own.
- The **channel sketch** shows the inversion charge along the channel. It
  is uniform at small \(V_{DS}\), thins toward the drain as \(V_{DS}\)
  rises, and pinches off at the drain end in saturation.
- The **readout** gives the region, the drain current, the
  transconductance \(g_m\), the output conductance \(g_{ds}\), the output
  resistance \(r_o\), the intrinsic gain, and the subthreshold slope.

Controls:

- **Gate voltage** and **Drain voltage** set the operating point, 0 to 3 V.
- **Threshold** \(V_T\): 0.2 to 1.0 V.
- **Width/length** \(W/L\): 1 to 100.
- \(\mu_n C_{ox}\): 100 to 500 µA/V².
- **Modulation** λ, the channel-length modulation coefficient: 0 to
  0.1 V\(^{-1}\).
- **Slope factor** \(n_{sub}\): 1 to 2.
- **Device** chooses NMOS or PMOS. A PMOS transistor has the same curves
  with every voltage and current reversed, so the plots show magnitudes
  and the labels change to \(V_{SG}\), \(V_{SD}\), and \(|V_T|\).
- **Reset** restores the defaults.

## Things to Try

1. **Predict first.** With the defaults, the operating point is in
   saturation. Lower the drain voltage slowly. At what drain voltage does
   the transistor enter the triode region? Compare with
   \(V_{GS} - V_T\).
2. In saturation, double the overdrive \(V_{GS} - V_T\) and read the
   current before and after. By what factor did it change?
3. Read \(g_m\) from the readout and compare it with
   \(\mu_n C_{ox}(W/L)(V_{GS} - V_T)\). Then read \(g_{ds}\) and compare it
   with \(\lambda I_D\).
4. Set λ to zero. What happens to the curves in saturation, to \(r_o\),
   and to the intrinsic gain? Why can no real transistor do this?
5. On the right plot, move the gate voltage below threshold. Read the
   current at two gate voltages 0.1 V apart and work out the slope in
   mV per decade. Compare with \(S\). Then set the slope factor to 1.
6. Raise the threshold voltage by 0.1 V. By what factor does the current
   at \(V_{GS} = 0\) change? What does that mean for the standby power of
   a chip?
7. Watch the channel sketch while you raise the drain voltage from 0 to
   3 V at a fixed gate voltage.

## The Physics Behind the Simulation

**Square-law model (Section 15.5).** With \(k = \mu_n C_{ox} W/L\) and the
gradual channel approximation,

\[
I_D = \frac{k}{2}\left[2(V_{GS} - V_T)V_{DS} - V_{DS}^2\right](1 + \lambda V_{DS})
\qquad \text{triode, } V_{DS} < V_{GS} - V_T
\]

\[
I_D = \frac{k}{2}(V_{GS} - V_T)^2 (1 + \lambda V_{DS})
\qquad \text{saturation, } V_{DS} \ge V_{GS} - V_T
\]

Saturation begins at \(V_{DS,sat} = V_{GS} - V_T\), where the inversion
charge at the drain end falls to zero. The factor \((1 + \lambda V_{DS})\)
is the channel-length modulation of Section 15.6. The sim applies it in
both regions, as SPICE Level 1 does, so that the current is continuous at
\(V_{DS,sat}\).

**Small-signal parameters (Section 15.6).** In saturation,

\[
g_m = \frac{\partial I_D}{\partial V_{GS}} = k(V_{GS} - V_T)(1 + \lambda V_{DS}), \qquad
g_{ds} = \frac{\partial I_D}{\partial V_{DS}} = \lambda\,\frac{k}{2}(V_{GS} - V_T)^2 \approx \lambda I_D, \qquad
r_o = \frac{1}{g_{ds}}
\]

The readout takes both derivatives numerically from the model curve.

**Subthreshold conduction (Section 15.7).** Below threshold the current is
exponential in the gate voltage:

\[
I_D \propto \exp\!\left(\frac{V_{GS} - V_T}{n_{sub}V_{th}}\right), \qquad
S = n_{sub}\,V_{th}\ln 10 = n_{sub} \times 59.5\ \text{mV/decade at 300 K}
\]

with \(V_{th} = k_BT/q = 25.85\) mV. The chapter rounds 59.5 to 60.

**Joining the two.** The sim uses one smooth expression for all three
regions:

\[
I_D = \frac{k}{2}\left(v_f^2 - v_r^2\right)(1 + \lambda V_{DS}), \qquad
v_f = 2n_{sub}V_{th}\ln\!\left(1 + e^{(V_{GS} - V_T)/2n_{sub}V_{th}}\right)
\]

and \(v_r\) is the same function of \(V_{GS} - V_T - V_{DS}\). This is the
interpolation used in the EKV MOSFET model. Well above threshold
\(v_f = V_{GS} - V_T\) and \(v_r = V_{GS} - V_T - V_{DS}\) (or zero in
saturation), which gives the square law exactly. Well below threshold it
gives \(I_D = 2n_{sub}^2 k V_{th}^2\,e^{(V_{GS} - V_T)/n_{sub}V_{th}}
\left(1 - e^{-V_{DS}/n_{sub}V_{th}}\right)\).

**Channel sketch.** In the gradual channel approximation the inversion
charge at a fraction \(y/L\) of the way along the channel is

\[
\frac{|Q_{inv}(y)|}{C_{ox}} = \sqrt{(V_{GS} - V_T)^2 - \frac{y}{L}\left[2(V_{GS} - V_T)V_{DS} - V_{DS}^2\right]}
\]

The sketch draws this as the thickness of the colored layer. In
saturation the pinch-off point is drawn a fraction
\(\lambda(V_{DS} - V_{DS,sat})\) of the channel length back from the
drain.

**Worked check.** Defaults: \(V_T = 0.5\) V, \(W/L = 10\),
\(\mu_n C_{ox} = 200\) µA/V², λ = 0.05 V\(^{-1}\), \(V_{GS} = 1.5\) V,
\(V_{DS} = 2.0\) V. Then \(k = 2.0\) mA/V², the overdrive is 1.0 V, and
\(V_{DS} > V_{DS,sat} = 1.0\) V, so the transistor is in saturation:

\[
I_D = \frac{2.0\ \text{mA/V}^2}{2}(1.0\ \text{V})^2(1 + 0.05 \times 2.0) = 1.10\ \text{mA}
\]

\[
g_m = (2.0\ \text{mA/V}^2)(1.0\ \text{V})(1.1) = 2.2\ \text{mS}, \qquad
g_{ds} = 0.05\ \text{V}^{-1} \times 1.0\ \text{mA} = 50\ \mu\text{S}, \qquad r_o = 20\ \text{k}\Omega
\]

The intrinsic gain is \(g_m r_o = 44\). With \(n_{sub} = 1.3\),
\(S = 1.3 \times 59.5 = 77.4\) mV/decade. These are the values in the
readout.

### Simplifications and Limitations

- **Long channel only.** There is no velocity saturation, no
  drain-induced barrier lowering, and no mobility degradation. For a
  short channel, Section 16.4 gives
  \(I_{D,sat} \approx W C_{ox}(V_{GS} - V_T)v_{sat}\), which is linear in
  the overdrive instead of quadratic, and the transconductance stops
  growing with gate voltage. The square law overestimates the current of
  such a device. The sim does not draw the short-channel curve.
- **Near threshold** (within about 0.2 V above \(V_T\)) the smooth curve
  lies above the square law, because the subthreshold tail is still
  contributing. With the default slope factor the difference is about
  30 % at an overdrive of 0.1 V and under 1 % at 0.3 V.
- **Subthreshold drain dependence.** The interpolation gives the factor
  \(1 - e^{-V_{DS}/n_{sub}V_{th}}\), while Section 15.7 has
  \(1 - e^{-V_{DS}/V_{th}}\). The two agree once \(V_{DS}\) exceeds about
  0.1 V.
- **Body effect** is not included. The source and body are at the same
  potential.
- **The channel sketch** is not to scale. The thickness of the colored
  layer stands for charge density, not for a physical thickness.
- **Operating point.** The gate and drain voltage sliders are not in the
  control list of the chapter specification. They were added because the
  channel sketch and the small-signal readout need an operating point.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) the triode, saturation, and cutoff regions on
  the output characteristics,
- calculate (Apply, L3) the transconductance and output conductance from
  the current-voltage data,
- explain (Analyze, L4) what the subthreshold slope means and why about
  60 mV per decade is its lower limit at room temperature, and
- compare (Evaluate, L5) the predictions of the long-channel model with
  the behavior expected of a short-channel transistor.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 20 minutes.

**Prerequisites:** The MOS capacitor and threshold voltage (Chapter 13);
the MOSFET structure and the gradual channel approximation
(Sections 15.3 to 15.5).

### Suggested Sequence

1. **Regions (4 min):** Students move the operating point across the
   dashed parabola and describe what changes in the channel sketch.
2. **Square law (4 min):** Students tabulate the saturation current at
   four gate voltages and show that it is quadratic in the overdrive.
3. **Small signal (5 min):** Students compute \(g_m\), \(g_{ds}\), and the
   intrinsic gain by hand at two operating points and compare with the
   readout.
4. **Subthreshold (4 min):** Students measure the slope on the right plot
   for \(n_{sub}\) = 1.0, 1.3, and 2.0, and find the off-current at
   \(V_{GS} = 0\) for each.
5. **Limits of the model (3 min):** Discussion. A 20 nm transistor has a
   current that rises about linearly with overdrive. Which assumption of
   this model has failed?

### Assessment Questions

1. A MOSFET has \(V_T = 0.5\) V, \(V_{GS} = 1.2\) V, and
   \(V_{DS} = 0.4\) V. Which region is it in?
   *(Triode: \(V_{DS} = 0.4\) V is less than
   \(V_{GS} - V_T = 0.7\) V.)*
2. With \(S = 80\) mV/decade, how far below threshold must the gate be to
   reduce the current by a factor of \(10^4\)?
   *(4 decades × 80 mV = 0.32 V.)*
3. Why can a conventional MOSFET not have \(S\) below about 60 mV/decade
   at 300 K?
   *(The carriers that cross the source barrier come from the Boltzmann
   tail of the source distribution, so the current changes by at most a
   factor of ten for each \(V_{th}\ln 10\) of barrier change, and the gate
   moves the barrier by at most its own voltage change.)*
4. The long-channel model predicts that doubling the overdrive
   quadruples the saturation current. What does the velocity-saturated
   expression of Section 16.4 predict?
   *(The current doubles.)*

## References

- [Chapter 15: JFET, MESFET, and Long-Channel MOSFET Fundamentals](../../chapters/15-jfet-mesfet-mosfet/index.md) —
  the gradual channel approximation, the square law, small-signal
  parameters, and subthreshold conduction
- [Chapter 16: Short-Channel Effects, CMOS, and Advanced FET Structures](../../chapters/16-short-channel-cmos/index.md) —
  velocity saturation and other departures from the long-channel model
- C. C. Enz, F. Krummenacher, and E. A. Vittoz, "An analytical MOS
  transistor model valid in all regions of operation and dedicated to
  low-voltage and low-current applications," *Analog Integrated Circuits
  and Signal Processing*, vol. 8, pp. 83–114, 1995.
- H. Shichman and D. A. Hodges, "Modeling and simulation of
  insulated-gate field-effect transistor switching circuits," *IEEE
  Journal of Solid-State Circuits*, vol. SC-3, pp. 285–289, 1968.
- [MOSFET (Wikipedia)](https://en.wikipedia.org/wiki/MOSFET)
- [Subthreshold slope (Wikipedia)](https://en.wikipedia.org/wiki/Subthreshold_slope)
