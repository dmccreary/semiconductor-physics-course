---
title: BJT Operating Regions Explorer
description: Output characteristics of a bipolar transistor with a load line and the DC operating point. See the saturation, forward active, and cutoff regions, how they follow from the bias of the two junctions, and how the Early voltage tilts the curves.
image: /sims/bjt-operating-regions/bjt-operating-regions.png
og:image: /sims/bjt-operating-regions/bjt-operating-regions.png
twitter:image: /sims/bjt-operating-regions/bjt-operating-regions.png
social:
   cards: false
---

# BJT Operating Regions Explorer

<iframe src="main.html" width="100%" height="614" scrolling="no"></iframe>

[Run the BJT Operating Regions Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/bjt-operating-regions/main.html"
        width="100%" height="614" scrolling="no"></iframe>
```

## Description

This MicroSim shows the common-emitter output characteristics of a bipolar
junction transistor and where a simple circuit places it on them.

- The **left plot** shows the collector current \(I_C\) against the
  collector-emitter voltage \(V_{CE}\) for six base currents: zero and
  five equal steps. The thick dark curve is the curve for the base current
  chosen with the slider. The orange line is the **load line** of a
  circuit with supply \(V_{CC}\) and collector resistor \(R_C\). The red
  dot Q is the DC operating point, where the load line crosses the
  selected curve.
- The shading marks the regions: **saturation** (orange, at the left),
  **forward active** (blue), and **cutoff** (the gray strip along the
  \(I_B = 0\) curve).
- The **two-by-two map** shows how the four regions follow from the bias
  of the two junctions. The cell for the present operating point is
  highlighted. Reverse active cannot be reached in this circuit, but it is
  shown for completeness.
- The **small cross section** shows the minority carrier concentration
  across the base at the operating point. It is drawn on a linear scale.
  The gray bands are the depletion layers.
- The **strip under the plot** gives the operating point, both junction
  voltages, the ratio \(I_C/I_B\), the output resistance, and the error
  that the Early effect would cause in a current mirror.

Controls:

- **Transistor** chooses NPN or PNP. A PNP transistor has the same curves
  with every voltage and current reversed, so the plot shows magnitudes.
- **Show load line** shows or hides the load line.
- **Current gain β**: 50 to 300.
- **Base current step**: 5 to 50 µA between curves.
- **Base current** \(I_B\): zero to five steps, for the operating point.
- **Supply** \(V_{CC}\): 2 to 20 V.
- **Load** \(R_C\): 0.1 to 10 kΩ.
- **Early voltage** \(V_A\): 50 to 500 V.
- **Reset** restores the defaults.

## Things to Try

1. **Predict first.** With the defaults the transistor is in the forward
   active region. Before you move it, predict what happens to Q when the
   load resistor is raised from 2 kΩ to 5 kΩ. Then try it.
2. In saturation, compare \(I_C/I_B\) with β in the readout. Which of the
   two is set by the transistor, and which by the circuit?
3. Lower the base current to zero. Where is Q now? Which cell of the map
   is highlighted?
4. Set the Early voltage to 50 V and then to 500 V. What changes on the
   plot? Read the output resistance and the current-mirror error at each
   setting.
5. Find the load line intercepts by hand: \(V_{CC}\) on the voltage axis
   and \(V_{CC}/R_C\) on the current axis. Then solve for Q in the active
   region with \(I_C = \beta I_B\) and compare with the readout. Why is
   the readout slightly higher?
6. Watch the small cross section as you move Q from the active region into
   saturation. What happens to the slope of the carrier profile, and how
   does that explain the lower collector current?

## The Physics Behind the Simulation

**Operating regions (Section 14.1).** The region depends only on the bias
of the two junctions:

| Region | B-E junction | B-C junction | Collector current |
|--------|--------------|--------------|-------------------|
| Cutoff | reverse (or not turned on) | reverse | leakage only |
| Forward active | forward | reverse | \(I_C = \beta I_B\) |
| Saturation | forward | forward | less than \(\beta I_B\), set by the circuit |
| Reverse active | reverse | forward | small, with emitter and collector exchanged |

**Model.** The curves come from the Ebers-Moll model of Section 14.4 in
its transport form, with the Early factor of Section 14.5.1:

\[
I_C = I_S\left(e^{V_{BE}/V_T} - e^{V_{BC}/V_T}\right)\left(1 + \frac{V_{CE}}{V_A}\right)
      - \frac{I_S}{\beta_R}\left(e^{V_{BC}/V_T} - 1\right)
\]

\[
I_B = \frac{I_S}{\beta_F}\left(e^{V_{BE}/V_T} - 1\right) + \frac{I_S}{\beta_R}\left(e^{V_{BC}/V_T} - 1\right),
\qquad V_{BC} = V_{BE} - V_{CE}
\]

Here \(V_T = k_BT/q = 25.85\) mV at 300 K, \(\beta_F\) is the slider value
β, and two parameters are fixed: \(I_S = 10^{-14}\) A and \(\beta_R = 1\).
For a given \(I_B\) and \(V_{CE}\) the second equation is solved for
\(V_{BE}\), and the first then gives \(I_C\).

In the forward active region the exponential in \(V_{BC}\) is negligible
and the model reduces to

\[
I_C = \beta I_B\left(1 + \frac{V_{CE}}{V_A}\right), \qquad
r_o = \left(\frac{\partial I_C}{\partial V_{CE}}\right)^{-1} = \frac{V_A}{\beta I_B}
\]

so β is the current gain extrapolated to \(V_{CE} = 0\), and the measured
ratio \(I_C/I_B\) is slightly larger.

**Saturation boundary.** The sim shades saturation where the B-C junction
is forward biased, \(V_{BC} > 0\), which is the same as
\(V_{CE} < V_{BE}\). Near that boundary the forward bias on the B-C
junction is too small to matter, and \(I_C\) is still close to
\(\beta I_B\). The current falls visibly only when \(V_{BC}\) exceeds
about 0.5 V, which is \(V_{CE}\) below about 0.2 V. That knee is the
\(V_{CE,sat}\) of circuit analysis.

**Load line.** The circuit requires \(I_C = (V_{CC} - V_{CE})/R_C\). The
operating point is the intersection of this line with the device curve.

**Minority carriers in the base (Section 14.2).** The concentration at the
emitter edge is proportional to \(e^{V_{BE}/V_T} - 1\) and at the collector
edge to \(e^{V_{BC}/V_T} - 1\), with a straight line between them. The
height is scaled to the value at the largest base current of the family.
The neutral base is drawn narrower by the factor \(1/(1 + V_{CE}/V_A)\) to
show base-width modulation.

**Current mirror.** In a simple mirror the reference transistor has
\(V_{CE} = V_{BE}\) and the output transistor has the \(V_{CE}\) that the
load gives it. With equal \(V_{BE}\), and ignoring base currents,

\[
\frac{I_{out}}{I_{ref}} = \frac{1 + V_{CE}/V_A}{1 + V_{BE}/V_A}
\]

The readout gives this ratio minus one as the mirror error.

**Worked check.** Defaults: β = 100, \(I_B = 30\) µA, \(V_{CC} = 10\) V,
\(R_C = 2\) kΩ, \(V_A = 100\) V. In the active region
\(I_C = 3.0\ \text{mA} \times (1 + V_{CE}/100\ \text{V})\) and
\(V_{CE} = 10\ \text{V} - (2\ \text{k}\Omega) I_C\). Solving the two
together,

\[
I_C = \frac{3.0\ \text{mA} \times 1.1}{1 + 0.06} = 3.11\ \text{mA}, \qquad
V_{CE} = 10 - 2 \times 3.11 = 3.77\ \text{V}
\]

Then \(r_o = 100\ \text{V} / 3.0\ \text{mA} = 33.3\) kΩ, and the mirror
error is \(1.0377/1.0068 - 1 = 3.1\,\%\). With \(R_C = 5\) kΩ the
transistor saturates: the sim gives \(V_{CE} = 0.137\) V and
\(I_C = (10 - 0.137)/5\ \text{k}\Omega = 1.97\) mA, so
\(I_C/I_B = 65.8\). This agrees with the Ebers-Moll saturation voltage

\[
V_{CE,sat} = V_T \ln\!\left[\frac{1/\alpha_R + (I_C/I_B)/\beta_R}{1 - (I_C/I_B)/\beta_F}\right]
= 0.02585 \times \ln\!\left[\frac{2 + 65.8}{1 - 0.658}\right] = 0.137\ \text{V}
\]

### Simplifications and Limitations

- **Ideal Ebers-Moll device.** There are no series resistances, no Kirk
  effect at high current, no fall of β at low or high current, and no
  breakdown. Real saturation voltages are higher because of the collector
  series resistance.
- **Fixed** \(I_S\) **and** \(\beta_R\). They set \(V_{BE}\) and the shape
  of the saturation knee, but not the active-region curves.
- **Cutoff** is reached here only as its boundary, \(I_B = 0\), because the
  base is driven by a current. The open-base \(V_{BE}\) in the readout is a
  small positive value, below turn-on.
- **Base current drive.** The sim does not include a base bias circuit.
  The base current is set directly.
- **The carrier profile** is a sketch on a linear scale. In moderate
  saturation the concentration at the collector edge is still small
  compared with the emitter edge, and it becomes visible only in deep
  saturation.
- **Specification.** The chapter specification asks for a band diagram.
  The sim shows the base minority carrier profile and the junction-bias
  map in its place. A slider for the operating base current was added,
  because the operating point needs one.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) the active, saturation, and cutoff regions on
  the output characteristics,
- determine (Apply, L3) the DC operating point from the load line
  intersection, and
- explain (Analyze, L4) how the Early voltage affects the accuracy of a
  current mirror.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 15 minutes.

**Prerequisites:** The forward- and reverse-biased p-n junction
(Chapter 11); BJT structure, minority carrier transport, and current gain
(Sections 14.1 to 14.3).

### Suggested Sequence

1. **Regions (3 min):** Students move the base current and the load
   resistor until Q has visited all three regions, and record the two
   junction voltages in each.
2. **Load line (5 min):** For \(V_{CC} = 12\) V, \(R_C = 3\) kΩ, β = 150
   and \(I_B = 20\) µA, students compute Q by hand with
   \(I_C = \beta I_B\), then check and explain the difference.
3. **Saturation (3 min):** Students find the smallest base current that
   saturates the transistor for a given load, and compare it with
   \(V_{CC}/(\beta R_C)\).
4. **Early effect (4 min):** Students measure the slope of a curve in the
   active region, compare it with \(\beta I_B/V_A\), and discuss what the
   mirror error means for an analog designer.

### Assessment Questions

1. A transistor has \(V_{BE} = 0.68\) V and \(V_{CE} = 0.15\) V. Which
   region is it in, and why?
   *(Saturation. \(V_{BC} = 0.53\) V, so both junctions are forward
   biased.)*
2. In saturation, why is \(I_C\) less than \(\beta I_B\)?
   *(The forward-biased collector junction also injects carriers into the
   base, which reduces the slope of the minority carrier profile and
   therefore the current collected.)*
3. A current mirror uses transistors with \(V_A = 50\) V. The output
   transistor sits at \(V_{CE} = 5\) V. Estimate the error.
   *(About \(5/50 = 10\,\%\), less the small term \(V_{BE}/V_A\): 8.5 %.)*

## References

- [Chapter 14: Bipolar Junction Transistors](../../chapters/14-bipolar-transistors/index.md) —
  operating regions, current gain, the Ebers-Moll model, and the Early
  effect
- J. J. Ebers and J. L. Moll, "Large-signal behavior of junction
  transistors," *Proceedings of the IRE*, vol. 42, pp. 1761–1772, 1954.
- J. M. Early, "Effects of space-charge layer widening in junction
  transistors," *Proceedings of the IRE*, vol. 40, pp. 1401–1406, 1952.
- [Bipolar junction transistor (Wikipedia)](https://en.wikipedia.org/wiki/Bipolar_junction_transistor)
- [Early effect (Wikipedia)](https://en.wikipedia.org/wiki/Early_effect)
