---
title: Crystal Bonding, Defects, and Surfaces
description: Covers bonding mechanisms in semiconductors and the full hierarchy of crystal defects — point defects, dislocations, stacking faults, grain boundaries, and surface/interface states — and their electrical consequences.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 13:54:22
version: 0.08
---

# Crystal Bonding, Defects, and Surfaces

## Summary

Building on the crystal structure framework, this chapter examines the bonding mechanisms that hold semiconductor crystals together and the defects that inevitably arise within them. Ionic, metallic, and van der Waals bonding are contrasted with the covalent sp³ hybridization already introduced in Chapter 2. The chapter then systematically covers the full defect hierarchy — point defects (vacancies, interstitials, substitutional impurities, Frenkel, and Schottky defects), line defects (edge and screw dislocations), planar defects (stacking faults and grain boundaries), and surface/interface defects (surface states, interface states, dangling bonds) — establishing how each type affects electrical properties.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Ionic Bonding
2. Metallic Bonding
3. Van der Waals Forces
4. Hybridization SP3
5. Point Defects
6. Vacancies
7. Interstitials
8. Substitutional Impurities
9. Frenkel Defects
10. Schottky Defects
11. Dislocations
12. Edge Dislocations
13. Screw Dislocations
14. Stacking Faults
15. Grain Boundaries
16. Surface States
17. Interface States
18. Dangling Bonds

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals](../01-intro-semiconductors/index.md)
- [Chapter 2: Crystal Lattice Structure and Symmetry](../02-crystal-lattice-structure/index.md)

---

!!! mascot-welcome "Imperfection? Never heard of it. (Until now.)"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
    Welcome to the chapter where we shatter the illusion of the perfect crystal. Chapters 1 and 2 treated semiconductor lattices as flawless geometric ideals. The truth? Every real crystal is peppered with vacancies, strained by dislocations, and haunted by dangling bonds at its surfaces. But here's the twist: *controlled* imperfection is the entire point of semiconductor engineering. Without substitutional impurities, there is no doping. Without surface states, there is no Si/SiO₂ interface — and no MOSFET. Learning to manage defects is learning to manage everything. Let's get excited about imperfection!

## Bonding in Semiconductors: A Brief Survey

Before turning to defects, it is useful to contrast the four principal bonding types found in solids: ionic, metallic, van der Waals, and covalent. Understanding the nature of covalent bonding — and its sp³ manifestation in semiconductors — explains both the crystal structures of Chapter 2 and the specific defects that matter in this chapter.

**Ionic bonding** arises from the electrostatic attraction between positively and negatively charged ions formed by electron transfer. Sodium chloride (NaCl) is the canonical example: each Na⁺ is surrounded by 6 Cl⁻ ions and vice versa. Ionic bonds are non-directional (the Coulomb force acts equally in all directions), strong, and produce materials that are hard, brittle, and electrically insulating. Compound semiconductors such as GaN and AlN have significant ionic character due to electronegativity differences between their constituent atoms, contributing to their spontaneous polarization.

**Metallic bonding** occurs when valence electrons delocalize completely, forming an electron "gas" that permeates a lattice of positive ion cores. Because valence electrons are free, metals are excellent electrical conductors. Metallic bonding is non-directional and produces close-packed structures (FCC, HCP) with coordination numbers of 12. No elemental semiconductors have metallic bonding under ambient conditions, though silicon undergoes a metallic transition above ~12 GPa.

**Van der Waals forces** are weak, short-range interactions between electrically neutral atoms or molecules arising from instantaneous dipole fluctuations (London dispersion forces). They dominate bonding in noble-gas solids, molecular crystals, and — crucially — layered two-dimensional materials such as graphene, MoS₂, and h-BN. These materials are held within each layer by strong covalent bonds, but adjacent layers interact only via van der Waals forces, enabling mechanical exfoliation. Van der Waals heterostructures are a growing frontier in semiconductor research.

