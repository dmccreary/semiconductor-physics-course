// BJT Operating Regions Explorer MicroSim
// CANVAS_HEIGHT: 612
//
// Common-emitter output characteristics (I_C against V_CE for a family of base
// currents) with a load line, the DC operating point, a map of the four
// operating regions in terms of the two junction biases, and the minority
// carrier profile in the base at the operating point.
//
// Model (Chapter 14, Ebers-Moll in transport form, 300 K):
//   I_C = I_S (e^{V_BE/V_th} - e^{V_BC/V_th}) (1 + V_CE/V_A)
//         - (I_S/beta_R) (e^{V_BC/V_th} - 1)
//   I_B = (I_S/beta_F) (e^{V_BE/V_th} - 1) + (I_S/beta_R) (e^{V_BC/V_th} - 1)
// with V_BC = V_BE - V_CE. In the forward active region this reduces to
//   I_C = beta_F I_B (1 + V_CE/V_A)        (Section 14.5.1)
// Fixed parameters: I_S = 1e-14 A, beta_R = 1. A PNP device has the same
// curves with every voltage and current reversed, so the plot shows magnitudes.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 462;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let labelWidth = 178;              // width reserved for a slider label in each column
let defaultTextSize = 14;

// ---- Device constants ----
const VTH = 8.617333e-5 * 300;     // kT/q at 300 K (V)
const I_S = 1e-14;                 // transport saturation current (A)
const BETA_R = 1;                  // reverse common-emitter gain
const NUM_CURVES = 5;              // family: I_B = 0, 1, ..., 5 steps

// ---- Controls ----
let typeSelect, loadCheckbox, resetButton;
let betaSlider, stepSlider, ibSlider, vccSlider, rcSlider, vaSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  typeSelect = createSelect();
  typeSelect.option('NPN', 'npn');
  typeSelect.option('PNP', 'pnp');
  typeSelect.selected('npn');
  typeSelect.position(92, drawHeight + 9);

  loadCheckbox = createCheckbox(' Show load line', true);
  loadCheckbox.position(168, drawHeight + 9);
  loadCheckbox.style('font-size', '14px');
  loadCheckbox.style('white-space', 'nowrap');

  resetButton = createButton('Reset');
  resetButton.position(308, drawHeight + 8);
  resetButton.mousePressed(resetDefaults);

  betaSlider = createSlider(50, 300, 100, 5);
  stepSlider = createSlider(5, 50, 10, 1);               // microamperes
  ibSlider = createSlider(0, NUM_CURVES, 3, 0.05);       // in units of the step
  vccSlider = createSlider(2, 20, 10, 0.5);              // volts
  rcSlider = createSlider(0.1, 10, 2, 0.1);              // kilohms
  vaSlider = createSlider(50, 500, 100, 10);             // volts
  layoutSliders();

  describe('Collector current against collector-emitter voltage for a ' +
    'family of base currents, with the saturation, forward active and ' +
    'cutoff regions shaded. A load line set by the supply voltage and the ' +
    'collector resistor crosses the selected curve at the operating point. ' +
    'A two by two map shows the four operating regions by the bias of the ' +
    'two junctions, and a small diagram shows the minority carrier ' +
    'concentration across the base. Sliders set the current gain, the base ' +
    'current step, the operating base current, the supply voltage, the ' +
    'collector resistor and the Early voltage.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Terminal quantities for base current ib (A) and collector-emitter voltage vce (V)
function bjtPoint(ib, vce, beta, va) {
  const a = Math.exp(-vce / VTH);                        // e^{V_BC/V_th} / e^{V_BE/V_th}
  const u = (ib / I_S + 1 / beta + 1 / BETA_R) / (1 / beta + a / BETA_R);  // e^{V_BE/V_th}
  const ic = I_S * u * (1 - a) * (1 + vce / va) - I_S / BETA_R * (u * a - 1);
  const vbe = VTH * Math.log(u);
  return { ic: ic, vbe: vbe, vbc: vbe - vce, u: u, a: a };
}

// Intersection of the device curve with the load line I_C = (V_CC - V_CE)/R_C
function operatingPoint(ib, beta, va, vcc, rc) {
  let lo = 0, hi = vcc;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (bjtPoint(ib, m, beta, va).ic > (vcc - m) / rc) hi = m; else lo = m;
  }
  const vce = (lo + hi) / 2;
  const pt = bjtPoint(ib, vce, beta, va);
  pt.vce = vce;
  return pt;
}

