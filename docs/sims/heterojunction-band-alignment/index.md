---
title: Heterojunction Band Alignment Visualizer
description: Choose two semiconductors and see their band edges lined up on a common vacuum level. The sim works out the conduction and valence band offsets with Anderson's rule and tells you whether the junction is Type I, Type II, or Type III.
image: /sims/heterojunction-band-alignment/heterojunction-band-alignment.png
og:image: /sims/heterojunction-band-alignment/heterojunction-band-alignment.png
twitter:image: /sims/heterojunction-band-alignment/heterojunction-band-alignment.png
social:
   cards: false
---

# Heterojunction Band Alignment Visualizer

<iframe src="main.html" width="100%" height="634" scrolling="no"></iframe>

[Run the Heterojunction Band Alignment Visualizer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/heterojunction-band-alignment/main.html"
        width="100%" height="634" scrolling="no"></iframe>
```

## Description

A heterojunction joins two different semiconductors. How their band edges
line up decides where the electrons and holes go. This MicroSim shows the
alignment for any pair of materials in the menus.

- The **left panel** shows the two materials before contact, drawn on a
  common vacuum level. Each block shows the electron affinity \(\chi\)
  (vacuum level down to \(E_C\)), the bandgap \(E_g\), and the Fermi level
  for the chosen doping type. The colored arrows between the blocks are
  the conduction band offset \(\Delta E_C\) and the valence band offset
  \(\Delta E_V\).
- The **right panel** sketches the same pair after contact. The Fermi
  level is flat, the bands bend near the interface, and the two offsets
  stay as vertical steps at the interface. Dots mark an interface where a
  band edge reaches the Fermi level and carriers collect.
- The **panel under the diagrams** names the alignment type, shows the
  Anderson's rule arithmetic with the numbers for the chosen pair, and
  says where the electrons and holes collect.

Material A is on the left and material B is on the right.

Controls:

- **Material A** and **Material B** choose from Si, Ge, GaAs,
  Al\(_x\)Ga\(_{1-x}\)As, InAs, InP, GaSb, GaN, and CdTe.
- The menu next to each material sets its **doping type** (n or p).
- **AlGaAs aluminum fraction x** runs from 0 (GaAs) to 1 (AlAs). It is
  active when either material is AlGaAs.
- **Show vacuum level reference** draws the vacuum level and the electron
  affinity arrows. Clear it to zoom in on the band edges.

## Things to Try

1. **Predict first.** The default is p-GaAs against
   n-Al\(_{0.3}\)Ga\(_{0.7}\)As. Before reading the panel, decide which
   material holds the electrons and which holds the holes.
2. Move the aluminum fraction from 0 to 1. Both offsets grow with x at
   first. What happens to \(\Delta E_C\) above x = 0.45, and why?
3. Choose **InAs** and **GaSb**. Read the type and find the energy by
   which the InAs conduction band lies below the GaSb valence band.
4. Choose **Si** and **Ge**, then **GaN** and **Si**. Work out both offsets
   by hand from the \(\chi\) and \(E_g\) values in the left panel, then
   compare with the panel.
5. Set A to n-AlGaAs (x = 0.3) and B to n-GaAs. Look at the right panel.
   On which side of the interface do electrons collect? This is the
   channel of a HEMT.
6. Switch the doping types and watch the right panel. Which quantities
   change, and which do not?

## The Physics Behind the Simulation

**Anderson's rule (Section 12.6.1)** assumes that the vacuum level is
continuous across the interface. The band offsets then follow from the
electron affinities and bandgaps:

\[
\Delta E_C = \chi_A - \chi_B, \qquad
\Delta E_V = (E_{g,B} - E_{g,A}) - \Delta E_C
\]

so that \(\Delta E_C + \Delta E_V = \Delta E_g\). With this sign
convention a positive \(\Delta E_C\) means that the conduction band edge
of B is higher than that of A, and a positive \(\Delta E_V\) means that
the valence band edge of B is lower than that of A.

**Alignment types (Section 12.6.2)**

| Type | Name | Condition | Where the carriers go |
|------|------|-----------|-----------------------|
| I | Straddling gap | One gap lies entirely inside the other (\(\Delta E_C\) and \(\Delta E_V\) have the same sign) | Electrons and holes both in the narrower-gap material |
| II | Staggered gap | Both band edges step in the same direction, and the gaps still overlap | Electrons in one material, holes in the other |
| III | Broken gap | \(E_C\) of one material lies below \(E_V\) of the other | Electrons transfer from the valence band of one material to the conduction band of the other |

**Material data (300 K)**

| Material | \(E_g\) (eV) | \(\chi\) (eV) | Gap |
|----------|-------------|---------------|-----|
| Si | 1.12 | 4.05 | indirect |
| Ge | 0.66 | 4.00 | indirect |
| GaAs | 1.42 | 4.07 | direct |
| InAs | 0.36 | 4.90 | direct |
| InP | 1.35 | 4.38 | direct |
| GaSb | 0.72 | 4.06 | direct |
| GaN (wurtzite) | 3.40 | 4.10 | direct |
| CdTe | 1.50 | 4.28 | direct |

The bandgaps are the values used elsewhere in this book. The electron
affinities are commonly tabulated values. Published electron affinities
for a given material differ by 0.1 eV or more between sources, because
\(\chi\) is a surface property that depends on orientation and surface
preparation.

**Al\(_x\)Ga\(_{1-x}\)As** is handled differently, because Section 12.6.1
gives measured offsets for it:

- Bandgap: \(E_g = 1.424 + 1.247x\) eV for \(x < 0.45\) (direct), and
  \(E_g = 1.900 + 0.125x + 0.143x^2\) eV for \(x \ge 0.45\) (indirect).
  This is the standard empirical fit (Casey and Panish; Adachi 1985).
- Valence band offset to GaAs: \(0.33 \times 1.247x\) eV for all \(x\).
  For \(x < 0.45\) this gives the chapter's 67:33 split,
  \(\Delta E_C = 0.67\,\Delta E_g\) and \(\Delta E_V = 0.33\,\Delta E_g\).
- The \(\chi\) shown for AlGaAs is the **effective** value that reproduces
  these offsets on a common vacuum level,
  \(\chi(x) = 4.07 - [E_g(x) - 1.424 - 0.411x]\) eV. It is not a measured
  surface electron affinity.

**Worked checks**

- GaAs / Al\(_{0.3}\)Ga\(_{0.7}\)As: \(\Delta E_g = 1.247 \times 0.3 = 0.374\) eV,
  \(\Delta E_C = 0.67 \times 0.374 = 0.25\) eV, and
  \(\Delta E_V = 0.33 \times 0.374 = 0.12\) eV. Both are positive, so the
  junction is Type I. These are the values in Section 12.6.1.
- InAs / GaSb: \(\Delta E_C = 4.90 - 4.06 = +0.84\) eV and
  \(\Delta E_V = (0.72 - 0.36) - 0.84 = -0.48\) eV. The InAs conduction
  band edge is at \(-4.90\) eV and the GaSb valence band edge is at
  \(-4.06 - 0.72 = -4.78\) eV, so \(E_C\) of InAs lies 0.12 eV below
  \(E_V\) of GaSb. The junction is Type III. The measured overlap is about
  0.15 eV.

**The right panel is a sketch.** It is built from three rules that hold in
any heterojunction: the Fermi level is flat in equilibrium, the vacuum
level is continuous, and the offsets are fixed at the interface. The total
band bending is the difference between the two work functions,
\(qV_{bi} = |\phi_B - \phi_A|\). Two things are schematic. The Fermi level
is placed 0.10 eV from the majority band edge on each side instead of
being computed from a doping concentration. The bending is split equally
between the two sides and drawn over a fixed width. In a real junction the
split depends on the doping and permittivity of each side.

### Simplifications and Limitations

- **Anderson's rule is a first estimate.** It ignores interface dipoles,
  strain, and interface chemistry. Measured offsets can differ from it by
  a few tenths of an eV, and for some pairs the predicted type is wrong.
  GaAs/Ge is a known example: with the electron affinities above, the rule
  gives a slightly staggered alignment, while photoemission measurements
  give a valence band offset of about 0.5 eV, which makes the junction
  Type I.
- **Lattice mismatch is ignored.** Many of the pairs in the menus cannot
  be grown on each other without strain or defects. The sim shows only the
  band lineup.
- **Materials left out.** The chapter specification also lists AlN and
  ZnO. They are not in the menus because their published electron
  affinities differ too much between sources (for AlN by more than 1 eV)
  to give a meaningful Anderson's rule result. AlAs is included as the
  x = 1 end of the AlGaAs alloy. GaSb was added so that the standard
  Type III example, InAs/GaSb, can be shown.
- **Bandgaps are 300 K values** and do not change with doping.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) Type I, Type II, and Type III alignment from a
  band diagram,
- calculate (Apply, L3) the band offsets of a heterojunction with
  Anderson's rule, and
- predict (Analyze, L4) where electrons and holes are confined for a given
  pair of materials.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 15 minutes.

**Prerequisites:** Energy band diagrams and the Fermi level (Chapters 5 to
7); the p-n junction in equilibrium (Chapter 11); electron affinity and
work function (Section 12.6.1).

### Suggested Sequence

1. **Read the diagram (3 min):** With the default pair, students name each
   arrow in the left panel and state what the two offsets add up to.
2. **Calculate (5 min):** Students compute \(\Delta E_C\) and \(\Delta E_V\)
   for Si/Ge and InP/InAs by hand, classify each junction, then check.
3. **Classify (4 min):** Students find one pair of each type in the menus
   and record where the electrons and holes collect.
4. **Design question (3 min):** A quantum-well laser needs both carriers in
   the same thin layer. Which type is required? Which of the pairs found
   in step 3 could serve, and what else would have to be true of the two
   materials?

### Assessment Questions

1. For a Type I junction, why do both carriers collect in the narrower-gap
   material?
   *(Electrons lower their energy by moving to the lower \(E_C\), and holes
   lower their energy by moving to the higher \(E_V\). In Type I both of
   those are in the same material.)*
2. \(\chi_A = 4.38\) eV, \(E_{g,A} = 1.35\) eV, \(\chi_B = 4.90\) eV,
   \(E_{g,B} = 0.36\) eV. Find the offsets and the type.
   *(\(\Delta E_C = -0.52\) eV, \(\Delta E_V = -0.47\) eV, Type I, with
   both carriers in B.)*
3. Changing the doping type moves the Fermi level and the band bending in
   the right panel. Why does it not change the offsets?
   *(The offsets are set by the electron affinities and bandgaps, which are
   properties of the two materials, not of the doping.)*

## References

- [Chapter 12: P-N Junction: Dynamics, Breakdown, and Heterojunctions](../../chapters/12-pn-junction-dynamics/index.md) —
  electron affinity, Anderson's rule, and the three alignment types
- R. L. Anderson, "Experiments on Ge-GaAs heterojunctions," *Solid-State
  Electronics*, vol. 5, pp. 341–351, 1962.
- S. Adachi, "GaAs, AlAs, and Al\(_x\)Ga\(_{1-x}\)As: Material parameters
  for use in research and device applications," *Journal of Applied
  Physics*, vol. 58, pp. R1–R29, 1985.
- H. Kroemer, "Nobel Lecture: Quasielectric fields and band offsets:
  teaching electrons new tricks," *Reviews of Modern Physics*, vol. 73,
  pp. 783–793, 2001.
- [Ioffe Institute: New Semiconductor Materials, Characteristics and Properties](https://www.ioffe.ru/SVA/NSM/Semicond/) —
  bandgaps and electron affinities of the group IV and III-V materials
- [Heterojunction (Wikipedia)](https://en.wikipedia.org/wiki/Heterojunction)
- [Anderson's rule (Wikipedia)](https://en.wikipedia.org/wiki/Anderson%27s_rule)
