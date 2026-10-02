// P-N Junction Explorer MicroSim
// CANVAS_HEIGHT: 700
//
// Four linked views of an abrupt silicon p-n junction (p side on the left):
//   1. Band diagram: E_C, E_V and the Fermi or quasi-Fermi levels
//   2. Charge density and electric field in the depletion approximation
//   3. Current density against voltage on a logarithmic scale, split into its
//      diffusion and recombination-generation parts
//   4. Carrier concentrations on both sides (or the worked calculation)
//
// Physics (Chapter 11):
//   V_bi = (kT/q) ln(N_A N_D / n_i^2)
//   W    = sqrt( 2 eps_s (V_bi - V)/q * (N_A + N_D)/(N_A N_D) ),  N_A x_p = N_D x_n
//   E_max = q N_D x_n / eps_s = 2 (V_bi - V) / W
//   J_diff = J_s (exp(V/V_th) - 1),  J_s = q n_i^2 (D_p/(L_p N_D) + D_n/(L_n N_A))
//   J_rg   = (q n_i W / 2 tau_0) (exp(V/2V_th) - 1)
// Silicon constants are the same as in the Chapter 7 MicroSims:
//   N_C, N_V = 2.86e19, 3.10e19 cm^-3 at 300 K (scaled as T^1.5), Varshni E_g(T)
//   with E_g(0) set so that n_i(300 K) = 9.65e9 cm^-3. eps_s = 11.7 eps_0.
// See index.md for the model details and limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 550;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 270;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Physical constants and silicon parameters ----
const Q = 1.602e-19;               // elementary charge (C)
const EPS_SI = 11.7 * 8.854e-14;   // permittivity of silicon (F/cm)
const KB_EV = 8.617333e-5;         // Boltzmann constant (eV/K)
const NC300 = 2.86e19;             // effective DOS, conduction band, 300 K (cm^-3)
const NV300 = 3.10e19;             // effective DOS, valence band, 300 K (cm^-3)
const NI300 = 9.65e9;              // intrinsic concentration at 300 K (cm^-3)
const VARSHNI_ALPHA = 4.73e-4;     // eV/K
const VARSHNI_BETA = 636;          // K
// 0 K gap chosen so sqrt(NC NV) exp(-Eg/2kT) = NI300 at 300 K (about 1.175 eV)
const EG0 = 2 * KB_EV * 300 * Math.log(Math.sqrt(NC300 * NV300) / NI300) +
            VARSHNI_ALPHA * 300 * 300 / (300 + VARSHNI_BETA);
const TAU0 = 1e-6;                 // minority carrier and generation lifetime (s)

const V_MIN = -5, V_MAX = 0.9;     // applied voltage range (V)
const J_MAX_EXP = 4;               // top of the current axis: 1e4 A/cm^2

