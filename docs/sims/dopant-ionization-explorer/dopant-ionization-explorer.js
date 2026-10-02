// Dopant Ionization Fraction vs. Temperature MicroSim
// CANVAS_HEIGHT: 627
//
// Shows what fraction of the dopant atoms in silicon are ionized between
// 50 K and 600 K, together with the band diagram (E_C, E_V, E_F, E_i and
// the dopant level) on the same temperature axis.
//
// Physics model (non-degenerate silicon, one dopant species):
//   Charge neutrality:  n + N_A^- = p + N_D^+
//   n = N_C exp(-(E_C - E_F)/kT),  p = N_V exp(-(E_F - E_V)/kT)
//   N_D^+/N_D = 1 / (1 + g_D exp((E_F - E_d)/kT)),   g_D = 2
//   N_A^-/N_A = 1 / (1 + g_A exp((E_a - E_F)/kT)),   g_A = 4
//   N_C, N_V = 2.86e19, 3.10e19 cm^-3 at 300 K, scaled as T^(3/2)
//   E_g(T) follows the Varshni form; its 0 K value is set so that the
//   mass-action law returns n_i(300 K) = 9.65e9 cm^-3 (the chapter value).
// The neutrality equation is solved for E_F by bisection at every T.
// See index.md for the model details and limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 512;              // drawing region height
let controlHeight = 115;           // control region height (3 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 230;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Physical constants and silicon parameters ----
const KB_EV = 8.617333e-5;         // Boltzmann constant (eV/K)
const NC300 = 2.86e19;             // effective DOS, conduction band, 300 K (cm^-3)
const NV300 = 3.10e19;             // effective DOS, valence band, 300 K (cm^-3)
const NI300 = 9.65e9;              // intrinsic concentration at 300 K (cm^-3)
const VARSHNI_ALPHA = 4.73e-4;     // eV/K
const VARSHNI_BETA = 636;          // K
// 0 K gap chosen so sqrt(NC NV) exp(-Eg/2kT) = NI300 at 300 K (about 1.175 eV)
const EG0 = 2 * KB_EV * 300 * Math.log(Math.sqrt(NC300 * NV300) / NI300) +
            VARSHNI_ALPHA * 300 * 300 / (300 + VARSHNI_BETA);
const G_DONOR = 2;                 // donor level degeneracy (spin)
const G_ACCEPTOR = 4;              // acceptor degeneracy (spin x heavy/light hole bands)

// Ionization energies (meV) from the Chapter 7 tables
const DOPANTS = [
  { key: 'P',  name: 'Phosphorus', type: 'donor',    meV: 45 },
  { key: 'As', name: 'Arsenic',    type: 'donor',    meV: 54 },
  { key: 'Sb', name: 'Antimony',   type: 'donor',    meV: 43 },
  { key: 'B',  name: 'Boron',      type: 'acceptor', meV: 45 },
  { key: 'Ga', name: 'Gallium',    type: 'acceptor', meV: 72 },
  { key: 'Al', name: 'Aluminum',   type: 'acceptor', meV: 69 },
  { key: 'In', name: 'Indium',     type: 'acceptor', meV: 160 }
];

const T_MIN = 50, T_MAX = 600, T_STEP = 5;

// ---- Controls and state ----
let dopantSelect, dopingSlider, tempSlider, sweepButton, fdCheckbox;
let isSweeping = false;
let curve = [];                    // cached {T, frac, ef, ec, ei, level}
let curveKey = '';
let N_now = 1e16;                 // current doping concentration (cm^-3)

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  dopantSelect = createSelect();
  for (const d of DOPANTS) {
    dopantSelect.option(d.key + ' - ' + d.type + ' (' + d.meV + ' meV)', d.key);
  }
  dopantSelect.selected('P');
  dopantSelect.position(68, drawHeight + 9);

  sweepButton = createButton('Sweep T');
  sweepButton.position(250, drawHeight + 8);
  sweepButton.mousePressed(toggleSweep);

  fdCheckbox = createCheckbox(' Show Fermi-Dirac tail', true);
  fdCheckbox.position(335, drawHeight + 9);

  // log10 of the doping concentration (cm^-3)
  dopingSlider = createSlider(14, 18, 16, 0.05);
  dopingSlider.position(sliderLeftMargin, drawHeight + 45);
  dopingSlider.size(canvasWidth - sliderLeftMargin - margin);

  tempSlider = createSlider(T_MIN, T_MAX, 300, 1);
  tempSlider.position(sliderLeftMargin, drawHeight + 80);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Two stacked plots share a temperature axis from 50 to 600 kelvin. ' +
    'The top plot shows the percentage of dopant atoms in silicon that are ' +
    'ionized. The bottom plot is a band diagram showing the conduction band ' +
    'edge, valence band edge, Fermi level, intrinsic level and the dopant ' +
    'energy level versus temperature. A panel on the right lists the values ' +
    'at the selected temperature and zooms in on the dopant level near the ' +
    'band edge, with an optional Fermi-Dirac curve. Controls select the ' +
    'dopant, the doping concentration and the temperature.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

