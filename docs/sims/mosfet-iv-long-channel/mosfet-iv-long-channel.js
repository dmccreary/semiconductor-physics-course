// Long-Channel MOSFET I-V Explorer MicroSim
// CANVAS_HEIGHT: 632
//
// Left:  drain current against drain voltage for a family of gate voltages,
//        with the triode, saturation and cutoff regions.
// Right: drain current against gate voltage on a logarithmic scale, showing
//        the subthreshold slope and the threshold voltage.
// Below: a sketch of the channel charge along the device and a readout of
//        the small-signal parameters at the operating point.
//
// Model (Chapter 15, long channel, 300 K), with k = mu C_ox W/L:
//   Triode      (V_DS < V_GS - V_T):  I_D = (k/2) [2 (V_GS - V_T) V_DS - V_DS^2]
//   Saturation  (V_DS >= V_GS - V_T): I_D = (k/2) (V_GS - V_T)^2
//   both multiplied by (1 + lambda V_DS) for channel-length modulation
//   Subthreshold: I_D proportional to exp((V_GS - V_T)/(n V_th)),
//                 S = n V_th ln(10)
// The three are joined by one smooth expression,
//   I_D = (k/2) (v_f^2 - v_r^2) (1 + lambda V_DS)
//   v_f = 2 n V_th ln(1 + exp((V_GS - V_T) / (2 n V_th)))
//   v_r = 2 n V_th ln(1 + exp((V_GS - V_T - V_DS) / (2 n V_th)))
// which equals the square law well above threshold and the exponential law
// well below it. A PMOS device has the same curves with every voltage and
// current reversed, so the plots show magnitudes. See index.md for details.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 482;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let labelWidth = 182;              // width reserved for a slider label in each column
let defaultTextSize = 14;

// ---- Constants ----
const VTH = 8.617333e-5 * 300;     // kT/q at 300 K (V)
const V_AXIS = 3;                  // both voltage axes run from 0 to 3 V
const FAMILY = [1.0, 1.5, 2.0, 2.5, 3.0];   // gate voltages of the family of curves (V)