// ---- Controls ----
let tempSelect, profileCheckbox, quasiCheckbox, resetButton;
let voltageSlider, naSlider, ndSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  tempSelect = createSelect();
  for (const t of [200, 250, 300, 350, 400]) tempSelect.option(t + ' K', t);
  tempSelect.selected('300');
  tempSelect.position(102, drawHeight + 9);

  profileCheckbox = createCheckbox(' Carrier profiles', true);
  profileCheckbox.position(178, drawHeight + 9);
  profileCheckbox.style('font-size', '14px');
  profileCheckbox.style('white-space', 'nowrap');

  quasiCheckbox = createCheckbox(' Quasi-Fermi levels', true);
  quasiCheckbox.position(318, drawHeight + 9);
  quasiCheckbox.style('font-size', '14px');
  quasiCheckbox.style('white-space', 'nowrap');

  resetButton = createButton('Reset');
  resetButton.position(478, drawHeight + 8);
  resetButton.mousePressed(resetDefaults);

  voltageSlider = createSlider(V_MIN, V_MAX, 0, 0.01);
  voltageSlider.position(sliderLeftMargin, drawHeight + 45);

  // log10 of the doping concentrations (cm^-3)
  naSlider = createSlider(14, 18, 17, 0.05);
  naSlider.position(sliderLeftMargin, drawHeight + 80);
  ndSlider = createSlider(14, 18, 16, 0.05);
  ndSlider.position(sliderLeftMargin, drawHeight + 115);
  sizeSliders();

  describe('Four linked plots for a silicon p-n junction. The band diagram ' +
    'shows the conduction and valence band edges bending across the ' +
    'depletion region, with the Fermi or quasi-Fermi levels. Below it are ' +
    'the charge density and the triangular electric field. On the right, a ' +
    'logarithmic plot of current density against voltage shows the ' +
    'diffusion and recombination-generation components, and a second plot ' +
    'shows the majority and minority carrier concentrations on each side. ' +
    'Sliders set the applied voltage and the doping on each side, and a ' +
    'menu sets the temperature. A readout lists the built-in potential, ' +
    'depletion width, peak field and current density.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

function bandgap(T) {
  return EG0 - VARSHNI_ALPHA * T * T / (T + VARSHNI_BETA);
}

function intrinsicConc(T) {
  const s = Math.pow(T / 300, 1.5);
  return Math.sqrt(NC300 * NV300) * s * Math.exp(-bandgap(T) / (2 * KB_EV * T));
}

// 300 K mobility fits against doping (cm^2/V.s): Chapter 8 for electrons,
// Arora et al. 1982 for holes
function mobilityN(N) { return 65 + (1330 - 65) / (1 + Math.pow(N / 1.26e17, 0.85)); }
function mobilityP(N) { return 54.3 + (461.2 - 54.3) / (1 + Math.pow(N / 2.35e17, 0.88)); }

// Everything that depends on doping and temperature but not on bias
function junctionParams(NA, ND, T) {
  const vth = KB_EV * T;                         // kT/q in volts
  const ni = intrinsicConc(T);
  const eg = bandgap(T);
  const s = Math.pow(T / 300, 1.5);
  const nc = NC300 * s, nv = NV300 * s;
  const vbi = vth * Math.log(NA * ND / (ni * ni));
  const Dn = mobilityN(NA) * vth;                // electrons are the minority on the p side
  const Dp = mobilityP(ND) * vth;                // holes are the minority on the n side
  const Ln = Math.sqrt(Dn * TAU0), Lp = Math.sqrt(Dp * TAU0);
  const np0 = ni * ni / NA, pn0 = ni * ni / ND;
  const Js = Q * ni * ni * (Dp / (Lp * ND) + Dn / (Ln * NA));
  const Nlow = Math.min(NA, ND);
  return {
    NA: NA, ND: ND, T: T, vth: vth, ni: ni, eg: eg, nc: nc, nv: nv, vbi: vbi,
    Dn: Dn, Dp: Dp, Ln: Ln, Lp: Lp, np0: np0, pn0: pn0, Js: Js,
    // the junction voltage can never reach V_bi; the plots stop just below it
    vCap: vbi - 0.05,
    // low-level injection holds while the injected minority density stays
    // below a tenth of the lighter doping
    vHLI: vth * Math.log(Nlow * Nlow / (10 * ni * ni)),
    // avalanche estimate of Section 12.1 for the lightly doped side
    vBD: 60 * Math.pow(eg / 1.1, 1.5) * Math.pow(Nlow / 1e16, -0.75)
  };
}

// Depletion-approximation electrostatics at junction voltage v (v < V_bi)
function depletion(p, v) {
  const W = Math.sqrt(2 * EPS_SI * (p.vbi - v) / Q * (p.NA + p.ND) / (p.NA * p.ND));
  const xn = W * p.NA / (p.NA + p.ND);
  const xp = W * p.ND / (p.NA + p.ND);
  return { W: W, xn: xn, xp: xp, emax: Q * p.ND * xn / EPS_SI };
}

function jDiffusion(p, v) { return p.Js * (Math.exp(v / p.vth) - 1); }

function jRecGen(p, v) {
  return Q * p.ni * depletion(p, v).W / (2 * TAU0) * (Math.exp(v / (2 * p.vth)) - 1);
}

function jTotal(p, v) { return jDiffusion(p, v) + jRecGen(p, v); }

// Local ideality factor n = (1/V_th) dV / d(ln J), forward bias only
function localIdeality(p, v) {
  const dv = 0.002;
  const a = jTotal(p, v - dv), b = jTotal(p, v + dv);
  if (a <= 0 || b <= 0) return NaN;
  return 2 * dv / (p.vth * Math.log(b / a));
}

// Forward voltage at which the diffusion current overtakes recombination
function crossoverVoltage(p) {
  const f = (v) => jDiffusion(p, v) - jRecGen(p, v);
  const hi = Math.min(V_MAX, p.vCap);
  if (hi <= 0.03 || f(0.03) >= 0) return 0;      // diffusion dominates everywhere
  if (f(hi) <= 0) return hi;                     // recombination dominates everywhere
  let a = 0.03, b = hi;
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2;
    if (f(m) > 0) b = m; else a = m;
  }
  return (a + b) / 2;
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const T = Number(tempSelect.value());
  const V = voltageSlider.value();
  const p = junctionParams(NA, ND, T);
  const vj = Math.min(V, p.vCap);                // junction voltage used in the plots
  const d = depletion(p, vj);
  const dRev = depletion(p, V_MIN);              // widest depletion: sets the x axis

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry: two columns of plots
  const leftPad = 52, gap = 64, rightPad = 14;
  const plotW = (canvasWidth - leftPad - gap - rightPad) / 2;
  const lx0 = leftPad, lx1 = leftPad + plotW;
  const rx0 = lx1 + gap, rx1 = rx0 + plotW;
  const r1y0 = 58, r1y1 = 228;                   // row 1: bands and J-V
  const r2y0 = 284, r2y1 = 434;                  // row 2: charge/field and carriers

  // Position axis shared by the band diagram and the charge/field plots
  let left = 1.3 * dRev.xp, right = 1.3 * dRev.xn;
  const span0 = left + right;
  left = Math.max(left, 0.2 * span0);
  right = Math.max(right, 0.2 * span0);
  const xOf = (x) => map(x, -left, right, lx0, lx1);

  drawBandDiagram(lx0, lx1, r1y0, r1y1, p, d, vj, V, xOf, left, right);
  drawChargeAndField(lx0, lx1, r2y0, r2y1, p, d, dRev, xOf, left, right);
  drawCurrentPlot(rx0, rx1, r1y0, r1y1, p, V, vj);
  if (profileCheckbox.checked()) {
    drawCarrierProfiles(rx0, rx1, r2y0, r2y1, p, vj);
  } else {
    drawWorkedCalculation(rx0 - 44, rx1, r2y0 - 20, r2y1 + 30, p, d, vj);
  }
  drawReadout(p, d, V, vj);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('P-N Junction Explorer: Silicon', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(V, NA, ND);
}

function plotFrame(x0, x1, y0, y1) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
}