// Region from the two junction biases. A base current of zero is treated as
// the cutoff boundary: the emitter junction is not turned on.
function regionOf(ib, pt) {
  const beOn = ib > 0 && pt.vbe > 0;
  const bcOn = pt.vbc > 0;
  if (!beOn) return { key: 'cutoff', name: 'Cutoff', col: 'dimgray' };
  if (bcOn) return { key: 'sat', name: 'Saturation', col: 'chocolate' };
  return { key: 'active', name: 'Forward active', col: 'royalblue' };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const isNPN = typeSelect.value() !== 'pnp';
  const beta = betaSlider.value();
  const step = stepSlider.value() * 1e-6;                // A
  const ib = ibSlider.value() * step;                    // A
  const vcc = vccSlider.value();
  const rc = rcSlider.value() * 1e3;                     // ohms
  const va = vaSlider.value();
  const op = operatingPoint(ib, beta, va, vcc, rc);
  const reg = regionOf(ib, op);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry: characteristics on the left, two small panels on the right
  const leftPad = 56, gap = 22, rightPad = 12;
  const total = canvasWidth - leftPad - gap - rightPad;
  const lx0 = leftPad, lx1 = leftPad + total * 0.6;
  const rx0 = lx1 + gap, rx1 = canvasWidth - rightPad;
  const y0 = 58, y1 = 330;

  const s = { isNPN: isNPN, beta: beta, step: step, ib: ib, vcc: vcc, rc: rc, va: va };
  drawCharacteristics(lx0, lx1, y0, y1, s, op);
  drawRegionMap(rx0, rx1, y0 - 14, 186, reg, s);
  drawBaseProfile(rx0, rx1, 200, y1 + 34, s, op, reg);
  drawReadout(s, op, reg);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('BJT Operating Regions Explorer', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(s);
}

// ---- Output characteristics ----
function drawCharacteristics(x0, x1, y0, y1, s, op) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  const vMax = niceCeil(s.vcc * 1.1);
  const icTop = s.beta * NUM_CURVES * s.step * (1 + vMax / s.va);
  const iMax = niceCeil(icTop * 1.12);
  const useMicro = iMax < 2e-3;
  const unit = useMicro ? 1e-6 : 1e-3;
  const xOfV = (v) => map(v, 0, vMax, x0, x1);
  const yOfI = (i) => map(i, 0, iMax, y1, y0);

  // Saturation region: both junctions forward biased, V_CE < V_BE.
  // Its boundary is the locus V_BC = 0 on every curve.
  const locus = [];
  for (let k = 0; k <= 40; k++) {
    const ibk = NUM_CURVES * s.step * k / 40;
    // on V_BC = 0 only the emitter junction carries base current
    const u = 1 + s.beta * ibk / I_S;
    const vbe = VTH * Math.log(u);
    locus.push([vbe, bjtPoint(ibk, vbe, s.beta, s.va).ic]);
  }
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  noStroke();
  fill(235, 244, 255);
  rect(x0, y0, x1 - x0, y1 - y0);                        // forward active (default)
  fill(255, 228, 196);
  beginShape();
  vertex(x0, y1);
  for (const [v, i] of locus) vertex(xOfV(v), yOfI(Math.max(i, 0)));
  vertex(xOfV(locus[locus.length - 1][0]), y0);
  vertex(x0, y0);
  endShape(CLOSE);
  fill(215);
  rect(x0, y1 - 5, x1 - x0, 5);                          // cutoff strip along I_B = 0
  pop();

  // Grid and ticks
  textSize(12);
  const vStep = vMax > 12 ? 5 : vMax > 6 ? 2 : 1;
  for (let v = 0; v <= vMax + 1e-9; v += vStep) {
    stroke('gainsboro'); strokeWeight(1);
    if (v > 0) line(xOfV(v), y0, xOfV(v), y1);
    stroke('black');
    line(xOfV(v), y1, xOfV(v), y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    text(v, xOfV(v), y1 + 7);
  }
  const iStep = niceStep(iMax / unit / 5);
  for (let i = 0; i <= iMax / unit + 1e-9; i += iStep) {
    stroke('gainsboro'); strokeWeight(1);
    if (i > 0) line(x0, yOfI(i * unit), x1, yOfI(i * unit));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(Number(i.toPrecision(6)), x0 - 6, yOfI(i * unit));
  }

  // Family of curves and the selected curve
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  const vs = [];
  for (let i = 0; i <= 60; i++) vs.push(0.5 * i / 60);   // fine steps through the knee
  for (let i = 1; i <= 80; i++) vs.push(0.5 + (vMax - 0.5) * i / 80);
  const curve = (ibk, col, w) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    beginShape();
    for (const v of vs) vertex(xOfV(v), yOfI(Math.max(bjtPoint(ibk, v, s.beta, s.va).ic, 0)));
    endShape();
  };
  for (let k = 0; k <= NUM_CURVES; k++) curve(k * s.step, 'steelblue', 1.5);
  curve(s.ib, 'navy', 3);

  // Load line
  if (loadCheckbox.checked()) {
    stroke('darkorange');
    strokeWeight(2.5);
    line(xOfV(0), yOfI(s.vcc / s.rc), xOfV(s.vcc), yOfI(0));
  }
  pop();

  // Curve labels at the right-hand end
  noStroke();
  textSize(11);
  for (let k = 1; k <= NUM_CURVES; k++) {
    const i = bjtPoint(k * s.step, vMax, s.beta, s.va).ic;
    chipText((k === NUM_CURVES ? 'I_{B} = ' : '') + fmtCurrent(k * s.step), x1 - 5, yOfI(i) - 9, RIGHT, 'steelblue');
  }

  // Operating point with drop lines
  const qx = xOfV(op.vce), qy = yOfI(Math.max(op.ic, 0));
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(qx, qy, qx, y1);
  line(x0, qy, qx, qy);
  drawingContext.setLineDash([]);
  stroke('white');
  strokeWeight(2);
  fill('crimson');
  circle(qx, qy, 12);
  textSize(12);
  textStyle(BOLD);
  // keep the label clear of the plot edges and of the load-line intercept label
  const nearLeft = qx < x0 + 90;
  chipText('Q', qx + (qx > x1 - 30 ? -14 : 12), qy + (nearLeft ? 14 : -12), CENTER, 'crimson');
  textStyle(NORMAL);

  // Region names
  noStroke();
  textSize(12);
  fill('royalblue');
  textAlign(CENTER, TOP);
  text('forward active', (xOfV(1) + x1) / 2, y0 + 5);
  chipText('cutoff: I_{B} = 0', x0 + (x1 - x0) * 0.62, y1 - 14, CENTER, 'dimgray');
  push();
  translate(x0 + 9, y0 + 8);
  rotate(HALF_PI);
  noStroke(); fill('chocolate'); textAlign(LEFT, CENTER); textSize(12);
  text('saturation', 0, 0);
  pop();
  if (loadCheckbox.checked() && s.vcc / s.rc <= iMax) {
    textSize(11);
    chipText('V_{CC}/R_{C}', x0 + 26, yOfI(s.vcc / s.rc) - 10, LEFT, 'chocolate');
  }

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD);
  richText('Output characteristics (' + (s.isNPN ? 'NPN' : 'PNP, magnitudes') + ')', (x0 + x1) / 2, y0 - 12, CENTER);
  textStyle(NORMAL);
  richText((s.isNPN ? 'V_{CE}' : 'V_{EC}') + ' (V)', (x0 + x1) / 2, y1 + 31, CENTER);
  push();
  translate(x0 - 42, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13);
  richText('I_{C} (' + (useMicro ? 'µA' : 'mA') + ')', 0, 0, CENTER);
  pop();
}

