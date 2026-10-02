---
title: LED Efficiency and Laser Threshold Explorer
description: A two-mode MicroSim for semiconductor light sources. LED mode shows the efficiency droop of the ABC recombination model. Laser mode finds the threshold where modal gain equals cavity loss and draws the light-current curve with its threshold kink.
image: /sims/led-laser-efficiency-explorer/led-laser-efficiency-explorer.png
og:image: /sims/led-laser-efficiency-explorer/led-laser-efficiency-explorer.png
twitter:image: /sims/led-laser-efficiency-explorer/led-laser-efficiency-explorer.png
social:
   cards: false
---

# LED Efficiency and Laser Threshold Explorer

<iframe src="main.html" width="100%" height="624" scrolling="no"></iframe>

[Run the LED Efficiency and Laser Threshold Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/led-laser-efficiency-explorer/main.html"
        width="100%" height="624" scrolling="no"></iframe>
```

## Description

The same GaAs active layer can be used as an LED or, inside an optical
cavity, as a laser. This MicroSim shows both, with one set of
recombination coefficients.

**LED mode**

- The **left plot** shows the internal quantum efficiency (IQE) against
  current density on a logarithmic axis. The blue curve is the IQE, which
  is the radiative share of the recombination. The dashed curves are the
  Shockley-Read-Hall share and the Auger share. The IQE rises at low
  current, peaks, and then falls. That fall is the **efficiency droop**.
- The **right plot** shows the light output against current. The dashed
  gray line is the output the LED would give if the IQE stayed at its peak
  value. The gap between the two is the droop.
- The **panel under the plots** gives the carrier density, the three
  recombination shares, the efficiency chain, and the output power at the
  drive current.

**Laser mode**

- The **left plot** shows the threshold condition. The blue curve is the
  modal gain \(\Gamma g\) against carrier density. The red line is the
  total loss \(\alpha_i + \alpha_m\), and the dashed red line is the
  internal loss alone. Lasing starts where the gain curve crosses the loss
  line. That point gives the threshold carrier density.
- The **right plot** shows the light output against current. The laser
  gives nothing until the threshold current and then rises in a straight
  line. The gray curve is the LED of LED mode on the same axes.
- The **panel under the plots** gives the mirror loss, the threshold gain,
  carrier density, current density and current, the differential quantum
  efficiency, the slope, and the output power.

Controls:

- **LED mode / Laser mode** switches the two views.
- **Compare quantum well with bulk** adds a second device whose active
  layer is a single 8 nm quantum well (green curves).
- **Drive current**: 0 to 1000 mA in LED mode and 0 to 100 mA in laser
  mode.
- **Mirror reflectivity** \(R_1 = R_2 = R\): 0.30 to 0.99 (laser mode).
- **Cavity length**: 50 to 500 µm (laser mode).
- **A**, **B**, **C**: the SRH, radiative, and Auger coefficients, on
  logarithmic scales.
- **Reset** restores the defaults.

## Things to Try

1. **Predict first.** In LED mode, raise the Auger coefficient C by a
   factor of ten. Before you do, predict what happens to the peak of the
   IQE curve: its height and its position.
2. Raise the SRH coefficient A, which stands for a higher defect density.
   Which side of the IQE curve changes?
3. Check the formula \(n_{peak} = \sqrt{A/C}\) against the readout for two
   settings of A and C.
4. Tick **Compare quantum well with bulk** in LED mode. The thin layer
   droops at a much lower current density. Why? What does this suggest
   about the design of high-power LEDs?
5. Switch to laser mode. Raise the mirror reflectivity from 0.30 to 0.90.
   What happens to the threshold current, and what happens to the slope of
   the light-current curve? Why do they move in opposite directions for
   the output power?
6. Shorten the cavity from 300 µm to 50 µm with R = 0.30. What happens to
   the mirror loss and to the threshold current density?
7. With the comparison on, find a cavity in which the quantum well laser
   has the lower threshold current, and one in which it cannot lase at
   all.
8. Compare the laser and LED curves on the right plot at 50 mA. Give two
   reasons for the difference.

## The Physics Behind the Simulation

**ABC model (Section 17.2).** For an injected carrier density \(n\) the
recombination rate is \(An + Bn^2 + Cn^3\), and

\[
\eta_{IQE} = \frac{Bn^2}{An + Bn^2 + Cn^3}, \qquad
J = \frac{q\,d\,(An + Bn^2 + Cn^3)}{\eta_{inj}}
\]

where \(d\) is the thickness of the active layer. The IQE peaks at
\(n = \sqrt{A/C}\) with the value \(B/(B + 2\sqrt{AC})\).

**LED efficiency chain**

\[
\eta_{EQE} = \eta_{inj}\,\eta_{IQE}\,\eta_{LEE}, \qquad
P_{out} = \eta_{EQE}\,\frac{h\nu}{q}\,I
\]

The external quantum efficiency is the number of photons out for each
electron in. The wall-plug efficiency is smaller by the factor
\(h\nu/qV\), where \(V\) is the voltage across the diode. The sim does not
model the diode voltage and reports the external quantum efficiency.

**Laser threshold (Section 17.5)**

\[
\Gamma g_{th} = \alpha_i + \alpha_m, \qquad
\alpha_m = \frac{1}{2L}\ln\!\left(\frac{1}{R_1R_2}\right) = \frac{1}{L}\ln\!\left(\frac{1}{R}\right)
\]

\[
J_{th} = \frac{q\,d}{\eta_i\,\tau}\,n_{th} = \frac{q\,d\,(An_{th} + Bn_{th}^2 + Cn_{th}^3)}{\eta_i}, \qquad
I_{th} = J_{th}\,w\,L
\]

The carrier lifetime at threshold comes from the same ABC coefficients,
\(1/\tau = A + Bn_{th} + Cn_{th}^2\). Above threshold the carrier density
stays at \(n_{th}\) and every extra injected carrier becomes a stimulated
photon:

\[
P_{out} = \eta_d\,\frac{h\nu}{q}\,(I - I_{th}), \qquad
\eta_d = \eta_i\,\frac{\alpha_m}{\alpha_i + \alpha_m}
\]

The expression for \(\eta_d\) is the standard result for a Fabry-Perot
cavity: of the photons generated, the fraction \(\alpha_m/(\alpha_i +
\alpha_m)\) leaves through the mirrors and the rest is absorbed inside.
\(P_{out}\) is the total from both facets.

**Parameter values**

| Parameter | Value | Source |
|-----------|-------|--------|
| Photon energy | 1.42 eV, \(\lambda = 1240/1.42 = 873\) nm | Section 17.1 (GaAs) |
| A, B, C defaults | \(10^{7}\ \text{s}^{-1}\), \(10^{-10}\ \text{cm}^3/\text{s}\), \(2 \times 10^{-30}\ \text{cm}^6/\text{s}\) | GaAs values of Chapter 10 and its MicroSim; A is a typical value |
| \(\eta_{inj}\), \(\eta_i\) | 0.95 | Section 17.2 |
| \(\eta_{LEE}\) | \(1/4n^2 = 2.0\,\%\) for \(n = 3.5\) | Section 17.2, one flat surface |
| LED area | 100 µm × 100 µm | assumed |
| Bulk active layer | \(d = 0.1\) µm, \(\Gamma = 0.3\) | typical double heterostructure |
| Bulk gain | \(g = a(n - n_{tr})\), \(a = 3 \times 10^{-16}\ \text{cm}^2\), \(n_{tr} = 10^{18}\ \text{cm}^{-3}\) | Section 17.5 |
| Quantum well layer | \(d = 8\) nm, \(\Gamma = 0.03\) | typical single well |
| Quantum well gain | \(g = g_0\ln(n/n_{tr})\), \(g_0 = 2400\ \text{cm}^{-1}\), \(n_{tr} = 2.6 \times 10^{18}\ \text{cm}^{-3}\) | representative of the fits tabulated by Coldren, Corzine, and Mašanović for an 8 nm GaAs well |
| Internal loss \(\alpha_i\) | 10 cm\(^{-1}\) | assumed |
| Laser stripe width \(w\) | 5 µm | assumed |

**Worked check, laser mode.** Defaults: R = 0.30, L = 300 µm, bulk layer.

\[
\alpha_m = \frac{\ln(1/0.30)}{0.030\ \text{cm}} = 40.1\ \text{cm}^{-1}, \qquad
g_{th} = \frac{10 + 40.1}{0.3} = 167\ \text{cm}^{-1}, \qquad
n_{th} = 10^{18} + \frac{167}{3 \times 10^{-16}} = 1.56 \times 10^{18}\ \text{cm}^{-3}
\]

The recombination rate at threshold is
\(1.6 \times 10^{25} + 2.42 \times 10^{26} + 0.08 \times 10^{26}
= 2.65 \times 10^{26}\ \text{cm}^{-3}\text{s}^{-1}\), so

\[
J_{th} = \frac{(1.602 \times 10^{-19})(10^{-5})(2.65 \times 10^{26})}{0.95} = 448\ \text{A/cm}^2, \qquad
I_{th} = 448 \times (5 \times 10^{-4})(0.030) = 6.7\ \text{mA}
\]

\(\eta_d = 0.95 \times 40.1/50.1 = 0.76\), the slope is
\(0.76 \times 1.42\ \text{V} = 1.08\) W/A, and at 50 mA the output is
\(1.08 \times (50 - 6.7)\ \text{mA} = 46.7\) mW. The threshold current
density is close to the range of 500 to 2000 A/cm² that Section 17.5
quotes for double heterostructure lasers.

**Worked check, LED mode.** At 500 mA the current density is
5000 A/cm². The carrier density that balances it is
\(5.1 \times 10^{18}\ \text{cm}^{-3}\), where the IQE is 0.891. Then
\(\eta_{EQE} = 0.95 \times 0.891 \times 0.0204 = 1.73\,\%\) and
\(P_{out} = 0.0173 \times 1.42\ \text{V} \times 0.5\ \text{A} = 12.3\) mW.

### Simplifications and Limitations

- **One flat surface.** The LED extraction efficiency is the 2 % of an
  unpackaged chip with a flat surface. Section 17.2 notes that textured
  and shaped chips reach more than 80 %. The laser emits along its
  waveguide and does not have this loss, which is the main reason the two
  curves on the right plot differ so much.
- **No heating.** Real LEDs and lasers lose efficiency as they warm up,
  and a real laser curve rolls over at high current. The straight line
  above threshold is the ideal case.
- **No spontaneous emission from the laser.** Below threshold a real laser
  emits a little light, like a poor LED. The sim shows zero.
- **Gain models.** The linear and logarithmic gain expressions are the
  ones in Section 17.5. They are fits that hold near and somewhat above
  transparency. When the required threshold density exceeds
  \(2 \times 10^{19}\ \text{cm}^{-3}\) the sim reports that the layer
  cannot supply the gain. A single quantum well in a short cleaved cavity
  is in that position.
- **The quantum well values** are representative. The gain of a real well
  depends on its width, composition, and strain.
- **Constant confinement factor, loss, and injection efficiency.**
- **VCSELs.** The chapter specification asks for a comparison with a
  VCSEL. The cavity length slider covers 50 to 500 µm, and a VCSEL cavity
  is about 1 µm long with mirrors above 99 % reflectivity, so it is
  outside the range of this model. Its light-current curve also depends on
  heating, which is not modeled. You can see the design direction by
  setting R = 0.99 and shortening the cavity: high reflectivity is what
  makes a short gain length workable.
- **A drive current slider** was added to the controls of the chapter
  specification, so that the efficiencies and output power can be read at
  a chosen operating point.

## Lesson Plan

**Learning objectives:** Students will be able to

- explain (Understand, L2) the efficiency droop of an LED with the ABC
  model,
- calculate (Apply, L3) the threshold current density of a laser from the
  gain-loss threshold condition,
- compare (Analyze, L4) the light-current curves of an LED and a laser,
  and
- choose (Evaluate, L5) a suitable light source for a given application.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 20 minutes.

**Prerequisites:** Radiative, SRH, and Auger recombination (Chapter 10);
the LED efficiency chain, optical gain, and the threshold condition
(Sections 17.2 to 17.5).

### Suggested Sequence

1. **Droop (5 min):** Students change A and C one at a time and describe
   what each does to the IQE curve. They state which coefficient a crystal
   grower can improve and which is a property of the material.
2. **Threshold by hand (6 min):** For R = 0.30 and L = 500 µm, students
   compute \(\alpha_m\), \(g_{th}\), \(n_{th}\), and \(J_{th}\) for the
   bulk layer, then check.
3. **Design trade-off (5 min):** Students raise R in steps and tabulate
   the threshold current and the slope. They find the reflectivity that
   gives the most output at 20 mA and at 100 mA.
4. **Choosing a source (4 min):** Discussion. Which source suits room
   lighting, a fiber link, and a short optical interconnect? What does
   each application need most: efficiency at low cost, a narrow beam and
   high modulation speed, or low threshold current?

### Assessment Questions

1. An LED has \(A = 10^{7}\ \text{s}^{-1}\) and
   \(C = 10^{-30}\ \text{cm}^6/\text{s}\). At what carrier density is its
   IQE highest?
   *(\(n = \sqrt{A/C} = 3.2 \times 10^{18}\ \text{cm}^{-3}\).)*
2. A cavity has L = 250 µm and R = 0.32. Find the mirror loss.
   *(\(\alpha_m = \ln(1/0.32)/0.025 = 45.6\ \text{cm}^{-1}\).)*
3. Raising the mirror reflectivity lowers the threshold current but also
   lowers the slope of the light-current curve. Explain.
   *(Less light leaks out at each reflection, so less gain is needed to
   reach threshold. For the same reason a smaller fraction of the photons
   generated above threshold leaves through the mirrors, and more are
   absorbed inside.)*
4. Why does the light output of a laser rise linearly above threshold,
   while that of an LED bends over?
   *(In the laser the carrier density is pinned at its threshold value, so
   the non-radiative rates stop growing and every extra carrier becomes a
   stimulated photon. In the LED the carrier density keeps rising with
   current, and Auger recombination takes a growing share.)*

## References

- [Chapter 17: Optoelectronic Sources: LEDs and Laser Diodes](../../chapters/17-leds-laser-diodes/index.md) —
  the LED efficiency chain, the ABC model, optical gain, and the threshold
  condition
- [Recombination Lifetime Explorer](../recombination-lifetime-explorer/index.md) —
  the three recombination mechanisms behind the A, B, and C coefficients
- L. A. Coldren, S. W. Corzine, and M. L. Mašanović, *Diode Lasers and
  Photonic Integrated Circuits*, 2nd ed., Wiley, 2012.
- E. F. Schubert, *Light-Emitting Diodes*, 2nd ed., Cambridge University
  Press, 2006.
- [Laser diode (Wikipedia)](https://en.wikipedia.org/wiki/Laser_diode)
- [Light-emitting diode physics (Wikipedia)](https://en.wikipedia.org/wiki/Light-emitting_diode_physics)