function plotCaption(str, x0, x1, y) {
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  richText(str, (x0 + x1) / 2, y, CENTER);
  textStyle(NORMAL);
}

// Position ticks along the bottom of a plot, in nm or micrometers
function drawPositionAxis(x0, x1, y1, xOf, left, right, withTitle) {
  const span = left + right;                     // cm
  const useNm = span < 0.6e-4;
  const unit = useNm ? 1e-7 : 1e-4;
  const step = niceStep(span / unit / 5);
  textSize(12);
  for (let v = Math.ceil(-left / unit / step) * step; v <= right / unit + 1e-9; v += step) {
    const xx = xOf(v * unit);
    stroke('black'); strokeWeight(1);
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    const dec = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
    text(Math.abs(v) < step / 1000 ? '0' : v.toFixed(dec).replace('-', '−'), xx, y1 + 7);
  }
  if (withTitle) {
    textSize(13);
    textAlign(CENTER, TOP);
    text('Position x (' + (useNm ? 'nm' : 'µm') + ')', (x0 + x1) / 2, y1 + 24);
  }
}

// ---- Panel 1: band diagram ----
function drawBandDiagram(x0, x1, y0, y1, p, d, vj, V, xOf, left, right) {
  plotFrame(x0, x1, y0, y1);
  const h = y1 - y0;

  // Energies in eV, measured from the n-side Fermi level
  const ecN = p.vth * Math.log(p.nc / p.ND);     // E_C on the n side
  const barrier = p.vbi - vj;                    // q(V_bi - V) in eV
  const ecP = ecN + barrier;                     // E_C on the p side
  const efN = 0, efP = -vj;                      // majority Fermi levels
  const evN = ecN - p.eg;                         // E_V on the n side (lowest edge)
  // fixed scale for small barriers, compressed to fit under strong reverse bias
  const pxPerEv = Math.min((h - 44) / (ecP - evN), h / 3.0);
  const eMid = (ecP + evN) / 2, yMid = (y0 + y1) / 2;
  const yOf = (e) => yMid - (e - eMid) * pxPerEv;
  const eTop = eMid + (h / 2) / pxPerEv, eBot = eMid - (h / 2) / pxPerEv;

  // Potential energy step across the depletion region (eV, 0 on the p side)
  const psi = (x) => {
    if (x <= -d.xp) return 0;
    if (x <= 0) return Q * p.NA / (2 * EPS_SI) * (x + d.xp) * (x + d.xp);
    if (x < d.xn) return barrier - Q * p.ND / (2 * EPS_SI) * (d.xn - x) * (d.xn - x);
    return barrier;
  };

  // Depletion region shading and the metallurgical junction
  noStroke();
  fill(232);
  rect(xOf(-d.xp), y0 + 1, Math.max(xOf(d.xn) - xOf(-d.xp), 1.5), h - 2);
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xOf(0), y0, xOf(0), y1);
  drawingContext.setLineDash([]);

  // Band edges
  const xs = [-left, -d.xp, 0, d.xn, right];
  for (let i = 1; i < 60; i++) xs.push(-d.xp + (d.xn + d.xp) * i / 60);
  xs.sort((a, b) => a - b);
  noFill();
  stroke('black');
  strokeWeight(2);
  for (const off of [0, -p.eg]) {
    beginShape();
    for (const x of xs) vertex(xOf(x), yOf(ecP - psi(x) + off));
    endShape();
  }

  // Fermi levels
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  const equilibrium = Math.abs(vj) < 0.005;
  if (equilibrium) {
    stroke('darkgreen');
    line(x0, yOf(0), x1, yOf(0));
  } else if (quasiCheckbox.checked()) {
    // each quasi-Fermi level stays flat across the depletion region and on
    // into the far side (the diffusion lengths are far longer than this view)
    stroke('royalblue');
    line(x0, yOf(efN), x1, yOf(efN));
    stroke('crimson');
    line(x0, yOf(efP), x1, yOf(efP));
  } else {
    stroke('royalblue');
    line(xOf(d.xn), yOf(efN), x1, yOf(efN));
    stroke('crimson');
    line(x0, yOf(efP), xOf(-d.xp), yOf(efP));
  }
  drawingContext.setLineDash([]);

  // Labels
  noStroke();
  textSize(12);
  fill('black');
  richText('E_{C}', x0 + 6, yOf(ecP) - 9, LEFT);
  richText('E_{V}', x1 - 6, yOf(evN) + 10, RIGHT);
  if (equilibrium) {
    fill('darkgreen');
    richText('E_{F}', x1 - 6, yOf(0) + 9, RIGHT);
  } else {
    const q = quasiCheckbox.checked();
    fill('royalblue');
    richText(q ? 'F_{n}' : 'E_{Fn}', x1 - 6, yOf(efN) + 9, RIGHT);
    fill('crimson');
    richText(q ? 'F_{p}' : 'E_{Fp}', x0 + 6, yOf(efP) - 9, LEFT);
  }
  fill('dimgray');
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('p', x0 + 6, y1 - 17);
  textAlign(RIGHT, TOP);
  text('n', x1 - 6, y0 + 5);
  textStyle(NORMAL);

  // Barrier height
  fill('black');
  richText('barrier q(V_{bi} − V) = ' + barrier.toFixed(2) + ' eV', x1 - 22, y0 + 12, RIGHT);

  // Energy ticks (eV, measured from the n-side Fermi level)
  const eStep = pxPerEv > 40 ? 0.5 : pxPerEv > 26 ? 1 : 2;
  textSize(12);
  for (let e = Math.ceil((eBot + 0.05) / eStep) * eStep; e <= eTop - 0.05; e += eStep) {
    stroke('black'); strokeWeight(1);
    line(x0 - 4, yOf(e), x0, yOf(e));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(Math.abs(e) < 1e-9 ? '0' : e.toFixed(eStep < 1 ? 1 : 0).replace('-', '−'), x0 - 6, yOf(e));
  }

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, h);
  drawPositionAxis(x0, x1, y1, xOf, left, right, false);
  plotCaption('Band diagram', x0, x1, y0 - 12);

  // Vertical axis title
  push();
  translate(x0 - 38, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13); textAlign(CENTER, CENTER);
  text('Energy (eV)', 0, 0);
  pop();
}

