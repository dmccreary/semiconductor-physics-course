# Semiconductor Physics Course FAQ

This FAQ covers the most common questions about semiconductor physics concepts,
course structure, and how to use this intelligent textbook. Questions are organized
from getting started through advanced topics.

---

## Getting Started

### What is this course about?

This course provides a systematic study of semiconductor physics, from quantum mechanical
foundations to advanced device applications. It explains *why* semiconductors behave the way
they do — not just what equations to apply — building the physical intuition needed to
design, troubleshoot, and reason about real devices.

Topics span crystal structure, band theory, carrier statistics, transport, p-n junctions,
metal-semiconductor contacts, MOS structures, bipolar and field-effect transistors,
optoelectronic devices, compound semiconductors, and fabrication technology.
See the [Course Description](course-description.md) for the full topic list and learning
outcomes.

### Who is this course for?

This textbook targets college juniors and seniors in electrical engineering, applied
physics, materials science, and engineering physics, as well as first-year graduate
students and working professionals in microelectronics or photonics who want a
rigorous refresher.

Prerequisites include multivariable calculus, ordinary and partial differential
equations, linear algebra, calculus-based university physics, and introductory quantum
mechanics. Familiarity with circuit analysis and materials science is helpful but not
required. See [Course Description](course-description.md) for the complete prerequisite list.

### What do I need to know before I start?

The core prerequisites are: multivariable calculus and vector calculus; ODEs and PDEs;
linear algebra (matrices, eigenvalues); calculus-based physics (E&M, waves); introductory
modern physics (Schrödinger equation, wave-particle duality); and introductory statistical
thermodynamics (Boltzmann distributions).

If your quantum mechanics background is limited, pay extra attention to
[Chapter 4 — Quantum Mechanics](chapters/04-quantum-mechanics/index.md), which provides
the review needed to follow the band theory chapters. If you are unfamiliar with crystal
structures, start with [Chapter 2 — Crystal Lattice Structure](chapters/02-crystal-lattice-structure/index.md).

### How is this course organized?

The 22 chapters follow prerequisite order: each chapter assumes you have read the chapters
before it. The first three chapters cover materials and crystal structure; Chapters 4–6
cover quantum mechanics and band theory; Chapters 7–10 cover carrier physics; Chapters 11–13
cover junctions and MOS structures; Chapters 14–16 cover transistors; Chapters 17–20 cover
optoelectronics and advanced materials; Chapters 21–22 cover fabrication and characterization.

Use the [Chapter List](chapters/index.md) or the [Learning Graph](learning-graph/index.md)
to see how topics connect.

### What are MicroSims and how do I use them?

MicroSims are interactive browser-based simulations embedded throughout the textbook. Each
lets you manipulate parameters — doping concentration, temperature, bias voltage, barrier
width — and observe the physical effect in real time. No software installation is required.

Click any slider, dropdown, or button in a MicroSim to explore the parameter space. A good
practice is to first predict what you expect to happen, then check your prediction. The
[MicroSims index](sims/index.md) lists all 16 available simulations.

### How do I use the learning graph?

The [Learning Graph](learning-graph/index.md) is an interactive visualization of all 600
concepts in the course and how they depend on one another. Use it to:

- Find prerequisite concepts if a chapter feels unfamiliar
- Explore which topics a given concept leads to
- Identify your current position in the knowledge structure
- Plan non-linear study if you already know some material

Click any node to highlight its immediate neighbors. Concepts earlier in the dependency
chain are in the upper portion of the graph.

### What is an intelligent textbook?

An intelligent textbook goes beyond static reading material. This one includes interactive
MicroSims for hands-on exploration, a learning graph that makes concept dependencies explicit,
a searchable glossary of 600 terms, a FAQ, per-chapter quizzes, and annotated references.

The design assumes that understanding builds incrementally — concepts appear only after their
prerequisites — rather than expecting students to absorb topics in isolation.

### Where do I find definitions of unfamiliar terms?

The [Glossary](glossary.md) contains definitions for all 600 key concepts in the course,
each written with a precise technical definition, physical significance statement, and a
worked numerical example. Use the page search (Ctrl/Cmd + F) or the site search bar at the
top of any page to find a term quickly.

### Is this textbook free to use?

Yes. The textbook is open source and released under a Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 license. There are no access codes,
paywalls, or annual subscriptions. See the [About](about.md) page for citation formats
and the License page for reuse conditions.

### How do I navigate between chapters?

Use the sidebar on the left for chapter-to-chapter navigation. Within a chapter, the
table of contents on the right shows sections. The site search bar at the top of any
page searches across the full textbook. The [Learning Graph](learning-graph/index.md)
provides a visual navigation alternative when you want to explore concept connections.

### How long does this course take to complete?

A typical junior/senior one-semester course covers roughly one chapter per week over
14–16 weeks. Self-paced study depends heavily on your background; students with strong
quantum mechanics backgrounds often move faster through Chapters 4–6 than those who
are reviewing it for the first time. Each chapter includes a quiz to help you assess
your readiness to move on.

### What is the difference between this textbook and a traditional one?

Traditional semiconductor textbooks present derivations and apply equations. This textbook
additionally provides: (1) interactive MicroSims that let you *explore* the physics rather
than just read about it; (2) a learning graph that makes the conceptual dependency structure
explicit; (3) a 600-term glossary with worked numerical examples; and (4) chapter-level
quizzes for self-assessment. The entire resource is free and openly licensed.

---

## Core Concepts

### What is a semiconductor?

A semiconductor is a material whose electrical conductivity falls between that of a metal
and an insulator, and — crucially — whose conductivity can be tuned over many orders of
magnitude through temperature, doping, or applied fields. This tunability arises from a
modest energy bandgap (typically 0.3–3.5 eV) that separates a filled valence band from
an empty conduction band at absolute zero.

Silicon (Eg = 1.12 eV) and germanium (Eg = 0.67 eV) are the most common elemental
semiconductors; gallium arsenide (Eg = 1.42 eV) is the most widely used compound
semiconductor. See [Chapter 1](chapters/01-intro-semiconductors/index.md) for a
detailed introduction.

### What is a bandgap and why does it matter?

The bandgap Eg is the energy difference between the top of the valence band and the
bottom of the conduction band — the energy range in which no electron states exist.
Carriers must acquire at least Eg of energy to make the transition from the valence
to the conduction band and contribute to conduction.

Eg determines whether a material is a conductor (no gap), semiconductor (small gap),
or insulator (large gap). It also sets the threshold photon energy for optical absorption,
making it critical for LEDs, solar cells, and photodetectors.

**Example:** Silicon with Eg = 1.12 eV cannot absorb photons with wavelengths longer than
hc/Eg ≈ 1107 nm, which is why silicon solar cells are transparent to near-infrared light.
See [Chapter 1](chapters/01-intro-semiconductors/index.md) and the glossary entry for
**Bandgap**.