**Covalent bonding** in semiconductors, as introduced in Chapter 2, places each Group IV atom in four directed bonds to its nearest neighbors via sp³ hybridization. The geometry of these bonds directly determines which defects are energetically possible and how they interact with electrical carriers.

### sp³ Hybridization in Detail

In an isolated silicon atom, the ground-state configuration is [Ne] 3s² 3p², offering only two unpaired 3p electrons for bonding. To form four equivalent tetrahedral bonds, silicon promotes one 3s electron to the empty 3p orbital and hybridizes all four resulting orbitals into four equivalent **sp³ hybrid orbitals** through linear combinations:

\[
|\psi_1\rangle = \tfrac{1}{2}(|s\rangle + |p_x\rangle + |p_y\rangle + |p_z\rangle)
\]

with three analogous expressions using sign combinations that place the four lobes toward tetrahedral corners. The energy cost of promotion (~1 eV) is more than recovered by forming four strong covalent bonds rather than two weaker ones. The Si-Si bond energy is approximately 3.4 eV.

Two consequences dominate defect physics: first, the 109.47° tetrahedral bond angle is energetically enforced — any deviation introduces **bond-angle strain**. Second, each bonding orbital holds exactly two electrons; breaking a bond leaves a **dangling bond** — a half-filled sp³ orbital that acts as a localized electronic state deep in the bandgap.

## Point Defects

A **point defect** is a lattice disruption confined to a single atomic site (or a few neighboring sites). Point defects are thermodynamically unavoidable at any nonzero temperature, because the configurational entropy gained by distributing defects randomly through the crystal lowers the Gibbs free energy even when each defect costs energy to form. The equilibrium defect concentration is:

\[
n_d = N \exp\!\left(-\frac{E_f}{k_B T}\right)
\]

where \(N\) is the site density (~\(5 \times 10^{22}\) cm\(^{-3}\) for silicon) and \(E_f\) is the formation energy. At room temperature (\(k_BT \approx 0.026\) eV), a defect with \(E_f = 2\) eV has concentration ~\(10^{-11}\) cm\(^{-3}\) — effectively zero. At typical silicon processing temperatures (900–1150°C, \(k_BT \approx 0.10\)–0.12 eV), the same defect reaches concentrations of \(10^{12}\)–\(10^{14}\) cm\(^{-3}\): detectable and important.

Four point defect types are fundamental to semiconductors:

**Vacancies** are unoccupied lattice sites — a silicon atom missing from its position, leaving four dangling bonds pointing inward. The singly-negative vacancy (V⁻) in silicon has formation energy ~3.6 eV. Vacancies are mobile at elevated temperatures (migration energy ~0.45 eV in Si) and mediate dopant diffusion via the vacancy mechanism — every phosphorus or boron atom that diffuses through silicon owes its mobility partly to nearby vacancies providing a hopping mechanism.

**Interstitials** are extra atoms in off-lattice positions between regular sites. Self-interstitials in silicon have formation energies ~3.3–4.5 eV. Ion implantation — the standard technique for introducing dopants — creates interstitials in large numbers by collisional displacement of lattice atoms. The resulting **transient enhanced diffusion (TED)** of boron caused by interstitial supersaturation was a critical challenge in sub-0.25 μm transistor scaling in the 1990s.

**Substitutional impurities** are foreign atoms occupying regular lattice sites. This is the controlled version of point defects: when the foreign atom is a dopant (phosphorus in silicon for n-type, boron for p-type), the substitutional impurity is the entire engineering objective. Unintentional substitutional impurities — iron, copper, gold in silicon — introduce deep-level trap states in the midgap that act as efficient Shockley-Read-Hall recombination centers, reducing minority carrier lifetime from milliseconds to microseconds.

**Frenkel defects** are vacancy-interstitial pairs created when a lattice atom displaces itself into an interstitial position while leaving the original site vacant. The defect count within a region is preserved. Frenkel defects dominate in materials with large interstitial sites — notably silver halides (AgBr in photographic film) and in compound semiconductors where one sublattice more easily accommodates interstitials than the other.