// ---- Panel 2: charge density and electric field ----
function drawChargeAndField(x0, x1, y0, y1, p, d, dRev, xOf, left, right) {
  const rhoH = 62;                               // charge sub-plot height
  const fy0 = y0 + rhoH + 14;                    // field sub-plot top
  plotFrame(x0, x1, y0, y0 + rhoH);
  plotFrame(x0, x1, fy0, y1);

  // Charge density: -q N_A on the p side, +q N_D on the n side
  const yZero = y0 + rhoH / 2;
  const nMax = Math.max(p.NA, p.ND);
  const hMax = rhoH / 2 - 6;
  noStroke();
  fill('lightcoral');
  rect(xOf(-d.xp), yZero, Math.max(xOf(0) - xOf(-d.xp), 1.5), hMax * p.NA / nMax);
  fill('cornflowerblue');
  const hn = Math.max(hMax * p.ND / nMax, 1.5);
  rect(xOf(0), yZero - hn, Math.max(xOf(d.xn) - xOf(0), 1.5), hn);
  stroke('dimgray');
  strokeWeight(1);
  line(x0, yZero, x1, yZero);
  textSize(12);
  chipText('−qN_{A}', x0 + 6, y0 + rhoH - 11, LEFT, 'firebrick');
  chipText('+qN_{D}', x1 - 6, y0 + 11, RIGHT, 'royalblue');
  chipText('x_{p} = ' + fmtLen(d.xp), x0 + 6, y0 + 11, LEFT, 'dimgray');
  chipText('x_{n} = ' + fmtLen(d.xn), x1 - 6, y0 + rhoH - 11, RIGHT, 'dimgray');

  // Electric field: a triangle that peaks at the junction. The vertical scale
  // is fixed by the field at -5 V so the triangle grows with reverse bias.
  const fh = y1 - fy0;
  const yTop = fy0 + 8;
  const tip = yTop + (fh - 16) * d.emax / dRev.emax;
  fill(216, 191, 216, 150);
  stroke('purple');
  strokeWeight(2);
  triangle(xOf(-d.xp), yTop, xOf(0), tip, xOf(d.xn), yTop);
  stroke('dimgray');
  strokeWeight(1);
  line(x0, yTop, x1, yTop);
  textSize(12);
  const onLeft = xOf(0) - x0 > x1 - xOf(0);
  chipText('|E|_{max} = ' + fmtField(d.emax),
           onLeft ? x0 + 6 : x1 - 6, y1 - 11, onLeft ? LEFT : RIGHT, 'purple');
  chipText('field points from n to p', onLeft ? x0 + 6 : x1 - 6, y1 - 27, onLeft ? LEFT : RIGHT, 'dimgray');

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, rhoH);
  rect(x0, fy0, x1 - x0, fh);
  drawPositionAxis(x0, x1, y1, xOf, left, right, true);
  plotCaption('Charge density ρ(x) and electric field E(x)', x0, x1, y0 - 12);

  noStroke(); fill('black'); textSize(13);
  textAlign(CENTER, CENTER);
  text('ρ', x0 - 22, y0 + rhoH / 2);
  text('E', x0 - 22, (fy0 + y1) / 2);
}

