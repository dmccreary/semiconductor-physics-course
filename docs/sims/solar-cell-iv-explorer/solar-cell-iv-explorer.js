// Solar Cell I-V Curve Explorer MicroSim
// CANVAS_HEIGHT: 589
//
// Single-diode model of an illuminated solar cell, per unit area (Section 18.4):
//   J = J_L - J_0 [exp((V + J R_s)/(n V_th)) - 1] - (V + J R_s)/R_sh
// J is positive when the cell delivers current to the load.
//   J_L = (irradiance in suns) x J_L(1 sun)
//   J_0(T) = J_0(25 C) (T/T_ref)^(3 N/n) exp[-(E_g(T)/T - E_g(T_ref)/T_ref)/(n k)]
// N is the number of junctions in series and E_g is the sum of their bandgaps.
// For silicon this is J_0 proportional to n_i^2, with the same N_C, N_V and
// Varshni E_g(T) as the other MicroSims of the book (n_i(300 K) = 9.65e9 cm^-3).
// Outputs: J_sc, V_oc, the maximum power point, the fill factor
//   FF = P_max/(V_oc J_sc) and the efficiency P_max/P_in, with
//   P_in = 100 mW/cm^2 (AM1.5G) for each sun.
// See index.md for the parameter values, their sources and the limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 474;              // drawing region height
let controlHeight = 115;           // control region height (3 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// ---- Constants ----
const KB_EV = 8.617333e-5;         // Boltzmann constant (eV/K)
const T_REF = 298.15;              // 25 C, the standard test temperature (K)
const P_SUN = 100;                 // AM1.5G irradiance of one sun (mW/cm^2)
const SQ_LIMIT = 0.337;            // Shockley-Queisser maximum, one junction, one sun (Section 18.5)

// Silicon bandgap: same model as the Chapter 7 to 16 MicroSims
const NC300 = 2.86e19, NV300 = 3.10e19, NI300 = 9.65e9;
const SI_ALPHA = 4.73e-4, SI_BETA = 636;
const SI_EG0 = 2 * KB_EV * 300 * Math.log(Math.sqrt(NC300 * NV300) / NI300) +
               SI_ALPHA * 300 * 300 / (300 + SI_BETA);
function egSi(T) { return SI_EG0 - SI_ALPHA * T * T / (T + SI_BETA); }
// GaAs bandgap (Varshni): 1.519 eV at 0 K, 1.42 eV at 300 K
function egGaAs(T) { return 1.519 - 5.405e-4 * T * T / (T + 204); }
const EG_PEROVSKITE = 1.68;        // top cell of the tandem (eV), taken as constant

// Cells. jl and voc are the 1 sun, 25 C values of the table in Section 18.4.
// n is the sum of the junction ideality factors; nj the number of junctions.
const CELLS = {
  si: { name: 'Silicon (commercial)', note: 'one junction, E_{g} = 1.12 eV',
        jl: 38e-3, voc: 0.64, n: 1.0, nj: 1, eg: egSi, vMax: 0.9, vStep: 0.1 },
  gaas: { name: 'GaAs (record lab cell)', note: 'one junction, E_{g} = 1.42 eV',
          jl: 29e-3, voc: 1.13, n: 1.0, nj: 1, eg: egGaAs, vMax: 1.4, vStep: 0.2 },
  tandem: { name: 'Perovskite-Si tandem', note: 'two junctions in series, 1.68 + 1.12 eV',
            jl: 20e-3, voc: 1.99, n: 2.4, nj: 2, eg: (T) => egSi(T) + EG_PEROVSKITE,
            vMax: 2.4, vStep: 0.4 }
};