function bandGap(T) {
  return EG0 - VARSHNI_ALPHA * T * T / (T + VARSHNI_BETA);
}

function effectiveDOS(T) {
  const s = Math.pow(T / 300, 1.5);
  return { NC: NC300 * s, NV: NV300 * s };
}

function intrinsicConcentration(T) {
  const dos = effectiveDOS(T);
  return Math.sqrt(dos.NC * dos.NV) * Math.exp(-bandGap(T) / (2 * KB_EV * T));
}

// Solve charge neutrality for one dopant species at temperature T.
// Energies are measured from the valence band edge (E_V = 0).
function solveNeutrality(T, dopant, N) {
  const kT = KB_EV * T;
  const ec = bandGap(T);
  const dos = effectiveDOS(T);
  const dE = dopant.meV / 1000;
  const isDonor = dopant.type === 'donor';
  const level = isDonor ? ec - dE : dE;

  function ionizedFraction(ef) {
    return isDonor
      ? 1 / (1 + G_DONOR * Math.exp((ef - level) / kT))
      : 1 / (1 + G_ACCEPTOR * Math.exp((level - ef) / kT));
  }
  // Net positive charge; decreases monotonically as E_F rises
  function netCharge(ef) {
    const n = dos.NC * Math.exp((ef - ec) / kT);
    const p = dos.NV * Math.exp(-ef / kT);
    const ion = N * ionizedFraction(ef);
    return isDonor ? p + ion - n : p - ion - n;
  }

  let lo = -0.4, hi = ec + 0.4;
  for (let i = 0; i < 70; i++) {
    const mid = 0.5 * (lo + hi);
    if (netCharge(mid) > 0) lo = mid; else hi = mid;
  }
  const ef = 0.5 * (lo + hi);
  const n = dos.NC * Math.exp((ef - ec) / kT);
  const p = dos.NV * Math.exp(-ef / kT);
  const ei = ec / 2 + 0.5 * kT * Math.log(dos.NV / dos.NC);
  return { T: T, kT: kT, ec: ec, ef: ef, ei: ei, level: level,
           frac: ionizedFraction(ef), n: n, p: p, isDonor: isDonor };
}

function currentDopant() {
  const key = dopantSelect.value();
  return DOPANTS.find(d => d.key === key);
}

function rebuildCurve(dopant, N) {
  const key = dopant.key + '|' + N;
  if (key === curveKey) return;
  curveKey = key;
  curve = [];
  for (let T = T_MIN; T <= T_MAX; T += T_STEP) {
    curve.push(solveNeutrality(T, dopant, N));
  }
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  if (isSweeping) {
    let t = tempSlider.value() + 2;
    if (t >= T_MAX) { t = T_MAX; isSweeping = false; sweepButton.html('Sweep T'); }
    tempSlider.value(t);
  }

  const dopant = currentDopant();
  const N = Math.pow(10, dopingSlider.value());
  N_now = N;
  const T = tempSlider.value();
  rebuildCurve(dopant, N);
  const now = solveNeutrality(T, dopant, N);
  const dopantColor = dopant.type === 'donor' ? color('royalblue') : color('crimson');

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry
  const panelW = canvasWidth >= 700 ? 236 : 200;
  const panelX = canvasWidth - panelW - 10;
  const plotL = 62;
  const plotR = panelX - 18;
  const topY0 = 62, topY1 = 208;
  const botY0 = 262, botY1 = 430;
  const xOfT = (t) => map(t, T_MIN, T_MAX, plotL, plotR);

  drawIonizationPlot(plotL, plotR, topY0, topY1, xOfT, now, dopant, dopantColor);
  drawBandPlot(plotL, plotR, botY0, botY1, xOfT, now, dopant, dopantColor);

  // Probe line through both plots
  stroke('dimgray');
  strokeWeight(1);
  line(xOfT(T), topY0, xOfT(T), botY1);

  drawInfoPanel(panelX, 44, panelW, 206, now, dopant, N, dopantColor);
  drawZoomPanel(panelX, 258, panelW, 214, now, dopant, dopantColor);
  drawModelNote(N);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Dopant Ionization Fraction vs. Temperature', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(N, T);
}