// ---- Panel 3: current density against voltage (logarithmic) ----
function drawCurrentPlot(x0, x1, y0, y1, p, V, vj) {
  plotFrame(x0, x1, y0, y1);
  // Split voltage axis: reverse bias compressed into the left third
  const xZero = x0 + (x1 - x0) * 0.3;
  const xOfV = (v) => v < 0 ? map(v, V_MIN, 0, x0, xZero) : map(v, 0, V_MAX, xZero, x1);

  // Vertical range: from just under the reverse current to 1e4 A/cm^2
  const jRev = Math.abs(jTotal(p, -0.2));
  const minExp = constrain(Math.floor(Math.log10(jRev)) - 1, -26, -6);
  const yOfJ = (j) => map(Math.log10(Math.max(j, 1e-300)), minExp, J_MAX_EXP, y1, y0);

  // Shaded forward-bias regions: recombination (n near 2) and diffusion (n near 1)
  const vx = crossoverVoltage(p);
  const vEnd = Math.min(V_MAX, p.vCap);
  noStroke();
  if (vx > 0.03) {
    fill(255, 228, 196, 150);
    rect(xZero, y0 + 1, xOfV(Math.min(vx, vEnd)) - xZero, y1 - y0 - 2);
  }
  if (vEnd > vx) {
    fill(204, 229, 255, 150);
    rect(xOfV(vx), y0 + 1, xOfV(vEnd) - xOfV(vx), y1 - y0 - 2);
  }
  // beyond low-level injection the ideal-diode model no longer holds
  const vValid = Math.max(Math.min(p.vHLI, vEnd), 0);
  if (vValid < V_MAX) {
    fill(225);
    rect(xOfV(vValid), y0 + 1, x1 - xOfV(vValid), y1 - y0 - 2);
  }

  // Grid and tick labels
  const stepE = (J_MAX_EXP - minExp) > 16 ? 4 : 2;
  textSize(12);
  for (let e = J_MAX_EXP; e >= minExp; e -= stepE) {
    const y = yOfJ(Math.pow(10, e));
    stroke('gainsboro'); strokeWeight(1);
    line(x0, y, x1, y);
    noStroke(); fill('black');
    richText('10^{' + String(e).replace('-', '−') + '}', x0 - 5, y, RIGHT);
  }
  for (const v of [-4, -2, 0, 0.2, 0.4, 0.6, 0.8]) {
    const xx = xOfV(v);
    stroke('black'); strokeWeight(1);
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    text(v === 0 ? '0' : String(v).replace('-', '−'), xx, y1 + 7);
  }
  stroke('gray');
  strokeWeight(1);
  line(xZero, y0, xZero, y1);

  // Curves, clipped to the plot
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  const vs = [];
  for (let i = 0; i <= 50; i++) vs.push(V_MIN + (0 - V_MIN) * i / 50 - (i === 50 ? 0.004 : 0));
  for (let i = 0; i <= 130; i++) vs.push(0.004 + (vEnd - 0.004) * i / 130);
  const curves = [
    { f: jRecGen, col: 'darkorange', w: 2, dash: [5, 4] },
    { f: jDiffusion, col: 'royalblue', w: 2, dash: [5, 4] },
    { f: jTotal, col: 'black', w: 3, dash: [] }
  ];
  noFill();
  for (const c of curves) {
    stroke(c.col);
    strokeWeight(c.w);
    drawingContext.setLineDash(c.dash);
    for (const side of [-1, 1]) {
      beginShape();
      for (const v of vs) {
        if (v * side > 0) vertex(xOfV(v), yOfJ(Math.abs(c.f(p, v))));
      }
      endShape();
    }
  }
  drawingContext.setLineDash([]);
  pop();

  // Probe
  const xpz = xOfV(vj);
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xpz, y0, xpz, y1);
  drawingContext.setLineDash([]);
  const jNow = Math.abs(jTotal(p, vj));
  if (Math.abs(vj) >= 0.004 && jNow < Math.pow(10, J_MAX_EXP) && jNow > Math.pow(10, minExp)) {
    stroke('white');
    strokeWeight(1.5);
    fill('black');
    circle(xpz, yOfJ(jNow), 10);
  }

  // Region labels
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  if (Math.min(vx, vValid) > 0.14) {
    fill('chocolate');
    text('n ≈ 2', (xZero + xOfV(Math.min(vx, vValid))) / 2, y0 + 5);
  }
  if (vValid - vx > 0.14) {
    fill('royalblue');
    text('n ≈ 1', (xOfV(vx) + xOfV(vValid)) / 2, y0 + 5);
  }
  if (V_MAX - vValid > 0.3) {
    fill('dimgray');
    text('high injection', (xOfV(vValid) + x1) / 2, y0 + 5);
  }
  fill('dimgray');
  text('reverse', (x0 + xZero) / 2, y0 + 5);

  // Legend
  const lx = x1 - 98, ly = y1 - 40;
  noStroke();
  fill(255, 255, 255, 215);
  rect(lx - 5, ly - 9, 100, 46, 4);
  const items = [['black', [], 'total'], ['royalblue', [5, 4], 'diffusion'],
                 ['darkorange', [5, 4], 'recomb.-gen.']];
  textAlign(LEFT, CENTER);
  for (let i = 0; i < items.length; i++) {
    stroke(items[i][0]);
    strokeWeight(i === 0 ? 3 : 2);
    drawingContext.setLineDash(items[i][1]);
    line(lx, ly + i * 14, lx + 20, ly + i * 14);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black');
    textSize(11);
    text(items[i][2], lx + 25, ly + i * 14);
  }

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  plotCaption('Current density |J| (A/cm^{2})', x0, x1, y0 - 12);
  noStroke(); fill('black');
  fitText('Applied voltage V (V); reverse side compressed', (x0 + x1) / 2, y1 + 31, x1 - x0 + 30);
}

