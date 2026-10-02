---
title: Hall Effect Measurement Simulator
description: Top view of a silicon Hall bar carrying a current in a perpendicular magnetic field. Watch the carriers pushed toward one face, read the Hall voltage, and extract the carrier type, carrier concentration, and Hall mobility. Switch between n-type and p-type or flip the field to see the sign change.
image: /sims/hall-effect-simulator/hall-effect-simulator.png
og:image: /sims/hall-effect-simulator/hall-effect-simulator.png
twitter:image: /sims/hall-effect-simulator/hall-effect-simulator.png
social:
   cards: false
---

# Hall Effect Measurement Simulator

<iframe src="main.html" width="100%" height="572" scrolling="no"></iframe>

[Run the Hall Effect Measurement Simulator Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/hall-effect-simulator/main.html"
        width="100%" height="572" scrolling="no"></iframe>
```

## Description

This MicroSim is a virtual Hall measurement on a silicon bar, seen from
above. The current \(I\) flows from left to right (\(+x\)). The magnetic
field is perpendicular to the page: a dot in a circle means out of the page
(\(+z\)), and a cross in a circle means into the page (\(-z\)). The voltmeter
across the width of the bar reads the Hall voltage.

- **Small dots** are the mobile carriers: electrons (blue) in n-type material
  and holes (red) in p-type material. Press **Start** to see them drift.
  Electrons drift against the current, and holes drift with it.
- The **large carrier** in the middle carries three arrows: its drift
  velocity \(v_d\), the magnetic force \(F_B\), and the Hall-field force
  \(F_E\). In steady state the two forces cancel.
- The **plus and minus signs** along the long faces show the charge that has
  built up. More signs mean a larger Hall voltage.
- The **text box** under the bar says in words what the current settings
  show.
- The **panel** on the right works through the measurement: the measured
  \(V_H\) and \(V_x\), then the Hall coefficient, carrier type, carrier
  concentration, resistivity, and Hall mobility extracted from them.

Controls:

- **N-type / P-type** switches the carrier type.
- **Flip B direction** reverses the magnetic field.
- **Carrier concentration** (\(10^{14}\) to \(10^{17}\ \text{cm}^{-3}\)),
  **Magnetic field** (0 to 1 T), and **Applied current** (1 to 10 mA).
- **Start / Pause** runs the carrier animation. The readouts update whether
  or not the animation is running.

## Things to Try

1. **Predict first.** With n-type material and the field out of the page,
   toward which face are the electrons pushed? Use
   \(\mathbf{F} = q\,\mathbf{v} \times \mathbf{B}\), remembering that both
   \(q\) and \(\mathbf{v}\) are reversed for electrons. Then check.
2. Switch to **P-type** without changing anything else. The carriers are
   pushed toward the *same* face as before, but the Hall voltage changes
   sign. Explain why.
3. Press **Flip B direction**. What changes and what does not?
4. Raise the carrier concentration by a factor of ten. What happens to
   \(V_H\)? Why are lightly doped samples easier to measure?
5. Double the current, then double the field. Confirm that \(V_H\) is
   proportional to both and that \(R_H\) does not change.
6. Cover the panel, read \(V_H\) from the voltmeter, and calculate the
   carrier concentration yourself from \(n = IB/(q\,t\,|V_H|)\).

## The Physics Behind the Simulation

A carrier moving with drift velocity \(\mathbf{v}_d\) in a magnetic field
feels the force \(\mathbf{F} = q\,\mathbf{v}_d \times \mathbf{B}\). For a
current along \(+x\) and a field along \(+z\), this force points toward the
\(-y\) face for holes (positive charge moving along \(+x\)) and also for
electrons (negative charge moving along \(-x\)). Both carrier types are
pushed toward the same face. What differs is the sign of the charge that
collects there, and that sets the sign of the Hall voltage.

Charge builds up until the transverse Hall field balances the magnetic force:

\[
q\,\mathcal{E}_H = q\,v_d\,B
\]

With \(I = q\,n\,v_d\,W\,t\), the Hall voltage across the width \(W\) is

\[
|V_H| = \mathcal{E}_H W = \frac{I B}{q\,n\,t}
\]

and the quantities extracted from the measurement are

\[
R_H = \frac{V_H\,t}{I\,B} = -\frac{1}{qn}\ \text{(n-type)} \quad \text{or} \quad +\frac{1}{qp}\ \text{(p-type)}
\]

\[
\rho = \frac{V_x\,W\,t}{I\,L}, \qquad \mu_H = \frac{|R_H|}{\rho}
\]

**Sign convention.** The voltmeter reads
\(V_H = V(-y\ \text{face}) - V(+y\ \text{face})\), that is, bottom minus top.
With this choice \(R_H = V_H t/(IB)\) comes out negative for n-type and
positive for p-type when \(B\) is counted positive along \(+z\), in
agreement with Section 9.5.

| Parameter | Value |
|-----------|-------|
| Bar length \(L\) between contacts | 6 mm |
| Bar width \(W\) | 2 mm |
| Bar thickness \(t\) | 0.5 mm |
| Temperature | 300 K |
| Drift mobility | Caughey–Thomas-form fits from Chapter 8 (electrons) and Arora et al. 1982 (holes) |

**Worked check.** N-type, \(n = 10^{15}\ \text{cm}^{-3}\), \(B = 0.5\) T,
\(I = 5\) mA, \(t = 0.5\) mm. In SI units:

\[
|V_H| = \frac{IB}{q\,n\,t}
      = \frac{(5 \times 10^{-3})(0.5)}{(1.602 \times 10^{-19})(10^{21})(5 \times 10^{-4})}
      = 31.2\ \text{mV}
\]

\[
|R_H| = \frac{1}{qn} = \frac{1}{(1.602 \times 10^{-19})(10^{15})} = 6.24 \times 10^{3}\ \text{cm}^3/\text{C}
\]

With \(\mu_n = 1310\) cm²/V·s at this doping, \(\rho = 1/(qn\mu_n) = 4.77\)
Ω·cm, so \(V_x = I\rho L/(Wt) = 1.43\) V and
\(\mu_H = |R_H|/\rho = 1310\) cm²/V·s. These are the panel values, with
\(V_H\) and \(R_H\) negative for n-type.

### Simplifications and Limitations

- **Single carrier type.** The sample has only majority carriers, fully
  ionized dopants, and no compensation. Near-intrinsic samples, where both
  electrons and holes contribute, need the two-carrier Hall formula.
- **Hall factor of one.** The sim takes \(\mu_H = \mu_{\text{drift}}\). As
  Section 9.5 notes, the measured Hall mobility is larger by the Hall factor
  \(r_H\) (between 1 and 2, depending on the scattering mechanism), and the
  concentration from \(1/(q|R_H|)\) is off by the same factor.
- **Ideal geometry.** Contacts are ideal, the bar is long enough that the end
  contacts do not short the Hall voltage, and there is no misalignment
  voltage or magnetoresistance.
- **Animation.** The dots show the steady state, in which carriers travel
  straight because the two transverse forces cancel. The brief transient
  during which charge piles up on the faces is not animated. Dot speed grows
  with the logarithm of the real drift speed, and the number of surface
  charge signs grows with the logarithm of \(|V_H|\).

## Lesson Plan

**Learning objectives:** Students will be able to

- explain (Understand, L2) why the sign of the Hall voltage depends on the
  carrier type,
- calculate (Apply, L3) the carrier concentration from Hall measurement data,
  and
- distinguish (Analyze, L4) n-type from p-type material from the sign of the
  Hall coefficient.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 15 minutes.

**Prerequisites:** Drift current and mobility (Chapter 8); resistivity
(Section 9.4); the Lorentz force from introductory physics.

### Suggested Sequence

1. **Warm-up (3 min):** With the defaults, students identify the current
   direction, the field direction, and the direction in which the electrons
   move. Press Start to confirm.
2. **Force directions (4 min):** Students work out \(q\,\mathbf{v} \times
   \mathbf{B}\) on paper for electrons and then for holes, and compare with
   the purple \(F_B\) arrow in each case.
3. **Unknown sample (5 min):** One student sets the type and concentration
   with the panel hidden. A partner reads only \(V_H\), \(V_x\), \(I\), and
   \(B\), and reports the carrier type, concentration, and mobility.
4. **Wrap-up (3 min):** Why does the Hall effect give the sign of the
   carriers when a resistance measurement cannot?

### Assessment Questions

1. For the same current and field, electrons and holes are pushed toward the
   same face. Why does the Hall voltage still change sign?
   *(The charge that collects on that face is negative in one case and
   positive in the other.)*
2. A Hall bar 0.5 mm thick carries 2 mA in a 0.4 T field and shows
   \(|V_H| = 5.0\) mV. Find the carrier concentration.
   *(\(n = IB/(q\,t\,|V_H|) = 2.0 \times 10^{15}\ \text{cm}^{-3}\).)*
3. Why is the Hall voltage of a metal so much smaller than that of a lightly
   doped semiconductor?
   *(\(V_H \propto 1/n\), and a metal has roughly \(10^{7}\) times more
   carriers per unit volume.)*

## References

- [Chapter 9: Carrier Diffusion and Transport](../../chapters/09-carrier-diffusion-transport/index.md) —
  Section 9.5, the Hall effect, and Section 9.6, the van der Pauw method
- [Carrier Mobility Explorer MicroSim](../carrier-mobility-explorer/index.md) —
  the mobility fits used for the resistivity
- [Hall effect (Wikipedia)](https://en.wikipedia.org/wiki/Hall_effect)
- [Van der Pauw method (Wikipedia)](https://en.wikipedia.org/wiki/Van_der_Pauw_method)
- E. H. Hall, "On a New Action of the Magnet on Electric Currents,"
  *American Journal of Mathematics*, vol. 2, pp. 287–292, 1879.
