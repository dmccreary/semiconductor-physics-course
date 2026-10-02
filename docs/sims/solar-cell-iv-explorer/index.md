---
title: Solar Cell I-V Curve Explorer
description: A single-diode model of an illuminated solar cell. The MicroSim plots current density and power density against voltage, marks the short-circuit current, the open-circuit voltage, and the maximum power point, and reports the fill factor and efficiency for a silicon cell, a GaAs cell, and a perovskite-silicon tandem cell.
image: /sims/solar-cell-iv-explorer/solar-cell-iv-explorer.png
og:image: /sims/solar-cell-iv-explorer/solar-cell-iv-explorer.png
twitter:image: /sims/solar-cell-iv-explorer/solar-cell-iv-explorer.png
social:
   cards: false
---

# Solar Cell I-V Curve Explorer

<iframe src="main.html" width="100%" height="591" scrolling="no"></iframe>

[Run the Solar Cell I-V Curve Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/solar-cell-iv-explorer/main.html"
        width="100%" height="591" scrolling="no"></iframe>
```

## Description

A solar cell is a p-n junction that delivers power to a load when light
generates carriers in it. This MicroSim solves the single-diode model of
Section 18.4 and shows where the numbers on a solar cell data sheet come
from.

- The **upper plot** shows the current density \(J\) against the voltage
  \(V\). The current is counted as positive when the cell delivers it to
  the load. The orange point is the short-circuit current density
  \(J_{sc}\), the purple point is the open-circuit voltage \(V_{oc}\), and
  the green point is the maximum power point (MPP). The green rectangle
  has the area \(V_{mp} J_{mp} = P_{max}\). The dashed box has the area
  \(V_{oc} J_{sc}\). The fill factor is the ratio of the two areas. Below
  the axis, beyond \(V_{oc}\), the current reverses and the cell absorbs
  power.
- The **lower plot** shows the power density \(P = VJ\) against the
  voltage. Its peak is the maximum power point.
- The **dashed gray curves** are the same cell with no series resistance
  and no shunt path.
- The **panel on the right** lists \(J_{sc}\), \(V_{oc}\), the maximum
  power point, the fill factor, and the efficiency. Under it are the
  values without the two resistances, and a small table of all three cells
  at the present settings.

Controls:

- **Cell**: a commercial silicon cell, a record GaAs laboratory cell, or a
  perovskite-silicon tandem cell.
- **Show Shockley-Queisser limit** draws the limit for one junction,
  33.7 % of the incident power, on the power plot.
- **Irradiance**: 0.1 to 5 suns. One sun is the AM1.5G standard,
  100 mW/cm² (1000 W/m²).
- **Temperature**: the cell temperature, −20 °C to +80 °C.
- **R_s**: series resistance, 0 to 2 Ω·cm².
- **R_sh**: shunt resistance, 100 to 10 000 Ω·cm², on a logarithmic scale.
- **Reset** restores the defaults: silicon, 1 sun, 25 °C,
  R_s = 0.5 Ω·cm², R_sh = 10 000 Ω·cm².

## Things to Try

1. **Predict first.** Double the irradiance from 1 sun to 2 suns. Before
   you do, predict the new \(J_{sc}\) and the new \(V_{oc}\). Which one
   doubles?
2. Raise the temperature from 25 °C to 80 °C. Which of \(J_{sc}\) and
   \(V_{oc}\) changes, and by how much for each degree?
3. Raise \(R_s\) from 0 to 2 Ω·cm². Which part of the curve moves? What
   happens to \(V_{oc}\) and \(J_{sc}\), and what happens to the fill
   factor?
4. Lower \(R_{sh}\) to 100 Ω·cm² with \(R_s = 0\). Which part of the curve
   moves now?
5. Repeat step 4 for the tandem cell. Why does the same shunt resistance
   do so much more damage to a cell with a high voltage and a low current?
6. Set 5 suns and compare \(R_s = 0\) with \(R_s = 2\) Ω·cm² for the
   silicon cell. Why do concentrator cells need a very low series
   resistance?
7. Tick **Show Shockley-Queisser limit** and step through the three cells
   at 1 sun and 25 °C. Which cells lie below the limit for one junction,
   and which one reaches it? Use the table in the panel to explain how the
   tandem cell does this with about half the current of the silicon cell.

## The Physics Behind the Simulation

**Single-diode model.** Per unit area, with the current positive when it
flows out of the cell into the load:

\[
J = J_L - J_0\!\left[\exp\!\left(\frac{V + J R_s}{n V_{th}}\right) - 1\right] - \frac{V + J R_s}{R_{sh}},
\qquad V_{th} = \frac{k_B T}{q}
\]

Section 18.4 writes the same equation with the opposite sign of the
current and without the two resistances. \(J_L\) is the photocurrent
density, \(J_0\) the saturation current density, and \(n\) the ideality
factor. The sim solves the equation in terms of the junction voltage
\(V_j = V + J R_s\), which makes it explicit.

**Parameters read from the curve**

\[
V_{oc} = n V_{th}\,\ln\!\left(\frac{J_L}{J_0} + 1\right), \qquad
FF = \frac{V_{mp} J_{mp}}{V_{oc} J_{sc}}, \qquad
\eta = \frac{P_{max}}{P_{in}} = \frac{V_{oc} J_{sc} FF}{P_{in}}
\]

The expression for \(V_{oc}\) holds when the shunt current is negligible.
\(P_{in}\) is 100 mW/cm² for each sun.

**Irradiance.** \(J_L\) is proportional to the irradiance. \(V_{oc}\)
rises only by \(n V_{th}\ln\) of the irradiance ratio.

**Temperature.** The saturation current follows the square of the
intrinsic carrier concentration:

\[
J_0(T) = J_0(T_{ref})\left(\frac{T}{T_{ref}}\right)^{3N/n}
\exp\!\left[-\frac{1}{n k_B}\left(\frac{E_g(T)}{T} - \frac{E_g(T_{ref})}{T_{ref}}\right)\right]
\]

with \(T_{ref} = 298.15\) K, \(N\) the number of junctions in series, and
\(E_g\) the sum of their bandgaps. For silicon this is
\(J_0 \propto n_i^2\) with the same \(N_C\), \(N_V\), and Varshni
\(E_g(T)\) as the other MicroSims of this book
(\(n_i(300\ \text{K}) = 9.65 \times 10^{9}\ \text{cm}^{-3}\)). \(J_0\)
rises steeply with temperature, so \(V_{oc}\) falls. \(J_L\) is held
constant with temperature.

**Cell parameters**

| Cell | \(J_L\) at 1 sun (mA/cm²) | \(V_{oc}\) at 1 sun, 25 °C (V) | Junctions | \(n\) | \(E_g\) | \(J_0\) at 25 °C (A/cm²) |
|------|------|------|------|------|------|------|
| Silicon (commercial) | 38 | 0.64 | 1 | 1 | Varshni, 1.12 eV class | \(5.8 \times 10^{-13}\) |
| GaAs (record lab cell) | 29 | 1.13 | 1 | 1 | Varshni, 1.42 eV at 300 K | \(2.3 \times 10^{-21}\) |
| Perovskite-Si tandem | 20 | 1.99 | 2 | 2.4 in total | 1.68 eV + silicon | \(1.9 \times 10^{-16}\) |

\(J_L\) and \(V_{oc}\) are the values in the table of Section 18.4.
\(J_0\) follows from them through the \(V_{oc}\) equation. The tandem cell
is treated as two current-matched junctions in series, which is
equivalent to one diode whose ideality factor is the sum of the two. The
sum is set to 2.4 so that the default settings give the 33.9 % of the
table. The top-cell bandgap of 1.68 eV is a typical value for
perovskite-silicon tandems and is an assumption.

**Shockley-Queisser limit.** The line on the power plot is 33.7 % of the
incident power, the maximum for one junction under AM1.5G light at one
sun, reached at a bandgap of 1.34 eV (Section 18.5). The limits for the
bandgaps of silicon and GaAs are within about two points of that maximum.
The limit does not apply to the tandem cell, which has two junctions.

**Worked check, open-circuit voltage.** Silicon at 25 °C:
\(V_{th} = 8.617 \times 10^{-5} \times 298.15 = 0.02569\) V. From 1 sun
to 5 suns

\[
V_{oc} = 0.640\ \text{V} + 0.02569\ \text{V} \times \ln 5 = 0.640 + 0.041 = 0.681\ \text{V}
\]

The sim shows 0.681 V and \(J_{sc} = 190\) mA/cm², five times the 1 sun
value.

**Worked check, fill factor and efficiency.** Silicon at the defaults.
The sim gives \(V_{mp} = 0.543\) V and \(J_{mp} = 36.2\) mA/cm², so

\[
P_{max} = 0.543\ \text{V} \times 36.2\ \text{mA/cm}^2 = 19.6\ \text{mW/cm}^2, \quad
FF = \frac{19.6}{0.640 \times 38.0} = 0.808, \quad
\eta = \frac{19.6}{100} = 19.6\,\%
\]

With no resistances the sim gives \(FF = 0.836\). Green's empirical
expression for an ideal diode,
\(FF_0 = [v - \ln(v + 0.72)]/(v + 1)\) with
\(v = V_{oc}/V_{th} = 24.9\), gives
\((24.9 - 3.24)/25.9 = 0.836\).

**Worked check, temperature.** Differentiating the \(V_{oc}\) equation
gives \(dV_{oc}/dT = -(E_{g0}/q - V_{oc} + 3V_{th})/T\), where
\(E_{g0} = 1.206\) eV is the bandgap extrapolated linearly to 0 K. For
silicon at 25 °C this is
\(-(1.206 - 0.640 + 0.077)/298 = -2.16\) mV/K, or −0.34 % per kelvin.
From 25 °C to 80 °C the sim's \(V_{oc}\) falls from 0.640 V to 0.519 V,
which is 2.2 mV/K.

### Simplifications and Limitations

- **One diode.** Real cells also have a recombination current with an
  ideality factor near 2, which matters at low voltage and low light.
- **The cells are models, not data sheets.** Each is fitted to two
  numbers of the Section 18.4 table. The fill factor and efficiency then
  come from the model and from the two resistance sliders, which apply to
  all three cells. At the defaults the model gives 19.6 %, 28.8 %, and
  33.9 %.
- **Photocurrent independent of temperature.** In a real silicon cell
  \(J_{sc}\) rises by about 0.05 % per kelvin as the bandgap narrows. This
  is small compared with the fall of \(V_{oc}\) and is left out.
- **Temperature is set by hand.** The cell does not heat up when the
  irradiance rises. A real cell under concentrated light needs cooling.
- **Spectrum.** The irradiance slider scales the AM1.5G spectrum without
  changing its shape. The tandem cell is assumed to stay current-matched.
- **The Shockley-Queisser line is the one-sun value.** The limit is
  higher under concentrated light. The limits for the individual bandgaps
  of silicon and GaAs are not drawn.
- **Uniform cell.** The series resistance is a single lumped value.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) \(J_{sc}\), \(V_{oc}\), the maximum power
  point, and the fill factor on an I-V curve,
- calculate (Apply, L3) the fill factor and efficiency from the I-V
  parameters,
- explain (Analyze, L4) why irradiance and temperature act differently on
  \(J_{sc}\) and \(V_{oc}\), and
- compare (Evaluate, L5) a single-junction cell with a tandem cell.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 20 minutes.

**Prerequisites:** The ideal diode equation (Chapter 11), the photocurrent
of an illuminated junction (Section 18.1), and the solar cell parameters
(Section 18.4).

### Suggested Sequence

1. **Read the curve (4 min):** With the defaults, students point out
   \(J_{sc}\), \(V_{oc}\), and the maximum power point, and compute the
   fill factor and efficiency from the panel values.
2. **Irradiance and temperature (6 min):** Students tabulate \(J_{sc}\)
   and \(V_{oc}\) at 0.5, 1, 2, and 4 suns, then at 0, 25, 50, and 75 °C.
   They state which quantity is linear in which variable.
3. **Resistances (5 min):** Students find which resistance changes the
   slope of the curve near \(V_{oc}\) and which changes the slope near
   \(J_{sc}\).
4. **Single junction and tandem (5 min):** Students compare the three
   cells with the limit line switched on and explain the gain of the
   tandem cell from thermalization and transmission losses
   (Sections 18.5 and 18.6).

### Assessment Questions

1. A cell has \(V_{oc} = 0.70\) V, \(J_{sc} = 40\) mA/cm², and
   \(FF = 0.82\) under one sun. Find its efficiency.
   *(\(0.70 \times 40 \times 0.82 = 23.0\) mW/cm², so 23.0 %.)*
2. By how much does \(V_{oc}\) of an ideal cell with \(n = 1\) rise at
   25 °C when the irradiance goes up by a factor of 10?
   *(\(0.02569 \times \ln 10 = 59\) mV.)*
3. Why does \(V_{oc}\) fall as the cell warms up, although the thermal
   voltage in front of the logarithm rises?
   *(\(J_0\) is proportional to \(n_i^2\), which rises exponentially with
   temperature. The logarithm of \(J_L/J_0\) falls faster than \(V_{th}\)
   rises.)*
4. A tandem cell has about half the short-circuit current of a silicon
   cell. How can it be more efficient?
   *(Each sub-cell absorbs the part of the spectrum near its own bandgap,
   so less photon energy is lost as heat. The voltages of the two
   junctions add, and the higher voltage more than makes up for the lower
   current.)*

## References

- [Chapter 18: Photodetectors, Solar Cells, and Imaging Devices](../../chapters/18-photodetectors-solar-cells/index.md) —
  the solar cell equation, fill factor, efficiency, and the
  Shockley-Queisser limit
- [P-N Junction Explorer](../pn-junction-explorer/index.md) — the diode
  current of the same junction in the dark
- W. Shockley and H. J. Queisser, "Detailed balance limit of efficiency of
  p-n junction solar cells," *Journal of Applied Physics* 32, 510 (1961).
- M. A. Green, *Solar Cells: Operating Principles, Technology, and System
  Applications*, Prentice-Hall, 1982.
- [Theory of solar cells (Wikipedia)](https://en.wikipedia.org/wiki/Theory_of_solar_cells)
- [Shockley–Queisser limit (Wikipedia)](https://en.wikipedia.org/wiki/Shockley%E2%80%93Queisser_limit)