// ---- Two-by-two map of the operating regions ----
function drawRegionMap(x0, x1, y0, y1, reg, s) {
  noStroke(); fill('black'); textSize(13); textStyle(BOLD); textAlign(CENTER, CENTER);
  text('Regions by junction bias', (x0 + x1) / 2, y0 + 2);
  textStyle(NORMAL);

  const hx = x0 + 58;                                    // left edge of the grid
  const top = y0 + 34, bottom = y1;
  const cw = (x1 - hx) / 2, ch = (bottom - top) / 2;
  const cells = [
    { key: 'reverse', label: 'Reverse\nactive', c: 0, r: 0, col: 'purple' },
    { key: 'sat', label: 'Saturation', c: 1, r: 0, col: 'chocolate' },
    { key: 'cutoff', label: 'Cutoff', c: 0, r: 1, col: 'dimgray' },
    { key: 'active', label: 'Forward\nactive', c: 1, r: 1, col: 'royalblue' }
  ];
  for (const cell of cells) {
    const cx = hx + cell.c * cw, cy = top + cell.r * ch;
    const on = cell.key === reg.key;
    stroke(on ? cell.col : 'silver');
    strokeWeight(on ? 3 : 1);
    fill(on ? color(255, 250, 205) : color(255));
    rect(cx + (on ? 2 : 0), cy + (on ? 2 : 0), cw - (on ? 4 : 0), ch - (on ? 4 : 0), 4);
    noStroke();
    fill(on ? cell.col : 'gray');
    textStyle(on ? BOLD : NORMAL);
    textSize(12);
    textLeading(14);
    textAlign(CENTER, CENTER);
    text(cell.label, cx + cw / 2, cy + ch / 2);
  }
  textStyle(NORMAL);
  // Column headers: emitter junction; row headers: collector junction
  noStroke();
  fill('black');
  textSize(11);
  textAlign(CENTER, CENTER);
  text('B-E reverse', hx + cw / 2, top - 9);
  text('B-E forward', hx + 1.5 * cw, top - 9);
  textAlign(RIGHT, CENTER);
  textLeading(13);
  text('B-C\nforward', hx - 5, top + ch / 2);
  text('B-C\nreverse', hx - 5, top + 1.5 * ch);
}