**Schottky defects** are balanced pairs of vacancies (on both sublattices of a compound crystal) created when atoms migrate to the crystal surface. In a binary compound AB, a Schottky pair is one A-vacancy plus one B-vacancy, preserving stoichiometry. Schottky defects are the dominant intrinsic defect in many ionic crystals and in compound semiconductors grown under non-stoichiometric conditions.

!!! mascot-thinking "A vacancy is a feature, not a bug — when you put it there on purpose."
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Nova thinking">
    Here's a beautiful inversion: the same physics that makes unwanted vacancies and interstitials a headache is what makes *intentional* substitutional doping work. When you add phosphorus to silicon, you are deliberately introducing a foreign substitutional impurity that donates an electron to the conduction band. The entire transistor industry runs on controlled point defects. So when someone says "defects are bad," the complete answer is: "It depends entirely on whether you chose to put them there, and precisely where they sit in the bandgap." Semiconductor engineering is applied imperfection management. Welcome to the club.

The following table summarizes the five point defect types, their formation energies, and their electrical effects:

| Defect Type | Description | \(E_f\) in Si | Effect on Device |
|---|---|---|---|
| Vacancy (V) | Missing lattice atom; 4 dangling bonds | ~3.6 eV (V⁻) | Deep-level traps; mediates dopant diffusion |
| Self-interstitial (I) | Extra Si at off-lattice site | ~3.3–4.5 eV | Causes transient enhanced diffusion (TED) |
| Substitutional dopant | Foreign atom on lattice site | ~0 eV (P, B in Si) | Shallow donor or acceptor |
| Frenkel pair | V + nearby I, preserved stoichiometry | Moderate | Trapping in compound semiconductors |
| Schottky defect | Balanced vacancy pairs in compound | Moderate | Stoichiometry deviation; recombination |

#### Diagram: Point Defect Visualizer


<iframe src="../../sims/point-defect-visualizer/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Point Defect Visualizer Fullscreen](../../sims/point-defect-visualizer/main.html)


<iframe src="../../sims/point-defect-visualizer/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Point Defect Visualizer Fullscreen](../../sims/point-defect-visualizer/main.html)

<details markdown="1">
<summary>Point Defect Visualizer</summary>
Type: MicroSim
**sim-id:** point-defect-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective:** Students will identify the five point defect types in a crystal lattice cross-section and explain (Understand, L2) their effect on carrier behavior by clicking defect sites to reveal detailed descriptions.

**Canvas size:** 820 × 500 px, responsive — call updateCanvasSize() in setup().

**Controls (p5.js built-in):**
- Select dropdown: "Highlight defect type" — "All defects", "Vacancies only", "Interstitials only", "Substitutional impurities", "Frenkel pairs", "Schottky defects". Default: "All defects".
- Button: "Randomize positions" — redistributes defect locations randomly, keeping counts fixed.

**Visual layout:**

Left panel (65%): Top-down 2D view of a 10×10 section of a simple square lattice representing a crystal cross-section. Draw host atoms as filled light-blue circles (radius 14 px). Lattice spacing ~50 px.

Place approximately 2–3 of each defect type at random lattice or interstitial positions:
- Vacancy: empty dashed-circle outline in dark red; label "V".
- Self-interstitial: small orange circle at midpoint between lattice sites; label "I".
- Substitutional donor (P): green circle at lattice site; label "P⁺".
- Substitutional deep trap (Au): purple circle at lattice site; label "Au".
- Frenkel pair: a vacancy + nearby interstitial connected by a curved dashed arc.

Hover over any defect: highlight with yellow glow; display tooltip showing defect name, mechanism, and electrical effect.
Click any defect: open detail card in right panel.