// ---- Panel 4a: carrier concentrations on a logarithmic scale ----
function drawCarrierProfiles(x0, x1, y0, y1, p, vj) {
  plotFrame(x0, x1, y0, y1);
  const band = 18;                               // depletion region, not to scale
  const xc = (x0 + x1) / 2;
  const pxL = xc - band / 2, nxL = xc + band / 2;
  const minExp = Math.floor(Math.log10(Math.min(p.np0, p.pn0))) - 2;
  const maxExp = 19;
  const yOfC = (c) => map(Math.log10(Math.max(c, 1e-300)), minExp, maxExp, y1, y0);
  const SPAN = 3;                                // diffusion lengths shown on each side

  const stepE = (maxExp - minExp) > 16 ? 6 : (maxExp - minExp) > 10 ? 4 : 3;
  textSize(12);
  for (let e = maxExp - 1; e >= minExp; e -= stepE) {
    const y = yOfC(Math.pow(10, e));
    stroke('gainsboro'); strokeWeight(1);
    line(x0, y, x1, y);
    noStroke(); fill('black');
    richText('10^{' + String(e).replace('-', '−') + '}', x0 - 5, y, RIGHT);
  }
  noStroke();
  fill(232);
  rect(pxL, y0 + 1, band, y1 - y0 - 2);

  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  const boost = Math.exp(vj / p.vth) - 1;
  noFill();
  // Equilibrium minority levels (dotted)
  strokeWeight(1);
  drawingContext.setLineDash([2, 4]);
  stroke('royalblue');
  line(x0, yOfC(p.np0), pxL, yOfC(p.np0));
  stroke('crimson');
  line(nxL, yOfC(p.pn0), x1, yOfC(p.pn0));
  drawingContext.setLineDash([]);
  // Majority carriers
  strokeWeight(2.5);
  stroke('crimson');
  line(x0, yOfC(p.NA), pxL, yOfC(p.NA));
  stroke('royalblue');
  line(nxL, yOfC(p.ND), x1, yOfC(p.ND));
  // Minority carriers: equilibrium value plus the injected (or extracted) excess
  stroke('royalblue');
  beginShape();
  for (let i = 0; i <= 60; i++) {
    const u = SPAN * i / 60;                     // distance from the edge in L_n
    vertex(pxL - (pxL - x0) * u / SPAN, yOfC(p.np0 * (1 + boost * Math.exp(-u))));
  }
  endShape();
  stroke('crimson');
  beginShape();
  for (let i = 0; i <= 60; i++) {
    const u = SPAN * i / 60;
    vertex(nxL + (x1 - nxL) * u / SPAN, yOfC(p.pn0 * (1 + boost * Math.exp(-u))));
  }
  endShape();
  pop();

  // Curve labels
  noStroke();
  textSize(12);
  fill('crimson');
  richText('p_{p} = N_{A}', x0 + 6, yOfC(p.NA) + 10, LEFT);
  richText('p_{n0}', x1 - 6, Math.min(yOfC(p.pn0) + 11, y1 - 9), RIGHT);
  fill('royalblue');
  richText('n_{n} = N_{D}', x1 - 6, yOfC(p.ND) + 10, RIGHT);
  richText('n_{p0}', x0 + 6, Math.min(yOfC(p.np0) + 11, y1 - 9), LEFT);
  // label the minority curves where they stand clear of the equilibrium lines
  const mid = 1 + boost * Math.exp(-1.5);
  const yn = yOfC(p.np0 * mid), ypn = yOfC(p.pn0 * mid);
  if (yOfC(p.np0) - yn > 18 && yn > y0 + 16) {
    fill('royalblue');
    richText('n_{p}(x)', (x0 + pxL) / 2, yn - 10, CENTER);
  }
  if (yOfC(p.pn0) - ypn > 18 && ypn > y0 + 16) {
    fill('crimson');
    richText('p_{n}(x)', (nxL + x1) / 2, ypn - 10, CENTER);
  }

  // Distance ticks in diffusion lengths
  for (let k = 1; k <= SPAN; k++) {
    for (const side of [-1, 1]) {
      const xx = side < 0 ? pxL - (pxL - x0) * k / SPAN : nxL + (x1 - nxL) * k / SPAN;
      stroke('black'); strokeWeight(1);
      line(xx, y1, xx, y1 + 4);
      if (k < SPAN) {
        noStroke(); fill('black');
        richText((k === 1 ? '' : k) + (side < 0 ? 'L_{n}' : 'L_{p}'), xx, y1 + 13, CENTER);
      }
    }
  }
  noStroke(); fill('dimgray'); textSize(11); textAlign(CENTER, TOP);
  text('W', xc, y1 + 7);

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  plotCaption('Carrier concentrations (cm^{−3})', x0, x1, y0 - 12);
  noStroke(); fill('black');
  fitText('Distance from the edges (L_{n} = ' + fmtLen(p.Ln) +
          ', L_{p} = ' + fmtLen(p.Lp) + ')', (x0 + x1) / 2, y1 + 31, x1 - x0 + 30);
}

