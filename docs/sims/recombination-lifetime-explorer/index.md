---
title: Recombination Lifetime Explorer
description: Three linked panels for radiative, Shockley-Read-Hall, and Auger recombination in an n-type semiconductor. A band diagram shows each path's share of the recombination rate, a decay plot shows how the excess carriers disappear, and a lifetime-versus-doping plot shows where each mechanism dominates.
image: /sims/recombination-lifetime-explorer/recombination-lifetime-explorer.png
og:image: /sims/recombination-lifetime-explorer/recombination-lifetime-explorer.png
twitter:image: /sims/recombination-lifetime-explorer/recombination-lifetime-explorer.png
social:
   cards: false
---

# Recombination Lifetime Explorer

<iframe src="main.html" width="100%" height="629" scrolling="no"></iframe>

[Run the Recombination Lifetime Explorer Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/semiconductor-physics-course/sims/recombination-lifetime-explorer/main.html"
        width="100%" height="629" scrolling="no"></iframe>
```

## Description

Excess carriers return to equilibrium by three routes that act in parallel.
This MicroSim shows all three for an n-type sample at 300 K and lets you find
out which one sets the minority carrier lifetime.

- **Recombination paths (left).** A band diagram with the three routes:
  radiative band-to-band recombination with an emitted photon (orange),
  Shockley-Read-Hall recombination through a trap level \(E_t\) (blue), and
  Auger recombination, in which the energy goes to a second electron (green).
  The thickness of each arrow and the percentage under it give that route's
  share of the total recombination rate. Press **Start** to animate
  transitions; they occur more often on the busier routes.
- **Decay (middle).** The excess hole density \(\delta p(t)\) after the
  injection stops, divided by its starting value, on a logarithmic axis. The
  black curve includes all three mechanisms. Each colored curve shows the
  decay if that mechanism acted alone. A straight line means a single
  exponential.
- **Lifetime vs. doping (right).** The lifetime of each mechanism and the
  effective lifetime (black) against donor concentration, at the selected
  injection level. The colored strip along the bottom shows which mechanism
  is fastest at each doping. The dot marks the selected doping.
- **Readout strip.** The three lifetimes, their shares of the rate, the
  effective lifetime, and the dominant mechanism.

Controls:

- **Material:** silicon (indirect gap) or GaAs (direct gap).
- **Trap density** \(N_t\), from \(10^{10}\) to \(10^{14}\ \text{cm}^{-3}\).
- **Trap level** \(E_t - E_i\), from −0.50 eV to +0.50 eV relative to the
  intrinsic level (close to midgap).
- **Doping** \(N_D\), from \(10^{14}\) to \(10^{19}\ \text{cm}^{-3}\).
- **Injection level** \(\delta n/n_0\), from \(10^{-4}\) to 100.

## Things to Try

1. **Predict first.** With the defaults (silicon, \(N_t = 10^{12}\),
   midgap trap), calculate \(\tau = 1/(\sigma v_{\text{th}} N_t)\) using
   \(\sigma = 10^{-15}\ \text{cm}^2\) and \(v_{\text{th}} = 10^{7}\) cm/s.
   Compare with the SRH lifetime in the strip.
2. Move the **trap level** away from midgap in either direction. The SRH
   lifetime grows. Why is a trap near a band edge a poor recombination
   center?
3. Raise the silicon **doping** toward \(10^{19}\ \text{cm}^{-3}\). Find the
   doping at which Auger recombination takes over from SRH. How does that
   crossover move when you lower the trap density to \(10^{10}\)?
4. Switch to **GaAs** at \(10^{17}\ \text{cm}^{-3}\). Which mechanism
   dominates now, and why does that make GaAs a good LED material and silicon
   a poor one?
5. In lightly doped silicon (\(10^{14}\)), raise the **injection level** to
   100. The decay curve is no longer a straight line. Which part of the decay
   is fastest, and which mechanism causes it?
6. Find a setting where radiative recombination dominates in *silicon*. Is
   there one?

## The Physics Behind the Simulation

The sample is n-type with \(n_0 = N_D\) and \(p_0 = n_i^2/N_D\). Injection
adds equal numbers of electrons and holes, so \(n = n_0 + \delta n\) and
\(p = p_0 + \delta n\). The net recombination rates of Section 10.2 are

\[
U_{\text{rad}} = B\,(np - n_i^2)
\]

\[
U_{\text{SRH}} = \frac{np - n_i^2}{\tau_{p0}(n + n_1) + \tau_{n0}(p + p_1)},
\qquad \tau_{n0} = \tau_{p0} = \frac{1}{\sigma\,v_{\text{th}}\,N_t}
\]

\[
U_{\text{Auger}} = (C_n n + C_p p)(np - n_i^2)
\]

with the trap emission terms written relative to the intrinsic level:

\[
n_1 = n_i\,e^{(E_t - E_i)/k_BT}, \qquad p_1 = n_i\,e^{(E_i - E_t)/k_BT}
\]

Each mechanism's lifetime is \(\tau = \delta n/U\), and because the rates
add,

\[
\frac{1}{\tau_{\text{eff}}} = \frac{1}{\tau_{\text{rad}}} + \frac{1}{\tau_{\text{SRH}}} + \frac{1}{\tau_{\text{Auger}}}
\]

The decay curves come from integrating
\(d(\delta p)/dt = -U(\delta p)\) numerically, so they stay correct at high
injection, where the lifetime changes as the carriers decay.

| Parameter | Silicon | GaAs |
|-----------|---------|------|
| \(n_i\) at 300 K (cm⁻³) | \(9.65 \times 10^{9}\) | \(2.1 \times 10^{6}\) |
| Radiative coefficient \(B\) (cm³/s) | \(10^{-15}\) | \(10^{-10}\) |
| Auger coefficients \(C_n\), \(C_p\) (cm⁶/s) | \(2.8 \times 10^{-31}\), \(0.99 \times 10^{-31}\) | \(\approx 10^{-30}\) each |
| Capture cross sections \(\sigma_n = \sigma_p\) | \(10^{-15}\ \text{cm}^2\) | \(10^{-15}\ \text{cm}^2\) |
| Thermal velocity \(v_{\text{th}}\) | \(10^{7}\) cm/s | \(10^{7}\) cm/s |

The radiative coefficients are the representative values quoted in
Section 10.2.1. The silicon Auger coefficients are those of Dziewior and
Schmid (1977). The GaAs Auger coefficient and the capture cross section are
representative order-of-magnitude values.

**Worked check.** Silicon, \(N_D = 10^{16}\), \(N_t = 10^{12}\ \text{cm}^{-3}\),
midgap trap, \(\delta n = 10^{14}\ \text{cm}^{-3}\):

\[
\tau_{p0} = \frac{1}{(10^{-15})(10^{7})(10^{12})} = 100\ \mu\text{s}
\]

\[
\tau_{\text{SRH}} = \frac{\tau_{p0}(n + n_1) + \tau_{n0}(p + p_1)}{n_0 + p_0 + \delta n}
\approx \frac{(100\ \mu\text{s})(1.02 \times 10^{16})}{1.01 \times 10^{16}} = 101\ \mu\text{s}
\]

\[
\tau_{\text{rad}} = \frac{1}{B(n_0 + \delta n)} = \frac{1}{(10^{-15})(1.01 \times 10^{16})} = 99\ \text{ms},
\qquad
\tau_{\text{Auger}} \approx \frac{1}{C_n n\,(n_0 + \delta n)} = 35\ \text{ms}
\]

so \(\tau_{\text{eff}} = 101\ \mu\text{s}\) and SRH carries more than 99 % of
the recombination. These are the values in the readout strip.

### Simplifications and Limitations

- **GaN is not included.** The specification listed GaN as a third material.
  Published values of its radiative coefficient differ by more than two
  orders of magnitude and its Auger coefficient is still debated, so the sim
  leaves it out rather than show numbers that cannot be stated with
  confidence.
- **One trap level** with equal electron and hole capture cross sections.
  Real defects have unequal cross sections and several levels.
- **N-type only, 300 K.** A p-type sample behaves the same way with the
  roles of electrons and holes exchanged.
- **Excess density cap.** \(\delta n\) is limited to
  \(10^{19}\ \text{cm}^{-3}\). When the injection slider asks for more, the
  strip shows "(capped)" and the lifetime curve has a kink at the doping
  where the cap begins.
- **Constant coefficients.** \(B\), \(C_n\), and \(C_p\) are constants. Real
  Auger and radiative coefficients vary with carrier density, and bandgap
  narrowing in heavily doped material is ignored.
- **No surface recombination** (Section 10.3) and no carrier trapping
  dynamics: the SRH rate is the steady-state expression.
- The trap-level slider is measured from \(E_i\), which the diagram draws at
  midgap.

## Lesson Plan

**Learning objectives:** Students will be able to

- identify (Understand, L2) which recombination mechanism dominates at a
  given doping and injection level,
- calculate (Apply, L3) the minority carrier lifetime from the trap density
  and capture cross section, and
- explain (Analyze, L4) why the position of the trap level affects SRH
  recombination.

**Audience:** College juniors and seniors in a first semiconductor devices
course.

**Duration:** 15–20 minutes.

**Prerequisites:** Equilibrium carrier concentrations and \(np = n_i^2\)
(Chapters 6–7); excess carriers and injection level (Section 10.1); the three
recombination mechanisms (Section 10.2).

### Suggested Sequence

1. **Warm-up (3 min):** With the defaults, students name the three paths in
   the band diagram and say where the energy goes in each.
2. **Lifetime engineering (5 min):** Students find the trap density that
   gives a 1 ms lifetime (solar-grade silicon) and the density that gives
   1 µs (a fast switching diode), first by calculation and then with the
   slider.
3. **Mechanism map (6 min):** For silicon and then GaAs, students sweep the
   doping and record the range over which each mechanism dominates, using the
   colored strip in the right panel.
4. **Trap position (4 min):** Students move the trap level from midgap to
   ±0.4 eV, record the SRH lifetime, and explain the trend using \(n_1\) and
   \(p_1\).

### Assessment Questions

1. A silicon wafer has \(N_t = 5 \times 10^{11}\ \text{cm}^{-3}\) midgap traps
   with \(\sigma = 10^{-15}\ \text{cm}^2\). Estimate the low-injection
   minority carrier lifetime.
   *(\(\tau = 1/(\sigma v_{\text{th}} N_t) = 200\ \mu\text{s}\).)*
2. Why does a trap 0.4 eV above \(E_i\) in n-type silicon doped at
   \(10^{16}\ \text{cm}^{-3}\) give a longer lifetime than a midgap trap of
   the same density?
   *(A captured electron is re-emitted to the conduction band before a hole
   arrives. In the formula, \(n_1\) becomes comparable to \(n_0\), which
   raises \(\tau_{\text{SRH}}\) to about six times \(\tau_{p0}\).)*
3. Why does Auger recombination limit the lifetime in heavily doped emitters
   however clean the material is?
   *(Its rate grows as the square of the majority carrier density and does
   not depend on defects.)*

## References

- [Chapter 10: Generation and Recombination](../../chapters/10-generation-recombination/index.md) —
  Sections 10.1 and 10.2, the three recombination mechanisms
- W. Shockley and W. T. Read, "Statistics of the recombinations of holes and
  electrons," *Physical Review*, vol. 87, pp. 835–842, 1952.
- R. N. Hall, "Electron-hole recombination in germanium," *Physical Review*,
  vol. 87, p. 387, 1952.
- J. Dziewior and W. Schmid, "Auger coefficients for highly doped and highly
  excited silicon," *Applied Physics Letters*, vol. 31, pp. 346–348, 1977.
- [Carrier generation and recombination (Wikipedia)](https://en.wikipedia.org/wiki/Carrier_generation_and_recombination)