// ---- Controls ----
let typeSelect, resetButton;
let vgsSlider, vdsSlider, vtSlider, wlSlider, kpSlider, lambdaSlider, nSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  vgsSlider = createSlider(0, V_AXIS, 1.5, 0.01);
  vdsSlider = createSlider(0, V_AXIS, 2.0, 0.01);
  vtSlider = createSlider(0.2, 1.0, 0.5, 0.01);
  wlSlider = createSlider(1, 100, 10, 1);
  kpSlider = createSlider(100, 500, 200, 10);            // microamperes per volt squared
  lambdaSlider = createSlider(0, 0.1, 0.05, 0.005);      // per volt
  nSlider = createSlider(1, 2, 1.3, 0.05);

  typeSelect = createSelect();
  typeSelect.option('NMOS', 'n');
  typeSelect.option('PMOS', 'p');
  typeSelect.selected('n');

  resetButton = createButton('Reset');
  resetButton.mousePressed(resetDefaults);
  layoutControls();

  describe('Two plots for a long-channel MOSFET. The left plot shows drain ' +
    'current against drain voltage for several gate voltages, with a dashed ' +
    'parabola separating the triode and saturation regions. The right plot ' +
    'shows drain current against gate voltage on a logarithmic scale, with ' +
    'a straight subthreshold section below the threshold voltage. A sketch ' +
    'of the transistor cross section shows the inversion charge thinning ' +
    'toward the drain and pinching off in saturation. A readout lists the ' +
    'drain current, transconductance, output conductance and subthreshold ' +
    'slope. Sliders set the gate and drain voltages, threshold voltage, ' +
    'width to length ratio, process transconductance, channel-length ' +
    'modulation and subthreshold slope factor.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Smoothed overdrive voltage: equals x well above 0, decays exponentially below
function softOverdrive(x, n) {
  const s = 2 * n * VTH;
  const z = x / s;
  return z > 30 ? x : s * Math.log1p(Math.exp(z));
}

// Drain current (A). d = {vt, k, lambda, n}, k in A/V^2
function drainCurrent(d, vgs, vds) {
  const vf = softOverdrive(vgs - d.vt, d.n);
  const vr = softOverdrive(vgs - d.vt - vds, d.n);
  return 0.5 * d.k * (vf * vf - vr * vr) * (1 + d.lambda * vds);
}

// Chapter square law without the subthreshold tail (for comparison)
function squareLaw(d, vgs, vds) {
  const vov = vgs - d.vt;
  if (vov <= 0) return 0;
  const core = vds < vov ? 2 * vov * vds - vds * vds : vov * vov;
  return 0.5 * d.k * core * (1 + d.lambda * vds);
}

// Small-signal parameters by central differences
function smallSignal(d, vgs, vds) {
  const h = 0.0005;
  const gm = (drainCurrent(d, vgs + h, vds) - drainCurrent(d, vgs - h, vds)) / (2 * h);
  const gds = (drainCurrent(d, vgs, vds + h) - drainCurrent(d, vgs, Math.max(vds - h, 0))) /
              (vds - h < 0 ? vds + h : 2 * h);
  return { gm: gm, gds: gds };
}

function regionOf(d, vgs, vds) {
  if (vgs < d.vt) return { key: 'sub', name: 'Cutoff (subthreshold)', col: 'dimgray' };
  if (vds < vgs - d.vt) return { key: 'triode', name: 'Triode', col: 'chocolate' };
  return { key: 'sat', name: 'Saturation', col: 'royalblue' };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const isN = typeSelect.value() !== 'p';
  const d = {
    isN: isN,
    vt: vtSlider.value(),
    wl: wlSlider.value(),
    kp: kpSlider.value() * 1e-6,
    lambda: lambdaSlider.value(),
    n: nSlider.value()
  };
  d.k = d.kp * d.wl;
  const vgs = vgsSlider.value(), vds = vdsSlider.value();
  // terminal names: magnitudes are plotted for PMOS
  d.gs = isN ? 'V_{GS}' : 'V_{SG}';
  d.ds = isN ? 'V_{DS}' : 'V_{SD}';
  d.vtName = isN ? 'V_{T}' : '|V_{T}|';

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry
  const leftPad = 56, gap = 66, rightPad = 14;
  const plotW = (canvasWidth - leftPad - gap - rightPad) / 2;
  const lx0 = leftPad, lx1 = leftPad + plotW;
  const rx0 = lx1 + gap, rx1 = rx0 + plotW;
  const y0 = 58, y1 = 282;

  drawOutputPlot(lx0, lx1, y0, y1, d, vgs, vds);
  drawTransferPlot(rx0, rx1, y0, y1, d, vgs, vds);
  const split = Math.round(canvasWidth * 0.44);
  drawCrossSection(10, split, 334, 474, d, vgs, vds);
  drawReadout(split + 10, canvasWidth - 10, 334, 474, d, vgs, vds);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Long-Channel MOSFET I-V Explorer', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(d, vgs, vds);
}

// ---- I_D against V_DS ----
function drawOutputPlot(x0, x1, y0, y1, d, vgs, vds) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  const iTop = drainCurrent(d, V_AXIS, V_AXIS);
  const iMax = niceCeil(iTop * 1.08);
  const useMicro = iMax < 2e-3;
  const unit = useMicro ? 1e-6 : 1e-3;
  const xOfV = (v) => map(v, 0, V_AXIS, x0, x1);
  const yOfI = (i) => map(i, 0, iMax, y1, y0);

  // Regions: triode to the left of V_DS = V_GS - V_T, saturation to the right
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  noStroke();
  fill(235, 244, 255);
  rect(x0, y0, x1 - x0, y1 - y0);
  fill(255, 235, 205);
  beginShape();
  vertex(x0, y1);
  for (let i = 0; i <= 60; i++) {
    const v = V_AXIS * i / 60;                           // overdrive = V_DS on the boundary
    vertex(xOfV(v), yOfI(0.5 * d.k * v * v * (1 + d.lambda * v)));
  }
  vertex(x1, y0);
  vertex(x0, y0);
  endShape(CLOSE);
  fill(215);
  rect(x0, y1 - 5, x1 - x0, 5);
  pop();

  // Grid and ticks
  textSize(12);
  for (let v = 0; v <= V_AXIS + 1e-9; v += 0.5) {
    stroke('gainsboro'); strokeWeight(1);
    if (v > 0) line(xOfV(v), y0, xOfV(v), y1);
    stroke('black');
    line(xOfV(v), y1, xOfV(v), y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    if (v % 1 === 0 || x1 - x0 > 260) text(v % 1 === 0 ? v : v.toFixed(1), xOfV(v), y1 + 7);
  }
  const iStep = niceStep(iMax / unit / 5);
  for (let i = 0; i <= iMax / unit + 1e-9; i += iStep) {
    stroke('gainsboro'); strokeWeight(1);
    if (i > 0) line(x0, yOfI(i * unit), x1, yOfI(i * unit));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(Number(i.toPrecision(6)), x0 - 6, yOfI(i * unit));
  }

  // Curves
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  const curve = (vg, col, w) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    beginShape();
    for (let i = 0; i <= 120; i++) {
      const v = V_AXIS * i / 120;
      vertex(xOfV(v), yOfI(drainCurrent(d, vg, v)));
    }
    endShape();
  };
  for (const vg of FAMILY) curve(vg, 'steelblue', 1.5);
  curve(vgs, 'navy', 3);
  // boundary V_DS = V_GS - V_T
  stroke('chocolate');
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  noFill();
  beginShape();
  for (let i = 0; i <= 60; i++) {
    const v = V_AXIS * i / 60;
    vertex(xOfV(v), yOfI(0.5 * d.k * v * v * (1 + d.lambda * v)));
  }
  endShape();
  drawingContext.setLineDash([]);
  pop();

  // Family labels
  textSize(11);
  for (const vg of FAMILY) {
    const i = drainCurrent(d, vg, V_AXIS);
    if (i < iMax * 0.07) continue;
    chipText((vg === FAMILY[FAMILY.length - 1] ? d.gs + ' = ' : '') + vg.toFixed(1) + ' V',
             x1 - 5, yOfI(i) + 10, RIGHT, 'steelblue');
  }

  // Operating point
  const iq = drainCurrent(d, vgs, vds);
  const qx = xOfV(vds), qy = yOfI(Math.min(iq, iMax));
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(qx, qy, qx, y1);
  drawingContext.setLineDash([]);
  stroke('white');
  strokeWeight(2);
  fill('crimson');
  circle(qx, qy, 12);

  // Region names
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  fill('chocolate');
  text('triode', x0 + 6, y0 + 5);
  fill('royalblue');
  textAlign(RIGHT, TOP);
  text('saturation', x1 - 6, y0 + 5);
  textSize(11);
  chipText(d.ds + ' = ' + d.gs + ' − ' + d.vtName, xOfV(1.55), y0 + 30, CENTER, 'chocolate');

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD);
  richText('Output characteristics: I_{D} against ' + d.ds, (x0 + x1) / 2, y0 - 12, CENTER);
  textStyle(NORMAL);
  richText(d.ds + ' (V)', (x0 + x1) / 2, y1 + 31, CENTER);
  push();
  translate(x0 - 42, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13);
  richText((d.isN ? 'I_{D}' : '|I_{D}|') + ' (' + (useMicro ? 'µA' : 'mA') + ')', 0, 0, CENTER);
  pop();
}