// ---- Controls ----
let cellSelect, sqCheckbox, resetButton;
let sunSlider, tempSlider, rsSlider, rshSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  cellSelect = createSelect();
  cellSelect.option('Silicon', 'si');
  cellSelect.option('GaAs', 'gaas');
  cellSelect.option('Perovskite-Si tandem', 'tandem');
  cellSelect.selected('si');
  cellSelect.position(48, drawHeight + 9);

  sqCheckbox = createCheckbox(' Show Shockley-Queisser limit', false);
  sqCheckbox.position(222, drawHeight + 9);
  sqCheckbox.style('font-size', '14px');
  sqCheckbox.style('white-space', 'nowrap');

  resetButton = createButton('Reset');
  resetButton.mousePressed(resetDefaults);

  sunSlider = createSlider(0.1, 5, 1, 0.1);              // irradiance (suns)
  tempSlider = createSlider(-20, 80, 25, 1);             // cell temperature (C)
  rsSlider = createSlider(0, 2, 0.5, 0.05);              // series resistance (ohm cm^2)
  rshSlider = createSlider(2, 4, 4, 0.02);               // log10 of shunt resistance (ohm cm^2)
  layoutControls();

  describe('A simulation of an illuminated solar cell. The upper plot shows ' +
    'current density against voltage with the short-circuit current, the ' +
    'open-circuit voltage, and a shaded rectangle at the maximum power ' +
    'point. The lower plot shows power density against voltage with the ' +
    'maximum power point marked. A panel on the right lists the ' +
    'short-circuit current density, open-circuit voltage, maximum power, ' +
    'fill factor and efficiency. Sliders set the irradiance, the cell ' +
    'temperature, the series resistance and the shunt resistance, and a ' +
    'menu selects a silicon cell, a gallium arsenide cell or a ' +
    'perovskite-silicon tandem cell.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Saturation current density (A/cm^2) at temperature T (K)
function satCurrent(c, T) {
  const vt = KB_EV * T_REF;
  const j0ref = c.jl / (Math.exp(c.voc / (c.n * vt)) - 1);   // fixes V_oc at 1 sun, 25 C
  return j0ref * Math.pow(T / T_REF, 3 * c.nj / c.n) *
         Math.exp(-(c.eg(T) / T - c.eg(T_REF) / T_REF) / (c.n * KB_EV));
}

// Solve the single-diode model. suns: irradiance; tc: temperature (C);
// rs: series resistance (ohm cm^2); gsh: shunt conductance (S/cm^2)
function solveCell(c, suns, tc, rs, gsh) {
  const T = tc + 273.15;
  const nvt = c.n * KB_EV * T;
  const jl = c.jl * suns;
  const j0 = satCurrent(c, T);
  // Everything is written in terms of the junction voltage vj = V + J R_s
  const J = (vj) => jl - j0 * (Math.exp(vj / nvt) - 1) - vj * gsh;
  const V = (vj) => vj - J(vj) * rs;
  const root = (f, lo, hi) => {              // f rises through zero between lo and hi
    for (let i = 0; i < 70; i++) {
      const m = (lo + hi) / 2;
      if (f(m) > 0) hi = m; else lo = m;
    }
    return (lo + hi) / 2;
  };
  const top = nvt * Math.log(jl / j0 + 1) + 0.02;
  const vjOc = root((v) => -J(v), 0, top);   // J = 0
  const vjSc = root(V, 0, top);              // V = 0
  // Maximum power point: golden-section search on P = V J between the two
  let a = vjSc, b = vjOc;
  const g = 0.6180339887;
  let x1 = b - g * (b - a), x2 = a + g * (b - a);
  let p1 = V(x1) * J(x1), p2 = V(x2) * J(x2);
  for (let i = 0; i < 60; i++) {
    if (p1 < p2) { a = x1; x1 = x2; p1 = p2; x2 = a + g * (b - a); p2 = V(x2) * J(x2); }
    else { b = x2; x2 = x1; p2 = p1; x1 = b - g * (b - a); p1 = V(x1) * J(x1); }
  }
  const vjMp = (a + b) / 2;
  const jsc = J(vjSc), voc = vjOc, vmp = V(vjMp), jmp = J(vjMp);
  const pmax = vmp * jmp;                    // W/cm^2
  return { J: J, V: V, vjSc: vjSc, vjOc: vjOc, jl: jl, j0: j0, nvt: nvt,
           jsc: jsc, voc: voc, vmp: vmp, jmp: jmp, pmax: pmax,
           ff: pmax / (voc * jsc),
           eta: pmax * 1000 / (P_SUN * suns) };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const c = CELLS[cellSelect.value()] || CELLS.si;
  const suns = sunSlider.value();
  const tc = tempSlider.value();
  const rs = rsSlider.value();
  const rsh = Math.pow(10, rshSlider.value());
  const showSQ = sqCheckbox.checked();

  const real = solveCell(c, suns, tc, rs, 1 / rsh);
  const ideal = solveCell(c, suns, tc, 0, 0);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const panelW = constrain(Math.round(canvasWidth * 0.33), 196, 260);
  const x0 = 58, x1 = Math.max(x0 + 120, canvasWidth - panelW - 26);
  const ivY0 = 58, ivY1 = 262, pvY0 = 296, pvY1 = 428;

  const xOfV = (v) => map(v, 0, c.vMax, x0, x1);
  const jTop = niceCeil(c.jl * suns * 1.12 * 1000);      // mA/cm^2
  const jBot = -0.14 * jTop;
  const yOfJ = (jmA) => map(jmA, jBot, jTop, ivY1, ivY0);
  const pinMw = P_SUN * suns;
  const pTop = niceCeil(Math.max(ideal.pmax * 1000, showSQ ? SQ_LIMIT * pinMw : 0) * 1.18);
  const yOfP = (pmW) => map(pmW, 0, pTop, pvY1, pvY0);

  drawIVPlot(c, real, ideal, x0, x1, ivY0, ivY1, xOfV, yOfJ, jTop, jBot);
  drawPVPlot(c, real, ideal, x0, x1, pvY0, pvY1, xOfV, yOfP, pTop, pinMw, showSQ);

  // Dashed line joining the maximum power point in the two plots
  stroke('seagreen');
  strokeWeight(1);
  drawingContext.setLineDash([3, 4]);
  line(xOfV(real.vmp), yOfJ(real.jmp * 1000), xOfV(real.vmp), yOfP(real.pmax * 1000));
  drawingContext.setLineDash([]);

  drawReadout(c, real, ideal, x1 + 16, canvasWidth - 10, suns, tc, rs, 1 / rsh, pinMw);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Solar Cell I-V Curve Explorer', canvasWidth / 2, 9);
  textStyle(NORMAL);

  drawControlLabels(suns, tc, rs, rsh);
}

function plotFrame(x0, x1, y0, y1) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
}

