---
title: Crystal Lattice Structure and Symmetry
description: Develops the crystallographic framework for semiconductor materials, covering lattice types, cubic structures, diamond and zincblende geometries, Miller indices, reciprocal lattice, and diffraction.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 13:54:22
version: 0.08
---

# Crystal Lattice Structure and Symmetry

## Summary

This chapter develops the crystallographic framework needed to describe semiconductor materials at the atomic scale. Starting from the concept of a crystal lattice and its associated unit cells, students progress through the cubic crystal families and the diamond and zincblende structures that define silicon, germanium, and most III-V semiconductors. The chapter introduces Miller indices for planes and directions, develops the reciprocal lattice and first Brillouin zone essential for band theory, and covers X-ray and electron diffraction as experimental probes of crystal structure. Covalent bonding in semiconductors is introduced here as the origin of the diamond structure.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Crystal Lattice
2. Unit Cell
3. Primitive Cell
4. Basis Vectors
5. Simple Cubic Structure
6. Face-Centered Cubic Structure
7. Body-Centered Cubic Structure
8. Diamond Cubic Structure
9. Zincblende Structure
10. Wurtzite Structure
11. Miller Indices
12. Crystal Planes
13. Crystal Directions
14. Reciprocal Lattice
15. First Brillouin Zone
16. Wigner-Seitz Cell
17. Lattice Constant
18. Lattice Mismatch
19. Bragg Diffraction Law
20. X-Ray Diffraction
21. Electron Diffraction
22. Covalent Bonding in Semiconductors

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../01-intro-semiconductors/index.md)

---

!!! mascot-welcome "Let's get *crystal* clear on this!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Chapter 2! Crystallography: the field where every atom knows exactly where it belongs and stays there for geological time scales. Must be nice. By the end of this chapter you will understand the geometric scaffolding of every semiconductor we care about — from the humble silicon atom sitting smugly in its diamond cubic lattice to the exotic wurtzite structure of GaN holding up the LED in your phone. Grab your pencil. Miller indices are coming and they refuse to be intuitive on first contact. Let's get excited anyway!

## The Crystal Lattice: Geometry at the Atomic Scale

A **crystal** is a solid in which atoms are arranged in a pattern that repeats periodically in three dimensions — an arrangement so regular that, in principle, knowing the positions of atoms in one small volume tells you the positions of every atom in the entire macroscopic solid. This periodicity is not merely aesthetic; it is the physical foundation of nearly everything computed in Chapter 1. The bandgap, the carrier effective masses, the optical selection rules — all arise from the translational symmetry of the crystal lattice.

A **crystal lattice** (or Bravais lattice) is the mathematical abstraction underlying this periodicity: an infinite, regular array of points in space, each point having an identical environment. A lattice is not a collection of atoms — it is a geometric skeleton. Atoms (or groups of atoms) are attached to lattice points according to a rule called the **basis**, producing the actual crystal structure. The distinction between lattice and basis is crucial: two crystals can share the same lattice yet have completely different properties because they differ in their bases.

Every lattice point \(\mathbf{R}\) can be reached from the origin by an integer combination of three fundamental translation vectors:

\[
\mathbf{R} = n_1 \mathbf{a}_1 + n_2 \mathbf{a}_2 + n_3 \mathbf{a}_3, \quad n_1, n_2, n_3 \in \mathbb{Z}
\]

The vectors \(\mathbf{a}_1\), \(\mathbf{a}_2\), \(\mathbf{a}_3\) are the **basis vectors** (also called primitive translation vectors). They define the fundamental step sizes and angles of the lattice. The magnitude \(a = |\mathbf{a}_1|\) for a cubic lattice is the **lattice constant**, typically reported in angstroms (Å) or nanometers: silicon's lattice constant is 5.431 Å = 0.5431 nm at room temperature.

## Unit Cells and Primitive Cells

A **unit cell** is any volume of space that, when translated by all lattice vectors, tiles all of space without gaps or overlaps. Unit cells are not unique — infinitely many valid choices exist for any lattice. In practice, two conventions are common.

