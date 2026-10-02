// MOS Capacitor C-V Explorer MicroSim
// CANVAS_HEIGHT: 705
//
// Capacitance-voltage curves of a metal / SiO2 / p-type silicon capacitor at
// 300 K, with the band diagram at a chosen gate voltage.
//
// Physics (Chapter 13, p-type substrate):
//   C_ox = eps_ox / t_ox,  eps_ox = 3.9 eps_0,  eps_s = 11.7 eps_0
//   phi_F = (kT/q) ln(N_A / n_i),  threshold at psi_s = 2 phi_F
//   Semiconductor charge from the exact solution of Poisson's equation with
//   Boltzmann statistics (u = psi_s / V_th, g = (n_i/N_A)^2):
//     |Q_s| = sqrt(2 eps_s q N_A V_th) * sqrt[(e^-u + u - 1) + g (e^u - u - 1)]
//   Gate voltage:
//     V_G = phi_ms - Q_f/C_ox + psi_s - Q_s/C_ox + q D_it (psi_s - phi_F)/C_ox
//   Low frequency:  C = C_ox in series with (dQ_s/dpsi_s + q D_it)
//   High frequency: inversion charge and interface traps do not follow the
//     signal, so C = C_ox in series with the depletion capacitance, which
//     stops changing once psi_s reaches 2 phi_F
//   Deep depletion: no inversion charge at all; the depletion layer keeps growing
// Silicon constants as in the other MicroSims of this book:
//   n_i(300 K) = 9.65e9 cm^-3, N_V = 3.10e19 cm^-3, chi = 4.05 eV
// See index.md for details and limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 450;              // drawing region height
let controlHeight = 255;           // control region height (7 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 310;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Physical constants (300 K) ----
const Q = 1.602e-19;               // elementary charge (C)
const EPS0 = 8.854e-14;            // F/cm
const EPS_SI = 11.7 * EPS0;
const EPS_OX = 3.9 * EPS0;
const VTH = 8.617333e-5 * 300;     // kT/q at 300 K (V)
const NI = 9.65e9;                 // intrinsic concentration (cm^-3)
const NC = 2.86e19, NV = 3.10e19;  // effective densities of states (cm^-3)
const EG = 2 * VTH * Math.log(Math.sqrt(NC * NV) / NI);  // gap consistent with n_i (1.130 eV)
const CHI_SI = 4.05;               // electron affinity of silicon (eV)
const CHI_OX = 0.95;               // electron affinity of SiO2 (eV)

// ---- Controls ----
let modeRadio, deepCheckbox, resetButton;
let vgSlider, toxSlider, naSlider, qfSlider, ditSlider, phimSlider;