function plotBorder(x0, x1, y0, y1) {
  stroke('black');
  strokeWeight(1);
  noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
}

function clipTo(x0, x1, y0, y1) {
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
}

function yTitle(str, x, y) {
  push();
  translate(x, y);
  rotate(-HALF_PI);
  noStroke();
  fill('black');
  textSize(13);
  richText(str, 0, 0, CENTER);
  pop();
}

function voltageGrid(c, x0, x1, y0, y1, xOfV, labels) {
  textSize(12);
  const n = Math.round(c.vMax / c.vStep);
  for (let i = 0; i <= n; i++) {
    const v = i * c.vStep, xx = xOfV(v);
    stroke('gainsboro');
    strokeWeight(1);
    line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    if (labels) {
      noStroke();
      fill('black');
      textAlign(CENTER, TOP);
      text(v.toFixed(1), xx, y1 + 6);
    }
  }
}

// Points of a curve (V in volts, J in A/cm^2) from short circuit to the plot edge
function curvePoints(s, c, jBotA) {
  // extend past V_oc until J reaches the bottom of the plot or V the right edge
  let hi = s.vjOc + 1.5;
  let lo = s.vjOc;
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2;
    if (s.J(m) < jBotA * 1.3 || s.V(m) > c.vMax * 1.05) hi = m; else lo = m;
  }
  const pts = [];
  const N = 260;
  for (let i = 0; i <= N; i++) {
    // more points near the knee: quadratic spacing toward the high-voltage end
    const u = i / N;
    const vj = s.vjSc + (hi - s.vjSc) * (1 - (1 - u) * (1 - u));
    pts.push([s.V(vj), s.J(vj)]);
  }
  return pts;
}