### What is the difference between a direct and an indirect bandgap?

In a direct-bandgap semiconductor (e.g., GaAs, GaN, InP), the conduction band minimum and
valence band maximum occur at the same crystal momentum **k**. An electron can recombine
with a hole by emitting a photon directly, making direct-gap materials efficient light
emitters.

In an indirect-bandgap semiconductor (e.g., Si, Ge), the band extrema occur at different
**k** values. Optical transitions require a simultaneous change in momentum, which requires
a phonon, making radiative recombination far less likely. This is why silicon LEDs and
lasers are inefficient.

See [Chapter 1](chapters/01-intro-semiconductors/index.md) and the
[E-k Band Structure Explorer MicroSim](sims/ek-band-structure-explorer/index.md).

### What is the Fermi level?

The Fermi level EF is the electrochemical potential of electrons in a solid — the energy
at which the probability of occupation is exactly 50% according to the Fermi-Dirac
distribution. In an intrinsic semiconductor at 0 K it lies midgap; at room temperature
it shifts slightly toward whichever band has a lower effective density of states.

EF is the central quantity that connects carrier concentrations, doping, and applied
voltages. Under equilibrium, EF is constant throughout a device. Under bias, it splits
into quasi-Fermi levels for electrons and holes.

See [Chapter 6 — Fermi-Dirac Statistics](chapters/06-fermi-dirac-statistics/index.md)
and the [Fermi-Dirac Explorer MicroSim](sims/fermi-dirac-explorer/index.md).

### What is doping and why is it used?

Doping is the deliberate introduction of impurity atoms into a semiconductor lattice to
control carrier concentration. Donor impurities (Group V in Si, e.g., phosphorus) each
contribute a free electron, shifting EF toward the conduction band — producing n-type
material. Acceptor impurities (Group III, e.g., boron) each contribute a free hole,
shifting EF toward the valence band — producing p-type material.

Doping changes conductivity by orders of magnitude and is fundamental to all semiconductor
devices. A p-n junction is simply the interface between p-type and n-type regions of the
same material.

**Example:** Adding 10¹⁶ cm⁻³ phosphorus to silicon at 300 K raises the electron
concentration from ni ≈ 10¹⁰ cm⁻³ to n ≈ 10¹⁶ cm⁻³ — a factor of one million.
See [Chapter 7 — Doping and Extrinsic Carriers](chapters/07-doping-extrinsic-carriers/index.md).

### What is the difference between n-type and p-type semiconductors?

In **n-type** semiconductor, donor doping makes electrons the majority carriers and holes
the minority carriers. The Fermi level lies close to the conduction band edge.

In **p-type** semiconductor, acceptor doping makes holes the majority carriers and electrons
the minority carriers. The Fermi level lies close to the valence band edge.

The law of mass action n·p = ni² holds in both cases under equilibrium: increasing one
carrier type decreases the other. See [Chapter 7](chapters/07-doping-extrinsic-carriers/index.md).

### What is a p-n junction?

A p-n junction is the interface between p-type and n-type regions of the same semiconductor.
At equilibrium, electrons diffuse from n to p and holes from p to n, creating a depletion
region that is swept clear of free carriers. The resulting built-in electric field prevents
further diffusion and establishes thermal equilibrium.

Under forward bias the field is reduced and large currents flow; under reverse bias the
field is enhanced and only tiny leakage currents flow. The p-n junction is the building
block of diodes, solar cells, LEDs, and most transistors.

See [Chapter 11 — P-N Junction Equilibrium](chapters/11-pn-junction-equilibrium/index.md)
and the [PN Junction MicroSim](sims/pn-junction/index.md).

### What is the depletion region?

The depletion region (space-charge region) is the thin zone on both sides of a p-n junction
from which mobile carriers have been swept away, leaving behind ionized donor and acceptor
atoms. These fixed charges create the built-in electric field.

The depletion width W depends on doping: W ∝ 1/√(Na + Nd), and it narrows under forward
bias and widens under reverse bias. The depletion approximation treats the boundaries as
abrupt — a simplification that is accurate for most device analysis.

**Example:** For a silicon junction with Na = Nd = 10¹⁷ cm⁻³, the depletion width at
equilibrium is approximately W ≈ 130 nm split equally on each side.
See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md).

### What is the built-in potential?

The built-in potential Vbi (or contact potential) is the electrostatic potential difference
across the depletion region of a p-n junction at thermal equilibrium. It arises from the
diffusion of majority carriers across the junction and is given by
Vbi = (kT/q) ln(Na·Nd / ni²).

Vbi cannot be measured directly with a voltmeter (the contact potentials of the metal probes
exactly cancel it). It determines the zero-bias depletion width and sets the forward-bias
threshold voltage. For silicon, Vbi ≈ 0.6–0.9 V at room temperature for typical dopings.
See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md).

### What is the Shockley diode equation?

The Shockley ideal diode equation I = Is(exp(qV/kT) − 1) describes the current-voltage
relationship of a p-n junction under the assumptions of ideal carrier injection, no
generation-recombination inside the depletion region, and low-level injection. Is is the
reverse saturation current, which depends on minority carrier diffusion lengths and
lifetimes.

The equation predicts exponential current increase under forward bias and saturation to −Is
under reverse bias. Real diodes deviate from ideal behavior because of generation-recombination
currents, series resistance, and high-injection effects.
See [Chapter 12 — P-N Junction Dynamics](chapters/12-pn-junction-dynamics/index.md).

### What is carrier mobility?

Mobility μ (cm²/V·s) measures how quickly a carrier responds to an applied electric field:
v_drift = μE. A higher mobility means a carrier reaches a higher drift velocity for the
same field, enabling faster and more efficient devices.

Mobility is limited by scattering — primarily acoustic phonon scattering (dominant near
room temperature) and ionized impurity scattering (dominant at high doping). Electron
mobility is higher than hole mobility in most semiconductors.

**Example:** In lightly doped silicon at 300 K, μn ≈ 1400 cm²/V·s and μp ≈ 450 cm²/V·s.
GaAs has μn ≈ 8500 cm²/V·s, making it preferred for high-frequency applications.
See [Chapter 8 — Carrier Drift and Mobility](chapters/08-carrier-drift-mobility/index.md).

### What is the Einstein relation?

The Einstein relation D = μkT/q connects the diffusion coefficient D (cm²/s) to the
mobility μ. It states that diffusion and drift are two manifestations of the same
underlying thermal motion and scattering physics — so knowing one gives the other.

**Example:** For silicon at 300 K with μn = 1400 cm²/V·s, the electron diffusion
coefficient is Dn = 1400 × 0.02585 ≈ 36 cm²/s.
See [Chapter 9 — Carrier Diffusion and Transport](chapters/09-carrier-diffusion-transport/index.md).