// ---- Cached curves (recomputed only when a parameter changes) ----
let cache = { key: '' };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  modeRadio = createRadio();
  modeRadio.option('hf', ' High frequency');
  modeRadio.option('lf', ' Low frequency');
  modeRadio.option('both', ' Both');
  modeRadio.selected('both');
  modeRadio.position(10, drawHeight + 10);
  modeRadio.style('font-size', '14px');

  deepCheckbox = createCheckbox(' Deep depletion', false);
  deepCheckbox.position(338, drawHeight + 9);
  deepCheckbox.style('font-size', '14px');
  deepCheckbox.style('white-space', 'nowrap');

  resetButton = createButton('Reset');
  resetButton.position(478, drawHeight + 8);
  resetButton.mousePressed(resetDefaults);

  // probe position as a fraction of the voltage axis
  vgSlider = createSlider(0, 1, 0.62, 0.002);
  toxSlider = createSlider(1, 20, 10, 0.5);              // nm
  naSlider = createSlider(15, 18, 17, 0.05);             // log10(cm^-3)
  qfSlider = createSlider(-100, 100, 0, 2);              // units of 1e10 cm^-2
  ditSlider = createSlider(0, 100, 0, 2);                // units of 1e10 cm^-2 eV^-1
  phimSlider = createSlider(4.0, 5.2, 4.1, 0.05);        // eV
  const sliders = [vgSlider, toxSlider, naSlider, qfSlider, ditSlider, phimSlider];
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].position(sliderLeftMargin, drawHeight + 45 + 35 * i);
  }
  sizeSliders();

  describe('Capacitance against gate voltage for a metal oxide semiconductor ' +
    'capacitor on p-type silicon. A low-frequency curve dips in depletion ' +
    'and returns to the oxide capacitance in inversion, and a ' +
    'high-frequency curve stays at its minimum. Vertical lines mark the ' +
    'flat-band and threshold voltages. A band diagram on the right shows ' +
    'the gate, oxide and silicon bands at the probe voltage. Sliders set ' +
    'the probe voltage, oxide thickness, substrate doping, fixed oxide ' +
    'charge, interface trap density and gate work function.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Quantities that do not depend on the gate voltage
function mosParams(toxNm, NA, Nf, Dit, phim) {
  const cox = EPS_OX / (toxNm * 1e-7);                   // F/cm^2
  const phiF = VTH * Math.log(NA / NI);
  const phiS = CHI_SI + EG - VTH * Math.log(NV / NA);    // semiconductor work function (eV)
  const phiMS = phim - phiS;
  const wMax = Math.sqrt(4 * EPS_SI * phiF / (Q * NA));  // cm
  const qDepMax = Q * NA * wMax;                         // C/cm^2
  const p = {
    tox: toxNm, NA: NA, Nf: Nf, Dit: Dit, phim: phim, cox: cox, phiF: phiF, phiMS: phiMS,
    wMax: wMax, qDepMax: qDepMax, gamma: (NI / NA) * (NI / NA),
    q0: Math.sqrt(2 * EPS_SI * Q * NA * VTH),            // charge scale (C/cm^2)
    c0: Math.sqrt(EPS_SI * Q * NA / (2 * VTH)),          // capacitance scale (F/cm^2)
    cit: Q * Dit                                         // interface trap capacitance (F/cm^2)
  };
  p.vfb = vgOfPsi(p, 0);
  p.vt = vgOfPsi(p, 2 * phiF);
  p.cMin = 1 / (1 / cox + wMax / EPS_SI);                // chapter formula
  p.cFB = series(cox, Math.SQRT2 * p.c0);                // sqrt(2) c0 = eps_s / L_D
  return p;
}

function series(a, b) { return a * b / (a + b); }

// Majority-carrier and depletion part of F^2, and the full F^2
function fDep2(u) { return Math.exp(-u) + u - 1; }
function fAll2(p, u) { return fDep2(u) + p.gamma * (Math.exp(u) - u - 1); }

// Semiconductor charge per unit area (C/cm^2); negative for positive psi_s
function qSemi(p, psi, deep) {
  const u = psi / VTH;
  const f2 = deep ? fDep2(u) : fAll2(p, u);
  return -Math.sign(u) * p.q0 * Math.sqrt(Math.max(f2, 0));
}

// Gate voltage that produces surface potential psi
function vgOfPsi(p, psi, deep) {
  return p.phiMS - Q * p.Nf / p.cox + psi - qSemi(p, psi, deep) / p.cox +
         p.cit * (psi - p.phiF) / p.cox;
}

// Surface potential at gate voltage vg (bisection; vgOfPsi is monotonic)
function psiOfVg(p, vg, deep) {
  let a = -1.2, b = 2 * p.phiF + (deep ? 12 : 1.0);
  for (let i = 0; i < 60; i++) {
    const m = (a + b) / 2;
    if (vgOfPsi(p, m, deep) > vg) b = m; else a = m;
  }
  return (a + b) / 2;
}

// Semiconductor capacitance (F/cm^2): all carriers follow the signal
function cSemiLF(p, psi) {
  const u = psi / VTH;
  if (Math.abs(u) < 1e-4) return Math.SQRT2 * p.c0;
  return p.c0 * Math.abs(1 - Math.exp(-u) + p.gamma * (Math.exp(u) - 1)) / Math.sqrt(fAll2(p, u));
}

// Semiconductor capacitance without minority carriers (accumulation + depletion)
function cSemiDep(p, psi) {
  const u = psi / VTH;
  if (Math.abs(u) < 1e-4) return Math.SQRT2 * p.c0;
  return p.c0 * Math.abs(1 - Math.exp(-u)) / Math.sqrt(fDep2(u));
}

function capLF(p, psi) { return series(p.cox, cSemiLF(p, psi) + p.cit); }
function capHF(p, psi) { return series(p.cox, cSemiDep(p, Math.min(psi, 2 * p.phiF))); }
function capDeep(p, psi) { return series(p.cox, cSemiDep(p, psi)); }

// Voltage axis: wide enough for every setting of Q_f, D_it and phi_m at this
// oxide thickness and doping, so those three sliders move the curve, not the axis
function voltageRange(toxNm, NA) {
  const lo = mosParams(toxNm, NA, 1e12, 1e12, 4.0).vfb;
  const hi = mosParams(toxNm, NA, -1e12, 1e12, 5.2).vt;
  return { min: Math.floor((lo - 0.7) * 2) / 2, max: Math.ceil((hi + 0.9) * 2) / 2 };
}

function buildCurves(p, range) {
  const N = 220;
  const mk = () => ({ v: [], lf: [], hf: [], dd: [] });
  const out = mk();
  for (let i = 0; i <= N; i++) {
    const v = range.min + (range.max - range.min) * i / N;
    const psi = psiOfVg(p, v, false);
    out.v.push(v);
    out.lf.push(capLF(p, psi) / p.cox);
    out.hf.push(capHF(p, psi) / p.cox);
    out.dd.push(v >= p.vt ? capDeep(p, psiOfVg(p, v, true)) / p.cox : null);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const tox = toxSlider.value();
  const NA = Math.pow(10, naSlider.value());
  const Nf = qfSlider.value() * 1e10;
  const Dit = ditSlider.value() * 1e10;
  const phim = phimSlider.value();
  const key = [tox, NA, Nf, Dit, phim].join('|');
  if (cache.key !== key) {
    const p = mosParams(tox, NA, Nf, Dit, phim);
    const ideal = mosParams(tox, NA, 0, 0, phim);
    const range = voltageRange(tox, NA);
    cache = { key: key, p: p, range: range, curves: buildCurves(p, range),
              idealCurves: buildCurves(ideal, range) };
  }
  const p = cache.p, range = cache.range;
  const vg = range.min + vgSlider.value() * (range.max - range.min);
  const psi = psiOfVg(p, vg, false);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry: C-V plot on the left, band diagram on the right
  const leftPad = 56, gap = 58, rightPad = 12;
  const total = canvasWidth - leftPad - gap - rightPad;
  const lx0 = leftPad, lx1 = leftPad + total * 0.58;
  const rx0 = lx1 + gap, rx1 = canvasWidth - rightPad;
  const y0 = 58, y1 = 300;

  drawCvPlot(lx0, lx1, y0, y1, p, range, vg, psi);
  drawBandDiagram(rx0, rx1, y0, y1, p, vg, psi);
  drawReadout(p, vg, psi);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('MOS Capacitor C-V Explorer', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(vg, tox, NA, Nf, Dit, phim);
}

function regimeOf(p, psi) {
  if (psi < -0.01) return { name: 'Accumulation', col: 'crimson' };
  if (psi <= 0.01) return { name: 'Flat band', col: 'dimgray' };
  if (psi < p.phiF) return { name: 'Depletion', col: 'darkorange' };
  if (psi < 2 * p.phiF) return { name: 'Weak inversion', col: 'teal' };
  return { name: 'Strong inversion', col: 'royalblue' };
}

// ---- C-V plot ----
function drawCvPlot(x0, x1, y0, y1, p, range, vg, psi) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
  const xOfV = (v) => map(v, range.min, range.max, x0, x1);
  const yOfC = (c) => map(c, 0, 1.15, y1, y0);
  const mode = modeRadio.value();
  const showLF = mode !== 'hf', showHF = mode !== 'lf';

  // Bias regions: accumulation | depletion | inversion
  const xfb = constrain(xOfV(p.vfb), x0, x1), xt = constrain(xOfV(p.vt), x0, x1);
  noStroke();
  fill(255, 228, 225, 120);
  rect(x0 + 1, y0 + 1, xfb - x0 - 1, y1 - y0 - 2);
  fill(255, 239, 213, 120);
  rect(xfb, y0 + 1, xt - xfb, y1 - y0 - 2);
  fill(220, 235, 255, 140);
  rect(xt, y0 + 1, x1 - xt - 1, y1 - y0 - 2);

  // Grid and ticks
  textSize(12);
  for (const c of [0, 0.2, 0.4, 0.6, 0.8, 1.0]) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOfC(c), x1, yOfC(c));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(c.toFixed(1), x0 - 6, yOfC(c));
  }
  const vStep = (range.max - range.min) > 8 ? 2 : (range.max - range.min) > 4 ? 1 : 0.5;
  for (let v = Math.ceil(range.min / vStep) * vStep; v <= range.max + 1e-9; v += vStep) {
    stroke('black'); strokeWeight(1);
    line(xOfV(v), y1, xOfV(v), y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    text(Math.abs(v) < 1e-9 ? '0' : v.toFixed(vStep < 1 ? 1 : 0).replace('-', '−'), xOfV(v), y1 + 7);
  }

  // C_ox and C_min reference lines
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([2, 4]);
  line(x0, yOfC(1), x1, yOfC(1));
  line(x0, yOfC(p.cMin / p.cox), x1, yOfC(p.cMin / p.cox));
  drawingContext.setLineDash([]);

  // Flat-band and threshold voltages
  for (const [v, label, yLab] of [[p.vfb, 'V_{FB}', y1 - 12], [p.vt, 'V_{T}', y1 - 30]]) {
    if (v <= range.min || v >= range.max) continue;
    stroke('dimgray');
    strokeWeight(1);
    drawingContext.setLineDash([5, 4]);
    line(xOfV(v), y0, xOfV(v), y1);
    drawingContext.setLineDash([]);
    textSize(12);
    chipText(label, xOfV(v), yLab, CENTER, 'black');
  }

  // Curves
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  const drawCurve = (vs, cs, col, w, dash) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    drawingContext.setLineDash(dash);
    beginShape();
    for (let i = 0; i < vs.length; i++) {
      if (cs[i] !== null) vertex(xOfV(vs[i]), yOfC(cs[i]));
    }
    endShape();
    drawingContext.setLineDash([]);
  };
  const shifted = p.Nf !== 0 || p.Dit !== 0;
  if (shifted) {
    const ic = cache.idealCurves;
    if (showLF) drawCurve(ic.v, ic.lf, 'darkgray', 1.5, [3, 3]);
    if (showHF) drawCurve(ic.v, ic.hf, 'darkgray', 1.5, [3, 3]);
  }
  const cv = cache.curves;
  if (deepCheckbox.checked()) drawCurve(cv.v, cv.dd, 'purple', 2, [6, 4]);
  if (showLF) drawCurve(cv.v, cv.lf, 'royalblue', 3, []);
  if (showHF) drawCurve(cv.v, cv.hf, 'crimson', 3, []);
  pop();

  // Probe
  const xp = xOfV(vg);
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xp, y0, xp, y1);
  drawingContext.setLineDash([]);
  stroke('white');
  strokeWeight(1.5);
  if (showLF) { fill('royalblue'); circle(xp, yOfC(capLF(p, psi) / p.cox), 10); }
  if (showHF) { fill('crimson'); circle(xp, yOfC(capHF(p, psi) / p.cox), 10); }

  // Labels: region names, reference lines, legend
  noStroke();
  textSize(12);
  textAlign(CENTER, TOP);
  fill('firebrick');
  if (xfb - x0 > 84) text('accumulation', (x0 + xfb) / 2, y0 + 5);
  fill('chocolate');
  if (xt - xfb > 62) text('depletion', (xfb + xt) / 2, y0 + 5);
  fill('royalblue');
  if (x1 - xt > 62) text('inversion', (xt + x1) / 2, y0 + 5);
  fill('dimgray');
  richText('C_{ox}', x1 + 4, yOfC(1), LEFT);
  richText('C_{min}', x1 + 4, yOfC(p.cMin / p.cox), LEFT);

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD);
  richText('Capacitance C / C_{ox}', (x0 + x1) / 2, y0 - 12, CENTER);
  textStyle(NORMAL);
  richText('Gate voltage V_{G} (V)', (x0 + x1) / 2, y1 + 31, CENTER);
  push();
  translate(x0 - 40, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13);
  richText('C / C_{ox}', 0, 0, CENTER);
  pop();
}