// ---- Upper plot: current density against voltage ----
function drawIVPlot(c, real, ideal, x0, x1, y0, y1, xOfV, yOfJ, jTop, jBot) {
  plotFrame(x0, x1, y0, y1);
  voltageGrid(c, x0, x1, y0, y1, xOfV, true);

  const jStep = niceStep(jTop / 5);
  textSize(12);
  for (let j = 0; j <= jTop * 1.0001; j += jStep) {
    stroke('gainsboro');
    strokeWeight(1);
    line(x0, yOfJ(j), x1, yOfJ(j));
    stroke('black');
    line(x0 - 4, yOfJ(j), x0, yOfJ(j));
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(Number(j.toPrecision(6)), x0 - 7, yOfJ(j));
  }

  push();
  clipTo(x0, x1, y0, y1);

  // Region below the axis: the cell takes power instead of delivering it
  noStroke();
  fill(240, 240, 240);
  rect(x0, yOfJ(0), x1 - x0, y1 - yOfJ(0));

  // Rectangle V_oc x J_sc (dashed) and the maximum power rectangle (filled)
  const jscmA = real.jsc * 1000, jmpmA = real.jmp * 1000;
  stroke('gray');
  strokeWeight(1);
  noFill();
  drawingContext.setLineDash([5, 4]);
  rect(xOfV(0), yOfJ(jscmA), xOfV(real.voc) - xOfV(0), yOfJ(0) - yOfJ(jscmA));
  drawingContext.setLineDash([]);
  noStroke();
  fill(46, 139, 87, 70);
  rect(xOfV(0), yOfJ(jmpmA), xOfV(real.vmp) - xOfV(0), yOfJ(0) - yOfJ(jmpmA));

  // Zero-current axis
  stroke('black');
  strokeWeight(1);
  line(x0, yOfJ(0), x1, yOfJ(0));

  // Ideal diode with the same J_L and J_0, no resistances
  noFill();
  stroke('gray');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  beginShape();
  for (const p of curvePoints(ideal, c, jBot / 1000)) vertex(xOfV(p[0]), yOfJ(p[1] * 1000));
  endShape();
  drawingContext.setLineDash([]);

  // The cell
  stroke('royalblue');
  strokeWeight(3);
  beginShape();
  for (const p of curvePoints(real, c, jBot / 1000)) vertex(xOfV(p[0]), yOfJ(p[1] * 1000));
  endShape();
  pop();

  // Markers
  stroke('white');
  strokeWeight(1.5);
  fill('darkorange');
  circle(xOfV(0), yOfJ(jscmA), 11);
  fill('purple');
  circle(xOfV(real.voc), yOfJ(0), 11);
  fill('seagreen');
  circle(xOfV(real.vmp), yOfJ(jmpmA), 11);

  // Labels
  textSize(12);
  textStyle(BOLD);
  chipText('J_{sc}', xOfV(0) + 9, yOfJ(jscmA) - 11, LEFT, 'darkorange');
  chipText('V_{oc}', xOfV(real.voc) + 8, yOfJ(0) - 11, LEFT, 'purple');
  chipText('MPP', xOfV(real.vmp) + 8, yOfJ(jmpmA) - 11, LEFT, 'seagreen');
  textStyle(NORMAL);
  const rw = xOfV(real.vmp) - xOfV(0), rh = yOfJ(0) - yOfJ(jmpmA);
  if (rw > 130 && rh > 46) {
    noStroke();
    fill(20, 90, 50);
    textSize(12);
    const two = rw > 185;
    richText('P_{max} = V_{mp} × J_{mp}', xOfV(0) + rw / 2, yOfJ(jmpmA) + rh / 2 - (two ? 8 : 0), CENTER);
    if (two) richText('FF = green area / dashed box', xOfV(0) + rw / 2, yOfJ(jmpmA) + rh / 2 + 9, CENTER);
  }
  textSize(11);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  if (x1 - x0 > 250) text('J < 0: the cell absorbs power', x0 + 6, (yOfJ(0) + y1) / 2 + 1);

  plotBorder(x0, x1, y0, y1);
  yTitle('J (mA/cm^{2})', x0 - 42, (y0 + y1) / 2);
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text('Current density', x0, y0 - 4);
  textStyle(NORMAL);

  // Legend on the header line, right-aligned to the plot
  if (x1 - x0 > 330) {
    const ly = y0 - 11;
    textSize(11);
    const w2 = richWidth('R_{s} = 0, no shunt'), w1 = textWidth('this cell');
    let lx = x1 - (w1 + w2 + 78);
    stroke('royalblue'); strokeWeight(3);
    line(lx, ly, lx + 22, ly);
    noStroke(); fill('black'); textAlign(LEFT, CENTER);
    text('this cell', lx + 27, ly);
    lx += 27 + w1 + 14;
    stroke('gray'); strokeWeight(1.5);
    drawingContext.setLineDash([6, 4]);
    line(lx, ly, lx + 22, ly);
    drawingContext.setLineDash([]);
    noStroke(); fill('black');
    richText('R_{s} = 0, no shunt', lx + 27, ly, LEFT);
  }
}

