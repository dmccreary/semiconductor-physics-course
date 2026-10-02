---
title: MOS Capacitor C-V Explorer
description: High-frequency and low-frequency capacitance-voltage curves of a MOS capacitor on p-type silicon, with the band diagram at a chosen gate voltage. Change the oxide thickness, doping, oxide charge, interface traps, and gate work function to see the curve shift, stretch, and change shape.
image: /sims/mos-cv-explorer/mos-cv-explorer.png
og:image: /sims/mos-cv-explorer/mos-cv-explorer.png
twitter:image: /sims/mos-cv-explorer/mos-cv-explorer.png
social:
   cards: false
---

# MOS Capacitor C-V Explorer

<iframe src="main.html" width="100%" height="707" scrolling="no"></iframe>

[Run the MOS Capacitor C-V Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/mos-cv-explorer/main.html"
        width="100%" height="707" scrolling="no"></iframe>
```

## Description

The capacitance-voltage (C-V) curve is the standard measurement on a MOS
capacitor. This MicroSim computes the curve for a metal gate on
SiO\(_2\) on p-type silicon at 300 K.

- The **left plot** shows the capacitance, as a fraction of the oxide
  capacitance \(C_{ox}\), against gate voltage. The blue curve is the
  low-frequency (quasi-static) curve and the red curve is the
  high-frequency curve. The two curves differ only in inversion. The
  background colors mark accumulation, depletion, and inversion. Dashed
  vertical lines mark the flat-band voltage \(V_{FB}\) and the threshold
  voltage \(V_T\). Dotted horizontal lines mark \(C_{ox}\) and
  \(C_{min}\).
- The **right panel** is the band diagram at the probe voltage: the gate
  Fermi level, the oxide barrier, and the silicon bands \(E_C\), \(E_i\),
  \(E_V\) with the Fermi level \(E_F\). Dots at the interface show
  accumulated holes (red) or inversion electrons (blue).
- The **strip under the plots** lists \(C_{ox}\), \(V_{FB}\), \(V_T\),
  \(C_{min}\), the quantities that go into \(V_T\), and the surface
  potential and capacitances at the probe voltage.

When the oxide charge or the interface trap density is not zero, a gray
dotted curve shows the same device without them, so you can see what they
changed.

Controls:

- **High frequency / Low frequency / Both** chooses the curves.
- **Deep depletion** adds the curve for a fast sweep, in which no inversion
  layer has time to form.
- **Gate voltage (probe)** moves the probe along the voltage axis.
- **Oxide thickness**: 1 to 20 nm.
- **Substrate doping** \(N_A\): \(10^{15}\) to \(10^{18}\ \text{cm}^{-3}\).
- **Fixed oxide charge** \(Q_f/q\): \(-10^{12}\) to \(+10^{12}\ \text{cm}^{-2}\).
- **Interface traps** \(D_{it}\): 0 to \(10^{12}\ \text{cm}^{-2}\text{eV}^{-1}\).
- **Gate work function** \(\phi_m\): 4.0 to 5.2 eV. Aluminum and n\(^+\)
  polysilicon are near 4.1 eV, and p\(^+\) polysilicon is near 5.2 eV.
- **Reset** restores the defaults.

The voltage axis depends only on the oxide thickness and the doping. The
charge, trap, and work function sliders move the curve inside a fixed
frame.

## Things to Try

1. **Predict first.** Move the probe from the left edge to the right edge.
   Before you do, say what the bands at the silicon surface will do in each
   of the three regions.
2. With **Both** selected, find where the red and blue curves separate.
   Why does the low-frequency curve return to \(C_{ox}\)?
3. Raise the **fixed oxide charge** to \(+5 \times 10^{11}\ \text{cm}^{-2}\).
   Compare the solid curves with the gray dotted ones. Does the shape
   change? Check that the shift equals \(-Q_f/C_{ox}\).
4. Set the oxide charge back to zero and raise the **interface traps** to
   \(10^{12}\ \text{cm}^{-2}\text{eV}^{-1}\). How is this change different
   from the one in step 3? What happens to the minimum of the low-frequency
   curve?
5. Halve the **oxide thickness**. What happens to \(C_{ox}\), to \(V_T\),
   and to the ratio \(C_{min}/C_{ox}\)?
6. Change the **gate work function** from 4.1 eV to 5.2 eV. Which voltages
   move, and by how much?
7. Switch on **Deep depletion** and move the probe above \(V_T\). Compare
   the purple curve with the red one, and explain the difference in terms
   of the depletion width.

## The Physics Behind the Simulation

The equations are those of Sections 13.5 to 13.8.

**Oxide capacitance and Fermi potential**

\[
C_{ox} = \frac{\varepsilon_{ox}}{t_{ox}}, \qquad
\phi_F = \frac{k_BT}{q}\ln\!\left(\frac{N_A}{n_i}\right)
\]

with \(\varepsilon_{ox} = 3.9\,\varepsilon_0\) and
\(\varepsilon_s = 11.7\,\varepsilon_0\).

**Flat-band and threshold voltage**

\[
V_{FB} = \phi_{ms} - \frac{Q_f}{C_{ox}}, \qquad
V_T = V_{FB} + 2\phi_F + \frac{qN_A W_{dep,max}}{C_{ox}}, \qquad
W_{dep,max} = \sqrt{\frac{4\varepsilon_s\phi_F}{qN_A}}
\]

where \(\phi_{ms} = \phi_m - \phi_s\) and the semiconductor work function
is \(\phi_s = \chi + (E_C - E_F)/q\) with \(\chi = 4.05\) eV.

**Semiconductor charge.** The sim does not use the depletion approximation
for the curves. It uses the exact solution of Poisson's equation with
Boltzmann statistics. With \(u = q\psi_s/k_BT\):

\[
|Q_s| = \sqrt{2\varepsilon_s k_BT N_A}\;
\sqrt{\left(e^{-u} + u - 1\right) + \frac{n_i^2}{N_A^2}\left(e^{u} - u - 1\right)}
\]

The gate voltage for a given surface potential \(\psi_s\) is

\[
V_G = \phi_{ms} - \frac{Q_f}{C_{ox}} + \psi_s - \frac{Q_s(\psi_s)}{C_{ox}}
      + \frac{qD_{it}(\psi_s - \phi_F)}{C_{ox}}
\]

At \(\psi_s = 2\phi_F\) the exact charge equals \(qN_AW_{dep,max}\), so this
expression gives the chapter's \(V_T\) exactly.

**Capacitance (Section 13.8)**

\[
\frac{1}{C} = \frac{1}{C_{ox}} + \frac{1}{C_s}
\]

| Curve | Semiconductor capacitance \(C_s\) |
|-------|-----------------------------------|
| Low frequency | \(dQ_s/d\psi_s\) from the full charge, plus \(qD_{it}\) |
| High frequency | The same expression without the inversion term, evaluated at the equilibrium \(\psi_s\) and held constant above \(V_T\) |
| Deep depletion | The same expression without the inversion term, with \(\psi_s\) from a charge balance that has no inversion charge |

The high-frequency plateau of the curve is within about 1 % of the
chapter's \(C_{min}\), where
\(1/C_{min} = 1/C_{ox} + W_{dep,max}/\varepsilon_s\).

**Oxide charge and interface traps (Section 13.7)**

- Fixed charge \(Q_f\) shifts the whole curve by \(-Q_f/C_{ox}\) without
  changing its shape.
- Interface traps are modeled as a uniform density \(D_{it}\) across the
  gap. Traps above midgap are acceptor-like and traps below midgap are
  donor-like, so the trapped charge is zero when the Fermi level is at
  midgap at the surface (\(\psi_s = \phi_F\)). The trapped charge changes
  with gate voltage, which stretches the curve about that point. At low
  frequency the traps also add the capacitance \(qD_{it}\) in parallel
  with \(C_s\), which raises the minimum of the low-frequency curve.

**Worked check.** Defaults: \(t_{ox} = 10\) nm,
\(N_A = 10^{17}\ \text{cm}^{-3}\), \(\phi_m = 4.10\) eV, no oxide charge.

\[
C_{ox} = \frac{3.9 \times 8.854 \times 10^{-14}\ \text{F/cm}}{10^{-6}\ \text{cm}} = 3.45 \times 10^{-7}\ \text{F/cm}^2
\]

\[
\phi_F = 0.02585 \times \ln\!\left(\frac{10^{17}}{9.65 \times 10^{9}}\right) = 0.418\ \text{V}, \qquad
W_{dep,max} = \sqrt{\frac{4 (1.036 \times 10^{-12})(0.418)}{(1.602 \times 10^{-19})(10^{17})}} = 1.04 \times 10^{-5}\ \text{cm}
\]

The depletion charge is \(qN_AW_{dep,max} = 1.66 \times 10^{-7}\ \text{C/cm}^2\),
which is 0.482 V across the oxide. The semiconductor work function is
\(4.05 + 1.130 - 0.02585\ln(3.10 \times 10^{19}/10^{17}) = 5.031\) eV, so
\(\phi_{ms} = 4.10 - 5.031 = -0.931\) V. Then

\[
V_{FB} = -0.931\ \text{V}, \qquad V_T = -0.931 + 0.835 + 0.482 = +0.386\ \text{V}
\]

\[
\frac{C_{min}}{C_{ox}} = \frac{1}{1 + C_{ox}W_{dep,max}/\varepsilon_s} = \frac{1}{1 + 3.46} = 0.224
\]

These are the values in the readout strip.

### Simplifications and Limitations

- **Classical, non-degenerate model.** For oxides thinner than about 3 nm,
  real devices show quantum confinement in the inversion layer, depletion
  of a polysilicon gate, and gate tunneling current. All three lower the
  measured capacitance in inversion and accumulation. They are not
  modeled, so the thin-oxide curves are idealized.
- **High-frequency curve.** The curve is the usual approximation in which
  the inversion charge is fixed and the depletion width stops at its
  threshold value. The exact high-frequency curve differs by a few
  percent near threshold.
- **Interface traps** are uniform in energy and respond fully at low
  frequency and not at all at high frequency. Real trap densities vary
  across the gap and respond over a range of frequencies.
- **Fixed charge** is placed at the silicon interface. Mobile and
  oxide-trapped charge are not modeled separately. For a C-V curve they
  act like fixed charge weighted by their position in the oxide.
- **Bandgap.** \(E_g = 1.130\) eV is used, the value that is consistent
  with \(n_i = 9.65 \times 10^9\ \text{cm}^{-3}\) and the chapter's
  \(N_C\) and \(N_V\) at 300 K, as in the other MicroSims of this book.
- **Band diagram.** The oxide is not drawn to scale in thickness. Its
  conduction band edge is drawn 3.1 eV above the silicon conduction band
  edge. The band bending in accumulation is a sketch.
- **Controls added to the chapter specification.** The probe voltage and
  the gate work function sliders are not in the control list of the
  specification. The probe is needed for the band diagram, and the work
  function is named in the specification's description.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) the accumulation, depletion, and inversion
  regions from the shape of a C-V curve,
- extract (Apply, L3) \(V_{FB}\), \(V_T\), \(t_{ox}\), and \(N_A\) from a
  C-V curve, and
- diagnose (Analyze, L4) fixed charge and interface traps from a parallel
  shift or a stretch-out of the curve.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 20 minutes.

**Prerequisites:** Band bending and the depletion approximation
(Chapter 11); the MOS bias regimes, flat-band voltage, and threshold
voltage (Sections 13.5 and 13.6).

### Suggested Sequence

1. **Regions (4 min):** Students sweep the probe and match each region of
   the curve to the band diagram.
2. **Extraction (6 min):** The instructor sets an oxide thickness and a
   doping without showing the sliders. From \(C_{ox}\) students find
   \(t_{ox}\), and from \(C_{min}/C_{ox}\) they find \(W_{dep,max}\) and
   estimate \(N_A\).
3. **Diagnosis (6 min):** The instructor sets either a fixed charge or an
   interface trap density. Students decide which one from the gray dotted
   reference curve, and estimate its size.
4. **Frequency (4 min):** Students explain why the two curves differ only
   in inversion, and what the deep-depletion curve adds.

### Assessment Questions

1. A C-V curve is shifted 0.3 V to the left of the ideal curve with no
   change of shape, for \(C_{ox} = 3.45 \times 10^{-7}\ \text{F/cm}^2\).
   What is the fixed charge density?
   *(\(Q_f/q = 0.3 \times 3.45 \times 10^{-7} / 1.602 \times 10^{-19}
   = 6.5 \times 10^{11}\ \text{cm}^{-2}\), positive.)*
2. Why does the high-frequency capacitance stay at \(C_{min}\) above
   threshold?
   *(The inversion charge cannot follow the signal. The depletion width
   has stopped growing, so the small-signal charge is still supplied at
   the depletion edge.)*
3. What does a larger \(C_{min}/C_{ox}\) tell you if the oxide thickness is
   unchanged?
   *(A narrower maximum depletion width, that is, heavier substrate
   doping.)*

## References

- [Chapter 13: Metal-Semiconductor Contacts and MOS Physics](../../chapters/13-metal-semiconductor-mos/index.md) —
  MOS bias regimes, flat-band and threshold voltage, oxide charges, and
  C-V characteristics
- E. H. Nicollian and J. R. Brews, *MOS (Metal Oxide Semiconductor)
  Physics and Technology*, Wiley, 1982.
- S. M. Sze and K. K. Ng, *Physics of Semiconductor Devices*, 3rd ed.,
  Wiley, 2007, Chapter 4.
- [Capacitance–voltage profiling (Wikipedia)](https://en.wikipedia.org/wiki/Capacitance%E2%80%93voltage_profiling)
- [Threshold voltage (Wikipedia)](https://en.wikipedia.org/wiki/Threshold_voltage)