The **conventional unit cell** is chosen for visual simplicity and symmetry, often containing more than one lattice point. For cubic lattices, the conventional cell is always a cube — easy to draw and easy to index. The **primitive cell** is the smallest possible unit cell, containing exactly one lattice point (or one formula unit of the basis). The primitive cell has volume \(V_p = |\mathbf{a}_1 \cdot (\mathbf{a}_2 \times \mathbf{a}_3)|\).

A particularly elegant primitive cell construction — used extensively in band theory — is the **Wigner-Seitz cell**: the region of space closer to a given lattice point than to any other. It is constructed by drawing perpendicular bisecting planes between a central point and all its neighbors, then taking the smallest enclosed volume. The Wigner-Seitz cell has the full rotational symmetry of the lattice and is the natural choice for visualizing the neighborhood of each atom. Its reciprocal-space analog — the first Brillouin zone — is discussed later in this chapter.

## Covalent Bonding: Why Semiconductors Choose Their Structures

Before surveying the cubic crystal families, we need to understand why silicon and its relatives prefer the structures they do rather than the densest possible packing. The answer is **covalent bonding**.

In covalent bonding, electrons are shared between atoms in directed, localized bonds. Silicon, germanium, and the Group III-V compounds all have four valence electrons per atom available for bonding. Through **sp³ hybridization** — a quantum mechanical mixing of one s orbital and three p orbitals — each atom forms four equivalent bond orbitals pointing toward the corners of a regular tetrahedron, separated by angles of 109.47°. This tetrahedral coordination is rigid and directional: each silicon atom bonds to exactly four neighbors arranged tetrahedrally, and this geometry propagates throughout the crystal to produce the diamond cubic structure.

Ionic bonding (NaCl structure) and metallic bonding (FCC or HCP close-packed) optimize for different constraints — electrostatic attraction or electron delocalization — and produce much higher coordination numbers (6–12 nearest neighbors). Covalently bonded semiconductors accept lower packing efficiency in exchange for the directed bond angles demanded by sp³ hybridization. The result is a coordination number of 4 and an atomic packing fraction of only 34% — less than half the theoretical maximum of 74% for close-packed spheres. Semiconductors sacrifice density for direction, and direction is exactly what gives them their extraordinary electrical properties.

## The Cubic Crystal Families

Three Bravais lattices have cubic symmetry, meaning all three basis vectors are equal in length and mutually perpendicular: \(|\mathbf{a}_1| = |\mathbf{a}_2| = |\mathbf{a}_3| = a\), all angles 90°. Before comparing them, two definitions are useful. The **coordination number** is the number of nearest neighbors touching each atom. The **atomic packing fraction (APF)** is the fraction of the unit cell volume occupied by hard-sphere atomic models:

\[
\text{APF} = \frac{N_{\text{atoms}} \cdot \frac{4}{3}\pi r^3}{a^3}
\]

where \(r\) is the atomic radius (maximized by assuming atoms just touch along the closest-packed direction). The following table summarizes all three cubic structures:

| Structure | Atoms/Cell | Coordination # | APF | Nearest-Neighbor Dist. | Semiconductor Relevance |
|---|---|---|---|---|---|
| Simple cubic (SC) | 1 | 6 | 52% | \(a\) | None — only Po adopts this |
| Body-centered cubic (BCC) | 2 | 8 | 68% | \(a\sqrt{3}/2\) | Reciprocal lattice of FCC |
| Face-centered cubic (FCC) | 4 | 12 | 74% | \(a/\sqrt{2}\) | Parent lattice of diamond, zincblende |

**Simple cubic:** Atoms at cube corners only. One atom per conventional cell. Only polonium adopts SC at room temperature — the structure is mechanically marginalized because each atom has just 6 neighbors and large voids between them. Silicon has no interest in polonium's lifestyle.

**Body-centered cubic:** Atoms at cube corners plus one at the cube center. Two atoms per cell. Common among transition metals and alkali metals; no common semiconductors adopt BCC in real space, but the BCC lattice reappears as the reciprocal lattice of FCC — an ironic cameo in k-space.

**Face-centered cubic:** Atoms at cube corners plus one at each face center. Four atoms per cell (8 × 1/8 + 6 × 1/2 = 4). FCC achieves the densest sphere packing (74%) and is the parent lattice for virtually every semiconductor crystal structure.