// ---- Lower plot: power density against voltage ----
function drawPVPlot(c, real, ideal, x0, x1, y0, y1, xOfV, yOfP, pTop, pinMw, showSQ) {
  plotFrame(x0, x1, y0, y1);
  voltageGrid(c, x0, x1, y0, y1, xOfV, true);

  const pStep = niceStep(pTop / 4);
  textSize(12);
  for (let p = 0; p <= pTop * 1.0001; p += pStep) {
    stroke('gainsboro');
    strokeWeight(1);
    line(x0, yOfP(p), x1, yOfP(p));
    stroke('black');
    line(x0 - 4, yOfP(p), x0, yOfP(p));
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(Number(p.toPrecision(6)), x0 - 7, yOfP(p));
  }

  push();
  clipTo(x0, x1, y0, y1);
  noFill();
  stroke('gray');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  beginShape();
  for (const p of curvePoints(ideal, c, 0)) if (p[1] >= 0) vertex(xOfV(p[0]), yOfP(p[0] * p[1] * 1000));
  endShape();
  drawingContext.setLineDash([]);
  stroke('crimson');
  strokeWeight(3);
  beginShape();
  for (const p of curvePoints(real, c, 0)) if (p[1] >= 0) vertex(xOfV(p[0]), yOfP(p[0] * p[1] * 1000));
  vertex(xOfV(real.voc), yOfP(0));
  endShape();
  pop();

  // Shockley-Queisser limit for one junction at one sun, as a power density
  if (showSQ) {
    const ys = yOfP(SQ_LIMIT * pinMw);
    stroke('darkviolet');
    strokeWeight(1.5);
    drawingContext.setLineDash([8, 4]);
    line(x0, ys, x1, ys);
    drawingContext.setLineDash([]);
    textSize(11);
    chipText(x1 - x0 > 300 ? 'Shockley-Queisser limit, one junction: 33.7 % of P_{in}'
                           : 'SQ limit: 33.7 % of P_{in}', x0 + 6, ys - 9, LEFT, 'darkviolet');
  }

  // Maximum power point
  const xm = xOfV(real.vmp), ym = yOfP(real.pmax * 1000);
  stroke('white');
  strokeWeight(1.5);
  fill('seagreen');
  circle(xm, ym, 11);
  textSize(12);
  textStyle(BOLD);
  const lab = 'MPP: ' + fmt3(real.pmax * 1000) + ' mW/cm^{2}';
  const lw = richWidth(lab);
  const nearSQ = showSQ && Math.abs(ym - yOfP(SQ_LIMIT * pinMw)) < 24;
  if (!nearSQ && xm + 12 + lw < x1 - 4) {
    chipText(lab, xm + 10, ym - 1, LEFT, 'seagreen');            // beside the point
  } else if (ym < y1 - 44 && xm - 10 - lw > x0 + 4) {
    stroke('seagreen');
    strokeWeight(1);
    drawingContext.setLineDash([3, 4]);
    line(xm, ym + 6, xm, y1);
    drawingContext.setLineDash([]);
    chipText(lab, xm - 8, y1 - 13, RIGHT, 'seagreen');           // at the foot of the MPP line
  } else {
    chipText(lab, constrain(xm, x0 + lw / 2 + 6, x1 - lw / 2 - 6), ym - 17, CENTER, 'seagreen');
  }
  textStyle(NORMAL);

  plotBorder(x0, x1, y0, y1);
  yTitle('P (mW/cm^{2})', x0 - 42, (y0 + y1) / 2);
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text('Power density', x0, y0 - 4);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text('Voltage V (V)', (x0 + x1) / 2, y1 + 31);
}