### What is effective mass?

Effective mass m* captures how an electron in a crystal responds to an external force,
accounting for the influence of the periodic crystal potential. It is defined through the
curvature of the E-k dispersion: 1/m* = (1/ℏ²)(d²E/dk²). Electrons near a band minimum
with high curvature have low effective mass and respond quickly to fields; electrons near
a flat band (low curvature) have high effective mass.

Effective mass is the key parameter linking band structure to measurable quantities like
mobility, density of states, and plasma frequency.
See [Chapter 5 — Bloch Theorem and Band Theory](chapters/05-bloch-theorem-band-theory/index.md).

### What is the density of states?

The density of states g(E) gives the number of available electron states per unit energy
per unit volume. In a 3D parabolic band, g(E) ∝ √(E − Ec). Multiplied by the Fermi-Dirac
occupation probability, it gives the actual electron concentration.

In lower-dimensional systems — quantum wells (2D), nanowires (1D), quantum dots (0D) —
g(E) takes step, sawtooth, and discrete forms, respectively. This leads to the sharp gain
spectra and temperature stability of quantum-well lasers compared with bulk devices.
See [Chapter 5](chapters/05-bloch-theorem-band-theory/index.md) and the
[Density of States Explorer MicroSim](sims/density-of-states-explorer/index.md).

### What are electron-hole pairs?

When a photon or phonon promotes an electron from the valence to the conduction band, it
leaves behind a vacant state in the valence band called a **hole**. The electron-hole pair
(EHP) is the fundamental excitation of a semiconductor. Holes behave as positively charged
quasi-particles with their own effective mass and mobility.

Generation creates EHPs; recombination destroys them. At equilibrium, generation and
recombination rates are equal, setting the intrinsic carrier concentration ni.
See [Chapter 1](chapters/01-intro-semiconductors/index.md) and
[Chapter 10 — Generation and Recombination](chapters/10-generation-recombination/index.md).

### What is recombination?

Recombination is the process by which a conduction-band electron falls into a valence-band
hole, annihilating the EHP. The three main mechanisms are: (1) **band-to-band** (direct
radiative, dominant in direct-gap semiconductors and the basis of LEDs and lasers);
(2) **SRH trap-assisted** (dominant in indirect-gap and defect-rich materials); and
(3) **Auger** (important at high carrier densities, limiting laser efficiency at high drive
currents).

The minority carrier lifetime τ characterizes how quickly excess carriers recombine after
excitation, setting the diffusion length L = √(Dτ).
See [Chapter 10](chapters/10-generation-recombination/index.md).

### What is a Schottky barrier?

A Schottky barrier is the potential energy barrier that forms at a metal-semiconductor
interface due to the difference in work functions. For an n-type semiconductor, the barrier
height φB ≈ φm − χs (metal work function minus semiconductor electron affinity) and governs
both rectifying and ohmic contact behavior.

If φB is large enough, the junction rectifies (Schottky diode), used in high-speed detection
because it has no minority carrier storage. If φB ≈ 0 (or tunneling is efficient), the
contact is ohmic. Fermi level pinning by interface states often overrides the Schottky-Mott
rule in practice.
See [Chapter 13 — Metal-Semiconductor and MOS Structures](chapters/13-metal-semiconductor-mos/index.md).

### What is a MOS capacitor?

A metal-oxide-semiconductor (MOS) capacitor consists of a metal gate, a thin insulating
oxide (typically SiO₂), and a semiconductor substrate. Applying voltage to the gate
modulates the surface carrier concentration of the semiconductor through three regimes:
accumulation, depletion, and inversion.

The C-V (capacitance-voltage) curve of a MOS capacitor reveals oxide thickness, flat-band
voltage, oxide charge density, and interface trap density — making it the primary
characterization structure for gate dielectrics.
See [Chapter 13](chapters/13-metal-semiconductor-mos/index.md).

### What is threshold voltage?

Threshold voltage VT is the gate voltage at which a MOSFET channel forms — specifically,
when the surface potential in the semiconductor reaches 2φF (strong inversion). For gate
voltages above VT, a conducting channel links source and drain; below VT, the device is
in subthreshold.

VT depends on oxide thickness, doping, flat-band voltage, and body bias. Precise control
of VT is one of the most critical challenges in CMOS process engineering.
See [Chapter 13](chapters/13-metal-semiconductor-mos/index.md) and
[Chapter 15 — JFET, MESFET, and MOSFET](chapters/15-jfet-mesfet-mosfet/index.md).

### What is a MOSFET?

A metal-oxide-semiconductor field-effect transistor (MOSFET) controls current flow between
source and drain by applying a gate voltage that creates or destroys a thin conducting
channel in the semiconductor surface. It is the dominant switching device in digital logic
and is fabricated in billions per square centimeter in modern integrated circuits.

MOSFETs operate in three regions: cutoff (below threshold), triode (low VDS, linear I-V),
and saturation (channel pinched off, I independent of VDS). The long-channel drain current
in saturation is ID = (μCox W/2L)(VGS − VT)².
See [Chapter 15](chapters/15-jfet-mesfet-mosfet/index.md).

### What is a bipolar junction transistor?

A bipolar junction transistor (BJT) is a three-terminal device (emitter, base, collector)
in which a small base current controls a much larger collector current. Current gain
β = IC/IB ranges from 50–500 in typical devices. Unlike a MOSFET, the BJT is
current-controlled and minority-carrier based.

The Ebers-Moll model describes both active and saturation/cutoff operation. BJTs offer
higher transconductance than MOSFETs at the same current and are preferred in analog and
high-frequency RF applications.
See [Chapter 14 — Bipolar Transistors](chapters/14-bipolar-transistors/index.md).

### What are quantum wells?

A quantum well is a thin semiconductor layer (typically 5–20 nm) sandwiched between
higher-bandgap barrier materials. The thin layer confines carriers in one dimension,
producing quantized energy levels and a step-like density of states.

Quantum wells increase optical gain, reduce threshold current in lasers, and sharpen the
gain spectrum. The discrete energy levels can be tuned by adjusting well thickness,
enabling wavelength engineering without changing the bulk material composition.
See [Chapter 19 — Compound Semiconductors and Quantum Structures](chapters/19-compound-semiconductors-quantum/index.md).

### What is the Hall effect?

When a current flows through a semiconductor in the presence of a perpendicular magnetic
field, the Lorentz force deflects carriers to one side, building up a transverse electric
field (the Hall field) that balances the magnetic force. The Hall coefficient RH = 1/(nq)
for electrons gives the carrier concentration directly, and its sign identifies carrier type.