// ---- Band diagram at the probe voltage ----
function drawBandDiagram(x0, x1, y0, y1, p, vg, psi) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  // Horizontal layout: gate | oxide (not to scale) | silicon
  const gateW = Math.min(46, (x1 - x0) * 0.16), oxW = Math.min(40, (x1 - x0) * 0.14);
  const gx1 = x0 + gateW, sx0 = gx1 + oxW;
  const depthMax = 1.6 * p.wMax;                         // cm, silicon depth shown
  const xOfDepth = (d) => map(d, 0, depthMax, sx0, x1);

  // Energies in eV measured from the silicon Fermi level
  const evBulk = -VTH * Math.log(NV / p.NA);
  const ecBulk = evBulk + EG;
  const eiBulk = p.phiF;
  const efm = -vg;                                       // gate Fermi level
  const wDep = psi > 0 ? Math.sqrt(2 * EPS_SI * psi / (Q * p.NA)) : 0;
  const lD = Math.sqrt(EPS_SI * VTH / (Q * p.NA));       // Debye length (cm)
  const bend = (d) => {
    if (psi > 0) return d < wDep ? psi * Math.pow(1 - d / wDep, 2) : 0;
    return psi * Math.exp(-d / lD);                      // accumulation layer (sketch)
  };
  const ecOxSi = ecBulk - psi + (CHI_SI - CHI_OX);       // oxide band edge at the silicon side
  const ecOxGate = efm + (p.phim - CHI_OX);              // oxide band edge at the gate side

  const eMaxRaw = Math.max(ecOxSi, ecOxGate, efm) + 0.3;
  const eMinRaw = Math.min(evBulk - Math.max(psi, 0), efm, evBulk) - 0.5;
  const yOf = (e) => map(e, eMinRaw, eMaxRaw, y1 - 16, y0 + 22);

  // Gate metal: filled up to its Fermi level
  noStroke();
  fill(200);
  rect(x0 + 1, yOf(efm), gateW - 1, y1 - 1 - yOf(efm));
  stroke('dimgray');
  strokeWeight(2);
  line(x0, yOf(efm), gx1, yOf(efm));

  // Oxide: the gap is far wider than the plot, so only its conduction band
  // edge appears; the valence band edge is off the bottom of the scale
  noStroke();
  fill(255, 248, 220);
  quad(gx1, yOf(ecOxGate), sx0, yOf(ecOxSi), sx0, y1 - 1, gx1, y1 - 1);
  stroke('peru');
  strokeWeight(2);
  line(gx1, yOf(ecOxGate), sx0, yOf(ecOxSi));
  stroke('silver');
  strokeWeight(1);
  line(gx1, y0, gx1, y1);
  line(sx0, y0, sx0, y1);

  // Silicon bands
  const N = 60;
  const reg = regimeOf(p, psi);
  noFill();
  for (const [e0, col, w, dash] of [[ecBulk, 'black', 2, []], [evBulk, 'black', 2, []],
                                    [eiBulk, 'gray', 1, [2, 4]]]) {
    stroke(col);
    strokeWeight(w);
    drawingContext.setLineDash(dash);
    beginShape();
    for (let i = 0; i <= N; i++) {
      const d = depthMax * i / N;
      vertex(xOfDepth(d), yOf(e0 - bend(d)));
    }
    endShape();
    drawingContext.setLineDash([]);
  }
  stroke('darkgreen');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  line(sx0, yOf(0), x1, yOf(0));
  drawingContext.setLineDash([]);

  // Depletion edge and surface carriers
  if (psi > 0.02 && wDep < depthMax) {
    stroke('gray');
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(xOfDepth(wDep), yOf(ecBulk) - 4, xOfDepth(wDep), yOf(evBulk) + 4);
    drawingContext.setLineDash([]);
    noStroke(); fill('dimgray'); textSize(11); textAlign(CENTER, TOP);
    text('W', xOfDepth(wDep), yOf(evBulk) + 6);
  }
  noStroke();
  if (psi >= 2 * p.phiF) {                               // inversion electrons
    fill('royalblue');
    for (let k = 0; k < 4; k++) circle(sx0 + 5, yOf(ecBulk - psi) - 6 - k * 7, 5);
  } else if (psi < -0.01) {                              // accumulated holes
    fill('crimson');
    for (let k = 0; k < 4; k++) circle(sx0 + 5, yOf(evBulk - psi) + 6 + k * 7, 5);
  }

  // Labels
  textSize(12);
  noStroke();
  fill('black');
  richText('E_{C}', x1 - 5, yOf(ecBulk) - 9, RIGHT);
  richText('E_{V}', x1 - 5, yOf(evBulk) + 10, RIGHT);
  fill('gray');
  richText('E_{i}', x1 - 36, yOf(eiBulk) - 8, RIGHT);
  fill('darkgreen');
  richText('E_{F}', x1 - 5, yOf(0) - 8, RIGHT);
  fill('dimgray');
  richText('E_{FM}', x0 + 4, yOf(efm) + (yOf(efm) < y0 + 34 ? 10 : -9), LEFT);
  textAlign(CENTER, TOP);
  textSize(11);
  text('gate', (x0 + gx1) / 2, y0 + 4);
  text('oxide', (gx1 + sx0) / 2, y0 + 4);
  text('p-type silicon', (sx0 + x1) / 2, y0 + 4);
  fill(reg.col);
  textStyle(BOLD);
  textSize(12);
  textAlign(RIGHT, BOTTOM);
  text(reg.name, x1 - 5, y1 - 3);
  textStyle(NORMAL);

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD);
  richText('Band diagram at V_{G} = ' + signed(vg, 2) + ' V', (x0 + x1) / 2, y0 - 12, CENTER);
  textStyle(NORMAL);
  textSize(13);
  textAlign(CENTER, CENTER);
  text('Depth (oxide not to scale)', (x0 + x1) / 2, y1 + 31);
}