// ---- Readout panel ----
function drawReadout(c, real, ideal, px0, px1, suns, tc, rsNow, gshNow, pinMw) {
  const py0 = 44, py1 = drawHeight - 10;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(px0, py0, px1 - px0, py1 - py0, 6);

  const lx = px0 + 10, rx = px1 - 10;
  let y = py0 + 17;
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(c.name, lx, y);
  textStyle(NORMAL);
  y += 18;
  textSize(11);
  fill('dimgray');
  richText(c.note, lx, y, LEFT);
  y += 10;
  stroke('gainsboro');
  line(lx, y, rx, y);
  y += 15;

  const row = (label, value, col, bold) => {
    noStroke();
    fill(col || 'black');
    textSize(13);
    textStyle(bold ? BOLD : NORMAL);
    richText(label, lx, y, LEFT);
    richText(value, rx, y, RIGHT);
    textStyle(NORMAL);
    y += 19;
  };
  row('P_{in}', fmt3(pinMw) + ' mW/cm^{2}');
  row('J_{sc}', fmt3(real.jsc * 1000) + ' mA/cm^{2}', 'darkorange', true);
  row('V_{oc}', real.voc.toFixed(3) + ' V', 'purple', true);
  row('V_{mp}', real.vmp.toFixed(3) + ' V', 'seagreen');
  row('J_{mp}', fmt3(real.jmp * 1000) + ' mA/cm^{2}', 'seagreen');
  row('P_{max}', fmt3(real.pmax * 1000) + ' mW/cm^{2}', 'crimson', true);
  row('Fill factor', real.ff.toFixed(3));
  y += 3;

  // Efficiency, emphasized
  noStroke();
  fill(235, 245, 255);
  rect(lx - 4, y - 13, rx - lx + 8, 30, 4);
  fill('black');
  textSize(15);
  textStyle(BOLD);
  richText('Efficiency', lx, y + 2, LEFT);
  richText((100 * real.eta).toFixed(1) + ' %', rx, y + 2, RIGHT);
  textStyle(NORMAL);
  y += 31;

  stroke('gainsboro');
  line(lx, y - 8, rx, y - 8);
  noStroke();
  fill('dimgray');
  textSize(12);
  richText('With R_{s} = 0 and no shunt:', lx, y + 4, LEFT);
  y += 18;
  fill('black');
  richText('FF ' + ideal.ff.toFixed(3) + ',  efficiency ' + (100 * ideal.eta).toFixed(1) + ' %', lx, y + 4, LEFT);
  y += 18;
  const lost = 100 * (ideal.eta - real.eta);
  fill('firebrick');
  richText('Lost in R_{s} and R_{sh}: ' + (lost < 0.05 ? '0.0' : lost.toFixed(1)) + ' points', lx, y + 4, LEFT);
  y += 24;

  // The three cells at the present settings
  stroke('gainsboro');
  line(lx, y - 6, rx, y - 6);
  noStroke();
  fill('dimgray');
  textSize(12);
  richText('All three cells at these settings:', lx, y + 6, LEFT);
  y += 24;
  const cols = [lx, lx + (rx - lx) * 0.44, lx + (rx - lx) * 0.80, rx];
  textSize(11);
  fill('dimgray');
  richText('V_{oc} (V)', cols[1], y, RIGHT);
  richText(rx - lx > 195 ? 'J_{sc} (mA/cm^{2})' : 'J_{sc}', cols[2], y, RIGHT);
  richText('η (%)', cols[3], y, RIGHT);
  y += 16;
  textSize(12);
  for (const key of ['si', 'gaas', 'tandem']) {
    const cc = CELLS[key];
    const r = cc === c ? real : solveCell(cc, suns, tc, rsNow, gshNow);
    if (cc === c) {
      fill(235, 245, 255);
      rect(lx - 4, y - 8, rx - lx + 8, 16, 3);
    }
    fill('black');
    textStyle(cc === c ? BOLD : NORMAL);
    richText(key === 'si' ? 'Si' : key === 'gaas' ? 'GaAs' : 'Tandem', cols[0], y, LEFT);
    richText(r.voc.toFixed(2), cols[1], y, RIGHT);
    richText(fmt3(r.jsc * 1000), cols[2], y, RIGHT);
    richText((100 * r.eta).toFixed(1), cols[3], y, RIGHT);
    textStyle(NORMAL);
    y += 17;
  }
  y += 2;
  if (suns > 1.05 && y < py1 - 22) {
    textSize(11);
    fill('firebrick');
    textAlign(LEFT, TOP);
    textLeading(13);
    text('Cell held at ' + String(tc).replace('-', '−') + ' °C; a real cell heats up in concentrated light.', lx, y - 4, rx - lx, 40);
  }
}