// ---- log I_D against V_GS ----
function drawTransferPlot(x0, x1, y0, y1, d, vgs, vds) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  const vdsPlot = Math.max(vds, 0.01);
  const topExp = Math.ceil(Math.log10(drainCurrent(d, V_AXIS, V_AXIS)));
  const botExp = topExp - 12;
  const xOfV = (v) => map(v, 0, V_AXIS, x0, x1);
  const yOfI = (i) => map(Math.log10(Math.max(i, 1e-300)), botExp, topExp, y1, y0);

  // Subthreshold region shading
  noStroke();
  fill(228);
  rect(x0 + 1, y0 + 1, xOfV(d.vt) - x0 - 1, y1 - y0 - 2);

  textSize(12);
  for (let e = topExp; e >= botExp; e -= 2) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOfI(Math.pow(10, e)), x1, yOfI(Math.pow(10, e)));
    noStroke(); fill('black');
    richText('10^{' + String(e).replace('-', '−') + '}', x0 - 5, yOfI(Math.pow(10, e)), RIGHT);
  }
  for (let v = 0; v <= V_AXIS + 1e-9; v += 0.5) {
    stroke('black'); strokeWeight(1);
    line(xOfV(v), y1, xOfV(v), y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    if (v % 1 === 0 || x1 - x0 > 260) text(v % 1 === 0 ? v : v.toFixed(1), xOfV(v), y1 + 7);
  }

  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  noFill();
  // The two limiting laws (thin dashed) and the full model (thick)
  const i0 = 2 * d.n * d.n * d.k * VTH * VTH;            // subthreshold prefactor
  const tail = (1 - Math.exp(-vdsPlot / (d.n * VTH))) * (1 + d.lambda * vdsPlot);
  stroke('gray');
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(xOfV(0), yOfI(i0 * Math.exp(-d.vt / (d.n * VTH)) * tail),
       xOfV(V_AXIS), yOfI(i0 * Math.exp((V_AXIS - d.vt) / (d.n * VTH)) * tail));
  beginShape();
  for (let i = 0; i <= 150; i++) {
    const v = d.vt + 0.003 + (V_AXIS - d.vt - 0.003) * i / 150;
    vertex(xOfV(v), yOfI(squareLaw(d, v, vdsPlot)));
  }
  endShape();
  drawingContext.setLineDash([]);
  stroke('navy');
  strokeWeight(3);
  beginShape();
  for (let i = 0; i <= 150; i++) {
    const v = V_AXIS * i / 150;
    vertex(xOfV(v), yOfI(drainCurrent(d, v, vdsPlot)));
  }
  endShape();
  pop();

  // Threshold marker
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(xOfV(d.vt), y0, xOfV(d.vt), y1);
  drawingContext.setLineDash([]);
  textSize(12);
  chipText(d.vtName, xOfV(d.vt), y0 + 28, CENTER, 'black');

  // Operating point
  const iq = drainCurrent(d, vgs, vdsPlot);
  const qy = constrain(yOfI(iq), y0, y1);
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xOfV(vgs), y0, xOfV(vgs), y1);
  drawingContext.setLineDash([]);
  stroke('white');
  strokeWeight(2);
  fill('crimson');
  circle(xOfV(vgs), qy, 12);

  // Labels
  noStroke();
  textSize(11);
  const S = d.n * VTH * Math.LN10 * 1000;
  chipText('slope: S = ' + S.toFixed(1) + ' mV/decade', x1 - 6, y1 - 30, RIGHT, 'black');
  chipText(x1 - x0 < 300 ? 'dashed: the two limiting laws' : 'thin dashed: square law and exponential law',
           x1 - 6, y1 - 12, RIGHT, 'dimgray');
  textSize(12);
  fill('dimgray');
  textAlign(LEFT, TOP);
  if (xOfV(d.vt) - x0 > 78) text('subthreshold', x0 + 5, y0 + 5);

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD);
  richText('Transfer curve at ' + d.ds + ' = ' + vds.toFixed(2) + ' V (log scale)', (x0 + x1) / 2, y0 - 12, CENTER);
  textStyle(NORMAL);
  richText(d.gs + ' (V)', (x0 + x1) / 2, y1 + 31, CENTER);
  push();
  translate(x0 - 44, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13);
  richText((d.isN ? 'I_{D}' : '|I_{D}|') + ' (A)', 0, 0, CENTER);
  pop();
}

