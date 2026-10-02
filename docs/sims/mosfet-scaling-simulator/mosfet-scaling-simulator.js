// MOSFET Scaling Simulator MicroSim
// CANVAS_HEIGHT: 652
//
// A 1 micrometer, 5 V reference transistor is shrunk to a chosen gate length.
// Three linked views show what happens:
//   1. A cross section of the chosen architecture and a gauge of gate control
//   2. Short-channel indicators against gate length (DIBL, threshold roll-off,
//      subthreshold slope)
//   3. Speed, dynamic power density and leakage power density against gate
//      length, with the constant-field (Dennard) and constant-voltage regions
//
// This is a TREND MODEL built from the scaling relations of Chapter 16. It is
// not a model of any commercial process. The pieces are:
//   Natural length (Sections 16.1, 16.7), eps_s/eps_ox = 3:
//     planar bulk   lambda = sqrt(3 t_ox t_dep)
//     FDSOI         lambda = sqrt(3 t_ox t_si)
//     FinFET        lambda = sqrt(3 t_ox t_fin / 2)
//     GAA nanowire  lambda = (R/2) sqrt(3)
//   Short-channel factor  theta = exp(-L / (2 lambda))
//     DIBL = theta (V/V),  threshold roll-off = (V_DD + 0.4 V) theta
//     S = 59.5 mV/decade * (1 + C_dep/C_ox + 2 theta)
//   Scaling rules for the reference device (constant field):
//     t_ox = L/50, t_dep = L/7, V_DD = 5 V * L / 1 um, V_T = V_DD / 4
//     with floors: t_ox >= 1 nm, t_dep >= 12 nm, V_DD >= the slider value
//   Power: P_dyn = alpha C V_DD^2 f with C the gate capacitance and f set by
//     the gate delay C V_DD / I_on, I_on = W C_ox v_sat (V_DD - V_T)
//     P_leak = I_off V_DD, I_off = 100 nA (W/L) 10^(-V_T,eff / S)
// See index.md for the details and limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 537;              // drawing region height
let controlHeight = 115;           // control region height (3 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 250;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Model constants ----
const L_REF = 1000;                // reference gate length (nm)
const V_REF = 5;                   // reference supply (V)
const L_MIN = 5;                   // shortest gate length (nm)
const TOX_FLOOR = 1.0;             // equivalent oxide thickness floor (nm)
const TDEP_FLOOR = 12;             // depletion depth floor (nm), doping near 1e19 cm^-3
const BODY = { fdsoi: 6, finfet: 6, gaa: 5 };   // film thickness, fin width, wire diameter (nm)
const S_IDEAL = 8.617333e-5 * 300 * Math.LN10 * 1000;   // 59.5 mV/decade at 300 K
const EPS_OX = 3.9 * 8.854e-14;    // F/cm
const V_SAT = 1e7;                 // saturation velocity (cm/s)
const LOGIC_DEPTH = 20;            // gate delays per clock period
const ACTIVITY = 0.1;              // activity factor alpha

const ARCHS = [
  { key: 'planar', name: 'Planar bulk', col: 'crimson' },
  { key: 'fdsoi', name: 'FDSOI', col: 'darkorange' },
  { key: 'finfet', name: 'FinFET', col: 'seagreen' },
  { key: 'gaa', name: 'GAA nanowire', col: 'royalblue' }
];