**Example:** Measuring RH = +0.0625 cm³/C in a p-type sample gives p = 1/(RH·q) = 10¹⁷ cm⁻³.
Combined with resistivity, this yields μp = σ·RH.
See [Chapter 8](chapters/08-carrier-drift-mobility/index.md) and
[Chapter 22 — Characterization and Modeling](chapters/22-characterization-modeling/index.md).

### What is the Bloch theorem?

Bloch's theorem states that in a perfectly periodic crystal potential, the electron
wavefunction takes the form ψk(r) = uk(r)e^{ik·r}, where uk(r) has the periodicity of
the lattice. This means electrons are not localized on atoms but exist as propagating
Bloch waves throughout the crystal.

The consequence is that a perfect crystal does not scatter electrons — scattering arises
only from deviations from perfect periodicity (phonons, impurities, defects). Bloch's
theorem is the foundation of all band structure calculations.
See [Chapter 5 — Bloch Theorem and Band Theory](chapters/05-bloch-theorem-band-theory/index.md).

### What is an E-k diagram?

An E-k diagram (band structure or dispersion relation) plots electron energy E versus
crystal momentum k, the key quantum number in a periodic solid. The allowed energy ranges
form bands separated by forbidden gaps. The shape of E(k) near a band extremum determines
the effective mass, and the gap between the highest filled band (valence) and lowest empty
band (conduction) is the bandgap.

The distinction between direct and indirect bandgaps is visible in the E-k diagram: in a
direct gap, the conduction minimum and valence maximum are at the same k; in an indirect
gap, they occur at different k values.
See [Chapter 5](chapters/05-bloch-theorem-band-theory/index.md) and the
[E-k Band Structure Explorer MicroSim](sims/ek-band-structure-explorer/index.md).

### What is crystal structure and why does it matter?

Semiconductor devices are fabricated from crystalline materials because ordered atomic
arrangements produce well-defined band structures with predictable properties. Silicon,
germanium, and GaAs adopt the diamond or zincblende cubic crystal structure. The lattice
constant, bonding type, and atomic arrangement determine bandgap, carrier effective mass,
thermal conductivity, and mechanical properties.

Defects (vacancies, interstitials, dislocations) interrupt the periodicity, introduce
energy states in the gap, and degrade carrier lifetime and mobility.
See [Chapter 2 — Crystal Lattice Structure](chapters/02-crystal-lattice-structure/index.md)
and [Chapter 3 — Crystal Bonding and Defects](chapters/03-crystal-bonding-defects/index.md).

### What is carrier diffusion?

Carrier diffusion is the net flow of carriers from a region of high concentration to a
region of low concentration, driven by a concentration gradient rather than an electric
field. The diffusion current density is J = qD(dn/dx) for electrons. Diffusion and drift
together determine the total current in most semiconductor devices.

In a forward-biased p-n junction, the injected minority carriers diffuse away from the
junction into the neutral regions, establishing an exponential concentration profile
whose characteristic length is the diffusion length L = √(Dτ).
See [Chapter 9 — Carrier Diffusion and Transport](chapters/09-carrier-diffusion-transport/index.md).

### What is a heterojunction?

A heterojunction is an interface between two different semiconductor materials, as opposed
to the same material (homojunction). The two materials have different bandgaps, and the
conduction and valence band offsets at the interface (Type I, II, or III alignment) create
potential steps that confine carriers or create 2D electron gases.

**Example:** The GaAs/Al₀.₃Ga₀.₇As interface has ΔEc ≈ 0.24 eV and ΔEv ≈ 0.13 eV.
This alignment confines electrons in GaAs quantum wells for high-performance lasers and HEMTs.
See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md) and
[Chapter 19](chapters/19-compound-semiconductors-quantum/index.md).

---

## Technical Detail Questions

### What is the law of mass action?

The law of mass action states that n·p = ni² in a semiconductor at thermal equilibrium,
regardless of the doping level (as long as the non-degenerate approximation holds). Here
ni is the intrinsic carrier concentration, which depends only on the bandgap and temperature.

**Example:** In silicon at 300 K, ni ≈ 10¹⁰ cm⁻³. If n-type doping gives n = 10¹⁶ cm⁻³,
then p = ni²/n = 10²⁰/10¹⁶ = 10⁴ cm⁻³. This tells you the minority carrier concentration
immediately. See [Chapter 6](chapters/06-fermi-dirac-statistics/index.md).

### What is ionized impurity scattering?

Ionized impurity scattering occurs when a carrier passes near a charged dopant ion (ionized
donor or acceptor) and is deflected by the Coulomb potential. Unlike acoustic phonon
scattering, ionized impurity scattering increases at lower temperatures (less thermal
smearing of the trajectory) and at higher doping concentrations (more scatterers).

It is the dominant mobility-limiting mechanism in heavily doped semiconductors at low
temperatures and contributes significantly at room temperature when doping exceeds ~10¹⁷ cm⁻³.
See [Chapter 8](chapters/08-carrier-drift-mobility/index.md).

### What is Matthiessen's rule?

Matthiessen's rule states that when multiple independent scattering mechanisms are present,
the total inverse mobility (or total scattering rate) is the sum of the individual
contributions: 1/μtotal = 1/μphonon + 1/μimpurity + 1/μ... This holds when each mechanism
is independent of the others.

It allows you to combine acoustic phonon, optical phonon, and ionized impurity scattering
into a single net mobility value. Matthiessen's rule is approximate — it slightly
overestimates scattering when mechanisms are not truly independent.
See [Chapter 8](chapters/08-carrier-drift-mobility/index.md).

### What is the continuity equation?

The continuity equation tracks how minority carrier concentration changes in time and space
due to drift, diffusion, generation, and recombination:

∂n/∂t = n_gen − n_recomb + (1/q)∂Jn/∂x

Under steady state (∂n/∂t = 0) with no generation and low-level injection, this reduces
to the minority carrier diffusion equation Dp(d²Δp/dx²) = Δp/τp for holes in n-type
material. Its solution — an exponential decay with characteristic length L = √(Dτ) — gives
the minority carrier profile in neutral regions of p-n junctions.
See [Chapter 9](chapters/09-carrier-diffusion-transport/index.md).

### What is SRH recombination?

Shockley-Read-Hall (SRH) recombination is trap-assisted recombination via energy states
near the middle of the bandgap, introduced by impurities or crystal defects. An electron
is captured by the trap, then the trap captures a hole (or vice versa), completing the
recombination event without emitting a photon.

SRH is the dominant recombination mechanism in indirect-bandgap semiconductors like silicon
and in any material with high defect density. It limits minority carrier lifetime in real
devices. Trap density is minimized by using high-purity crystals and passivating surfaces.
See [Chapter 10](chapters/10-generation-recombination/index.md).

### What is Auger recombination?