// ---- Channel cross section (sketch) ----
function drawCrossSection(x0, x1, y0, y1, d, vgs, vds) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x0, y0, x1 - x0, y1 - y0, 8);

  const bodyCol = d.isN ? color(255, 228, 232) : color(214, 234, 255);
  const sdCol = d.isN ? color(120, 170, 240) : color(240, 130, 150);
  const chanCol = d.isN ? 'royalblue' : 'crimson';
  const pad = 12;
  const bx0 = x0 + pad, bx1 = x1 - pad;
  const surf = y0 + 62;                                  // silicon surface
  const by1 = y1 - 22;                                   // bottom of the body
  const sdW = (bx1 - bx0) * 0.2;
  const gx0 = bx0 + sdW - 4, gx1 = bx1 - sdW + 4;        // gate overlaps the junctions slightly
  const L = gx1 - gx0 - 8;

  // Body, source and drain
  stroke('gray');
  strokeWeight(1);
  fill(bodyCol);
  rect(bx0, surf, bx1 - bx0, by1 - surf);
  fill(sdCol);
  rect(bx0, surf, sdW, 30, 0, 0, 6, 0);
  rect(bx1 - sdW, surf, sdW, 30, 0, 0, 0, 6);
  // Oxide and gate
  fill(255, 248, 220);
  rect(gx0, surf - 7, gx1 - gx0, 7);
  fill(170);
  rect(gx0, surf - 27, gx1 - gx0, 20);

  // Inversion charge along the channel (gradual channel approximation)
  const vov = softOverdrive(vgs - d.vt, d.n);            // effective overdrive
  const vdEff = Math.min(vds, vov);
  const sat = vds >= vov && vgs >= d.vt;
  // In saturation the pinch-off point moves toward the source by a fraction
  // lambda (V_DS - V_DSsat) of the channel length
  const shrink = sat ? Math.min(d.lambda * (vds - vov), 0.45) : 0;
  const Leff = L * (1 - shrink);
  const cxs = gx0 + 4;
  const hMaxPx = 20, vovMax = V_AXIS - 0.2;
  if (vgs >= d.vt && vov > 0.005) {
    noStroke();
    fill(chanCol);
    beginShape();
    vertex(cxs, surf);
    for (let i = 0; i <= 40; i++) {
      const f = i / 40;
      const qn = Math.sqrt(Math.max(vov * vov - f * (2 * vov * vdEff - vdEff * vdEff), 0));
      vertex(cxs + Leff * f, surf + 1.5 + hMaxPx * qn / vovMax);
    }
    vertex(cxs + Leff, surf);
    endShape(CLOSE);
  }
  // Drain depletion region (sketch): grows with the drain voltage
  noFill();
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  const dep = 6 + 6 * Math.sqrt(vds);
  rect(bx1 - sdW - dep, surf, sdW + dep, 30 + dep, 0, 0, 0, 8);
  rect(bx0, surf, sdW + 6, 36, 0, 0, 8, 0);
  drawingContext.setLineDash([]);

  // Labels
  noStroke();
  fill('black');
  textSize(12);
  textAlign(CENTER, CENTER);
  text('gate', (gx0 + gx1) / 2, surf - 17);
  fill('white');
  textStyle(BOLD);
  text('S', bx0 + sdW / 2, surf + 15);
  text('D', bx1 - sdW / 2, surf + 15);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, CENTER);
  text((d.isN ? 'p' : 'n') + '-type body', bx0 + 8, by1 - 9);
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Channel charge', x0 + 12, y0 + 14);
  textStyle(NORMAL);

  let msg;
  const carriers = d.isN ? 'electrons' : 'holes';
  if (vgs < d.vt) msg = 'No inversion layer: only a weak diffusion current.';
  else if (sat) msg = 'Pinched off at the drain end: current saturates.';
  else if (vds < 0.02) msg = 'Uniform sheet of ' + carriers + ': a resistor.';
  else msg = 'Inversion layer thins toward the drain.';
  fill(regionOf(d, vgs, vds).col === 'dimgray' ? 'black' : regionOf(d, vgs, vds).col);
  textSize(canvasWidth < 700 ? 11 : 12);
  textAlign(CENTER, CENTER);
  text(msg, (x0 + x1) / 2, y1 - 11);

  if (sat) {                                             // pinch-off marker
    const px = cxs + Leff;
    stroke('black');
    strokeWeight(1);
    line(px, surf + 3, px, surf + 34);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(CENTER, TOP);
    text('pinch-off', px, surf + 36);
  }
}