// ---- Panel 4b: the chapter formulas with the present numbers ----
function drawWorkedCalculation(x0, x1, y0, y1, p, d, vj) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x0, y0, x1 - x0, y1 - y0, 8);
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Worked calculation', x0 + 10, y0 + 15);
  textStyle(NORMAL);
  const small = (x1 - x0) < 330;
  textSize(small ? 11 : 12);
  const lines = [
    'kT/q = ' + (p.vth * 1000).toFixed(2) + ' mV,   n_{i} = ' + sci(p.ni, 2) + ' cm^{−3}',
    'V_{bi} = (kT/q) ln(N_{A}N_{D}/n_{i}^{2})',
    '      = ' + (p.vth * 1000).toFixed(2) + ' mV × ln(' + sci(p.NA * p.ND / (p.ni * p.ni), 2) + ') = ' + p.vbi.toFixed(3) + ' V',
    'W = [2ε_{s}(V_{bi} − V)(N_{A} + N_{D})/(qN_{A}N_{D})]^{1/2}',
    '      = ' + fmtLen(d.W) + '   with V_{bi} − V = ' + (p.vbi - vj).toFixed(3) + ' V',
    'x_{n} = W N_{A}/(N_{A} + N_{D}) = ' + fmtLen(d.xn) + ',   x_{p} = ' + fmtLen(d.xp),
    '|E|_{max} = 2(V_{bi} − V)/W = ' + fmtField(d.emax),
    'J_{s} = q n_{i}^{2} [D_{p}/(L_{p}N_{D}) + D_{n}/(L_{n}N_{A})] = ' + sci(p.Js, 2) + ' A/cm^{2}',
    'D_{p} = ' + p.Dp.toFixed(1) + ', D_{n} = ' + p.Dn.toFixed(1) + ' cm^{2}/s,   τ = 1 µs'
  ];
  let cy = y0 + 36;
  const lh = (y1 - y0 - 44) / (lines.length - 1);
  for (const s of lines) {
    richText(s, x0 + 10, cy, LEFT);
    cy += lh;
  }
}

// ---- Readout strip under the plots ----
function drawReadout(p, d, V, vj) {
  const x = 10, y = 474, w = canvasWidth - 20, h = 68;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const small = canvasWidth < 720;
  textSize(small ? 12 : 13);
  fill('black');
  textStyle(BOLD);
  richText('V_{bi} = ' + p.vbi.toFixed(3) + ' V     W = ' + fmtLen(d.W) +
           '     |E|_{max} = ' + fmtField(d.emax), x + 12, y + 14, LEFT);
  textStyle(NORMAL);

  // Current and its dominant component
  let line2;
  const jd = jDiffusion(p, vj), jr = jRecGen(p, vj), jt = jd + jr;
  if (Math.abs(vj) < 0.004) {
    line2 = 'J = 0: drift and diffusion balance at equilibrium.';
  } else {
    const share = Math.round(100 * jr / jt);
    const dom = share >= 50 ? 'recombination-generation ' + share + ' %'
                            : 'diffusion ' + (100 - share) + ' %';
    line2 = 'J = ' + sci(jt, 2) + ' A/cm^{2}  (' + dom + ')';
    if (vj > 0.05) {
      const n = localIdeality(p, vj);
      if (isFinite(n)) line2 += '     local ideality factor n = ' + n.toFixed(2);
    }
  }
  richText(line2, x + 12, y + 34, LEFT);

  // Status or caution line
  let note, col = 'dimgray';
  if (V > p.vCap) {
    col = 'firebrick';
    note = 'Caution: the junction cannot take more than about V_{bi} − 0.05 V. Plots are frozen there; the model is not valid.';
  } else if (V > p.vHLI) {
    col = 'firebrick';
    note = 'Caution: high-level injection above ' + p.vHLI.toFixed(2) +
           ' V. The ideal-diode model overestimates J here.';
  } else if (-V > p.vBD) {
    col = 'firebrick';
    note = 'Caution: reverse bias exceeds the avalanche estimate of Section 12.1 (about ' +
           p.vBD.toFixed(1) + ' V). Breakdown is not modeled.';
  } else if (V > 0.004) {
    note = 'Forward bias: the barrier drops, the depletion region narrows, minority carriers are injected.';
  } else if (V < -0.004) {
    note = 'Reverse bias: the barrier rises, the depletion region widens, minority carriers are extracted.';
  } else {
    note = 'Equilibrium: the Fermi level is flat and no net current flows.';
  }
  fill(col);
  textSize(small ? 11 : 12);
  richText(note, x + 12, y + 54, LEFT);
}