Auger recombination is a three-carrier process in which an electron-hole pair recombines
and the released energy is transferred to a third carrier (electron or hole) rather than
emitted as a photon. The third carrier subsequently relaxes to the band edge by emitting
phonons.

Auger recombination scales as n²p or np² and therefore becomes dominant at high carrier
densities — in heavily doped regions, in laser diodes at high drive current, and in solar
cells under concentration. It is a fundamental limit on laser efficiency and solar cell
open-circuit voltage at very high injection.
See [Chapter 10](chapters/10-generation-recombination/index.md).

### What is the depletion approximation?

The depletion approximation simplifies analysis of p-n junctions and MOS structures by
assuming that the transition from neutral semiconductor to the space-charge region is
abrupt: carrier concentration drops from its bulk value to zero at the depletion edge.
Within the depletion region, only fixed ionized dopant charges remain.

This approximation yields closed-form expressions for depletion width, built-in potential,
and junction capacitance that agree with exact numerical solutions to within a few percent
for typical doping levels and bias voltages. It breaks down at very low doping or very
high forward bias.
See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md).

### What is the flat-band voltage?

The flat-band voltage VFB is the gate voltage at which the semiconductor energy bands are
flat (no band bending) — i.e., the electric field at the semiconductor surface is zero.
In an ideal MOS structure, VFB = φms (metal-semiconductor work function difference).

In real devices, fixed oxide charges, interface traps, and mobile ions shift VFB from the
ideal value. Extracting VFB from the C-V curve is a standard method for quantifying
these charges. VFB is the reference point from which threshold voltage is calculated.
See [Chapter 13](chapters/13-metal-semiconductor-mos/index.md).

### What is the subthreshold slope?

The subthreshold slope S (mV/decade) describes how rapidly the MOSFET drain current
increases as gate voltage rises below threshold. The ideal lower limit at room temperature
is S = (kT/q)ln(10) × (1 + Cd/Cox) ≈ 60 mV/decade. Real devices have S = 70–100 mV/dec.

S sets a fundamental limit on how much the gate voltage must swing to turn the device on
and off, directly constraining supply voltage and power consumption in digital circuits.
Tunnel FETs can in principle break the 60 mV/dec limit.
See [Chapter 15](chapters/15-jfet-mesfet-mosfet/index.md).

### What is channel-length modulation?

Channel-length modulation is the slight increase in drain current with increasing VDS in
a MOSFET operating in saturation, caused by the pinch-off point moving toward the source
as VDS increases. This effectively shortens the channel by a small amount ΔL, increasing
ID. It is modeled by multiplying the ideal saturation current by (1 + λVDS).

Channel-length modulation becomes more pronounced as the physical gate length decreases,
making it an increasingly important non-ideal effect in short-channel devices.
See [Chapter 15](chapters/15-jfet-mesfet-mosfet/index.md).

### What is the Early effect?

The Early effect (base-width modulation) in BJTs is the increase in collector current with
increasing VCE in the active region. As VCE increases, the collector-base depletion region
widens and reduces the effective base width, increasing the collector current. The Early
voltage VA (typically 20–200 V) characterizes this: IC = (IC0)(1 + VCE/VA).

The Early effect reduces output resistance and limits the voltage gain achievable with a
BJT amplifier stage. Heterojunction bipolar transistors (HBTs) can be designed with much
higher VA through bandgap engineering.
See [Chapter 14](chapters/14-bipolar-transistors/index.md).

### What are Miller indices?

Miller indices (hkl) are a notation system for identifying crystal planes and directions
using three integers derived from the intercepts of the plane with the crystal axes,
taken as reciprocals and cleared of fractions. The (100), (110), and (111) planes of
silicon have different atomic densities and surface properties, making the index critical
for wafer specification, cleavage, and oxidation rate.

**Example:** Silicon CMOS wafers are typically (100) orientation because this surface
gives the highest electron mobility under the gate and the best interface quality with
SiO₂. See [Chapter 2](chapters/02-crystal-lattice-structure/index.md) and the
[Miller Indices Explorer MicroSim](sims/miller-indices-explorer/index.md).

### What is the Kronig-Penney model?

The Kronig-Penney model is a simplified 1D model of electron motion in a crystal,
consisting of a periodic array of rectangular potential wells and barriers. Despite its
simplicity, it captures the essential physics of band formation: for certain values of
electron energy, Bloch waves can propagate (allowed bands); for others, they cannot
(forbidden gaps). It provides the clearest intuitive demonstration of why energy bands
and bandgaps arise in periodic potentials.
See [Chapter 4 — Quantum Mechanics](chapters/04-quantum-mechanics/index.md) and
[Chapter 5](chapters/05-bloch-theorem-band-theory/index.md).

### What is the Czochralski process?

The Czochralski process is the dominant method for growing large, dislocation-free single-
crystal silicon ingots. Polysilicon is melted in a quartz crucible, and a seed crystal is
touched to the surface, then slowly pulled upward while rotating. The crystal grows from
the melt interface, replicating the seed's orientation. Controlled doping is achieved
by adding dopant to the melt.

Modern 300 mm silicon wafers used in IC manufacturing are grown by this process.
See [Chapter 21 — Fabrication Technology](chapters/21-fabrication-technology/index.md).

### What is ion implantation?

Ion implantation is the standard technique for introducing dopant atoms into a semiconductor
with precise control of dose and depth profile. A beam of high-energy dopant ions (e.g.,
B⁺, P⁺, As⁺) is accelerated into the wafer surface, coming to rest at a depth determined
by the ion energy. The implanted dose (atoms/cm²) is precisely controlled by measuring
beam current.

Because implantation causes crystal damage, a high-temperature anneal is required to
restore crystallinity and activate the dopants electrically.
See [Chapter 21](chapters/21-fabrication-technology/index.md).

### What is the Ebers-Moll model?

The Ebers-Moll (EM) model is a large-signal equivalent-circuit model for the BJT that
accurately represents the device in all four operating regions (active, saturation, cutoff,
and reverse active). It models the transistor as two coupled diodes with current sources
that capture the injection and transport physics analytically.

The EM model is the basis for SPICE's Gummel-Poon BJT model and is essential for
understanding amplifier bias, switching speed, and saturation behavior.
See [Chapter 14](chapters/14-bipolar-transistors/index.md).

### What is a quantum dot?

A quantum dot is a semiconductor nanostructure that confines carriers in all three spatial
dimensions (0D), producing discrete atomic-like energy levels. Because the level spacing
depends on dot size, quantum dots are tunable light emitters across a wide spectral range
by simply changing dot diameter during growth.

Quantum dot lasers have narrower, temperature-stable gain spectra than bulk or quantum-
well lasers and are used in optical communications, bioimaging, and quantum information.
See [Chapter 19](chapters/19-compound-semiconductors-quantum/index.md).