Right panel (35%): Detail card for the clicked defect:
- Name and dimensionality (0D point defect).
- Formation mechanism.
- Charge states possible.
- Electrical impact (carrier concentration, lifetime, mobility).
- Real-world consequence (one sentence).

**Behavior:** Dropdown grays out non-selected defect types. "Randomize" regenerates positions. On resize: updateCanvasSize() reflows proportionally.

**Implementation:** p5.js, single HTML file. Use createSelect(), createButton(). Parent canvas to document.querySelector('main').
</details>

## Dislocations: Line Defects

A **dislocation** is a one-dimensional (line) defect — a disruption extending along a line through the crystal rather than confined to a single point. Dislocations were hypothesized in 1934 independently by Taylor, Orowan, and Polanyi to explain the enormous gap between the theoretical and observed yield strengths of metals (a ~1000× discrepancy), and were first imaged directly by transmission electron microscopy in the 1950s.

The fundamental parameter characterizing a dislocation is the **Burgers vector** \(\mathbf{b}\), which quantifies the magnitude and direction of the lattice distortion. It is determined by the Burgers circuit: draw a closed path around the dislocation core in a perfect reference crystal, then trace the same path around the dislocation — the vector needed to close the loop is \(\mathbf{b}\).

**Edge dislocations** consist of an extra half-plane of atoms inserted into the crystal. The dislocation line runs along the edge of this half-plane, and the Burgers vector is **perpendicular** to the dislocation line. Atoms above the half-plane are under compressive stress; atoms below are under tensile stress. This stress field extends several nanometers from the dislocation core and scatters conduction electrons and holes, reducing carrier mobility.

**Screw dislocations** arise when one part of the crystal is sheared by one lattice vector relative to the other. The resulting structure is helical: traversing a closed path around the dislocation line advances you by one lattice spacing along the line — like the thread of a screw (hence the name). The Burgers vector is **parallel** to the dislocation line. Screw dislocations are critical in crystal growth: the step at a screw dislocation provides a perpetual attachment site for incoming atoms, enabling spiral growth (Burton-Cabrera-Frank mechanism) without requiring the nucleation of new crystalline layers.

| Property | Edge Dislocation | Screw Dislocation |
|---|---|---|
| \(\mathbf{b}\) direction | ⊥ to dislocation line | ∥ to dislocation line |
| Physical picture | Extra half-plane of atoms | Helical lattice shear |
| Stress field | Mixed tensile/compressive | Shear only |
| Role in growth | Minor | Spiral growth (BCF mechanism) |
| Primary semiconductor concern | Misfit/threading dislocations | Screw components in misfit dislocations |

In semiconductor heterostructures, lattice mismatch generates **misfit dislocations** at the epitaxial interface. If the epilayer exceeds the **critical thickness** (derived by Matthews and Blakeslee from an energy balance between elastic strain and dislocation formation), misfit dislocations nucleate and generate **threading dislocations** — line defects propagating from the interface through the active device layers to the surface. Threading dislocation densities in GaN-on-sapphire are typically \(10^8\)–\(10^{10}\) cm\(^{-2}\), creating recombination centers that limit LED efficiency and reduce HEMT carrier mobility.

!!! mascot-warning "Push a dislocation too hard and it reproduces. Alarming but true."
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Nova cautioning">
    Dislocations multiply when mechanically stressed via the **Frank-Read mechanism**: a pinned dislocation segment bows outward under applied stress, wraps around its pinning points, and generates new dislocation loops. This is why exceeding the critical thickness in a strained heterostructure is not a gentle degradation — it is a cascade. A 1% exceedance above the critical thickness can lead to a 1000× increase in threading dislocation density. This is not linear. Check the critical thickness formula *before* growing your heterostructure, not after measuring your device's carrier lifetime and wondering why it's terrible.

## Planar Defects: Stacking Faults and Grain Boundaries