// ---- Controls ----
let archSelect, dennardCheckbox, resetButton, lengthSlider, vddSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  archSelect = createSelect();
  for (const a of ARCHS) archSelect.option(a.name, a.key);
  archSelect.selected('planar');
  archSelect.position(104, drawHeight + 9);

  dennardCheckbox = createCheckbox(' Dennard reference', true);
  dennardCheckbox.position(240, drawHeight + 9);
  dennardCheckbox.style('font-size', '14px');
  dennardCheckbox.style('white-space', 'nowrap');

  resetButton = createButton('Reset');
  resetButton.position(400, drawHeight + 8);
  resetButton.mousePressed(resetDefaults);

  // 0 = 1 micrometer, 1 = 5 nm: moving right shrinks the transistor
  lengthSlider = createSlider(0, 1, lengthToSlider(45), 0.002);
  lengthSlider.position(sliderLeftMargin, drawHeight + 45);
  vddSlider = createSlider(0.5, 1.5, 1.0, 0.05);
  vddSlider.position(sliderLeftMargin, drawHeight + 80);
  sizeSliders();

  describe('A transistor scaling model in three linked views. A cross ' +
    'section shows the chosen architecture: planar bulk, fully depleted ' +
    'silicon on insulator, FinFET, or gate all around, with a gauge of ' +
    'gate length divided by natural length. A plot against gate length ' +
    'shows drain induced barrier lowering, threshold voltage roll-off and ' +
    'subthreshold slope rising as the transistor shrinks. A second plot ' +
    'shows switching speed, dynamic power density and leakage power ' +
    'density, with the constant-field Dennard region and the ' +
    'constant-voltage region shaded differently. Sliders set the gate ' +
    'length and the lowest supply voltage.', LABEL);
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

function sliderToLength(s) { return L_REF * Math.pow(L_MIN / L_REF, s); }
function lengthToSlider(L) { return Math.log(L / L_REF) / Math.log(L_MIN / L_REF); }

// Everything about a device of gate length L (nm) in architecture arch,
// when the supply voltage cannot go below vFloor (V)
function device(arch, L, vFloor) {
  const tox = Math.max(L / 50, TOX_FLOOR);               // nm
  const tdep = Math.max(L / 7, TDEP_FLOOR);              // nm (planar bulk only)
  let lambda, nBody = 1;
  if (arch === 'planar') {
    lambda = Math.sqrt(3 * tox * tdep);
    nBody = 1 + 3 * tox / tdep;                          // 1 + C_dep/C_ox
  } else if (arch === 'fdsoi') {
    lambda = Math.sqrt(3 * tox * BODY.fdsoi);
  } else if (arch === 'finfet') {
    lambda = Math.sqrt(3 * tox * BODY.finfet / 2);
  } else {
    lambda = (BODY.gaa / 2) / 2 * Math.sqrt(3);
  }
  const theta = Math.min(Math.exp(-L / (2 * lambda)), 0.5);   // short-channel factor
  const vdd = Math.max(V_REF * L / L_REF, vFloor);
  const vtLong = vdd / 4;
  const rollOff = (vdd + 0.4) * theta;                   // V, at V_DS = V_DD
  const vtEff = vtLong - rollOff;
  const S = S_IDEAL * (nBody + 2 * theta);               // mV/decade

  // Currents per unit gate width (A/cm)
  const cox = EPS_OX / (tox * 1e-7);                     // F/cm^2
  const iOn = cox * V_SAT * (vdd - vtLong);
  const iOff = Math.min(100e-9 / (L * 1e-7) * Math.pow(10, -vtEff * 1000 / S), iOn);

  // Relative to the 1 micrometer reference
  const speed = L_REF / L;                               // 1 / gate delay
  const pDyn = (vdd * vdd / (tox * L)) / (V_REF * V_REF / (L_REF / 50 * L_REF));
  const pLeak = pDyn * (LOGIC_DEPTH / ACTIVITY) * iOff / iOn;
  return {
    L: L, tox: tox, tdep: tdep, lambda: lambda, ratio: L / lambda, theta: theta,
    dibl: theta * 1000, rollOff: rollOff * 1000, S: S, vdd: vdd, vtLong: vtLong, vtEff: vtEff,
    iOn: iOn, iOff: iOff, speed: speed, pDyn: pDyn, pLeak: pLeak,
    dennard: V_REF * L / L_REF >= vFloor
  };
}

// Gate length at which the supply voltage stops scaling
function breakLength(vFloor) { return L_REF * vFloor / V_REF; }

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const arch = archSelect.value();
  const L = sliderToLength(lengthSlider.value());
  const vFloor = vddSlider.value();
  const dev = device(arch, L, vFloor);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry: boxes on the left, two stacked plots on the right
  const boxW = Math.round(Math.min(280, canvasWidth * 0.36));
  const px0 = boxW + 70, px1 = canvasWidth - 16;
  const p1y0 = 58, p1y1 = 250, p2y0 = 302, p2y1 = 490;

  drawArchitecture(10, boxW, 44, 262, arch, dev);
  drawReadout(10, boxW, 272, 529, arch, dev, vFloor);
  drawSceplot(px0, px1, p1y0, p1y1, arch, dev, vFloor);
  drawPowerPlot(px0, px1, p2y0, p2y1, arch, dev, vFloor);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('MOSFET Scaling Simulator', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(L, vFloor);
}