// ---- Minority carriers in the base ----
function drawBaseProfile(x0, x1, y0, y1, s, op, reg) {
  noStroke(); fill('black'); textSize(13); textStyle(BOLD); textAlign(CENTER, CENTER);
  text(canvasWidth < 700 ? 'Minority carriers in base' : 'Minority carriers in the base', (x0 + x1) / 2, y0 + 8);
  textStyle(NORMAL);

  const top = y0 + 22, bottom = y1 - 16;
  const w = x1 - x0;
  const ex1 = x0 + w * 0.2;                              // emitter | base junction
  const cx0 = x0 + w * 0.7;                              // base | collector junction (metallurgical)
  // Early effect: the collector depletion layer widens with V_CE and the
  // neutral base narrows by the factor 1/(1 + V_CE/V_A)
  const neutral = (cx0 - ex1 - 6) / (1 + Math.max(op.vce, 0) / s.va);
  const bx0 = ex1 + 3, bx1 = bx0 + neutral;

  const emitterCol = s.isNPN ? color(200, 225, 255) : color(255, 215, 220);
  const baseCol = s.isNPN ? color(255, 225, 228) : color(210, 232, 255);
  stroke('gray');
  strokeWeight(1);
  fill(emitterCol);
  rect(x0, top, ex1 - x0, bottom - top);
  fill(baseCol);
  rect(ex1, top, cx0 - ex1, bottom - top);
  fill(emitterCol);
  rect(cx0, top, x1 - cx0, bottom - top);
  noStroke();
  fill(190);                                             // depletion layers
  rect(ex1 - 3, top + 1, 6, bottom - top - 2);
  rect(bx1, top + 1, Math.max(cx0 + 8 - bx1, 4), bottom - top - 2);

  // Linear profile from the emitter edge to the collector edge of the neutral base
  const uRef = s.beta * NUM_CURVES * s.step / I_S;       // largest e^{V_BE/V_th} in the family
  const n0 = constrain((op.u - 1) / uRef, 0, 1);
  const nW = constrain((op.u * op.a - 1) / uRef, 0, 1);
  const hMax = bottom - top - 20;
  const carrierCol = s.isNPN ? 'royalblue' : 'crimson';
  const c = color(carrierCol);
  noStroke();
  fill(red(c), green(c), blue(c), 90);
  quad(bx0, bottom, bx0, bottom - n0 * hMax, bx1, bottom - nW * hMax, bx1, bottom);
  stroke(carrierCol);
  strokeWeight(2.5);
  line(bx0, bottom - n0 * hMax, bx1, bottom - nW * hMax);

  // Labels
  noStroke();
  fill('black');
  textSize(12);
  textAlign(CENTER, TOP);
  text('E', (x0 + ex1) / 2, top + 3);
  text('B', (ex1 + cx0) / 2, top + 3);
  text('C', (cx0 + x1) / 2, top + 3);
  fill('dimgray');
  textSize(11);
  const types = s.isNPN ? ['n⁺', 'p', 'n'] : ['p⁺', 'n', 'p'];
  text(types[0], (x0 + ex1) / 2, top + 18);
  text(types[1], (ex1 + cx0) / 2, top + 18);
  text(types[2], (cx0 + x1) / 2, top + 18);
  textAlign(CENTER, TOP);
  fill('black');
  textSize(11);
  const what = s.isNPN ? 'electrons' : 'holes';
  let msg;
  if (reg.key === 'cutoff') msg = 'no injected ' + what;
  else if (reg.key === 'sat') msg = 'both junctions inject ' + what;
  else msg = 'slope sets I_C; base narrows with V_CE';
  richText(msg.replace('I_C', 'I_{C}').replace('V_CE', s.isNPN ? 'V_{CE}' : 'V_{EC}'), (x0 + x1) / 2, y1 - 6, CENTER);
}