### What is a two-dimensional electron gas?

A two-dimensional electron gas (2DEG) is an electron sheet confined at a semiconductor
heterojunction (e.g., AlGaN/GaN or AlGaAs/GaAs) by the conduction-band offset. The
electrons are free to move in the plane but are quantum-mechanically confined in the
perpendicular direction.

Because the electrons occupy a region separate from the ionized dopants (modulation
doping), ionized impurity scattering is dramatically reduced, enabling very high
mobilities (>10,000 cm²/V·s at room temperature in GaAs HEMTs). This is the operating
principle of the high-electron-mobility transistor (HEMT).
See [Chapter 19](chapters/19-compound-semiconductors-quantum/index.md).

---

## Common Challenge Questions

### Why is band theory difficult to understand intuitively?

Band theory is abstract because the relevant quantities — Bloch waves, crystal momentum,
and reciprocal lattice vectors — have no classical analogs. The key conceptual leap is
accepting that electrons in a crystal are not localized on atoms; they are delocalized
Bloch waves that fill the entire crystal yet still experience the crystal potential.

Start with the Kronig-Penney model (Chapter 4–5), which shows *why* gaps open at Brillouin
zone boundaries using a simple 1D periodic potential. Once you understand why gaps form
there, the generalization to 3D band structure becomes more believable. The
[E-k Band Structure Explorer](sims/ek-band-structure-explorer/index.md) lets you see the
gap form as you change the periodic potential strength.

### How do I read a band diagram?

A band diagram plots electron energy (y-axis) versus position in the device (x-axis).
The conduction band edge Ec and valence band edge Ev vary with position as the material,
doping, or applied bias changes. The Fermi level EF (or quasi-Fermi levels under bias)
indicates carrier concentration at each point.

Key rules: (1) electrons sit near Ec; holes sit near Ev. (2) EF constant = equilibrium.
(3) Slope of Ec = electric field. (4) EF close to Ec = n-type; close to Ev = p-type.
(5) Under forward bias, EF splits: EFn rises on the n-side, EFp on the p-side.

See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md) and
[Chapter 12](chapters/12-pn-junction-dynamics/index.md) for worked examples.

### Why does the Fermi level shift with doping?

The Fermi level is a thermodynamic quantity that shifts to maintain charge neutrality.
Adding donors adds electrons to the system; the Fermi level must rise (move closer to Ec)
so that the Fermi-Dirac distribution places more electrons in the conduction band to match
the donor concentration. Adding acceptors removes electrons, so EF drops toward Ev.

This can be calculated explicitly: EF − Ei = (kT)ln(n/ni) for n-type. Each decade of
doping shifts EF by about 60 mV (one kT·ln10) at room temperature.
See [Chapter 7](chapters/07-doping-extrinsic-carriers/index.md).

### Are holes real particles?

Holes are not physically distinct particles — they are vacancies in the valence band
described using the quasi-particle formalism. In a filled band, all electron momenta cancel
and no current flows. When one electron is missing, the net momentum is equal and opposite
to the missing electron's momentum. It is mathematically and physically equivalent to track
this vacancy as a positively charged quasi-particle with its own effective mass and mobility.

In every experimentally measurable quantity (Hall effect, cyclotron resonance, current,
drift), holes behave exactly as classical positive charges. The concept is a bookkeeping
convenience that simplifies analysis enormously.
See [Chapter 5](chapters/05-bloch-theorem-band-theory/index.md).

### When should I use the depletion approximation?

Use the depletion approximation when: doping is in the range 10¹⁴–10¹⁸ cm⁻³; you need
quick analytical estimates rather than exact numerical results; or the reverse bias is
modest (not near breakdown). The approximation gives depletion widths, built-in potential,
and junction capacitance accurate to a few percent under these conditions.

It breaks down when: doping is very low (the transition from neutral to depleted is gradual,
not abrupt); very high forward bias approaches Vbi; or you need accurate carrier profiles
inside the depletion region for generation-recombination analysis.
See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md).

### Why does reverse-bias diode current saturate?

Under reverse bias, the minority carrier concentration at the junction edge is driven to
nearly zero (the reverse-bias boundary condition). Minority carriers diffuse from the
neutral regions toward the junction, creating a drift current. Once the bias is large
enough to fully deplete the minority carriers at the junction (V >> kT/q), increasing
the reverse voltage further cannot extract more minority carriers — supply is limited by
the diffusion rate from the neutral regions, not the field.

This saturates the current at Is, which depends only on minority carrier diffusion
coefficients and lifetimes, not on the reverse voltage.
See [Chapter 12](chapters/12-pn-junction-dynamics/index.md).

### What is the difference between drift and diffusion, and when does each dominate?

**Drift** current is driven by an electric field: J_drift = qnμE. It requires an
external field (from applied voltage or built-in potential) and dominates in the
depletion region and in resistors.

**Diffusion** current is driven by a carrier concentration gradient: J_diff = qD(dn/dx).
It requires no field but does require a concentration difference. Diffusion dominates
in the neutral regions of a forward-biased p-n junction, where minority carriers injected
at the junction boundary diffuse away.

In most device analyses both are present, and the total current density J = J_drift + J_diff.
The Einstein relation connects the two through the same scattering physics.
See [Chapter 9](chapters/09-carrier-diffusion-transport/index.md).

### How do short-channel effects degrade MOSFET performance?

As gate length scales below ~100 nm, several effects degrade the ideal long-channel
behavior: (1) **Drain-induced barrier lowering (DIBL)** — the drain field lowers the
source-to-channel barrier, reducing VT with increasing VDS. (2) **Velocity saturation** —
carriers reach their maximum drift velocity before the drain end, changing the I-V
characteristic. (3) **Punch-through** — the source and drain depletion regions merge,
allowing direct source-to-drain current even when the gate is off.

These effects increase off-state leakage, reduce gain, and degrade noise margins. They are
mitigated by ultra-thin body, high-k gate dielectrics, and 3D structures like FinFETs.
See [Chapter 16 — Short-Channel and CMOS](chapters/16-short-channel-cmos/index.md).

### Why does carrier mobility decrease at high electric fields?

At low fields, drift velocity is proportional to field: v = μE. But as the field increases,
carriers gain enough energy between scattering events to excite optical phonons, rapidly
dissipating energy and preventing further velocity increase. The drift velocity saturates
at vsat ≈ 10⁷ cm/s for electrons in silicon.

At even higher fields, carriers become "hot" (their energy far exceeds thermal equilibrium)
and can cause impact ionization. High-field transport is essential to understand
velocity saturation in short-channel MOSFETs and breakdown in power devices.
See [Chapter 8](chapters/08-carrier-drift-mobility/index.md).

### What is the difference between emitter injection efficiency and current gain?