// Shared logarithmic gate-length axis: 1 micrometer on the left, 5 nm on the right
function xOfLength(L, x0, x1) {
  return map(Math.log10(L), Math.log10(L_REF), Math.log10(L_MIN), x0, x1);
}

function drawLengthAxis(x0, x1, y1, withTitle) {
  textSize(12);
  for (const L of [1000, 500, 200, 100, 50, 20, 10, 5]) {
    const xx = xOfLength(L, x0, x1);
    stroke('black'); strokeWeight(1);
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    text(L === 1000 ? '1 µm' : L, xx, y1 + 7);
  }
  if (withTitle) {
    noStroke(); fill('black'); textSize(13); textAlign(CENTER, TOP);
    text('Gate length L (nm), shrinking to the right', (x0 + x1) / 2, y1 + 24);
  }
}

function gateLengthGrid(x0, x1, y0, y1) {
  for (const L of [1000, 500, 200, 100, 50, 20, 10, 5]) {
    stroke('gainsboro'); strokeWeight(1);
    line(xOfLength(L, x0, x1), y0, xOfLength(L, x0, x1), y1);
  }
}

function logLengths() {
  const out = [];
  for (let i = 0; i <= 160; i++) out.push(sliderToLength(i / 160));
  return out;
}

// ---- Plot 1: short-channel indicators ----
function drawSceplot(x0, x1, y0, y1, arch, dev, vFloor) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
  const yOf = (v) => map(Math.log10(constrain(v, 0.5, 2000)), 0, 3, y1, y0);   // 1 to 1000

  gateLengthGrid(x0, x1, y0, y1);
  textSize(12);
  for (const v of [1, 10, 100, 1000]) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOf(v), x1, yOf(v));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(v, x0 - 6, yOf(v));
  }
  // 50 mV/V: the limit for a well-designed device (Section 16.2)
  stroke('gray');
  strokeWeight(1);
  drawingContext.setLineDash([2, 4]);
  line(x0, yOf(50), x1, yOf(50));
  drawingContext.setLineDash([]);

  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  const Ls = logLengths();
  const plotLine = (f, col, w, dash) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    drawingContext.setLineDash(dash);
    beginShape();
    for (const L of Ls) vertex(xOfLength(L, x0, x1), yOf(f(L)));
    endShape();
    drawingContext.setLineDash([]);
  };
  // DIBL of the other architectures, faint, for comparison
  for (const a of ARCHS) {
    if (a.key !== arch) plotLine((L) => device(a.key, L, vFloor).dibl, color(170), 1.5, [4, 3]);
  }
  plotLine((L) => device(arch, L, vFloor).rollOff, 'darkorange', 2.5, []);
  plotLine((L) => device(arch, L, vFloor).S, 'royalblue', 2.5, []);
  plotLine((L) => device(arch, L, vFloor).dibl, 'crimson', 3, []);
  pop();

  // Labels for the faint comparison curves, at the 5 mV/V level
  // (staggered so that neighboring labels do not collide)
  textSize(10);
  const levels = { planar: 10, fdsoi: 3, finfet: 6.5, gaa: 2 };
  for (const a of ARCHS) {
    if (a.key === arch) continue;
    const level = levels[a.key];
    const Lc = crossingLength(a.key, vFloor, level);
    if (Lc > L_MIN && Lc < L_REF) {
      chipText(a.key === 'gaa' ? 'GAA' : a.name.replace(' bulk', ''), xOfLength(Lc, x0, x1) - 4, yOf(level), RIGHT, 'dimgray');
    }
  }

  // Probe
  const xp = xOfLength(dev.L, x0, x1);
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xp, y0, xp, y1);
  drawingContext.setLineDash([]);
  stroke('white');
  strokeWeight(1.5);
  for (const [v, col] of [[dev.rollOff, 'darkorange'], [dev.S, 'royalblue'], [dev.dibl, 'crimson']]) {
    if (v >= 1) { fill(col); circle(xp, yOf(v), 9); }
  }

  // Legend
  const items = [['crimson', 'DIBL (mV/V)'], ['darkorange', 'V_{T} roll-off (mV)'], ['royalblue', 'S (mV/decade)']];
  const lx = x0 + 8, ly = y0 + 12;
  noStroke();
  fill(255, 255, 255, 220);
  rect(lx - 4, ly - 9, 134, 48, 4);
  for (let i = 0; i < items.length; i++) {
    stroke(items[i][0]);
    strokeWeight(3);
    line(lx, ly + i * 15, lx + 18, ly + i * 15);
    noStroke();
    fill('black');
    textSize(11);
    richText(items[i][1], lx + 23, ly + i * 15, LEFT);
  }
  textSize(10);
  chipText('50 mV/V', x0 + 4, yOf(50) - 8, LEFT, 'gray');

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  drawLengthAxis(x0, x1, y1, false);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD); textAlign(CENTER, CENTER);
  text('Short-channel effects (' + ARCHS.find((a) => a.key === arch).name + ')', (x0 + x1) / 2, y0 - 12);
  textStyle(NORMAL);
}