**Stacking faults** are two-dimensional disruptions in the normal stacking sequence of crystal planes. In an FCC crystal, close-packed \(\{111\}\) planes follow the pattern ABCABCABC…. A stacking fault is a local deviation: ABCABABC (intrinsic fault, one layer missing) or ABCABACBC (extrinsic fault, one layer inserted). Stacking faults in silicon can form during high-temperature oxidation — **oxidation-induced stacking faults (OSF)** — and were a historical yield concern in early bipolar and CMOS processing. They do not typically limit modern CMOS devices but remain a process monitoring metric.

**Grain boundaries** separate crystal grains with different orientations in polycrystalline material. They contain high densities of dangling bonds, strained bonds, and segregated impurities. Grain boundaries scatter both electrons and holes efficiently — mobility in polycrystalline silicon (poly-Si) is 10–100× lower than in single-crystal silicon — and they act as efficient recombination centers, reducing minority carrier lifetime dramatically. Thin-film transistors (TFTs) in LCD backplane circuits use poly-Si, and the grain size (typically 50–500 nm after excimer laser annealing) directly limits the achievable field-effect mobility.

#### Diagram: Crystal Defect Hierarchy Network


<iframe src="../../sims/defect-hierarchy-network/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Crystal Defect Hierarchy Network Fullscreen](../../sims/defect-hierarchy-network/main.html)


<iframe src="../../sims/defect-hierarchy-network/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Crystal Defect Hierarchy Network Fullscreen](../../sims/defect-hierarchy-network/main.html)

<details markdown="1">
<summary>Crystal Defect Hierarchy Network</summary>
Type: MicroSim
**sim-id:** defect-hierarchy-network<br/>
**Library:** vis-network<br/>
**Status:** Specified

**Learning objective:** Students will classify crystal defects by dimensionality and identify (Analyze, L4) which device parameters each defect type degrades, via a clickable hierarchical network diagram.

**Canvas size:** 800 × 500 px, responsive.

**Graph structure (vis-network):**
Root node: "Crystal Defects" — large, gray rectangle.
Level-1 nodes (dimensionality categories): "0D: Point Defects" (blue), "1D: Line Defects" (orange), "2D: Planar Defects" (green), "3D: Volume Defects" (red).
Level-2 nodes (specific types):
- Under 0D: "Vacancy", "Self-Interstitial", "Substitutional Impurity", "Frenkel Pair", "Schottky Defect"
- Under 1D: "Edge Dislocation", "Screw Dislocation"
- Under 2D: "Stacking Fault", "Grain Boundary", "Surface State", "Interface State"
- Under 3D: "Precipitate", "Void"

All level-2 nodes are clickable. Clicking opens an infobox overlay with: name, dimensionality, formation mechanism, degraded device parameters (mobility, lifetime, \(V_T\), etc.), and a real example.

Layout: hierarchical top-to-bottom. Edge arrows from root → level-1 → level-2. Edge labels: "includes".

**Implementation:** vis-network, single HTML file. Node click event → infobox rendered in right panel. Canvas parents to document.querySelector('main').
</details>

## Surface and Interface Defects

The surface of a crystal is the ultimate planar defect: the crystal simply stops. The periodic boundary conditions that produce the beautiful bulk band structure no longer apply at the surface, and every atom on the outermost plane has fewer than four bonding partners — it has unsatisfied bonds pointing outward into the vacuum. These are **dangling bonds**.

A dangling bond is a half-filled sp³ orbital. On an unreconstructed Si(100) surface, each surface atom would have two dangling bonds. In reality, adjacent surface atoms pair up and form dimers in the **Si(100)-(2×1) reconstruction**, reducing the dangling bond density by ~50% and lowering the surface energy. Residual dangling bonds at step edges and kink sites remain and act as adsorption sites for impurity atoms and as electronic traps.

