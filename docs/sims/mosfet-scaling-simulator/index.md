---
title: MOSFET Scaling Simulator
description: Shrink a transistor from 1 micrometer to 5 nm and watch the short-channel effects, speed, and power density change. Compare planar, FDSOI, FinFET, and gate-all-around architectures, and see where constant-field (Dennard) scaling stops.
image: /sims/mosfet-scaling-simulator/mosfet-scaling-simulator.png
og:image: /sims/mosfet-scaling-simulator/mosfet-scaling-simulator.png
twitter:image: /sims/mosfet-scaling-simulator/mosfet-scaling-simulator.png
social:
   cards: false
---

# MOSFET Scaling Simulator

<iframe src="main.html" width="100%" height="654" scrolling="no"></iframe>

[Run the MOSFET Scaling Simulator Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/mosfet-scaling-simulator/main.html"
        width="100%" height="654" scrolling="no"></iframe>
```

## Description

This MicroSim takes a reference transistor with a 1 µm gate and a 5 V
supply and shrinks it. It is a **trend model** built from the scaling
relations of Chapter 16. It shows why each effect appears and in what
order. It is not a model of any commercial process, and its numbers
should not be read as data for a named technology node.

- The **top left box** shows a cross section of the chosen architecture and
  a gauge of gate control, the ratio \(L/\lambda\) of the gate length to
  the natural length. For the planar and FDSOI devices the gate is drawn
  with a length of \(L/\lambda\) units, and the dashed red arcs show how
  far the source and drain fields reach under it.
- The **top plot** shows three short-channel indicators against gate
  length: drain-induced barrier lowering (DIBL), the threshold voltage
  roll-off at \(V_{DS} = V_{DD}\), and the subthreshold slope \(S\). The
  gray dashed curves are the DIBL of the other three architectures. The
  dotted line at 50 mV/V is the limit for a well-designed device
  (Section 16.2).
- The **bottom plot** shows the switching speed, the dynamic power
  density, and the leakage power density, all relative to the 1 µm
  reference. The green background is the constant-field (Dennard) region,
  where the supply voltage scales with the gate length. The red background
  is the constant-voltage region, where the supply has reached its floor.
- The **bottom left box** lists the numbers at the selected gate length.

Gate length shrinks to the right on both plots, and the gate length slider
moves the same way.

Controls:

- **Architecture**: planar bulk, FDSOI, FinFET, or gate-all-around (GAA)
  nanowire.
- **Dennard reference** draws the power density that constant-field
  scaling would keep if it could continue.
- **Gate length**: 1 µm to 5 nm, on a logarithmic scale.
- **Lowest supply** \(V_{DD}\): 0.5 to 1.5 V. This is the floor below which
  the supply voltage cannot be scaled.
- **Reset** returns to planar bulk at 45 nm with a 1.0 V floor.

## Things to Try

1. **Predict first.** Start at 1 µm with the planar device and shrink it.
   In the green region, what happens to DIBL and to the dynamic power
   density? Why does constant-field scaling keep both constant?
2. Keep shrinking the planar device. At what gate length does DIBL cross
   50 mV/V? Which of the model's limits causes the natural length to stop
   shrinking?
3. At 20 nm, switch between the four architectures and record
   \(\lambda\), DIBL, and \(S\) for each. Rank them by gate control.
4. For the FinFET, find the shortest gate length that keeps DIBL under
   50 mV/V. Then do the same for the GAA nanowire.
5. Lower the supply floor from 1.0 V to 0.5 V at a fixed gate length.
   Dynamic power falls. What happens to the leakage, and why?
6. Use the example line in the lower box to work out the dynamic power of
   one gate for supply voltages of 1.0 V and 0.7 V. By what factor does
   it change?

## The Model

**Natural length (Sections 16.1 and 16.7).** With
\(\varepsilon_s/\varepsilon_{ox} = 11.7/3.9 = 3\):

| Architecture | Natural length | Fixed dimension |
|--------------|----------------|-----------------|
| Planar bulk | \(\lambda = \sqrt{\varepsilon_s t_{ox} t_{dep}/\varepsilon_{ox}} = \sqrt{3\,t_{ox}t_{dep}}\) | none |
| FDSOI | \(\lambda = \sqrt{3\,t_{ox}t_{si}}\) | film thickness \(t_{si} = 6\) nm |
| FinFET | \(\lambda = \sqrt{3\,t_{ox}t_{fin}/2}\) | fin width \(t_{fin} = 6\) nm |
| GAA nanowire | \(\lambda = (R/2)\sqrt{3}\) | wire diameter \(2R = 5\) nm |

The FinFET and GAA expressions are those of Section 16.7. The FDSOI
expression is the single-gate result of Yan, Ourmazd, and Lee (1992).

**Short-channel factor.** The drain and source fields decay under the gate
with the natural length, so their effect at the middle of the channel is
governed by

\[
\theta = e^{-L/2\lambda}
\]

The sim then uses

\[
\text{DIBL} = \theta\ \ (\text{V/V}), \qquad
\Delta V_T = -(V_{DS} + 0.4\ \text{V})\,\theta, \qquad
S = 59.5\ \frac{\text{mV}}{\text{decade}} \times \left(1 + \frac{C_{dep}}{C_{ox}} + 2\theta\right)
\]

The threshold expression is the leading term of the quasi-two-dimensional
model of Liu and co-workers (1993). The slope expression treats the source
and the drain as two extra capacitors that compete with the gate for
control of the barrier. \(C_{dep}/C_{ox} = 3t_{ox}/t_{dep}\) for the
planar device and zero for the three fully depleted devices. \(\theta\) is
limited to 0.5.

**Scaling rules for the reference device.** The reference has
\(L = 1\ \mu\text{m}\), \(V_{DD} = 5\) V, \(t_{ox} = 20\) nm, and a
depletion depth of 143 nm. Constant-field scaling shrinks all of them in
proportion:

\[
t_{ox} = \frac{L}{50}, \qquad t_{dep} = \frac{L}{7}, \qquad
V_{DD} = 5\ \text{V} \times \frac{L}{1\ \mu\text{m}}, \qquad V_T = \frac{V_{DD}}{4}
\]

Three floors stop this:

- \(t_{ox} \ge 1\) nm (equivalent oxide thickness),
- \(t_{dep} \ge 12\) nm, which corresponds to a channel doping near
  \(10^{19}\ \text{cm}^{-3}\),
- \(V_{DD} \ge\) the value of the supply slider. The threshold voltage
  cannot keep scaling because \(S\) cannot go below 59.5 mV/decade
  (Section 16.6).

**Constant-field and constant-voltage scaling (Section 16.6).** For a
shrink by a factor \(k\):

| Quantity | Constant field (Dennard) | Constant voltage |
|----------|--------------------------|------------------|
| Dimensions | \(1/k\) | \(1/k\) |
| Supply voltage | \(1/k\) | 1 |
| Gate delay | \(1/k\) | \(1/k\) |
| Density | \(k^2\) | \(k^2\) |
| Dynamic power density | 1 | \(k^2\) while \(t_{ox}\) still scales, then \(k\) |

**Speed and power.** The gate delay is \(\tau = CV_{DD}/I_{on}\) with the
gate capacitance \(C = C_{ox}WL\) and the velocity-saturated on-current of
Section 16.4, \(I_{on} = WC_{ox}v_{sat}(V_{DD} - V_T)\). That gives
\(\tau = (4/3)\,L/v_{sat}\), so the speed curve is \(1/L\). The clock
period is taken as 20 gate delays and the activity factor as
\(\alpha = 0.1\). Then

\[
P_{dyn} = \alpha C V_{DD}^2 f \quad\Rightarrow\quad
\frac{P_{dyn}}{\text{area}} \propto \frac{V_{DD}^2}{t_{ox}L}
\]

\[
P_{leak} = I_{off}V_{DD}, \qquad
I_{off} = 100\ \text{nA} \times \frac{W}{L} \times 10^{-V_{T,eff}/S}, \qquad
\frac{P_{leak}}{P_{dyn}} = \frac{20}{\alpha}\,\frac{I_{off}}{I_{on}}
\]

where \(V_{T,eff} = V_T + \Delta V_T\) at \(V_{DS} = V_{DD}\). The
off-current expression defines threshold as the gate voltage at which the
current is \(100\ \text{nA} \times W/L\). Both power curves are divided by
the dynamic power density of the 1 µm reference.

**Worked check.** FinFET, \(L = 18\) nm, supply floor 1.0 V. The oxide is
at its floor, \(t_{ox} = 1\) nm.

\[
\lambda = \sqrt{\frac{3 \times 1\ \text{nm} \times 6\ \text{nm}}{2}} = 3.0\ \text{nm}, \qquad
\frac{L}{\lambda} = 6.0, \qquad \theta = e^{-3.0} = 0.0498
\]

So DIBL = 50 mV/V, \(\Delta V_T = -(1.0 + 0.4) \times 0.0498 = -70\) mV,
and \(S = 59.5 \times (1 + 0.0996) = 65.5\) mV/decade. With
\(V_T = 0.25\) V the effective threshold is 0.180 V, and

\[
\frac{I_{off}}{W} = \frac{100\ \text{nA}}{0.018\ \mu\text{m}} \times 10^{-180.3/65.45} = 9.8\ \text{nA}/\mu\text{m}, \qquad
\frac{I_{on}}{W} = (3.45 \times 10^{-6}\ \text{F/cm}^2)(10^{7}\ \text{cm/s})(0.75\ \text{V}) = 2590\ \mu\text{A}/\mu\text{m}
\]

The ratio is \(2.6 \times 10^{5}\), and leakage is
\(200 / 2.6 \times 10^{5} = 7.5 \times 10^{-4}\) of the dynamic power. The
dynamic power density is
\((1^2/(1 \times 18)) / (5^2/(20 \times 1000)) = 44\) times the reference.

### Simplifications and Limitations

- **A trend model, not a process model.** Real technologies do not follow
  one set of rules from 1 µm to 5 nm. The 5 V supply was kept for several
  generations, strain and new gate materials changed the drive current,
  and "node" names stopped corresponding to gate lengths. The sim does not
  label any gate length with a node name for that reason.
- **Planar bulk is treated with uniform doping.** Halo implants,
  retrograde wells, and shallow junctions (Section 16.3) are not modeled.
- **Fixed body dimensions.** The FDSOI film, the fin, and the wire keep the
  same thickness at every gate length. In practice they are thinned as the
  gate is shortened.
- **The on-current is the velocity-saturated limit**, which is an upper
  bound. Quasi-ballistic transport, series resistance, and mobility are
  not modeled.
- **The speed curve is the intrinsic gate speed.** Real clock frequencies
  stopped rising when the power density became too high to cool. The
  dynamic power curve shows what would happen if the clock kept following
  the gate speed.
- **Leakage is subthreshold leakage only.** Gate tunneling and junction
  leakage are left out.
- **Numbers that differ from the chapter text.** The sim evaluates the
  formulas of Sections 16.1 and 16.7 directly. With
  \(\varepsilon_s/\varepsilon_{ox} = 3\), the planar natural length is
  \(\sqrt{3\,t_{ox}t_{dep}}\), the FinFET example (6 nm fin, 1 nm oxide)
  gives 3.0 nm, and the nanowire example (5 nm diameter) gives 2.2 nm.
- **The example gate line** uses fixed values (\(\alpha = 0.1\),
  \(C = 1\) fF, \(f = 3\) GHz) so that students can practice
  \(P = \alpha CV_{DD}^2 f\). Only \(V_{DD}\) comes from the model.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) which short-channel effects appear as the gate
  length is reduced,
- calculate (Apply, L3) the dynamic power dissipation for a given
  frequency and activity factor,
- explain (Analyze, L4) why a FinFET gives better electrostatic control
  than a planar MOSFET, and
- compare (Evaluate, L5) the trade-offs between the advanced FET
  architectures.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 20 minutes.

**Prerequisites:** The long-channel MOSFET, threshold voltage, and
subthreshold slope (Chapter 15); short-channel effects, CMOS power, and
Dennard scaling (Sections 16.1 to 16.6).

### Suggested Sequence

1. **Dennard scaling (5 min):** Students shrink the planar device through
   the green region and state which quantities stay constant and which
   improve.
2. **The break (5 min):** Students move the supply floor and watch the
   boundary between the two regions move. They explain the slope of the
   dynamic power curve on each side.
3. **Electrostatics (5 min):** At 20 nm, students tabulate \(\lambda\),
   DIBL, and \(S\) for the four architectures and relate the ranking to
   the number of sides the gate covers.
4. **Trade-offs (5 min):** Discussion. What does each architecture cost in
   manufacturing or design, and why was planar bulk kept for as long as
   it worked?

### Assessment Questions

1. A logic block has \(\alpha = 0.2\), a switched capacitance of 2 nF, a
   0.8 V supply, and a 2 GHz clock. What is its dynamic power?
   *(\(0.2 \times 2 \times 10^{-9} \times 0.64 \times 2 \times 10^{9} = 0.51\) W.)*
2. Why does the gate of a FinFET control the channel better than the gate
   of a planar transistor of the same gate length?
   *(The gate surrounds the thin fin on three sides, so every part of the
   channel is close to the gate. The natural length is set by the fin
   width, not by a depletion depth, and is smaller.)*
3. In constant-voltage scaling, why does a lower threshold voltage raise
   the leakage so sharply?
   *(The off-current depends exponentially on the threshold voltage,
   one decade for each \(S\) millivolts.)*

## References

- [Chapter 16: Short-Channel Effects, CMOS, and Advanced FET Structures](../../chapters/16-short-channel-cmos/index.md) —
  natural length, DIBL, velocity saturation, CMOS power, Dennard scaling,
  and advanced architectures
- R. H. Dennard, F. H. Gaensslen, H.-N. Yu, V. L. Rideout, E. Bassous, and
  A. R. LeBlanc, "Design of ion-implanted MOSFET's with very small
  physical dimensions," *IEEE Journal of Solid-State Circuits*, vol. SC-9,
  pp. 256–268, 1974.
- R.-H. Yan, A. Ourmazd, and K. F. Lee, "Scaling the Si MOSFET: from bulk
  to SOI to bulk," *IEEE Transactions on Electron Devices*, vol. 39,
  pp. 1704–1710, 1992.
- Z.-H. Liu, C. Hu, J.-H. Huang, T.-Y. Chan, M.-C. Jeng, P. K. Ko, and
  Y. C. Cheng, "Threshold voltage model for deep-submicrometer MOSFETs,"
  *IEEE Transactions on Electron Devices*, vol. 40, pp. 86–95, 1993.
- C. P. Auth and J. D. Plummer, "Scaling theory for cylindrical,
  fully-depleted, surrounding-gate MOSFET's," *IEEE Electron Device
  Letters*, vol. 18, pp. 74–76, 1997.
- [Dennard scaling (Wikipedia)](https://en.wikipedia.org/wiki/Dennard_scaling)
- [Multigate device (Wikipedia)](https://en.wikipedia.org/wiki/Multigate_device)