// Gate length at which the DIBL of an architecture equals target (mV/V)
function crossingLength(arch, vFloor, target) {
  let a = L_MIN, b = L_REF;
  if (device(arch, a, vFloor).dibl < target || device(arch, b, vFloor).dibl > target) return -1;
  for (let i = 0; i < 50; i++) {
    const m = Math.sqrt(a * b);
    if (device(arch, m, vFloor).dibl > target) a = m; else b = m;
  }
  return Math.sqrt(a * b);
}

// ---- Plot 2: speed and power density ----
function drawPowerPlot(x0, x1, y0, y1, arch, dev, vFloor) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
  const E_MIN = -4, E_MAX = 5;
  const yOf = (v) => map(Math.log10(constrain(v, 1e-6, 1e7)), E_MIN, E_MAX, y1, y0);

  // Dennard (constant field) and post-Dennard (constant voltage) regions
  const xb = constrain(xOfLength(breakLength(vFloor), x0, x1), x0, x1);
  noStroke();
  fill(226, 242, 226);
  rect(x0 + 1, y0 + 1, xb - x0 - 1, y1 - y0 - 2);
  fill(253, 232, 228);
  rect(xb, y0 + 1, x1 - xb - 1, y1 - y0 - 2);

  gateLengthGrid(x0, x1, y0, y1);
  textSize(12);
  for (let e = E_MIN; e <= E_MAX; e += (y1 - y0 > 170 ? 1 : 3)) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOf(Math.pow(10, e)), x1, yOf(Math.pow(10, e)));
    if ((e - E_MIN) % 3 === 1 || e === 0) {
      noStroke(); fill('black');
      richText(e === 0 ? '1' : '10^{' + String(e).replace('-', '−') + '}', x0 - 5, yOf(Math.pow(10, e)), RIGHT);
    }
  }

  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  const Ls = logLengths();
  const plotLine = (f, col, w, dash) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    drawingContext.setLineDash(dash);
    beginShape();
    for (const L of Ls) vertex(xOfLength(L, x0, x1), yOf(f(L)));
    endShape();
    drawingContext.setLineDash([]);
  };
  if (dennardCheckbox.checked()) {
    // constant-field scaling carried on regardless: power density stays at 1
    plotLine(() => 1, 'dimgray', 1.5, [6, 4]);
  }
  plotLine((L) => device(arch, L, vFloor).speed, 'seagreen', 2.5, []);
  plotLine((L) => device(arch, L, vFloor).pLeak, 'purple', 2.5, []);
  plotLine((L) => device(arch, L, vFloor).pDyn, 'crimson', 3, []);
  pop();

  // Probe
  const xp = xOfLength(dev.L, x0, x1);
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xp, y0, xp, y1);
  drawingContext.setLineDash([]);
  stroke('white');
  strokeWeight(1.5);
  for (const [v, col] of [[dev.speed, 'seagreen'], [dev.pLeak, 'purple'], [dev.pDyn, 'crimson']]) {
    if (v >= Math.pow(10, E_MIN) && v <= Math.pow(10, E_MAX)) { fill(col); circle(xp, yOf(v), 9); }
  }

  // Region names
  noStroke();
  textSize(11);
  textAlign(CENTER, TOP);
  if (xb - x0 > 110) {
    fill('darkgreen');
    text('constant field (Dennard)', (x0 + xb) / 2, y0 + 4);
  }
  if (x1 - xb > 104) {
    fill('firebrick');
    text('constant voltage', (xb + x1) / 2, y0 + 4);
  }

  // Legend
  const items = [['seagreen', [], 'speed, 1/gate delay'], ['crimson', [], 'dynamic power density'],
                 ['purple', [], 'leakage power density']];
  if (dennardCheckbox.checked()) items.push(['dimgray', [6, 4], 'Dennard: power density = 1']);
  const lx = x0 + 8, ly = y0 + 28;
  noStroke();
  fill(255, 255, 255, 220);
  rect(lx - 4, ly - 9, 168, 14 * items.length + 4, 4);
  for (let i = 0; i < items.length; i++) {
    stroke(items[i][0]);
    strokeWeight(items[i][1].length ? 1.5 : 3);
    drawingContext.setLineDash(items[i][1]);
    line(lx, ly + i * 14, lx + 18, ly + i * 14);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(LEFT, CENTER);
    text(items[i][2], lx + 23, ly + i * 14);
  }

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  drawLengthAxis(x0, x1, y1, true);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD); textAlign(CENTER, CENTER);
  text('Speed and power density (1 µm reference = 1)', (x0 + x1) / 2, y0 - 12);
  textStyle(NORMAL);
}