function drawIonizationPlot(x0, x1, y0, y1, xOfT, now, dopant, dopantColor) {
  const yOfPct = (p) => map(p, 0, 105, y1, y0);

  // Plot background
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  // Horizontal grid and y ticks
  textSize(12);
  for (const p of [0, 25, 50, 75, 100]) {
    stroke(p === 100 ? 'darkgray' : 'gainsboro');
    line(x0, yOfPct(p), x1, yOfPct(p));
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(p, x0 - 6, yOfPct(p));
  }
  drawTemperatureGrid(x0, x1, y0, y1, xOfT, false);

  // 90 % guide line
  stroke('darkorange');
  strokeWeight(1);
  dashed(x0, yOfPct(90), x1, yOfPct(90), [4, 4]);
  noStroke();
  fill('darkorange');
  textAlign(RIGHT, TOP);
  textSize(12);
  text('90 %', x1 - 4, yOfPct(90) + 2);

  // 300 K operating point
  stroke('seagreen');
  strokeWeight(1.5);
  dashed(xOfT(300), y0, xOfT(300), y1, [6, 4]);
  noStroke();
  fill('seagreen');
  textAlign(LEFT, BOTTOM);
  text('300 K', xOfT(300) + 4, y1 - 3);

  // Ionization curve
  noFill();
  stroke(dopantColor);
  strokeWeight(3);
  beginShape();
  for (const pt of curve) vertex(xOfT(pt.T), yOfPct(100 * pt.frac));
  endShape();

  // Probe marker
  fill(dopantColor);
  stroke('white');
  strokeWeight(1.5);
  circle(xOfT(now.T), yOfPct(100 * now.frac), 11);

  // Axis title (rotated)
  noStroke();
  fill('black');
  push();
  translate(16, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textSize(13);
  richText(dopant.type === 'donor' ? 'Ionized N_{D}^{+}/N_{D} (%)' : 'Ionized N_{A}^{−}/N_{A} (%)',
           0, 0, CENTER);
  pop();

  // Plot caption
  textAlign(LEFT, BOTTOM);
  textSize(13);
  fill(dopantColor);
  textStyle(BOLD);
  text(dopant.name + ' (' + dopant.type + ', ' + dopant.meV + ' meV)', x0 + 2, y0 - 4);
  textStyle(NORMAL);
}

function drawBandPlot(x0, x1, y0, y1, xOfT, now, dopant, dopantColor) {
  const E_LO = -0.12, E_HI = 1.30;
  const yOfE = (e) => map(e, E_LO, E_HI, y1, y0);

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  // Conduction band (above E_C) and valence band (below E_V) shading
  noStroke();
  fill(100, 181, 246, 110);
  beginShape();
  vertex(x0, y0);
  vertex(x1, y0);
  for (let i = curve.length - 1; i >= 0; i--) vertex(xOfT(curve[i].T), yOfE(curve[i].ec));
  endShape(CLOSE);
  fill(129, 199, 132, 110);
  rect(x0, yOfE(0), x1 - x0, y1 - yOfE(0));

  // y ticks
  textSize(12);
  for (const e of [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]) {
    stroke('gainsboro');
    line(x0, yOfE(e), x1, yOfE(e));
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(e.toFixed(1), x0 - 6, yOfE(e));
  }
  drawTemperatureGrid(x0, x1, y0, y1, xOfT, true);

  // 300 K operating point
  stroke('seagreen');
  strokeWeight(1.5);
  dashed(xOfT(300), y0, xOfT(300), y1, [6, 4]);

  // Curves
  noFill();
  strokeWeight(2);
  stroke('firebrick');
  beginShape(); for (const pt of curve) vertex(xOfT(pt.T), yOfE(pt.ec)); endShape();
  stroke('navy');
  line(x0, yOfE(0), x1, yOfE(0));
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([3, 4]);
  beginShape(); for (const pt of curve) vertex(xOfT(pt.T), yOfE(pt.ei)); endShape();
  stroke(dopantColor);
  strokeWeight(2);
  drawingContext.setLineDash([7, 4]);
  beginShape(); for (const pt of curve) vertex(xOfT(pt.T), yOfE(pt.level)); endShape();
  drawingContext.setLineDash([]);
  stroke('purple');
  strokeWeight(3);
  beginShape(); for (const pt of curve) vertex(xOfT(pt.T), yOfE(pt.ef)); endShape();

  // Probe marker on E_F
  fill('purple');
  stroke('white');
  strokeWeight(1.5);
  circle(xOfT(now.T), yOfE(now.ef), 11);

  // Band labels
  noStroke();
  textSize(12);
  textAlign(RIGHT, TOP);
  fill('navy');
  text('valence band', x1 - 6, yOfE(0) + 2);

  // Legend row above the plot
  const items = [
    { label: 'E_{C}', col: color('firebrick'), dash: [] },
    { label: dopant.type === 'donor' ? 'E_{d}' : 'E_{a}', col: dopantColor, dash: [7, 4] },
    { label: 'E_{F}', col: color('purple'), dash: [] },
    { label: 'E_{i}', col: color('gray'), dash: [3, 4] },
    { label: 'E_{V}', col: color('navy'), dash: [] }
  ];
  const step = Math.min(78, (x1 - x0) / items.length);
  let lx = x0 + 2;
  textSize(13);
  for (const it of items) {
    stroke(it.col);
    strokeWeight(2.5);
    dashed(lx, y0 - 12, lx + 22, y0 - 12, it.dash);
    noStroke();
    fill('black');
    richText(it.label, lx + 27, y0 - 12, LEFT);
    lx += step;
  }

  // Axis titles
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('Temperature (K)', (x0 + x1) / 2, y1 + 24);
  push();
  translate(16, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textSize(13);
  richText('Energy above E_{V} (eV)', 0, 0, CENTER);
  pop();
}

function drawTemperatureGrid(x0, x1, y0, y1, xOfT, withLabels) {
  textSize(12);
  for (let t = 100; t <= 600; t += 100) {
    stroke('gainsboro');
    strokeWeight(1);
    line(xOfT(t), y0, xOfT(t), y1);
    if (withLabels) {
      stroke('black');
      line(xOfT(t), y1, xOfT(t), y1 + 4);
      noStroke();
      fill('black');
      textAlign(CENTER, TOP);
      text(t, xOfT(t), y1 + 7);
    }
  }
}

function drawInfoPanel(x, y, w, h, now, dopant, N, dopantColor) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const isDonor = now.isDonor;
  const pad = 10;
  let cy = y + 16;
  const small = w < 220;
  const ts = small ? 12 : 13;

  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(ts + 1);
  fill('black');
  text('At T = ' + now.T + ' K', x + pad, cy);
  textStyle(NORMAL);
  textSize(ts);
  cy += 22;
  richText((isDonor ? 'E_{C} − E_{d} = ' : 'E_{a} − E_{V} = ') + dopant.meV + ' meV', x + pad, cy, LEFT);
  cy += 20;
  richText('kT = ' + (now.kT * 1000).toFixed(1) + ' meV', x + pad, cy, LEFT);
  cy += 20;
  richText((isDonor ? 'N_{D} = ' : 'N_{A} = ') + sci(N, 1) + ' cm^{−3}', x + pad, cy, LEFT);
  cy += 24;

  fill(dopantColor);
  textStyle(BOLD);
  textSize(ts + 3);
  text('Ionized: ' + (100 * now.frac).toFixed(now.frac > 0.0995 ? 1 : 2) + ' %', x + pad, cy);
  textStyle(NORMAL);
  textSize(ts);
  fill('black');
  cy += 24;
  const maj = isDonor ? now.n : now.p;
  richText((isDonor ? 'n = ' : 'p = ') + sci(maj, 2) + ' cm^{−3}', x + pad, cy, LEFT);
  cy += 20;
  const gap = isDonor ? now.ec - now.ef : now.ef;
  richText((isDonor ? 'E_{C} − E_{F} = ' : 'E_{F} − E_{V} = ') + gap.toFixed(3) + ' eV', x + pad, cy, LEFT);
  cy += 22;

  // Verdict on the complete-ionization approximation
  let verdict, vcol;
  if (now.frac >= 0.99) { verdict = 'Complete ionization: good'; vcol = 'seagreen'; }
  else if (now.frac >= 0.90) { verdict = 'Complete ionization: fair'; vcol = 'darkorange'; }
  else { verdict = 'Complete ionization fails'; vcol = 'firebrick'; }
  fill(vcol);
  textStyle(BOLD);
  text(verdict, x + pad, cy);
  textStyle(NORMAL);
  cy += 20;

  // Temperature above which at least 90 % of the dopants are ionized
  fill('black');
  const t90 = ninetyPercentTemperature();
  text(t90 === null ? 'Below 90 % over 50–600 K'
                    : (t90 <= T_MIN ? '≥ 90 % ionized over 50–600 K'
                                    : '≥ 90 % ionized above ' + Math.round(t90) + ' K'),
       x + pad, cy);
}

// First temperature on the cached curve where the ionized fraction reaches 90 %
function ninetyPercentTemperature() {
  if (curve.length === 0) return null;
  if (curve[0].frac >= 0.9) return T_MIN;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].frac >= 0.9) {
      const a = curve[i - 1], b = curve[i];
      return a.T + (0.9 - a.frac) / (b.frac - a.frac) * (b.T - a.T);
    }
  }
  return null;
}

