---
title: Velocity-Field Relationship Explorer
description: Log-log plot of drift velocity against electric field for electrons and holes in silicon, GaAs, and germanium. See the linear regime, the transition, and velocity saturation, with the low-field tangent, the critical field, and a sketch of how the carrier energy distribution heats up.
image: /sims/velocity-field-explorer/velocity-field-explorer.png
og:image: /sims/velocity-field-explorer/velocity-field-explorer.png
twitter:image: /sims/velocity-field-explorer/velocity-field-explorer.png
social:
   cards: false
---

# Velocity-Field Relationship Explorer

<iframe src="main.html" width="100%" height="634" scrolling="no"></iframe>

[Run the Velocity-Field Relationship Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/velocity-field-explorer/main.html"
        width="100%" height="634" scrolling="no"></iframe>
```

## Description

At low electric field, drift velocity is proportional to the field:
\(v_d = \mu_0 \mathcal{E}\). At high field it stops rising and settles at the
saturation velocity \(v_{\text{sat}}\). This MicroSim plots the whole curve
on log-log axes, from \(10^2\) to \(10^6\) V/cm.

- The **thick curve** is the selected carrier. The **thin curve** is the
  other carrier type in the same material, for comparison.
- The shaded bands mark the **linear**, **transition**, and **saturation**
  regimes. The boundaries are drawn at \(0.3\,\mathcal{E}_c\) and
  \(3\,\mathcal{E}_c\), where \(\mathcal{E}_c = v_{\text{sat}}/\mu_0\) is the
  critical field.
- The gray dashed line is the **low-field tangent** \(v = \mu_0\mathcal{E}\).
  The orange dashed lines mark \(v_{\text{sat}}\) and the **critical field**.
  Together they form the two-piece linear model of Section 8.5.
- The **panel** lists \(\mu_0\), \(v_{\text{sat}}\), and \(\mathcal{E}_c\),
  then the drift velocity at the selected field from the smooth model and
  from the two-piece model.
- The **inset** sketches the carrier energy distribution: a Maxwellian at the
  lattice temperature (gray) and a hotter Maxwellian for the carriers (red).
  The green line marks the optical phonon energy.

Controls:

- **Material** (Si, GaAs, Ge) and **Carrier** (electrons, holes).
- **Temperature** from 200 K to 400 K. It acts on silicon only. GaAs and Ge
  are shown at 300 K and the slider is grayed out.
- **Electric field** moves the probe point from 100 V/cm to 316 kV/cm.
- Two checkboxes show or hide the critical field marker and the tangent
  line.

## Things to Try

1. **Predict first.** For silicon electrons at 300 K, estimate the critical
   field from \(v_{\text{sat}}/\mu_0\) before reading it from the panel.
2. Set the field to 1 kV/cm, then 10 kV/cm, then 100 kV/cm. At each, compare
   the smooth-model velocity with the two-piece model. Where is the two-piece
   model worst, and by how much?
3. A MOSFET has 0.8 V across a 10 nm channel. Work out the average field and
   place the probe there. Which regime is the device in?
4. Raise the temperature from 200 K to 400 K with the probe at 1 kV/cm, then
   again at 100 kV/cm. Which changes more with temperature, the low-field
   velocity or the saturated velocity?
5. Select **GaAs electrons**. The velocity rises to a peak and then *falls*
   as the field increases. Compare the low-field slope and the high-field
   velocity with silicon.
6. Watch the inset as you raise the field. At what field does a noticeable
   share of the carriers exceed the optical phonon energy?

## The Physics Behind the Simulation

**Silicon, germanium, and GaAs holes** use the empirical expression of
Section 8.5 (the Caughey–Thomas form):

\[
v_d(\mathcal{E}) = \frac{\mu_0 \mathcal{E}}{\left[1 + \left(\mathcal{E}/\mathcal{E}_c\right)^{\beta}\right]^{1/\beta}},
\qquad \mathcal{E}_c = \frac{v_{\text{sat}}}{\mu_0}
\]

with \(\beta = 2\) for electrons and \(\beta = 1\) for holes.

**GaAs electrons** use an empirical transferred-electron expression. Above a
few kV/cm, electrons gain enough energy to scatter from the light central
valley into heavy satellite valleys, so the average velocity drops:

\[
v_d(\mathcal{E}) = \frac{\mu_0 \mathcal{E} + v_{\text{sat}}\,(\mathcal{E}/\mathcal{E}_0)^4}{1 + (\mathcal{E}/\mathcal{E}_0)^4},
\qquad \mathcal{E}_0 = 4\ \text{kV/cm}
\]

**The two-piece linear model** is \(v_d = \mu_0\mathcal{E}\) for
\(\mathcal{E} < \mathcal{E}_c\) and \(v_d = v_{\text{sat}}\) above it.

| Material | Carrier | \(\mu_0\) (cm²/V·s) | \(v_{\text{sat}}\) (cm/s) | \(\beta\) |
|----------|---------|--------------------|--------------------------|-----------|
| Si | electrons | 1400 | \(1.07 \times 10^{7}\) | 2 |
| Si | holes | 450 | \(8.4 \times 10^{6}\) | 1 |
| GaAs | electrons | 8500 | \(\approx 8 \times 10^{6}\) | transferred-electron form |
| GaAs | holes | 400 | \(\approx 1 \times 10^{7}\) | 1 |
| Ge | electrons | 3900 | \(6 \times 10^{6}\) | 2 |
| Ge | holes | 1900 | \(6 \times 10^{6}\) | 1 |

**Silicon temperature dependence.** The low-field mobility follows the
chapter's power laws, \(\mu_n \propto T^{-2.42}\) and
\(\mu_p \propto T^{-2.20}\). The saturation velocity follows the fit of
Canali et al. (1975), \(v_{\text{sat},n} \propto T^{-0.87}\) and
\(v_{\text{sat},p} \propto T^{-0.52}\).

**Inset.** The carrier temperature comes from a simple energy balance: the
power a carrier takes from the field, \(q v_d \mathcal{E}\), equals the rate
at which it loses its excess energy to the lattice over an energy relaxation
time \(\tau_E\):

\[
T_e = T + \frac{2}{3}\,\frac{q\,v_d\,\mathcal{E}\,\tau_E}{k_B}, \qquad \tau_E = 0.3\ \text{ps}
\]

**Worked check.** Silicon electrons at 300 K:
\(\mathcal{E}_c = 1.07 \times 10^{7}/1400 = 7.64\) kV/cm. At
\(\mathcal{E} = 10\) kV/cm,

\[
v_d = \frac{1400 \times 10^{4}}{\sqrt{1 + (10/7.64)^2}}
    = \frac{1.4 \times 10^{7}}{1.647} = 8.5 \times 10^{6}\ \text{cm/s}
\]

The two-piece model gives \(1.07 \times 10^{7}\) cm/s, which is 26 % too
high. The energy balance gives
\(T_e = 300 + \tfrac{2}{3}(0.0255\ \text{eV})/k_B \approx 497\) K.

### Simplifications and Limitations

- **Critical field.** The chapter rounds \(v_{\text{sat}}\) to
  \(10^{7}\) cm/s and quotes \(\mathcal{E}_c \approx 7100\) V/cm. The sim
  uses \(1.07 \times 10^{7}\) cm/s, which gives 7640 V/cm.
- **GaAs electrons.** Section 8.5 lists the \(\beta = 1\) saturating form as
  "GaAs-type". Measured GaAs curves have a velocity peak followed by negative
  differential mobility (the basis of the Gunn effect), so the sim uses the
  transferred-electron expression instead. The high-field velocity
  \(8 \times 10^{6}\) cm/s is a representative value; published values range
  from about 0.6 to \(1.0 \times 10^{7}\) cm/s.
- **Approximate entries.** The GaAs hole saturation velocity is approximate.
  For germanium and for GaAs holes the exponent \(\beta\) is assumed to be
  the same as in silicon. The low-field mobilities and the germanium
  saturation velocity are standard handbook values.
- **Temperature.** Only silicon has a temperature model here. The slider is
  disabled for GaAs and Ge because the sim has no saturation-velocity fit for
  them.
- **Inset.** The heated Maxwellian is a sketch. Real hot-carrier
  distributions are not Maxwellian, the single value \(\tau_E = 0.3\) ps is
  an order-of-magnitude figure for silicon electrons applied to every case,
  and the estimate is least meaningful for GaAs electrons, which divide
  between two kinds of valley.
- Velocity overshoot in very short channels and impact ionization at the
  highest fields are not modeled.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) the linear, transition, and saturated regimes of
  a velocity-field curve,
- calculate (Apply, L3) the drift velocity at a given field with the
  two-piece linear model and compare it with the smooth model, and
- explain (Analyze, L4) why short-channel MOSFETs operate in velocity
  saturation.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 10–15 minutes.

**Prerequisites:** Drift velocity and low-field mobility (Sections 8.1–8.2);
optical phonon scattering (Section 8.3.1).

### Suggested Sequence

1. **Warm-up (2 min):** With the defaults, have students point to the part of
   the curve where \(v_d = \mu_0\mathcal{E}\) holds and the part where it
   does not.
2. **Two-piece calculation (5 min):** Students compute \(v_d\) with the
   two-piece model at 2, 7.64, and 50 kV/cm, then read the smooth-model
   values and tabulate the error.
3. **Device connection (4 min):** Students compute the average channel field
   for three gate lengths (1 µm, 100 nm, 10 nm) at 1 V and place each on the
   curve.
4. **Wrap-up (3 min):** Use the inset to discuss where the energy goes once
   the velocity stops rising.

### Assessment Questions

1. Calculate the drift velocity of electrons in silicon at 2 kV/cm using the
   two-piece model. Is the answer trustworthy there?
   *(\(1400 \times 2000 = 2.8 \times 10^{6}\) cm/s. Yes: the field is well
   below \(\mathcal{E}_c\), and the smooth model gives
   \(2.7 \times 10^{6}\) cm/s.)*
2. Why does drive current in a 10 nm MOSFET scale with \(v_{\text{sat}}\)
   rather than with mobility?
   *(The channel field is about ten times \(\mathcal{E}_c\), so carriers move
   at \(v_{\text{sat}}\) over most of the channel whatever the low-field
   mobility is.)*
3. What physical process holds the velocity at \(v_{\text{sat}}\)?
   *(Carriers that gain more than the optical phonon energy emit optical
   phonons, which removes energy and randomizes momentum as fast as the field
   supplies them.)*

## References

- [Chapter 8: Carrier Drift and Mobility](../../chapters/08-carrier-drift-mobility/index.md) —
  Section 8.5, high-field transport, velocity saturation, and hot carriers
- D. M. Caughey and R. E. Thomas, "Carrier mobilities in silicon empirically
  related to doping and field," *Proceedings of the IEEE*, vol. 55,
  pp. 2192–2193, 1967.
- C. Canali, G. Majni, R. Minder, and G. Ottaviani, "Electron and hole drift
  velocity measurements in silicon and their empirical relation to electric
  field and temperature," *IEEE Transactions on Electron Devices*,
  vol. ED-22, pp. 1045–1047, 1975.
- S. M. Sze and K. K. Ng, *Physics of Semiconductor Devices*, 3rd ed., Wiley,
  2007 (velocity-field curves and transferred-electron devices).
- [Saturation velocity (Wikipedia)](https://en.wikipedia.org/wiki/Saturation_velocity)
- [Gunn diode (Wikipedia)](https://en.wikipedia.org/wiki/Gunn_diode)