// ---- Readout ----
function drawReadout(x0, x1, y0, y1, d, vgs, vds) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x0, y0, x1 - x0, y1 - y0, 8);
  noStroke();

  const reg = regionOf(d, vgs, vds);
  const id = drainCurrent(d, vgs, vds);
  const ss = smallSignal(d, vgs, vds);
  const small = (x1 - x0) < 400;
  const px = x0 + 12;
  let cy = y0 + 16;
  const lh = 21;

  fill(reg.col);
  textStyle(BOLD);
  textSize(small ? 13 : 14);
  textAlign(LEFT, CENTER);
  text(reg.name, px, cy);
  textStyle(NORMAL);
  fill('black');
  textSize(small ? 12 : 13);
  cy += lh;
  textStyle(BOLD);
  richText((d.isN ? 'I_{D}' : '|I_{D}|') + ' = ' + fmtCurrent(id) + '     overdrive ' + d.gs + ' − ' + d.vtName +
           ' = ' + signed(vgs - d.vt, 2) + ' V', px, cy, LEFT);
  textStyle(NORMAL);
  cy += lh;
  richText('g_{m} = ∂I_{D}/∂' + d.gs + ' = ' + fmtSiemens(ss.gm), px, cy, LEFT);
  cy += lh;
  const ro = ss.gds > 1e-15 ? 1 / ss.gds : Infinity;
  richText('g_{ds} = ∂I_{D}/∂' + d.ds + ' = ' + fmtSiemens(ss.gds) + '     r_{o} = ' + fmtOhms(ro), px, cy, LEFT);
  cy += lh;
  const gain = ss.gds > 1e-15 ? ss.gm / ss.gds : Infinity;
  const gainText = !isFinite(gain) ? '∞' : gain >= 1e4 ? sci(gain, 1) : gain.toPrecision(3);
  richText('intrinsic gain g_{m}r_{o} = ' + gainText + '     S = ' +
           (d.n * VTH * Math.LN10 * 1000).toFixed(1) + ' mV/decade', px, cy, LEFT);
  cy += lh;
  fill('dimgray');
  textSize(small ? 11 : 12);
  const k = d.k * 1e3;
  richText('k = ' + (d.isN ? 'μ_{n}' : 'μ_{p}') + 'C_{ox}W/L = ' + Number(k.toPrecision(3)) + ' mA/V^{2}     ' +
           (d.isN ? 'V_{DS,sat}' : 'V_{SD,sat}') + ' = ' + d.gs + ' − ' + d.vtName + ' = ' +
           Math.max(vgs - d.vt, 0).toFixed(2) + ' V', px, cy, LEFT);
}