function drawZoomPanel(x, y, w, h, now, dopant, dopantColor) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const isDonor = now.isDonor;
  const small = w < 220;
  fill('black');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(small ? 12 : 13);
  richText('Zoom near ' + (isDonor ? 'E_{C}' : 'E_{V}') + ' at ' + now.T + ' K', x + 10, y + 15, LEFT);
  textStyle(NORMAL);

  // Energy window: relative to the band edge (eV)
  const zx0 = x + 46, zx1 = x + w - 12;
  const zy0 = y + 32, zy1 = y + h - 44;
  const eEdge = isDonor ? now.ec : 0;
  const eLo = isDonor ? eEdge - 0.30 : eEdge - 0.06;
  const eHi = isDonor ? eEdge + 0.06 : eEdge + 0.30;
  const yOfE = (e) => map(e, eLo, eHi, zy1, zy0);

  stroke('silver');
  fill('white');
  rect(zx0, zy0, zx1 - zx0, zy1 - zy0);

  // Band shading
  noStroke();
  if (isDonor) {
    fill(100, 181, 246, 110);
    rect(zx0, zy0, zx1 - zx0, yOfE(eEdge) - zy0);
  } else {
    fill(129, 199, 132, 110);
    rect(zx0, yOfE(eEdge), zx1 - zx0, zy1 - yOfE(eEdge));
  }

  // Fermi-Dirac occupation probability f(E): 0 at the left edge, 1 at the right
  if (fdCheckbox.checked()) {
    noFill();
    stroke(186, 104, 200);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i <= 60; i++) {
      const e = eLo + (eHi - eLo) * i / 60;
      const f = 1 / (1 + Math.exp((e - now.ef) / now.kT));
      vertex(map(f, 0, 1, zx0, zx1), yOfE(e));
    }
    endShape();
    noStroke();
    fill('purple');
    textSize(12);
    textAlign(LEFT, TOP);
    text('0', zx0, zy1 + 3);
    textAlign(RIGHT, TOP);
    text('1', zx1, zy1 + 3);
    textAlign(CENTER, TOP);
    text('f(E)', (zx0 + zx1) / 2, zy1 + 3);
  }

  // Band edge
  stroke(isDonor ? 'firebrick' : 'navy');
  strokeWeight(2);
  line(zx0, yOfE(eEdge), zx1, yOfE(eEdge));

  // Dopant level with ten representative dopant atoms
  stroke(dopantColor);
  strokeWeight(1.5);
  dashed(zx0, yOfE(now.level), zx1, yOfE(now.level), [6, 4]);
  const nIon = Math.round(now.frac * 10);
  const dx = (zx1 - zx0) / 10;
  for (let i = 0; i < 10; i++) {
    const cx = zx0 + dx * (i + 0.5);
    const cyy = yOfE(now.level);
    const ionized = i < nIon;
    stroke(dopantColor);
    strokeWeight(1.5);
    fill(ionized ? color('white') : dopantColor);
    circle(cx, cyy, Math.min(11, dx - 3));
    if (ionized) {
      line(cx - 2.5, cyy, cx + 2.5, cyy);
      if (isDonor) line(cx, cyy - 2.5, cx, cyy + 2.5);
    }
  }

  // Fermi level (clamped to the window with an arrow when outside)
  const efIn = now.ef >= eLo && now.ef <= eHi;
  noStroke();
  textSize(12);
  if (efIn) {
    stroke('purple');
    strokeWeight(2.5);
    line(zx0, yOfE(now.ef), zx1, yOfE(now.ef));
  }

  // Level labels on the left of the window
  noStroke();
  textSize(13);
  fill(isDonor ? 'firebrick' : 'navy');
  richText(isDonor ? 'E_{C}' : 'E_{V}', zx0 - 6, yOfE(eEdge) + (isDonor ? -7 : 7), RIGHT);
  fill(dopantColor);
  richText(isDonor ? 'E_{d}' : 'E_{a}', zx0 - 6, yOfE(now.level) + (isDonor ? 8 : -8), RIGHT);
  fill('purple');
  if (efIn) {
    // keep the E_F label clear of the band-edge and dopant labels
    let ly = yOfE(now.ef);
    const yEdge = yOfE(eEdge) + (isDonor ? -7 : 7);
    const yLev = yOfE(now.level) + (isDonor ? 8 : -8);
    if (Math.abs(ly - yLev) < 14) ly = yLev + (isDonor ? 15 : -15);
    if (Math.abs(ly - yEdge) < 14) ly = yEdge + (isDonor ? -15 : 15);
    richText('E_{F}', zx0 - 6, ly, RIGHT);
  } else {
    const below = now.ef < eLo;
    textSize(12);
    richText('E_{F} is ' + (below ? 'below' : 'above') + ' this window ' + (below ? '↓' : '↑'),
             (zx0 + zx1) / 2, below ? zy1 - 10 : zy0 + 10, CENTER);
  }

  // Caption: how many of the ten representative atoms are ionized
  fill('black');
  textSize(12);
  textAlign(LEFT, TOP);
  const cap = nIon + ' of 10 dopant atoms ionized (' + (isDonor ? '+' : '−') + ')';
  text(cap, x + 10, y + h - 22);
}