// ---- Readout strip ----
function drawReadout(s, op, reg) {
  const x = 10, y = 376, w = canvasWidth - 20, h = 78;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const small = canvasWidth < 720;
  const ce = s.isNPN ? 'V_{CE}' : 'V_{EC}';
  const be = s.isNPN ? 'V_{BE}' : 'V_{EB}';
  const bc = s.isNPN ? 'V_{BC}' : 'V_{CB}';
  textSize(small ? 12 : 13);
  fill(reg.col);
  textStyle(BOLD);
  const wr = richText(reg.name + ':', x + 12, y + 15, LEFT);
  fill('black');
  const ratio = s.ib > 0 ? (op.ic / s.ib).toFixed(1) : '—';
  richText('Q at ' + ce + ' = ' + op.vce.toFixed(2) + ' V,  I_{C} = ' + fmtCurrent(Math.max(op.ic, 0)) +
           ',  I_{C}/I_{B} = ' + ratio + '  (β = ' + s.beta + ')', x + 20 + wr, y + 15, LEFT);
  textStyle(NORMAL);

  const beState = s.ib > 0 ? 'forward' : 'not turned on';
  const bcState = op.vbc > 0 ? 'forward' : 'reverse';
  richText('B-E junction: ' + beState + ', ' + be + ' = ' + op.vbe.toFixed(3) + ' V     B-C junction: ' + bcState +
           ', ' + bc + ' = ' + signed(op.vbc, 2) + ' V', x + 12, y + 36, LEFT);

  let line3;
  if (reg.key === 'active') {
    const ro = s.va / (s.beta * s.ib);
    const mirror = (1 + op.vce / s.va) / (1 + op.vbe / s.va) - 1;
    line3 = 'I_{C} = βI_{B}(1 + ' + ce + '/V_{A})     r_{o} = V_{A}/(βI_{B}) = ' + fmtOhms(ro) +
            '     current-mirror error at this ' + ce + ': +' + (100 * mirror).toFixed(1) + ' %';
  } else if (reg.key === 'sat') {
    line3 = 'Saturated: I_{C} is below βI_{B}. The circuit sets it: I_{C} = (V_{CC} − ' + ce + ')/R_{C}.';
  } else {
    line3 = 'Cutoff: no base current, so only leakage flows and ' + ce + ' is close to V_{CC}.';
  }
  fill(reg.col === 'dimgray' ? 'black' : reg.col);
  textSize(small ? 11 : 12);
  richText(line3, x + 12, y + 58, LEFT);
}