// ---- Readout strip ----
function drawReadout(p, vg, psi) {
  const x = 10, y = 346, w = canvasWidth - 20, h = 96;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const small = canvasWidth < 720;
  textSize(small ? 12 : 13);
  fill('black');
  textStyle(BOLD);
  richText('C_{ox} = ' + (p.cox * 1e6).toPrecision(3) + ' µF/cm^{2}     V_{FB} = ' + signed(p.vfb, 3) +
           ' V     V_{T} = ' + signed(p.vt, 3) + ' V     C_{min}/C_{ox} = ' + (p.cMin / p.cox).toFixed(3),
           x + 12, y + 15, LEFT);
  textStyle(NORMAL);
  richText('φ_{F} = ' + p.phiF.toFixed(3) + ' V     φ_{ms} = ' + signed(p.phiMS, 3) + ' V     W_{max} = ' +
           fmtLen(p.wMax) + '     Q_{dep,max}/C_{ox} = ' + (p.qDepMax / p.cox).toFixed(3) +
           ' V     C_{FB}/C_{ox} = ' + (p.cFB / p.cox).toFixed(3), x + 12, y + 35, LEFT);
  const reg = regimeOf(p, psi);
  fill(reg.col);
  textStyle(BOLD);
  const wReg = richText(reg.name + ':', x + 12, y + 56, LEFT);
  textStyle(NORMAL);
  fill('black');
  richText('ψ_{s} = ' + signed(psi, 3) + ' V     C_{LF}/C_{ox} = ' + (capLF(p, psi) / p.cox).toFixed(3) +
           '     C_{HF}/C_{ox} = ' + (capHF(p, psi) / p.cox).toFixed(3),
           x + 20 + wReg, y + 56, LEFT);

  // Legend for the curves
  const mode = modeRadio.value();
  const items = [];
  if (mode !== 'hf') items.push(['royalblue', [], 3, 'low frequency']);
  if (mode !== 'lf') items.push(['crimson', [], 3, 'high frequency']);
  if (deepCheckbox.checked()) items.push(['purple', [6, 4], 2, 'deep depletion']);
  if (p.Nf !== 0 || p.Dit !== 0) {
    items.push(['darkgray', [3, 3], 1.5, small ? 'Q_{f} = D_{it} = 0' : 'same device with Q_{f} = 0 and D_{it} = 0']);
  }
  let lx = x + 12;
  const ly = y + 79;
  textSize(12);
  for (const [col, dash, wgt, label] of items) {
    stroke(col);
    strokeWeight(wgt);
    drawingContext.setLineDash(dash);
    line(lx, ly, lx + 24, ly);
    drawingContext.setLineDash([]);
    noStroke();
    fill('dimgray');
    lx += 30 + richText(label, lx + 30, ly, LEFT) + 18;
  }
}