!!! mascot-thinking "Why do semiconductors use FCC? Because atoms are efficiency maximalists — up to a point."
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova thinking">
    FCC packs spheres as tightly as geometry allows. If atoms were billiard balls with no directional preferences, everything would be FCC or HCP. But silicon atoms have strong tetrahedral bond preferences baked in by sp³ hybridization. So silicon takes the FCC lattice and then *adds a second FCC lattice* shifted by one-quarter of the body diagonal, creating the diamond structure. The result is a crystal with FCC regularity but silicon's preferred 109.47° bond angle. Elegant quantum-level engineering — or, as Feynman would say, nature finding the one path that makes all the others cancel out.

The following MicroSim lets you rotate and compare all three cubic structures plus diamond cubic and zincblende, visualizing the atomic positions and bonds interactively.

#### Diagram: Cubic Crystal Structure Explorer


<iframe src="../../sims/cubic-crystal-structure-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Cubic Crystal Structure Explorer Fullscreen](../../sims/cubic-crystal-structure-explorer<br/>/main.html)


<iframe src="../../sims/cubic-crystal-structure-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Cubic Crystal Structure Explorer Fullscreen](../../sims/cubic-crystal-structure-explorer<br/>/main.html)

<details markdown="1">
<summary>Cubic Crystal Structure Explorer</summary>
Type: MicroSim
**sim-id:** cubic-crystal-structure-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will identify atomic positions in SC, BCC, FCC, and diamond cubic structures and calculate atoms per unit cell (Remember/Apply, L1/L3) by manipulating an interactive 3D-perspective model.

**Canvas size:** 900 × 550 px, responsive — call updateCanvasSize() first in setup().

**Controls (p5.js built-in):**
- Select dropdown: Structure — "Simple Cubic (SC)", "Body-Centered Cubic (BCC)", "Face-Centered Cubic (FCC)", "Diamond Cubic", "Zincblende (GaAs)". Default: "Face-Centered Cubic (FCC)".
- Slider: Rotation angle φ 0–360°, default 30°. Label: "Rotate (°):"
- Slider: Tilt θ 10–80°, default 35°. Label: "Tilt (°):"
- Checkbox: "Show bonds" (default checked).
- Checkbox: "Show unit cell outline" (default checked).

**Visual layout:**

Left panel (65%): 3D isometric perspective projection of one conventional unit cell, drawn with p5.js manual 3D→2D projection (no WebGL). Use rotation/tilt sliders to update the viewing angle each frame.