function drawControlLabels(suns, tc, rs, rsh) {
  const c2 = columnTwoX();
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Cell:', 10, drawHeight + 20);
  richText('Irradiance: ' + suns.toFixed(1) + (suns === 1 ? ' sun' : ' suns'), 10, drawHeight + 55, LEFT);
  richText('Temperature: ' + String(tc).replace('-', '−') + ' °C', 10, drawHeight + 90, LEFT);
  richText('R_{s}: ' + rs.toFixed(2) + ' Ω·cm^{2}', c2, drawHeight + 55, LEFT);
  richText('R_{sh}: ' + fmtRsh(rsh) + ' Ω·cm^{2}', c2, drawHeight + 90, LEFT);
}

// ---------------------------------------------------------------------------
// Controls and helpers
// ---------------------------------------------------------------------------

function columnTwoX() {
  return Math.round(canvasWidth / 2) + 8;
}

function layoutControls() {
  const c2 = columnTwoX();
  const lw1 = 162, lw2 = 158;
  sunSlider.position(10 + lw1, drawHeight + 45);
  tempSlider.position(10 + lw1, drawHeight + 80);
  sunSlider.size(Math.max(40, c2 - 10 - lw1 - 18));
  tempSlider.size(Math.max(40, c2 - 10 - lw1 - 18));
  rsSlider.position(c2 + lw2, drawHeight + 45);
  rshSlider.position(c2 + lw2, drawHeight + 80);
  rsSlider.size(Math.max(40, canvasWidth - (c2 + lw2) - margin));
  rshSlider.size(Math.max(40, canvasWidth - (c2 + lw2) - margin));
  // On a narrow canvas the checkbox label is shortened so the Reset button still fits
  const span = sqCheckbox.elt.querySelector('span');
  if (span) span.textContent = canvasWidth < 520 ? ' Show SQ limit' : ' Show Shockley-Queisser limit';
  resetButton.position(Math.max(340, canvasWidth - 72), drawHeight + 8);
}

function resetDefaults() {
  cellSelect.selected('si');
  sqCheckbox.checked(false);
  sunSlider.value(1);
  tempSlider.value(25);
  rsSlider.value(0.5);
  rshSlider.value(4);
}

function fmt3(x) {
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 100) return x.toFixed(0);
  if (a >= 10) return x.toFixed(1);
  return x.toFixed(2);
}

function fmtRsh(r) {
  const v = Number(r.toPrecision(2));
  return v >= 10000 ? '10 000' : String(Math.round(v));
}

// 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8 or 10 times a power of ten, at or above x
function niceCeil(x) {
  const e = Math.floor(Math.log10(x));
  const m = x / Math.pow(10, e);
  for (const c of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (m <= c * 1.0000001) return c * Math.pow(10, e);
  }
  return 10 * Math.pow(10, e);
}

// 1, 2 or 5 times a power of ten, at or above x
function niceStep(x) {
  const e = Math.floor(Math.log10(x));
  const m = x / Math.pow(10, e);
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * Math.pow(10, e);
}

// richText on a translucent white chip, so it stays readable over curves
function chipText(str, x, y, align, col) {
  const w = richWidth(str), ts = textSize();
  const left = align === RIGHT ? x - w : align === CENTER ? x - w / 2 : x;
  noStroke();
  fill(255, 255, 255, 205);
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

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    const w = Math.floor(container.getBoundingClientRect().width);
    if (w > 0) canvasWidth = w;
    if (typeof rshSlider !== 'undefined' && rshSlider) layoutControls();
  }
}