**Emitter injection efficiency** γ is the fraction of the total emitter current carried
by the minority carrier species that is actually injected into the base. Ideally γ ≈ 1.
**Base transport factor** αT is the fraction of injected minority carriers that survive
recombination and reach the collector. The common-base current gain α = γ·αT, and the
common-emitter gain β = α/(1−α).

High β requires both high γ (achieved by making the emitter much more heavily doped than
the base) and high αT (achieved by making the base thin relative to the diffusion length).
See [Chapter 14](chapters/14-bipolar-transistors/index.md).

### What causes the body effect in MOSFETs?

The body effect (also called substrate bias effect) describes the increase in threshold
voltage VT when the body (substrate) is reverse-biased relative to the source. Because
the source-body reverse bias increases the depletion charge under the channel, more gate
voltage is needed to invert the surface.

The body effect coefficient γ = √(2qεsNa)/Cox quantifies this: ΔVT = γ(√(2φF + VSB) − √(2φF)).
It is a concern in CMOS circuits where the body potential is not independently controlled,
and it is the reason CMOS requires careful n-well or p-well engineering.
See [Chapter 15](chapters/15-jfet-mesfet-mosfet/index.md).

### How do I choose the right semiconductor material for a device?

Material selection is driven by the requirements: (1) **Speed/frequency** — high mobility
(GaAs, InP, GaN HEMT) vs. silicon; (2) **Power** — high breakdown field and thermal
conductivity (SiC, GaN for power devices); (3) **Light emission** — direct bandgap
required (GaAs, GaN, InP); (4) **Integration** — compatibility with silicon CMOS process
(Si, SiGe, Ge for digital); (5) **Wavelength** — bandgap sets photon energy (InGaAsP for
1.3/1.55 µm fiber, GaN for blue/UV).

See [Chapter 19](chapters/19-compound-semiconductors-quantum/index.md) and
[Chapter 20 — Strained Silicon, 2D Materials, and Power Devices](chapters/20-strained-si-2d-power/index.md).

---

## Best Practice Questions

### How do I draw a band diagram for a p-n junction under forward bias?

1. Draw the isolated n-type and p-type band diagrams, marking Ec, Ev, and EF for each.
2. In equilibrium, EF must be flat — bend the bands so Ec and Ev are higher on the p-side
   by qVbi (the built-in potential). The depletion region is where bands curve.
3. Under forward bias V: the n-side EF rises (or equivalently the p-side drops) by qV,
   reducing the band bending by qV. Split EF into EFn and EFp separated by qV.
4. Verify: neutral n-region flat, neutral p-region flat, all bending occurs in the
   depletion region, minority carrier injection visible as EFn > EF_p at junction.

See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md) and
[Chapter 12](chapters/12-pn-junction-dynamics/index.md).

### What is the best way to solve the minority carrier diffusion equation?

1. Write the general solution: Δp(x) = A·exp(x/Lp) + B·exp(−x/Lp) where Lp = √(Dp τp).
2. Apply boundary conditions: (a) at the junction edge x=0, the excess carrier
   concentration is set by the applied bias — Δp(0) = pn0(exp(qV/kT) − 1); (b) at the
   far contact (or x → ∞), Δp → 0.
3. With a long neutral region, the A term vanishes and the solution is a decaying
   exponential: Δp(x) = Δp(0)·exp(−x/Lp).
4. Diffuse the result: J_p = −qDp·dΔp/dx gives the minority hole current.

See [Chapter 9](chapters/09-carrier-diffusion-transport/index.md).

### How do I extract device parameters from I-V measurements?

For a diode: plot ln(I) vs. V. The slope gives q/nkT (where n is the ideality factor);
the y-intercept extrapolates to ln(Is). A slope of q/kT indicates ideal diffusion current;
q/2kT indicates generation-recombination current in the depletion region.

For a MOSFET: plot √ID vs. VGS in saturation (long-channel) to extract VT (x-intercept)
and (μCoxW/2L)^0.5 (slope). Plot ID vs. VGS on a log scale to extract subthreshold slope.
See [Chapter 22 — Characterization and Modeling](chapters/22-characterization-modeling/index.md).

### How do I analyze a MOSFET for short-channel effects?

Check: (1) Is the gate length L comparable to the natural length λ = √(εs·tox·xinv·xdep/εox)?
If L < 3λ, short-channel effects are likely significant. (2) Plot VT vs. VDS — a significant
VT roll-off with VDS indicates DIBL. (3) Check the subthreshold slope — values above
70 mV/dec suggest interface traps or DIBL. (4) Look for non-saturating ID at high VDS
(punchthrough).

For a given technology node, the ITRS (now IRDS) roadmap provides target parameters.
See [Chapter 16](chapters/16-short-channel-cmos/index.md).

### What tools help me visualize semiconductor concepts?

The textbook's [MicroSims](sims/index.md) are designed specifically for this course.
Particularly useful:

- [E-k Band Structure Explorer](sims/ek-band-structure-explorer/index.md) — sweep through Si, Ge, GaAs
- [Fermi-Dirac Explorer](sims/fermi-dirac-explorer/index.md) — temperature and doping effects
- [PN Junction MicroSim](sims/pn-junction/index.md) — bias the junction and watch band bending
- [Quantum Tunneling Explorer](sims/quantum-tunneling-explorer/index.md) — vary barrier parameters
- [Learning Graph Viewer](sims/graph-viewer/index.md) — navigate concept dependencies

### How do I approach a design problem for a p-n junction?

1. State requirements: blocking voltage (sets depletion width and therefore doping),
   forward current at a given voltage (sets junction area), switching speed (sets minority
   carrier lifetime), leakage current (sets Is through diffusion length).
2. Use the Shockley equation and depletion approximation to get first estimates.
3. Check secondary effects: series resistance, generation-recombination current, high-
   injection limits, and avalanche breakdown voltage.
4. Iterate the design — often requirements trade off (e.g., lower doping increases
   breakdown voltage but increases series resistance).

See [Chapter 11](chapters/11-pn-junction-equilibrium/index.md) and
[Chapter 12](chapters/12-pn-junction-dynamics/index.md).

### How should I use the learning graph to plan my study?

Open the [Learning Graph Viewer](sims/graph-viewer/index.md) and click the concept you
want to master. Trace backward through the dependency arrows to identify which prerequisite
concepts must be understood first. If a prerequisite feels unfamiliar, navigate to its
chapter, study it, then return.

For a linear study plan, follow the graph's topological sort, which is essentially the
chapter order already chosen in this textbook. For targeted review before an exam,
use the graph to identify which concepts underpin the weakest areas in your understanding.

### How do I convert between mobility and diffusivity?

Use the Einstein relation: D = μkT/q. At room temperature (T = 300 K), kT/q = 0.02585 V,
so D = μ × 0.02585 cm²/s when μ is in cm²/V·s.