// ---- Cross section of the chosen architecture and the gate-control gauge ----
function drawArchitecture(x0, x1, y0, y1, arch, dev) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x0, y0, x1 - x0, y1 - y0, 8);

  const a = ARCHS.find((aa) => aa.key === arch);
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(a.name, x0 + 10, y0 + 14);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(11);
  textAlign(RIGHT, CENTER);
  text(arch === 'planar' || arch === 'fdsoi' ? 'view along the channel' : 'view across the channel', x1 - 10, y0 + 15);

  const cx = (x0 + x1) / 2;
  const top = y0 + 30, bottom = y1 - 84;
  const w = x1 - x0 - 24;
  const si = color(255, 225, 228), nPlus = color(120, 170, 240), ox = color(255, 236, 170);
  const gate = color(150), box = color(205, 225, 245);

  if (arch === 'planar' || arch === 'fdsoi') {
    // gate length drawn in units of the natural length: 13 px per lambda
    const gateW = constrain(dev.ratio * 13, 16, w - 80);
    const surf = top + 34;
    const filmH = arch === 'fdsoi' ? 14 : bottom - surf;
    stroke('gray');
    strokeWeight(1);
    if (arch === 'fdsoi') {
      fill(box);
      rect(x0 + 12, surf + filmH, w, bottom - surf - filmH - 14);     // buried oxide
      fill(225);
      rect(x0 + 12, bottom - 14, w, 14);                              // substrate
    }
    fill(si);
    rect(x0 + 12, surf, w, filmH);
    fill(nPlus);
    const sdH = arch === 'fdsoi' ? filmH : 26;
    rect(x0 + 12, surf, (w - gateW) / 2, sdH);
    rect(cx + gateW / 2, surf, (w - gateW) / 2, sdH);
    fill(ox);
    rect(cx - gateW / 2, surf - 5, gateW, 5);
    fill(gate);
    rect(cx - gateW / 2, surf - 27, gateW, 22);
    // reach of the source and drain fields into the channel: two natural lengths
    noFill();
    stroke('crimson');
    strokeWeight(1.5);
    drawingContext.setLineDash([3, 3]);
    const reach = 26;
    const arcH = arch === 'fdsoi' ? filmH * 2 - 2 : 2 * reach;
    arc(cx - gateW / 2, surf + 1, 2 * reach, arcH, 0, HALF_PI);
    arc(cx + gateW / 2, surf + 1, 2 * reach, arcH, HALF_PI, PI);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(CENTER, CENTER);
    text('gate', cx, surf - 16);
    fill('white');
    textStyle(BOLD);
    text('S', x0 + 12 + (w - gateW) / 4, surf + sdH / 2);
    text('D', x1 - 12 - (w - gateW) / 4, surf + sdH / 2);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(10);
    if (arch === 'fdsoi') {
      text('buried oxide', cx, surf + filmH + (bottom - surf - filmH - 14) / 2);
    } else {
      text('p-type body', cx, bottom - 10);
    }
  } else {
    // gate wraps the fin on three sides, or each wire on all four
    const gw = Math.min(w, 170), gx = cx - gw / 2;
    stroke('gray');
    strokeWeight(1);
    fill(box);
    rect(x0 + 12, bottom - 16, w, 16);                                // isolation oxide
    fill(gate);
    rect(gx, top + 4, gw, bottom - 16 - top - 4, 4);
    if (arch === 'finfet') {
      const fw = 22, fh = bottom - 16 - top - 24;
      fill(ox);
      rect(cx - fw / 2 - 4, top + 20, fw + 8, fh + 4, 3, 3, 0, 0);
      fill(si);
      rect(cx - fw / 2, top + 24, fw, fh + 12);
      noStroke(); fill('black'); textSize(10); textAlign(CENTER, CENTER);
      text('fin', cx, top + 24 + fh / 2);
    } else {
      const d = 16;
      const pitch = (bottom - 16 - top - 4) / 3;
      for (let k = 0; k < 3; k++) {
        const cy = top + 4 + pitch * (k + 0.5);
        stroke('gray');
        fill(ox);
        circle(cx, cy, d + 7);
        fill(si);
        circle(cx, cy, d);
      }
    }
    noStroke();
    fill('white');
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('gate', gx + 22, top + 16);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(10);
    text('oxide', x0 + 36, bottom - 8);
  }

  // Caption: what the picture shows
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(CENTER, CENTER);
  const captions = {
    planar: 'dashed: reach of the S and D fields',
    fdsoi: 'thin film on oxide; gate on one side',
    finfet: 'gate on three sides of a 6 nm fin',
    gaa: 'gate all around 5 nm wires'
  };
  text(captions[arch], cx, bottom + 11);

  // Gate-control gauge: L / lambda on a scale of 0 to 12
  const gx0 = x0 + 14, gx1 = x1 - 14, gy = y1 - 30;
  const gxOf = (r) => map(constrain(r, 0, 12), 0, 12, gx0, gx1);
  noStroke();
  fill(235, 150, 140);
  rect(gx0, gy, gxOf(5) - gx0, 9, 4, 0, 0, 4);
  fill(245, 215, 130);
  rect(gxOf(5), gy, gxOf(7) - gxOf(5), 9);
  fill(160, 210, 160);
  rect(gxOf(7), gy, gx1 - gxOf(7), 9, 0, 4, 4, 0);
  const mx = gxOf(dev.ratio);
  fill('black');
  triangle(mx, gy - 1, mx - 5, gy - 9, mx + 5, gy - 9);
  textSize(11);
  textAlign(LEFT, CENTER);
  fill('firebrick');
  text('weak control', gx0, gy + 19);
  textAlign(RIGHT, CENTER);
  fill('darkgreen');
  text('strong control', gx1, gy + 19);
  fill('black');
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('L/λ = ' + (dev.ratio >= 100 ? Math.round(dev.ratio) : dev.ratio.toFixed(1)) +
       (dev.ratio > 12 ? ' (off scale)' : ''), (gx0 + gx1) / 2, gy - 18);
  textStyle(NORMAL);
}