function drawControlLabels(d, vgs, vds) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  const c2 = columnTwoX();
  const yRow = (i) => drawHeight + 20 + 35 * i;
  richText('Gate voltage ' + d.gs + ': ' + vgs.toFixed(2) + ' V', 10, yRow(0), LEFT);
  richText('Drain voltage ' + d.ds + ': ' + vds.toFixed(2) + ' V', 10, yRow(1), LEFT);
  richText('Threshold ' + d.vtName + ': ' + d.vt.toFixed(2) + ' V', 10, yRow(2), LEFT);
  richText('Width/length W/L: ' + d.wl, 10, yRow(3), LEFT);
  richText((d.isN ? 'μ_{n}' : 'μ_{p}') + 'C_{ox}: ' + Math.round(d.kp * 1e6) + ' µA/V^{2}', c2, yRow(0), LEFT);
  richText('Modulation λ: ' + d.lambda.toFixed(3) + ' V^{−1}', c2, yRow(1), LEFT);
  richText('Slope factor n_{sub}: ' + d.n.toFixed(2), c2, yRow(2), LEFT);
  text('Device:', c2, yRow(3));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function columnTwoX() {
  return Math.round(canvasWidth / 2) + 8;
}

function layoutControls() {
  const c2 = columnTwoX();
  const w1 = c2 - 10 - labelWidth - 14;
  const x2 = c2 + labelWidth - 14;
  const left = [vgsSlider, vdsSlider, vtSlider, wlSlider], right = [kpSlider, lambdaSlider, nSlider];
  for (let i = 0; i < left.length; i++) {
    left[i].position(10 + labelWidth, drawHeight + 10 + 35 * i);
    left[i].size(w1);
  }
  for (let i = 0; i < right.length; i++) {
    right[i].position(x2, drawHeight + 10 + 35 * i);
    right[i].size(canvasWidth - x2 - margin);
  }
  typeSelect.position(c2 + 58, drawHeight + 114);
  resetButton.position(c2 + 140, drawHeight + 113);
}

function resetDefaults() {
  typeSelect.selected('n');
  vgsSlider.value(1.5);
  vdsSlider.value(2.0);
  vtSlider.value(0.5);
  wlSlider.value(10);
  kpSlider.value(200);
  lambdaSlider.value(0.05);
  nSlider.value(1.3);
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

// Scientific notation in richText markup, e.g. "1.3 × 10^{5}"
function sci(x, digits) {
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = x / Math.pow(10, e);
  if (Number(m.toFixed(digits)) >= 10) { m /= 10; e += 1; }
  return m.toFixed(digits) + ' × 10^{' + String(e).replace('-', '−') + '}';
}

// Value with an SI prefix and three significant figures
function fmtEng(x, unit) {
  const a = Math.abs(x);
  if (a === 0) return '0 ' + unit;
  const prefixes = [[1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p'], [1e-15, 'f'], [1e-18, 'a']];
  for (const [scale, p] of prefixes) {
    if (a >= scale) return Number((a / scale).toPrecision(3)) + ' ' + p + unit;
  }
  return a.toExponential(1) + ' ' + unit;
}
function fmtCurrent(i) { return fmtEng(i, 'A'); }
function fmtSiemens(g) { return fmtEng(g, 'S'); }

function fmtOhms(r) {
  if (!isFinite(r)) return '∞';
  if (r >= 1e9) return (r / 1e9).toPrecision(3) + ' GΩ';
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
    if (typeof resetButton !== 'undefined' && resetButton) layoutControls();
  }
}