// One- or two-line model note under the plots. It turns into a caution
// when the doping is heavy enough that the isolated-level model starts to fail.
function drawModelNote(N) {
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textLeading(15);
  let note;
  if (N >= 3e17) {
    fill('firebrick');
    note = 'Caution: at heavy doping the dopant levels broaden into a band (Sec. 7.8), ' +
           'so real silicon is more fully ionized than this isolated-level model predicts.';
  } else {
    fill('dimgray');
    note = 'Model: silicon with one dopant species, isolated dopant level, Boltzmann ' +
           'statistics, degeneracy 2 for donors and 4 for acceptors.';
  }
  text(note, 10, 478, canvasWidth - 20, 32);
}

function drawControlLabels(N, T) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Dopant:', 10, drawHeight + 20);
  richText('Doping: ' + sci(N, 1) + ' cm^{−3}', 10, drawHeight + 55, LEFT);
  text('Temperature: ' + T + ' K', 10, drawHeight + 90);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toggleSweep() {
  if (!isSweeping && tempSlider.value() >= T_MAX) tempSlider.value(T_MIN);
  isSweeping = !isSweeping;
  sweepButton.html(isSweeping ? 'Pause' : 'Sweep T');
}

function dashed(x1, y1, x2, y2, pattern) {
  drawingContext.setLineDash(pattern);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);
}

// Scientific notation in richText markup, e.g. "9.96 × 10^{15}"
function sci(x, digits) {
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = x / Math.pow(10, e);
  if (Number(m.toFixed(digits)) >= 10) { m /= 10; e += 1; }
  return m.toFixed(digits) + ' × 10^{' + String(e).replace('-', '−') + '}';
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

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    const w = Math.floor(container.getBoundingClientRect().width);
    if (w > 0) canvasWidth = w;
    if (typeof dopingSlider !== 'undefined' && dopingSlider) {
      dopingSlider.size(canvasWidth - sliderLeftMargin - margin);
      tempSlider.size(canvasWidth - sliderLeftMargin - margin);
    }
  }
}