**Surface states** are allowed energy levels within the semiconductor bandgap that exist at the surface due to dangling bonds and reconstructions. Their occupancy (charged or neutral) depends on their energy relative to the Fermi level. A high density of surface states **pins the Fermi level** at the surface: applied gate voltage is absorbed by charging or discharging surface states rather than modulating the band bending. Fermi level pinning at metal-semiconductor contacts determines the Schottky barrier height and explains why measured barrier heights often differ from the Schottky-Mott prediction based on work function differences alone.

**Interface states** (\(D_{it}\), units: cm\(^{-2}\)·eV\(^{-1}\)) are the analog at the semiconductor-dielectric boundary. The thermally oxidized Si/SiO₂ interface achieves \(D_{it} < 10^{10}\) cm\(^{-2}\)·eV\(^{-1}\) — fewer than 1 interface trap per \(10^5\) surface atoms — through the formation of a nearly perfect SiO₂ glass that satisfies nearly all surface bonds. This extraordinary quality is silicon's decisive competitive advantage and the reason CMOS scaling continued for six decades. GaN/dielectric interface state densities remain \(10^{11}\)–\(10^{12}\) cm\(^{-2}\)·eV\(^{-1}\) — 100–1000× worse — limiting GaN MOSFET threshold voltage stability and is one of the defining challenges in wide-bandgap power device research.

!!! mascot-encourage "Surface physics is genuinely hard. You're in excellent company being confused."
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Nova encouraging">
    Surface states involve broken symmetry, quantum confinement, localized gap states, and self-consistent electrostatics all at once. If it doesn't click immediately, that's appropriate — the field took decades to untangle these concepts. The key insight to hold onto: **a dangling bond is just an atom that wanted four bonds and only got three**. That unsatisfied orbital sticks into the gap as a localized state. Everything else — Fermi level pinning, interface traps, \(D_{it}\) — follows from that one simple picture. You will revisit all of this quantitatively in Chapter 13 (MOS capacitor physics), where interface state density becomes a measured device parameter with real consequences for threshold voltage and subthreshold slope.

## Key Takeaways

This chapter surveyed the imperfections that distinguish real crystals from the idealized structures of Chapters 1 and 2:

- The four bonding types — **ionic**, **metallic**, **van der Waals**, and **covalent** — explain crystal structure preferences. The **sp³ hybridization** of Group IV and III-V semiconductors enforces tetrahedral coordination and produces dangling bonds when any bond is broken.
- **Point defects** (vacancies, interstitials, substitutional impurities, Frenkel pairs, Schottky defects) have equilibrium concentrations \(n_d = N\exp(-E_f/k_BT)\). Intentional substitutional dopants are beneficial; unintentional deep-level impurities are traps.
- **Edge and screw dislocations** are line defects characterized by the Burgers vector \(\mathbf{b}\). They scatter carriers, reduce mobility, and multiply under stress (Frank-Read mechanism). Misfit and threading dislocations from lattice-mismatched growth degrade device performance.
- **Stacking faults** disrupt close-packed plane sequences. **Grain boundaries** in polycrystalline semiconductors scatter carriers and reduce minority carrier lifetime, limiting thin-film transistor performance.
- **Dangling bonds** at crystal surfaces produce **surface states** in the bandgap; at semiconductor-dielectric interfaces they are **interface states** (\(D_{it}\)). The Si/SiO₂ interface's record-low \(D_{it} < 10^{10}\) cm\(^{-2}\)·eV\(^{-1}\) is a primary reason silicon dominates CMOS.

!!! mascot-celebration "Perfect understanding of imperfection — well earned!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Nova celebrating">
    You now command the full defect hierarchy of semiconductor crystals — from the lonely single-atom vacancy to the sprawling grain boundary. More importantly, you can distinguish the *disastrous* from the *deliberate*: threading dislocations from uncontrolled mismatch vs. substitutional dopants placed precisely where needed. The Si/SiO₂ interface's exceptional \(D_{it}\) is not an accident; it is decades of materials engineering. You now know what's being engineered and why. Chapter 4 awaits: we finally build the quantum mechanics required to *derive* the band structures we have been confidently sketching.