Atom rendering:
- Corner atoms: draw as full circles with radius scaled by perspective, color light blue (#90caf9). Eight corners, each contributing 1/8 atom.
- Face-center atoms (FCC, diamond): light blue, radius × 0.85 (slightly smaller to indicate partial inclusion, though drawn fully).
- BCC body-center atom: green (#a5d6a7), full size.
- Diamond second sublattice atoms: orange (#ffb74d) at positions (¼,¼,¼), (¾,¾,¼), (¾,¼,¾), (¼,¾,¾) in fractional coordinates.
- Zincblende: first sublattice atoms orange (Ga), second sublattice purple (#7b1fa2) (As).

Draw bond lines between nearest-neighbor pairs if "Show bonds" checked.
Draw cube outline in dark gray if "Show unit cell outline" checked.

Right panel (35%): Information card showing:
- Structure name (bold, large).
- "Atoms per unit cell: N"
- "Coordination number: N"
- "APF: XX%"
- "Nearest-neighbor distance: X·a"
- "Semiconductor examples:" with 2–3 materials.

**Behavior:**
- Selecting a new structure immediately redraws.
- Hover over an atom: highlight yellow, tooltip shows fractional coordinates.
- Sliders update projection in real time.

**Implementation:** p5.js, single self-contained HTML file. Manual perspective projection via 3D rotation matrices. Parent canvas to document.querySelector('main').
</details>

## Diamond Cubic and Zincblende: The Semiconductor Structures

The **diamond cubic structure** is the crystal structure of silicon, germanium, diamond (carbon), and gray tin. It consists of two interpenetrating FCC sublattices, offset from each other by \(\frac{a}{4}(1,1,1)\) — a displacement of one-quarter of the body diagonal. The conventional cubic cell (side \(a\)) contains 8 atoms: 4 from each FCC sublattice. Every atom has exactly 4 nearest neighbors arranged tetrahedrally, with bond length \(d = a\sqrt{3}/4\). For silicon (\(a = 5.431\) Å), the Si-Si bond length is 2.352 Å.

The **zincblende structure** (also called sphalerite) is geometrically identical to diamond cubic, except the two FCC sublattices are occupied by different atomic species. In gallium arsenide, one sublattice is all Ga and the other is all As. The resulting structure lacks inversion symmetry (unlike diamond, which has it), giving rise to **piezoelectric** and **pyroelectric** behavior exploited in GaN-based RF devices. GaAs, InP, InAs, AlAs, CdTe, and ZnS all adopt zincblende at ambient conditions.

The **wurtzite structure** is the hexagonal counterpart of zincblende: two interpenetrating hexagonal close-packed (HCP) sublattices offset along the hexagonal c-axis. GaN, AlN, and ZnO prefer wurtzite at ambient conditions. The reduced symmetry of wurtzite produces a large spontaneous polarization along the c-axis and strong piezoelectric constants — critical for the two-dimensional electron gas (2DEG) in AlGaN/GaN HEMT structures used in power electronics and 5G base stations.

| Structure | Parent Lattice | Atoms/Cell | Inversion Symmetry | Key Materials |
|---|---|---|---|---|
| Diamond cubic | 2× FCC, 1 species | 8 | Yes | Si, Ge, C |
| Zincblende | 2× FCC, 2 species | 8 | No | GaAs, InP, ZnS, CdTe |
| Wurtzite | 2× HCP, 2 species | 4 | No | GaN, AlN, ZnO |

## Miller Indices: Labeling Planes and Directions

To communicate unambiguously about crystal planes and directions, crystallographers use **Miller indices** — a three-integer notation derived from the axis intercepts of a plane. The procedure for finding the Miller indices \((hkl)\) of a plane:

1. Find where the plane intersects each crystallographic axis, expressed as multiples of the lattice constants. If the plane is parallel to an axis, the intercept is ∞.
2. Take the reciprocals of the intercepts.
3. Multiply through by the smallest integer that clears all fractions to reach integers \(h\), \(k\), \(l\).

For example, a plane intersecting axes at \(a\), \(2b\), ∞ has intercepts 1, 2, ∞; reciprocals \(1, \frac{1}{2}, 0\); multiplied by 2: Miller indices \((210)\). Negative intercepts use an overbar: \((\bar{1}00)\).

Notation conventions for cubic systems:

- \((hkl)\): a specific plane (or its parallel family).
- \(\{hkl\}\): all crystallographically equivalent planes (the family). \(\{100\}\) in a cube includes all six face planes.
- \([hkl]\): a specific direction. In cubic systems only, \([hkl] \perp (hkl)\).
- \(\langle hkl \rangle\): all equivalent directions.

Several planes matter enormously in device processing:

| Plane/Direction | Semiconductor Significance |
|---|---|
| (100) | Standard Si CMOS wafer surface; cleaves poorly |
| (110) | GaAs natural cleavage plane; yields laser facets |
| (111) | Original bipolar transistor surface; III-V epitaxy |
| \([111]\) | Direction of diamond sublattice offset: \(\frac{a}{4}[111]\) |
| \(\langle 110\rangle\) | Highest hole mobility direction in strained Si |

!!! mascot-tip "Miller index trap: parallel planes give index 0, not infinity"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Nova giving a tip">
    When a plane is *parallel* to an axis, it never intersects that axis — intercept is ∞, reciprocal is 0. So the (100) plane is parallel to y and z (indices 0, 0) and intersects x at one lattice unit (index 1). Where students reliably stumble: they write the intercept as 0 ("it doesn't cross, so zero"), then attempt to take 1/0 and summon mathematical chaos. Remember: take the *reciprocal* of the intercept first. Parallel → intercept ∞ → reciprocal 0. Once that clicks, Miller indices are just integer arithmetic dressed in fancy notation.

#### Diagram: Miller Indices Crystal Plane Explorer


<iframe src="../../sims/miller-indices-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Miller Indices Crystal Plane Explorer Fullscreen](../../sims/miller-indices-explorer<br/>/main.html)


<iframe src="../../sims/miller-indices-explorer<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Miller Indices Crystal Plane Explorer Fullscreen](../../sims/miller-indices-explorer<br/>/main.html)

<details markdown="1">
<summary>Miller Indices Crystal Plane Explorer</summary>
Type: MicroSim
**sim-id:** miller-indices-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will calculate Miller indices from axis intercepts and identify the corresponding crystal plane orientation in a 3D cubic cell (Apply, L3).

**Canvas size:** 850 × 520 px, responsive.

**Controls (p5.js built-in):**
- Three sliders: h (−3 to 3, default 1), k (−3 to 3, default 0), l (−3 to 3, default 0). Labels: "h:", "k:", "l:".
- Button: "Render Plane".
- Select dropdown: Preset planes — "Custom", "(100)", "(110)", "(111)", "(200)", "(210)", "(211)", "(010)", "(001)". Selecting preset snaps sliders.

**Visual layout:**

Left panel (60%): Isometric 3D view of a 2×2×2 simple cubic supercell. Draw atoms as small gray circles at integer coordinate positions. Draw the selected (hkl) plane as a translucent blue polygon (alpha ≈ 0.4) clipping through the supercell. Highlight atoms on or near the plane in orange. Draw crystallographic axes (x, y, z) in red, green, blue with labels. Mark axis intercepts with filled triangle markers.

Right panel (40%): Step-by-step calculation display:
- "Intercepts on a, b, c axes: X, Y, Z"
- "Reciprocals: 1/X, 1/Y, 1/Z"
- "Miller indices: (h k l)"
- "Plane family {hkl} has N equivalent planes in cubic symmetry."
- "Interplanar spacing: d = a / √(h²+k²+l²) = X.XX Å (Si)"

**Behavior:**
- Any slider change immediately re-renders the plane.
- If h=k=l=0, display error: "Invalid: (000) is not a Miller index."
- Hover over an atom shows its (fractional) coordinates.

**Implementation:** p5.js, single HTML file. Compute plane polygon from intercepts analytically. Parent canvas to document.querySelector('main').
</details>

## The Reciprocal Lattice and First Brillouin Zone

The **reciprocal lattice** is a construct in momentum space (k-space) that is as fundamental to solid-state physics as the direct lattice is to crystallography. It is defined by three reciprocal basis vectors derived from the direct lattice basis vectors:

\[
\mathbf{b}_1 = 2\pi \frac{\mathbf{a}_2 \times \mathbf{a}_3}{\mathbf{a}_1 \cdot (\mathbf{a}_2 \times \mathbf{a}_3)}, \quad \mathbf{b}_2 = 2\pi \frac{\mathbf{a}_3 \times \mathbf{a}_1}{\mathbf{a}_1 \cdot (\mathbf{a}_2 \times \mathbf{a}_3)}, \quad \mathbf{b}_3 = 2\pi \frac{\mathbf{a}_1 \times \mathbf{a}_2}{\mathbf{a}_1 \cdot (\mathbf{a}_2 \times \mathbf{a}_3)}
\]

By construction, \(\mathbf{a}_i \cdot \mathbf{b}_j = 2\pi \delta_{ij}\). For a simple cubic lattice with constant \(a\), the reciprocal lattice is also simple cubic with constant \(2\pi/a\). For the FCC lattice underlying silicon, the reciprocal lattice is BCC — an elegant duality.

The **first Brillouin zone** is the Wigner-Seitz cell of the reciprocal lattice — the set of k-space points closer to the origin than to any other reciprocal lattice point. For silicon's FCC lattice, the first Brillouin zone is a **truncated octahedron**: 8 hexagonal faces from \(\{111\}\) reciprocal lattice planes and 6 square faces from \(\{200\}\) planes. Its high-symmetry points have standard labels:

- **Γ**: zone center, \(\mathbf{k} = 0\). Valence band maximum in silicon.
- **X**: zone boundary along \(\langle 100\rangle\). Near-CBM location in silicon.
- **L**: zone boundary along \(\langle 111\rangle\). CBM in germanium.
- **K, W, U**: additional high-symmetry points on zone boundary edges.

Every distinct electron wavevector \(\mathbf{k}\) in a crystal is contained within the first Brillouin zone (or can be folded back into it by adding a reciprocal lattice vector). The E-k band structure diagrams from Chapter 1, and derived rigorously in Chapter 5, are computed along paths connecting these high-symmetry points.

## Probing Crystal Structure: Diffraction

The periodic spacing of crystal planes (\(\sim\)1–5 Å) makes crystals natural diffraction gratings for radiation of comparable wavelength. **Bragg's law** states the condition for constructive interference:

\[
n\lambda = 2d_{hkl}\sin\theta
\]

where \(\lambda\) is the radiation wavelength, \(d_{hkl}\) is the interplanar spacing for the \((hkl)\) family, \(\theta\) is the Bragg angle (measured from the plane surface, not the normal), and \(n\) is a positive integer. For cubic lattices, the interplanar spacing formula is:

\[
d_{hkl} = \frac{a}{\sqrt{h^2 + k^2 + l^2}}
\]

Measuring diffraction peak positions allows reconstruction of \(a\) to sub-0.001 Å precision. Measuring peak widths reveals crystallite size (Scherrer equation) and lattice strain.

**X-ray diffraction (XRD)** uses photons with wavelengths 0.5–2.5 Å, most commonly Cu Kα radiation (\(\lambda = 1.5406\) Å). XRD scatters from electron density, making it sensitive to atomic number. In semiconductor manufacturing, high-resolution XRD (HRXRD) rocking curves characterize epitaxial layer composition and strain with sensitivity below 0.01% in lattice mismatch. A narrow rocking curve width (arcseconds) indicates high crystalline perfection; broadening reveals defects.

**Electron diffraction** uses electrons accelerated through voltage \(V\), with de Broglie wavelength \(\lambda = h/\sqrt{2m_e eV}\) — approximately 0.037 Å at 100 kV, far smaller than interplanar spacings and producing very small Bragg angles. Electrons interact far more strongly with matter than X-rays do, so electron diffraction works from films nanometers thick. **RHEED** (reflection high-energy electron diffraction) monitors MBE growth surfaces in real time; oscillations in RHEED intensity count individual monolayers as they deposit, providing direct control over quantum well thicknesses.

!!! mascot-warning "Lattice mismatch is the crystal's version of wearing shoes two sizes too small"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova cautioning">
    When you grow one semiconductor epitaxially on another with a different lattice constant, the deposited layer can elastically strain to match the substrate — compressing in-plane and expanding out-of-plane (or vice versa). This is **pseudomorphic growth** and is often intentional (strained Si channels, InGaAs quantum wells). But pseudomorphic growth is only stable up to a **critical thickness** beyond which the elastic strain energy exceeds the energy cost of forming a misfit dislocation. Once dislocations nucleate, they propagate and multiply, degrading mobility, recombination lifetime, and LED efficiency. Check the mismatch *before* designing your heterostructure. The table below has your numbers.

**Lattice mismatch** \(f = (a_{\text{epi}} - a_{\text{sub}}) / a_{\text{sub}} \times 100\%\) between common semiconductor pairs:

| Material Pair | Mismatch (%) | Practical Consequence |
|---|---|---|
| Si / Ge | +4.2% | Requires graded SiGe buffer; strained Ge channels |
| GaAs / AlAs | +0.1% | Near lattice-matched; used freely in heterostructures |
| GaAs / InAs | +7.2% | Quantum dot self-assembly via Stranski-Krastanov mode |
| GaAs / Si | +4.1% | Dislocations without buffer; active research topic |
| InP / In₀.₅₃Ga₀.₄₇As | ~0% | Lattice-matched telecom material system |
| GaN / AlN | +2.4% | Intentional strain for 2DEG formation in HEMTs |

#### Diagram: Semiconductor Lattice Constant and Bandgap Map


<iframe src="../../sims/lattice-bandgap-map<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Semiconductor Lattice Constant and Bandgap Map Fullscreen](../../sims/lattice-bandgap-map<br/>/main.html)


<iframe src="../../sims/lattice-bandgap-map<br/>/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Semiconductor Lattice Constant and Bandgap Map Fullscreen](../../sims/lattice-bandgap-map<br/>/main.html)

<details markdown="1">
<summary>Semiconductor Lattice Constant and Bandgap Map</summary>
Type: MicroSim
**sim-id:** lattice-bandgap-map<br/>
**Library:** Chart.js<br/>
**Status:** Specified

**Learning objective:** Students will compare lattice constants and bandgaps of common semiconductors and evaluate (Evaluate, L5) lattice mismatch implications for heterostructure design.

**Canvas size:** 780 × 500 px, responsive.

**Chart type:** Scatter plot (Chart.js Scatter). Each semiconductor is a labeled data point.

**Dataset:** Plot the following (lattice constant in Å on x-axis, bandgap in eV on y-axis):
- Si: (5.431, 1.12), Ge: (5.658, 0.66), GaAs: (5.653, 1.42), AlAs: (5.661, 2.16), InP: (5.869, 1.35), InAs: (6.058, 0.36), GaP: (5.451, 2.26), AlP: (5.467, 2.45), InSb: (6.479, 0.17), GaSb: (6.096, 0.72).
- Color direct-gap materials green (#4caf50), indirect-gap red (#f44336).
- Draw curved interpolation lines between ternary alloy endpoints (e.g., GaAs-AlAs in gray, InAs-GaAs in orange) labeled with the alloy name.

**Interaction:**
- Clicking or hovering a data point displays an infobox: material name, lattice constant, bandgap, gap type (direct/indirect), and key applications.
- A vertical reference line at x = 5.431 Å (Si) is toggleable via a "Show Si reference" checkbox.
- A vertical reference line at x = 5.869 Å (InP) is toggleable via "Show InP reference" checkbox.

**Implementation:** Chart.js v4, single HTML file. Custom tooltip callbacks for rich infoboxes. Parent canvas to document.querySelector('main').
</details>

## Key Takeaways

This chapter established the geometric and crystallographic language that recurs throughout the course:

- A **crystal lattice** is an infinite, periodic array of points; the physical crystal is the lattice plus a **basis** of atoms. The **lattice constant** \(a\) is the fundamental atomic-scale length.
- The three cubic Bravais lattices — SC, BCC, FCC — differ in atoms per cell, coordination number, and packing fraction; FCC (APF = 74%) is the parent lattice for semiconductor crystal structures.
- **Covalent sp³ bonding** forces tetrahedral coordination and produces the **diamond cubic structure** (Si, Ge) and **zincblende structure** (GaAs, InP), each with 8 atoms per conventional cell. **Wurtzite** (GaN, AlN) is the hexagonal equivalent with important spontaneous polarization properties.
- **Miller indices** \((hkl)\) label crystal planes by the reciprocals of axis intercepts; \([hkl]\) labels directions; curly and angle brackets denote equivalent families.
- The **reciprocal lattice** lives in k-space; its Wigner-Seitz cell is the **first Brillouin zone**. For FCC silicon, this is a truncated octahedron with labeled high-symmetry points Γ, X, L.
- **Bragg's law** (\(n\lambda = 2d_{hkl}\sin\theta\)) governs diffraction from crystal planes; XRD and RHEED measure lattice constants, strain, and crystal quality.
- **Lattice mismatch** must be engineered carefully; mismatches beyond a critical thickness nucleate misfit dislocations that degrade mobility, lifetime, and light-emission efficiency.

!!! mascot-celebration "That's a crystal-clear win!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    You now speak fluent crystallography. Lattice? Understood. Miller indices? Indexed. Reciprocal lattice? Reciprocated. You know why silicon is diamond cubic, why GaAs is zincblende, why GaN is wurtzite, and why you measure lattice mismatch *before* designing a heterostructure rather than after discovering your device doesn't work. That is a legitimately impressive crystallographic toolkit. Chapter 3 awaits — and it's all about what happens when perfect crystals develop interesting imperfections.