**Example:** μn = 1400 cm²/V·s → Dn = 1400 × 0.02585 ≈ 36.2 cm²/s.
μp = 450 cm²/V·s → Dp = 450 × 0.02585 ≈ 11.6 cm²/s.
See [Chapter 9](chapters/09-carrier-diffusion-transport/index.md).

### How do I determine whether a semiconductor is degenerate?

A semiconductor is degenerate when the Fermi level moves inside (or very near) a band,
so the Maxwell-Boltzmann approximation to the Fermi-Dirac distribution breaks down. The
conventional threshold is EF within ~3kT of Ec (for n-type) or Ev (for p-type).

For silicon at 300 K, this occurs at doping above approximately 10¹⁹ cm⁻³. At this point,
the simple n = Nc·exp(−(Ec−EF)/kT) formula is inaccurate and must be replaced with the
Fermi-Dirac integral. Degenerate semiconductors are used in ohmic contacts and as source/
drain regions in MOSFETs. See [Chapter 6](chapters/06-fermi-dirac-statistics/index.md).

---

## Advanced Topics

### What is Dennard scaling and why did it end?

Dennard (classical CMOS) scaling is the principle that as device dimensions are reduced
by a factor κ, supply voltage and threshold voltage are also reduced by κ, maintaining
constant power density. This allowed each generation to be faster, denser, and no hotter
than the previous.

Dennard scaling ended around 2005 because VT cannot be reduced below ~200–300 mV
(subthreshold leakage becomes unacceptable) and leakage power became comparable to active
power. Since then, voltage has stagnated, power density has increased, and improvements
have shifted to architecture (multicore, heterogeneous integration) and new device
structures (FinFET, GAA). See [Chapter 16](chapters/16-short-channel-cmos/index.md).

### What is a FinFET and how does it differ from a planar MOSFET?

A FinFET wraps the gate around a thin, vertical silicon "fin" on three sides, providing
much better electrostatic control over the channel than a planar gate. This suppresses
short-channel effects — particularly DIBL — at gate lengths below 22 nm where planar
MOSFETs lose adequate gate control.

FinFETs became the standard for high-performance logic at the 22 nm node (Intel, 2011)
and remain dominant through the 5 nm node. The successor, gate-all-around (GAA) nanosheet
FETs, encloses the channel on all four sides for even better electrostatic control.
See [Chapter 16](chapters/16-short-channel-cmos/index.md).

### What are 2D materials and how do they differ from bulk semiconductors?

Two-dimensional materials (graphene, MoS₂, WSe₂, h-BN, and other transition metal
dichalcogenides) are atomically thin crystals in which carriers are confined to a single
atomic plane. Because there is no bulk to deplete, 2D channel FETs have intrinsically
thin bodies, suppressing short-channel effects — potentially enabling scaling beyond
silicon FinFETs.

Unlike bulk semiconductors, many 2D materials have strongly layer-dependent bandgaps
(MoS₂ goes from indirect 1.3 eV bulk to direct 1.9 eV monolayer), valley degrees of
freedom (valleytronics), and extremely high in-plane stiffness. Current challenges are
contact resistance and large-area uniformity.
See [Chapter 20](chapters/20-strained-si-2d-power/index.md).

### What is the Shockley-Queisser limit?

The Shockley-Queisser (SQ) limit is the theoretical maximum efficiency of a single-junction
solar cell (~33% for an optimized bandgap of ~1.1–1.4 eV under AM1.5G illumination). It
arises from two fundamental losses: photons below the bandgap are not absorbed; photons
above the bandgap are absorbed but the excess energy above Eg is thermalized to heat.

Multi-junction cells stack semiconductors of different bandgaps, absorbing different parts
of the solar spectrum more efficiently and exceeding the SQ single-junction limit.
See [Chapter 18 — Photodetectors and Solar Cells](chapters/18-photodetectors-solar-cells/index.md).

### What is a high-electron-mobility transistor?

A high-electron-mobility transistor (HEMT) exploits the 2DEG at a heterojunction interface.
Because electrons are confined away from the doped barrier layer, ionized impurity
scattering is reduced, yielding very high mobility even at room temperature.

GaN HEMTs (AlGaN/GaN) combine high mobility with high breakdown field and high thermal
conductivity, making them dominant in power amplifiers for 5G base stations and power
electronics. InGaAs/InAlAs HEMTs provide the highest room-temperature mobility and are
used in low-noise amplifiers at millimeter-wave frequencies.
See [Chapter 19](chapters/19-compound-semiconductors-quantum/index.md).

### How does strained silicon improve MOSFET performance?

Depositing silicon on a relaxed SiGe buffer layer stretches the Si lattice biaxially
(tensile strain). This distortion splits the conduction-band valleys, preferentially
populating the low-effective-mass valleys perpendicular to the channel and reducing
phonon scattering — increasing electron mobility by 50–100%.

Compressive strain (from SiGe source/drain epitaxy pushing inward on the channel) enhances
hole mobility similarly. Intel introduced strained Si channels at the 90 nm node in 2003;
both uniaxial and biaxial strain engineering remain standard in FinFETs today.
See [Chapter 20](chapters/20-strained-si-2d-power/index.md).

### What is an avalanche photodiode and how does it work?

An avalanche photodiode (APD) is a reverse-biased photodetector that applies high enough
reverse bias to cause impact ionization. Each photogenerated carrier accelerates in the
strong depletion field and creates additional electron-hole pairs through impact ionization,
providing internal current gain (multiplication factor M = 10–100×).

APDs achieve higher sensitivity than PIN diodes for low-light detection (optical fiber
receivers, LIDAR) at the cost of excess noise introduced by the statistical nature of
the multiplication process. The excess noise factor F = kM + (2 − 1/M)(1−k) depends on
the impact ionization coefficient ratio k.
See [Chapter 18](chapters/18-photodetectors-solar-cells/index.md).

### What is the role of phonons in semiconductor transport?

Phonons are quantized lattice vibrations — the primary mechanism by which electrons in
a semiconductor scatter and lose momentum. Acoustic phonons (long-wavelength, low-energy)
provide the dominant scattering near room temperature for lightly doped material; optical
phonons (higher energy, ~60 meV in GaAs) become important at room temperature and for
hot carriers.

Phonon scattering also limits thermal conductivity: the same scattering that limits carrier
mobility allows phonons to carry heat. High thermal conductivity (e.g., diamond, SiC)
requires low phonon-phonon (Umklapp) scattering, which is why wide-gap materials make
excellent heat spreaders for high-power devices.
See [Chapter 8](chapters/08-carrier-drift-mobility/index.md) and
[Chapter 10](chapters/10-generation-recombination/index.md).