function drawControlLabels(vg, tox, NA, Nf, Dit, phim) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const yRow = (i) => drawHeight + 55 + 35 * i;
  richText('Gate voltage V_{G} (probe): ' + signed(vg, 2) + ' V', 10, yRow(0), LEFT);
  richText('Oxide thickness t_{ox}: ' + tox.toFixed(1) + ' nm', 10, yRow(1), LEFT);
  richText('Substrate doping N_{A}: ' + sci(NA, 1) + ' cm^{−3}', 10, yRow(2), LEFT);
  richText('Fixed oxide charge Q_{f}/q: ' + sciSigned(Nf) + ' cm^{−2}', 10, yRow(3), LEFT);
  richText('Interface traps D_{it}: ' + (Dit === 0 ? '0' : sci(Dit, 1)) + ' cm^{−2}eV^{−1}', 10, yRow(4), LEFT);
  richText('Gate work function φ_{m}: ' + phim.toFixed(2) + ' eV', 10, yRow(5), LEFT);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetDefaults() {
  modeRadio.selected('both');
  deepCheckbox.checked(false);
  vgSlider.value(0.62);
  toxSlider.value(10);
  naSlider.value(17);
  qfSlider.value(0);
  ditSlider.value(0);
  phimSlider.value(4.1);
}

function signed(v, digits) {
  const s = Math.abs(v).toFixed(digits);
  if (Number(s) === 0) return s;
  return (v < 0 ? '−' : '+') + s;
}

function sciSigned(x) {
  if (x === 0) return '0';
  return (x > 0 ? '+' : '') + sci(x, 1);
}

// Length given in cm, shown in nm or micrometers with three significant figures
function fmtLen(cm) {
  const um = cm * 1e4;
  if (um < 1) return (um * 1000).toPrecision(3) + ' nm';
  return um.toPrecision(3) + ' µm';
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

// richText on a translucent white chip, so it stays readable over lines
function chipText(str, x, y, align, col) {
  const w = richWidth(str), ts = textSize();
  const left = align === RIGHT ? x - w : align === CENTER ? x - w / 2 : x;
  noStroke();
  fill(255, 255, 255, 215);
  rect(left - 3, y - ts * 0.62, w + 6, ts * 1.3, 3);
  fill(col);
  richText(str, x, y, align);
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
  for (const s of [vgSlider, toxSlider, naSlider, qfSlider, ditSlider, phimSlider]) s.size(w);
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
    if (typeof phimSlider !== 'undefined' && phimSlider) sizeSliders();
  }
}
