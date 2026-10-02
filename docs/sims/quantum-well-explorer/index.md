---
title: Quantum Well Energy Level Explorer
description: Bound states of a finite square quantum well. The MicroSim solves for the energy levels and wavefunctions, compares them with the infinite-well formula, and shows the staircase density of states of the well beside the square-root density of states of the bulk material.
image: /sims/quantum-well-explorer/quantum-well-explorer.png
og:image: /sims/quantum-well-explorer/quantum-well-explorer.png
twitter:image: /sims/quantum-well-explorer/quantum-well-explorer.png
social:
   cards: false
---

# Quantum Well Energy Level Explorer

<iframe src="main.html" width="100%" height="568" scrolling="no"></iframe>

[Run the Quantum Well Energy Level Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/quantum-well-explorer/main.html"
        width="100%" height="568" scrolling="no"></iframe>
```

## Description

A quantum well is a thin layer of a narrow-gap semiconductor between two
layers with a wider gap. An electron in the well is confined in the growth
direction \(z\), and its energy for motion in that direction takes only
certain values. This MicroSim finds those values for a well of finite
depth.

- The **left plot** shows the conduction band edge against position
  (black line). The colored horizontal lines are the bound energy levels,
  measured from the band edge of the well material. On each level sits its
  wavefunction, which extends a short way into the barriers. The dotted
  lines are the levels of an infinitely deep well of the same width.
- The **right plot** shows the density of states on the same energy axis.
  The blue staircase is the quantum well: it has one step at each level.
  The dashed gray curve is the bulk well material, which starts at the
  band edge and rises as the square root of the energy.
- The **table** lists each level for this well and for the infinite well,
  and the fraction of the probability that lies in the barriers. The
  right-hand column gives the effective masses and the height of one step
  of the staircase.

Controls:

- **Material**: GaAs / AlGaAs, InGaAs / InP, or GaN / AlGaN. The choice
  sets the effective masses in the well and in the barriers.
- **Show wavefunctions** draws \(\psi_n(z)\) on each of the first four
  levels. **as |ψ|²** draws the probability density instead.
- **Well width** \(L_z\): 1 to 20 nm.
- **Band offset** \(\Delta E_C\): the depth of the well, 0.10 to 0.50 eV.
- **Reset** restores the defaults: GaAs / AlGaAs, 10 nm, 0.25 eV.

## Things to Try

1. **Predict first.** Halve the well width from 10 nm to 5 nm. Before you
   do, predict what happens to \(E_1\) from the infinite-well formula.
   Does the finite well follow the prediction?
2. Compare the two energy columns of the table. Which is always lower?
   Explain this with the wavefunction: how does spreading into the
   barriers change the wavelength inside the well?
3. Narrow the well to 1 nm. What happens to the level, and where is the
   electron most of the time?
4. Widen the well until a new level appears. Read the "in barriers"
   column for the new level. Why is a level near the top of the well so
   weakly confined?
5. Switch the material to InGaAs / InP at the same width and depth. Why do
   the levels rise?
6. Look at the right plot. At what energy does the quantum well have its
   first states, and at what energy does the bulk material? Which of the
   two has more states just above its first allowed energy?
7. Use your answer to step 6 to explain why a quantum well laser reaches
   threshold at a lower current density than a bulk laser
   (Section 19.3.2).

## The Physics Behind the Simulation

**Finite well.** Inside the well the wavefunction is a cosine (even
states, \(n = 1, 3, \ldots\)) or a sine (odd states, \(n = 2, 4,
\ldots\)). In the barriers it decays as \(e^{-\kappa |z|}\). Matching
\(\psi\) and \((1/m^*)\,d\psi/dz\) at the well edges gives

\[
\frac{k}{m_w}\tan\!\left(\frac{kL_z}{2}\right) = \frac{\kappa}{m_b}
\quad\text{(even)}, \qquad
-\frac{k}{m_w}\cot\!\left(\frac{kL_z}{2}\right) = \frac{\kappa}{m_b}
\quad\text{(odd)}
\]

\[
k = \frac{\sqrt{2m_w E}}{\hbar}, \qquad
\kappa = \frac{\sqrt{2m_b(\Delta E_C - E)}}{\hbar}
\]

With equal masses the even condition reduces to the form in
Section 19.3.1. The sim solves each equation by bisection. A well always
has at least one bound state, and the number of bound states is the
smallest integer not less than
\(\sqrt{2m_w \Delta E_C}\,L_z/(\pi\hbar)\).

**Infinite well.**

\[
E_n = \frac{n^2\pi^2\hbar^2}{2m_w L_z^2}
= \frac{0.376\ \text{eV·nm}^2}{(m_w/m_0)\,L_z^2}\,n^2
\]

The levels of the finite well always lie below these values, because the
wavefunction spreads into the barriers and its wavelength in the well is
longer.

**Density of states.** Each level is the bottom of a subband: the
electron still moves freely in the plane of the well. Each subband adds a
constant \(m_w/\pi\hbar^2\) per unit area and energy. Divided by the well
width it can be compared with the bulk value:

\[
g_{QW}(E) = \frac{m_w}{\pi\hbar^2 L_z} \times (\text{number of levels below } E), \qquad
g_{bulk}(E) = \frac{1}{2\pi^2}\left(\frac{2m_w}{\hbar^2}\right)^{3/2}\sqrt{E}
\]

The staircase is drawn up to the top of the well. Above it the electron is
not confined.

**Effective masses**

| System | Well | \(m_w/m_0\) | Barrier | \(m_b/m_0\) | Typical \(\Delta E_C\) |
|--------|------|------|---------|------|------|
| GaAs / AlGaAs | GaAs | 0.067 | Al₀.₃Ga₀.₇As | 0.092 | about 0.25 eV (Section 19.3.1) |
| InGaAs / InP | In₀.₅₃Ga₀.₄₇As | 0.041 | InP | 0.080 | about 0.25 eV |
| GaN / AlGaN | GaN | 0.20 | Al₀.₂₅Ga₀.₇₅N | 0.23 | roughly 0.3 to 0.4 eV |

The GaAs value is the one in the chapter. The AlGaAs value is
\((0.067 + 0.083x)\,m_0\) for \(x = 0.3\). The other masses are
commonly tabulated room-temperature values. The band offset is set by the
slider and does not change when the material is switched.

**Worked check.** GaAs / AlGaAs, \(L_z = 10\) nm,
\(\Delta E_C = 0.25\) eV. Infinite well:

\[
E_1 = \frac{0.376}{0.067 \times 10^2} = 0.0561\ \text{eV} = 56.1\ \text{meV}, \qquad E_2 = 4E_1 = 224\ \text{meV}
\]

which are the values in Section 19.3.1. The sim gives
\(E_1 = 30.5\) meV for the finite well. Substituting it back:
\(k = \sqrt{0.067 \times 0.03054/0.0381} = 0.2317\ \text{nm}^{-1}\),
\(kL_z/2 = 1.159\) rad, and
\((k/m_w)\tan(kL_z/2) = 3.459 \times 2.288 = 7.91\ \text{nm}^{-1}\).
On the other side
\(\kappa = \sqrt{0.092 \times 0.2195/0.0381} = 0.728\ \text{nm}^{-1}\) and
\(\kappa/m_b = 7.91\ \text{nm}^{-1}\). The two sides agree.

The number of bound states is the smallest integer not less than
\(\sqrt{250/56.1} = 2.11\), which is 3. The sim shows three levels: 30.5,
120, and 244 meV. The third lies just below the top of the well, and 61 %
of its probability is in the barriers. The infinite-well formula would
put only two levels below 250 meV.

**Worked check, density of states.**
\(m_0/\pi\hbar^2 = 4.18 \times 10^{14}\ \text{cm}^{-2}\,\text{eV}^{-1}\),
so for GaAs one step is
\(0.067 \times 4.18 \times 10^{14} = 2.80 \times 10^{13}\ \text{cm}^{-2}\,\text{eV}^{-1}\).
Divided by \(L_z = 10^{-6}\) cm this is
\(2.80 \times 10^{19}\ \text{cm}^{-3}\,\text{eV}^{-1}\). The bulk curve has
the same value at \(E = 56.1\) meV, the first level of the infinite well.

### Simplifications and Limitations

- **Square well, flat bands.** There is no doping, no applied field, and
  no charge in the well. For **GaN / AlGaN** grown in the usual polar
  direction this is a poor assumption: the polarization field of about
  1 MV/cm tilts the well and shifts the levels. The GaN option shows the
  effect of the heavier mass only.
- **Parabolic bands.** The effective mass does not depend on energy. In
  InGaAs the mass rises with energy, so the upper levels of a narrow well
  are lower than shown.
- **One barrier mass for each system.** The barrier mass belongs to the
  composition in the table and does not follow the band offset slider.
- **Electrons only.** Holes have their own wells in the valence band,
  with heavy-hole and light-hole levels. They are not shown.
- **Wavefunction scale.** Each wavefunction is drawn with the same peak
  height for visibility. The curves are not normalized to a common area.
- **Density of states per unit volume of the well layer.** Dividing by
  \(L_z\) is a convention that allows the comparison with the bulk curve.

## Lesson Plan

**Learning objectives:** Students will be able to

- explain (Understand, L2) why confinement raises the lowest allowed
  energy above the bulk band edge,
- calculate (Apply, L3) the ground-state energy of a quantum well of given
  width and material, and
- compare (Analyze, L4) the density of states of a quantum well with that
  of the bulk material and relate the difference to the threshold of a
  quantum well laser.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 20 minutes.

**Prerequisites:** The particle in a box (Chapter 4), effective mass and
the density of states (Chapter 5), and heterojunction band offsets
(Chapter 12).

### Suggested Sequence

1. **Infinite well by hand (4 min):** Students compute \(E_1\) for a
   10 nm and a 5 nm GaAs well and compare with the "infinite well" column.
2. **Finite well (6 min):** Students tabulate the finite-well \(E_1\) and
   the barrier fraction for widths of 20, 10, 5, and 2 nm. They describe
   when the infinite-well formula is a good estimate.
3. **Material (4 min):** Students compare the three material systems at
   the same width and depth and relate the levels to the effective mass.
4. **Density of states and lasers (6 min):** Students describe the two
   curves of the right plot in words and connect the step at \(E_1\) to
   the gain of a quantum well laser.

### Assessment Questions

1. Find \(E_1\) of an infinite well of width 8 nm in GaAs.
   *(\(0.376/(0.067 \times 64) = 0.0877\) eV, or 88 meV.)*
2. Why is the ground-state energy of a finite well lower than that of an
   infinite well of the same width?
   *(The wavefunction extends into the barriers, so its wavelength inside
   the well is longer, the wave vector is smaller, and the kinetic energy
   is lower.)*
3. A 10 nm well in In₀.₅₃Ga₀.₄₇As has a higher \(E_1\) than a 10 nm well
   in GaAs. Why?
   *(The electron effective mass is smaller, 0.041 against 0.067, and the
   confinement energy is inversely proportional to the mass.)*
4. The lowest states of a bulk semiconductor are at the band edge, where
   the density of states is zero. How does a quantum well differ, and why
   does it help a laser?
   *(The density of states of the well jumps to its full step value at
   \(E_1\). Injected carriers are concentrated in a narrow range of
   energy, so fewer carriers are needed to reach the gain that equals the
   loss.)*

## References

- [Chapter 19: III-V/II-VI Semiconductors, Quantum Nanostructures, and HEMTs](../../chapters/19-compound-semiconductors-quantum/index.md) —
  quantum well energy levels, subbands, and the two-dimensional density
  of states
- [Particle in a Box — Energy Level Explorer](../particle-in-a-box-explorer/index.md) —
  the infinite well
- [Dimensionality and Density of States Explorer](../density-of-states-explorer/index.md) —
  the density of states in three, two, one, and zero dimensions
- [LED Efficiency and Laser Threshold Explorer](../led-laser-efficiency-explorer/index.md) —
  the threshold of a quantum well laser
- I. Vurgaftman, J. R. Meyer, and L. R. Ram-Mohan, "Band parameters for
  III-V compound semiconductors and their alloys," *Journal of Applied
  Physics* 89, 5815 (2001).
- J. H. Davies, *The Physics of Low-Dimensional Semiconductors*, Cambridge
  University Press, 1998.
- [Quantum well (Wikipedia)](https://en.wikipedia.org/wiki/Quantum_well)
- [Finite potential well (Wikipedia)](https://en.wikipedia.org/wiki/Finite_potential_well)