function drawControlLabels(s) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Transistor:', 10, drawHeight + 20);
  textSize(13);
  const c2 = columnTwoX();
  const yRow = (i) => drawHeight + 55 + 35 * i;
  text('Current gain β: ' + s.beta, 10, yRow(0));
  richText('Base current step: ' + fmtCurrent(s.step), 10, yRow(1), LEFT);
  richText('Base current I_{B}: ' + fmtCurrent(s.ib), 10, yRow(2), LEFT);
  richText('Supply V_{CC}: ' + s.vcc.toFixed(1) + ' V', c2, yRow(0), LEFT);
  richText('Load R_{C}: ' + fmtOhms(s.rc), c2, yRow(1), LEFT);
  richText('Early voltage V_{A}: ' + s.va + ' V', c2, yRow(2), LEFT);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function columnTwoX() {
  return Math.round(canvasWidth / 2) + 8;
}

function layoutSliders() {
  const c2 = columnTwoX();
  const w = c2 - 10 - labelWidth - 14;
  const left = [betaSlider, stepSlider, ibSlider], right = [vccSlider, rcSlider, vaSlider];
  for (let i = 0; i < 3; i++) {
    left[i].position(10 + labelWidth, drawHeight + 45 + 35 * i);
    left[i].size(w);
    right[i].position(c2 + labelWidth - 8, drawHeight + 45 + 35 * i);
    right[i].size(canvasWidth - (c2 + labelWidth - 8) - margin);
  }
}

function resetDefaults() {
  typeSelect.selected('npn');
  loadCheckbox.checked(true);
  betaSlider.value(100);
  stepSlider.value(10);
  ibSlider.value(3);
  vccSlider.value(10);
  rcSlider.value(2);
  vaSlider.value(100);
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

function signed(v, digits) {
  const t = Math.abs(v).toFixed(digits);
  if (Number(t) === 0) return t;
  return (v < 0 ? '−' : '+') + t;
}

// Current with an SI prefix and three significant figures
function fmtCurrent(i) {
  const a = Math.abs(i);
  if (a < 1e-9) return '0 µA';
  if (a >= 1) return a.toPrecision(3) + ' A';
  if (a >= 1e-3) return Number((a * 1e3).toPrecision(3)) + ' mA';
  return Number((a * 1e6).toPrecision(3)) + ' µA';
}

function fmtOhms(r) {
  if (!isFinite(r)) return '∞';
  if (r >= 1e6) return (r / 1e6).toPrecision(3) + ' MΩ';
  if (r >= 1e3) return (r / 1e3).toPrecision(3) + ' kΩ';
  return r.toPrecision(3) + ' Ω';
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
    if (typeof vaSlider !== 'undefined' && vaSlider) layoutSliders();
  }
}