function drawControlLabels(V, NA, ND) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Temperature:', 10, drawHeight + 20);
  text('Applied voltage V: ' + (V > 0 ? '+' : V < 0 ? '−' : '') + Math.abs(V).toFixed(2) + ' V',
       10, drawHeight + 55);
  richText('p-side doping N_{A}: ' + sci(NA, 1) + ' cm^{−3}', 10, drawHeight + 90, LEFT);
  richText('n-side doping N_{D}: ' + sci(ND, 1) + ' cm^{−3}', 10, drawHeight + 125, LEFT);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetDefaults() {
  tempSelect.selected('300');
  voltageSlider.value(0);
  naSlider.value(17);
  ndSlider.value(16);
  profileCheckbox.checked(true);
  quasiCheckbox.checked(true);
}

// richText on a translucent white chip, so it stays readable over filled shapes
function chipText(str, x, y, align, col) {
  const w = richWidth(str), ts = textSize();
  const left = align === RIGHT ? x - w : align === CENTER ? x - w / 2 : x;
  noStroke();
  fill(255, 255, 255, 205);
  rect(left - 3, y - ts * 0.62, w + 6, ts * 1.3, 3);
  fill(col);
  richText(str, x, y, align);
}

// Centered richText that shrinks from 13 px until it fits in maxWidth
function fitText(str, cx, y, maxWidth) {
  let size = 13;
  textSize(size);
  while (size > 10 && richWidth(str) > maxWidth) {
    size -= 0.5;
    textSize(size);
  }
  richText(str, cx, y, CENTER);
}

// Width of a richText string at the current text size
function richWidth(str) {
  const base = textSize();
  let total = 0, last = 0, m;
  const re = /([_^])\{([^}]*)\}/g;
  while ((m = re.exec(str)) !== null) {
    total += textWidth(str.slice(last, m.index));
    textSize(base * 0.72);
    total += textWidth(m[2]);
    textSize(base);
    last = re.lastIndex;
  }
  return total + textWidth(str.slice(last));
}

// 1, 2 or 5 times a power of ten, at or above x
function niceStep(x) {
  const e = Math.floor(Math.log10(x));
  const m = x / Math.pow(10, e);
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * Math.pow(10, e);
}

// Length given in cm, shown in nm or micrometers with three significant figures
function fmtLen(cm) {
  const um = cm * 1e4;
  if (um < 1) return (um * 1000).toPrecision(3) + ' nm';
  return um.toPrecision(3) + ' µm';
}

// Field given in V/cm
function fmtField(e) {
  if (e >= 1e6) return (e / 1e6).toPrecision(3) + ' MV/cm';
  return (e / 1e3).toPrecision(3) + ' kV/cm';
}

// Scientific notation in richText markup, e.g. "−1.0 × 10^{16}"
function sci(x, digits) {
  if (x === 0) return '0';
  const sign = x < 0 ? '−' : '';
  const a = Math.abs(x);
  let e = Math.floor(Math.log10(a));
  let m = a / Math.pow(10, e);
  if (Number(m.toFixed(digits)) >= 10) { m /= 10; e += 1; }
  return sign + m.toFixed(digits) + ' × 10^{' + String(e).replace('-', '−') + '}';
}

// Draw text containing _{subscript} and ^{superscript} markup.
// (x, y) is the left / center / right anchor at the vertical center of the line.
function richText(str, x, y, align) {
  const segs = [];
  const re = /([_^])\{([^}]*)\}/g;
  let last = 0, m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) segs.push({ t: str.slice(last, m.index), mode: 0 });
    segs.push({ t: m[2], mode: m[1] === '_' ? 1 : 2 });
    last = re.lastIndex;
  }
  if (last < str.length) segs.push({ t: str.slice(last), mode: 0 });

  push();
  noStroke();
  const base = textSize();
  let total = 0;
  for (const s of segs) {
    textSize(s.mode ? base * 0.72 : base);
    s.w = textWidth(s.t);
    total += s.w;
  }
  let cx = align === CENTER ? x - total / 2 : align === RIGHT ? x - total : x;
  textAlign(LEFT, CENTER);
  for (const s of segs) {
    textSize(s.mode ? base * 0.72 : base);
    const dy = s.mode === 1 ? base * 0.28 : s.mode === 2 ? -base * 0.32 : 0;
    text(s.t, cx, y + dy);
    cx += s.w;
  }
  pop();
  return total;
}

function sizeSliders() {
  const w = canvasWidth - sliderLeftMargin - margin;
  voltageSlider.size(w);
  naSlider.size(w);
  ndSlider.size(w);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    const w = Math.floor(container.getBoundingClientRect().width);
    if (w > 0) canvasWidth = w;
    if (typeof voltageSlider !== 'undefined' && voltageSlider) sizeSliders();
  }
}