// ---- Numbers at the selected gate length ----
function drawReadout(x0, x1, y0, y1, arch, dev, vFloor) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x0, y0, x1 - x0, y1 - y0, 8);
  noStroke();

  const small = (x1 - x0) < 250;
  const px = x0 + 10;
  let cy = y0 + 15;
  const lh = 19.5;
  const row = (s, col, bold) => {
    fill(col || 'black');
    textStyle(bold ? BOLD : NORMAL);
    richText(s, px, cy, LEFT);
    textStyle(NORMAL);
    cy += lh;
  };
  textSize(small ? 11.5 : 12.5);
  row('L = ' + fmtNm(dev.L) + ':  ' + (dev.dennard ? 'constant-field region' : 'constant-voltage region'),
      dev.dennard ? 'darkgreen' : 'firebrick', true);
  row('V_{DD} = ' + dev.vdd.toFixed(2) + ' V     V_{T} = V_{DD}/4 = ' + dev.vtLong.toFixed(2) + ' V');
  row('t_{ox} = ' + dev.tox.toFixed(1) + ' nm' +
      (arch === 'planar' ? '     t_{dep} = ' + dev.tdep.toFixed(0) + ' nm' : ''));
  row('natural length λ = ' + dev.lambda.toFixed(1) + ' nm');
  cy += 3;
  const severity = dev.dibl < 50 ? ['well controlled', 'darkgreen'] :
                   dev.dibl < 200 ? ['degraded', 'chocolate'] : ['severe', 'firebrick'];
  row('Short-channel effects: ' + severity[0], severity[1], true);
  row('DIBL ' + fmtSmall(dev.dibl) + ' mV/V', 'crimson');
  row('V_{T} roll-off ' + fmtSmall(dev.rollOff) + ' mV at V_{DS} = V_{DD}', 'chocolate');
  row('S = ' + dev.S.toFixed(1) + ' mV/decade', 'royalblue');
  cy += 3;
  const onOff = dev.iOn / dev.iOff;
  row('I_{on}/I_{off} ' + (dev.iOff >= dev.iOn ? '= 1 (cannot turn off)' :
      onOff < 1000 ? '= ' + onOff.toPrecision(2) : '= ' + sci(onOff, 1)));
  const share = dev.pLeak / dev.pDyn;
  row('leakage/dynamic power ' + (share >= 10 ? '> 10' : share >= 0.001 ? '= ' + share.toPrecision(2) : '= ' + sci(share, 1)), 'purple');
  cy += 3;
  textSize(small ? 10.5 : 11.5);
  // One gate, example values: alpha = 0.1, C = 1 fF, f = 3 GHz
  const p = ACTIVITY * 1e-15 * dev.vdd * dev.vdd * 3e9;
  row('Example gate: P = αCV_{DD}^{2}f', 'dimgray');
  row('= 0.1 × 1 fF × (' + dev.vdd.toFixed(2) + ' V)^{2} × 3 GHz = ' + fmtPower(p), 'dimgray');
}

function drawControlLabels(L, vFloor) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Architecture:', 10, drawHeight + 20);
  text('Gate length L: ' + fmtNm(L), 10, drawHeight + 55);
  richText('Lowest supply V_{DD}: ' + vFloor.toFixed(2) + ' V', 10, drawHeight + 90, LEFT);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetDefaults() {
  archSelect.selected('planar');
  dennardCheckbox.checked(true);
  lengthSlider.value(lengthToSlider(45));
  vddSlider.value(1.0);
}

function fmtNm(L) {
  if (L >= 999.5) return '1.00 µm';
  return (L >= 100 ? Math.round(L) : L >= 10 ? L.toFixed(1) : L.toFixed(2)) + ' nm';
}

function fmtSmall(v) {
  if (v >= 100) return '= ' + Math.round(v);
  if (v >= 1) return '= ' + v.toPrecision(2);
  return v < 0.01 ? '< 0.01' : '= ' + v.toFixed(2);
}

function fmtPower(p) {
  if (p >= 1e-3) return (p * 1e3).toPrecision(3) + ' mW';
  if (p >= 1e-6) return (p * 1e6).toPrecision(3) + ' µW';
  return (p * 1e9).toPrecision(3) + ' nW';
}

// Scientific notation in richText markup, e.g. "1.3 × 10^{5}"
function sci(x, digits) {
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = x / Math.pow(10, e);
  if (Number(m.toFixed(digits)) >= 10) { m /= 10; e += 1; }
  return m.toFixed(digits) + ' × 10^{' + String(e).replace('-', '−') + '}';
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

function sizeSliders() {
  const w = canvasWidth - sliderLeftMargin - margin;
  lengthSlider.size(w);
  vddSlider.size(w);
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
    if (typeof vddSlider !== 'undefined' && vddSlider) sizeSliders();
  }
}
