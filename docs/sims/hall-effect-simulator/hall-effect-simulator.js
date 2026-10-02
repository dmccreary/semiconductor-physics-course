// Hall Effect Measurement Simulator MicroSim
// CANVAS_HEIGHT: 570
//
// Top view of a silicon Hall bar. Current flows left to right (+x), the
// magnetic field is perpendicular to the page (+z out of the page, -z into
// it), and the Hall voltage appears across the bar width (y direction).
//
// Physics (single carrier type, steady state, 300 K):
//   Lorentz force:       F = q (v x B)   pushes both electrons and holes
//                        toward the same face for a given current direction
//   Hall field balance:  q E_H = q v_d B
//   Hall voltage:        V_H = I B / (q n t)   (magnitude)
//   Hall coefficient:    R_H = V_H t / (I B) = -1/(q n)  or  +1/(q p)
//   Hall mobility:       mu_H = |R_H| / rho
// Sign convention: V_H = V(-y face) - V(+y face), which makes R_H negative
// for n-type and positive for p-type with I along +x and B along +z.
// The drift mobility comes from the Caughey-Thomas-form fits used in
// Chapter 8 (electrons) and Arora et al. 1982 (holes); the Hall factor is 1.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 420;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 290;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Physical constants and sample geometry ----
const Q = 1.602e-19;               // elementary charge (C)
const SAMPLE_L = 0.6;              // bar length between contacts (cm)
const SAMPLE_W = 0.2;              // bar width (cm)
const SAMPLE_T = 0.05;             // bar thickness (cm)

// ---- Controls and state ----
let typeRadio, concSlider, fieldSlider, currentSlider, flipButton, startButton;
let bDirection = 1;                // +1: B out of the page (+z), -1: into the page
let isRunning = false;             // loads paused; press Start to animate
let carriers = [];                 // {u, v} in unit coordinates inside the bar
const NUM_CARRIERS = 30;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  typeRadio = createRadio();
  typeRadio.option('n', ' N-type');
  typeRadio.option('p', ' P-type');
  typeRadio.selected('n');
  typeRadio.position(10, drawHeight + 10);
  typeRadio.style('font-size', '15px');

  flipButton = createButton('Flip B direction');
  flipButton.position(180, drawHeight + 8);
  flipButton.mousePressed(() => { bDirection = -bDirection; });

  startButton = createButton('Start');
  startButton.position(300, drawHeight + 8);
  startButton.mousePressed(toggleAnimation);

  // log10 of the carrier concentration (cm^-3)
  concSlider = createSlider(14, 17, 15, 0.05);
  concSlider.position(sliderLeftMargin, drawHeight + 45);
  concSlider.size(canvasWidth - sliderLeftMargin - margin);

  fieldSlider = createSlider(0, 1, 0.5, 0.01);
  fieldSlider.position(sliderLeftMargin, drawHeight + 80);
  fieldSlider.size(canvasWidth - sliderLeftMargin - margin);

  currentSlider = createSlider(1, 10, 5, 0.1);
  currentSlider.position(sliderLeftMargin, drawHeight + 115);
  currentSlider.size(canvasWidth - sliderLeftMargin - margin);

  // Scatter the carriers through the bar with a fixed seed so every load matches
  randomSeed(7);
  for (let i = 0; i < NUM_CARRIERS; i++) {
    carriers.push({ u: random(), v: random(0.16, 0.84) });
  }

  describe('Top view of a rectangular semiconductor bar carrying a current ' +
    'from left to right in a magnetic field perpendicular to the page. ' +
    'Moving carriers are pushed toward one long face of the bar, charge ' +
    'builds up on the two faces, and a voltmeter across the bar shows the ' +
    'Hall voltage. A panel lists the Hall voltage, the Hall coefficient, ' +
    'the carrier concentration and the Hall mobility. Switching between ' +
    'n-type and p-type or flipping the field reverses the sign of the Hall ' +
    'voltage.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Drift mobility (cm^2/V.s) at 300 K for carrier concentration N (cm^-3),
// assuming full ionization and no compensation
function driftMobility(isN, N) {
  return isN
    ? 65 + (1330 - 65) / (1 + Math.pow(N / 1.26e17, 0.85))
    : 54.3 + (461.2 - 54.3) / (1 + Math.pow(N / 2.35e17, 0.88));
}

// All measured and derived quantities for the present settings.
// conc in cm^-3, B in tesla (signed, + is out of the page), I in amperes.
function hallMeasurement(isN, conc, B, I) {
  const mu = driftMobility(isN, conc);                 // cm^2/V.s
  const rho = 1 / (Q * conc * mu);                     // ohm.cm
  const Vx = I * rho * SAMPLE_L / (SAMPLE_W * SAMPLE_T); // V along the bar
  const J = I / (SAMPLE_W * SAMPLE_T);                 // A/cm^2
  const vd = J / (Q * conc);                           // drift speed, cm/s
  const B_cgs = B * 1e-4;                              // V.s/cm^2
  const RH = (isN ? -1 : 1) / (Q * conc);              // cm^3/C
  const VH = RH * I * B_cgs / SAMPLE_T;                // V, = V(-y) - V(+y)
  const EH = Math.abs(VH) / SAMPLE_W;                  // V/cm
  return { mu: mu, rho: rho, Vx: Vx, J: J, vd: vd, RH: RH, VH: VH, EH: EH };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const isN = typeRadio.value() !== 'p';
  const conc = Math.pow(10, concSlider.value());
  const Bmag = fieldSlider.value();
  const B = bDirection * Bmag;
  const I = currentSlider.value() * 1e-3;
  const m = hallMeasurement(isN, conc, B, I);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry
  const panelW = canvasWidth >= 700 ? 262 : 214;
  const panelX = canvasWidth - panelW - 10;
  const bx0 = 76, bx1 = panelX - 52;       // bar left / right
  const by0 = 122, by1 = 232;              // bar top (+y face) / bottom (-y face)
  const geo = { bx0: bx0, bx1: bx1, by0: by0, by1: by1, panelX: panelX };

  // Face toward which the carriers are pushed: bottom for B out of the page
  const towardBottom = B > 0;
  const carrierColor = isN ? color('royalblue') : color('crimson');

  drawBar(geo, isN);
  drawFieldSymbols(geo, B);
  drawSurfaceCharge(geo, isN, m, B);
  drawCarriers(geo, isN, m, carrierColor);
  drawForces(geo, isN, B, towardBottom, carrierColor);
  drawCurrentArrow(geo, I);
  drawVoltmeter(geo, m);
  drawAxes(34, drawHeight - 34);
  drawExplanation(geo, isN, B, towardBottom);
  drawInfoPanel(panelX, 44, panelW, drawHeight - 52, isN, conc, B, I, m);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Hall Effect Measurement Simulator', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(isN, conc, Bmag, I);
}

function drawBar(g, isN) {
  // Semiconductor bar
  stroke('dimgray');
  strokeWeight(1.5);
  fill(isN ? color(225, 240, 255) : color(255, 232, 236));
  rect(g.bx0, g.by0, g.bx1 - g.bx0, g.by1 - g.by0);
  // End contacts
  fill('darkgray');
  rect(g.bx0 - 10, g.by0, 10, g.by1 - g.by0);
  rect(g.bx1, g.by0, 10, g.by1 - g.by0);
  // Face labels
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('top face (+y)', g.bx0 + 2, g.by0 - 3);
  textAlign(LEFT, TOP);
  text('bottom face (−y)', g.bx0 + 2, g.by1 + 4);
}

// Field symbols: a dot in a circle for B out of the page, a cross for into it
function drawFieldSymbols(g, B) {
  if (B === 0) return;
  const alpha = 70 + 150 * Math.abs(B);
  // an even number of columns keeps the symbols clear of the force arrows at the center
  const cols = Math.max(4, 2 * Math.floor((g.bx1 - g.bx0) / 150));
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < 2; j++) {
      const cx = g.bx0 + (g.bx1 - g.bx0) * (i + 0.5) / cols;
      const cy = g.by0 + (g.by1 - g.by0) * (j === 0 ? 0.3 : 0.7);
      drawFieldSymbol(cx, cy, 15, B > 0, alpha);
    }
  }
}

function drawFieldSymbol(cx, cy, d, outOfPage, alpha) {
  stroke(123, 31, 162, alpha);
  strokeWeight(1.5);
  noFill();
  circle(cx, cy, d);
  if (outOfPage) {
    noStroke();
    fill(123, 31, 162, alpha);
    circle(cx, cy, d * 0.3);
  } else {
    const r = d * 0.26;
    line(cx - r, cy - r, cx + r, cy + r);
    line(cx - r, cy + r, cx + r, cy - r);
  }
}

// Excess charge on the two long faces. The number of symbols grows with the
// logarithm of the Hall voltage (1 microvolt to 1 volt).
function drawSurfaceCharge(g, isN, m, B) {
  if (B === 0) return;
  const mag = Math.abs(m.VH);
  const count = Math.round(constrain(map(Math.log10(Math.max(mag, 1e-6)), -6, 0, 3, 15), 3, 15));
  // The carriers pile up on the face they are pushed toward
  const pileBottom = B > 0;
  const pileSign = isN ? -1 : 1;
  for (let i = 0; i < count; i++) {
    const cx = g.bx0 + (g.bx1 - g.bx0) * (i + 0.5) / count;
    drawChargeSign(cx, (pileBottom ? g.by1 : g.by0) + (pileBottom ? -8 : 8), pileSign);
    drawChargeSign(cx, (pileBottom ? g.by0 : g.by1) + (pileBottom ? 8 : -8), -pileSign);
  }
}

function drawChargeSign(cx, cy, sign) {
  stroke(sign > 0 ? 'crimson' : 'royalblue');
  strokeWeight(2);
  line(cx - 4, cy, cx + 4, cy);
  if (sign > 0) line(cx, cy - 4, cx, cy + 4);
}

function drawCarriers(g, isN, m, col) {
  // Screen speed grows with the logarithm of the drift speed (qualitative)
  const speed = map(Math.log10(m.vd), 0.5, 5, 0.0012, 0.008, true);
  const dir = isN ? -1 : 1;          // electrons drift against the current
  noStroke();
  for (const c of carriers) {
    if (isRunning) {
      c.u += dir * speed;
      if (c.u > 1) c.u -= 1;
      if (c.u < 0) c.u += 1;
    }
    const cx = g.bx0 + 6 + (g.bx1 - g.bx0 - 12) * c.u;
    const cy = g.by0 + (g.by1 - g.by0) * c.v;
    fill(col);
    circle(cx, cy, 8);
  }
}

// One highlighted carrier at the middle of the bar with its velocity and the
// two transverse forces that balance in steady state
function drawForces(g, isN, B, towardBottom, col) {
  const cx = (g.bx0 + g.bx1) / 2;
  const cy = (g.by0 + g.by1) / 2;
  const dir = isN ? -1 : 1;

  // Velocity arrow
  drawArrow(cx, cy, cx + dir * 46, cy, color('black'), 2);
  labelChip(cx + dir * 58, cy - 1, 22, 17);
  fill('black');
  textSize(13);
  richText('v_{d}', cx + dir * 58, cy - 1, CENTER);

  if (B !== 0) {
    const s = towardBottom ? 1 : -1;
    const fb = color(123, 31, 162);
    const fe = color('seagreen');
    drawArrow(cx, cy, cx, cy + s * 36, fb, 2.5);
    drawArrow(cx, cy, cx, cy - s * 36, fe, 2.5);
    labelChip(cx + 19, cy + s * 30, 24, 17);
    labelChip(cx + 19, cy - s * 30, 24, 17);
    textSize(13);
    fill(fb);
    richText('F_{B}', cx + 9, cy + s * 30, LEFT);
    fill(fe);
    richText('F_{E}', cx + 9, cy - s * 30, LEFT);
  }

  stroke('white');
  strokeWeight(1.5);
  fill(col);
  circle(cx, cy, 17);
  stroke('white');
  strokeWeight(2);
  line(cx - 4, cy, cx + 4, cy);
  if (!isN) line(cx, cy - 4, cx, cy + 4);
}

// Opaque chip behind a label so passing carriers cannot strike through it
function labelChip(cx, cy, w, h) {
  noStroke();
  fill(255, 255, 255, 215);
  rect(cx - w / 2, cy - h / 2, w, h, 4);
}

function drawCurrentArrow(g, I) {
  const y = (g.by0 + g.by1) / 2;
  drawArrow(12, y, g.bx0 - 14, y, color('darkorange'), 3);
  noStroke();
  fill('chocolate');
  textSize(13);
  textAlign(LEFT, BOTTOM);
  textStyle(BOLD);
  text('I', 14, y - 6);
  textStyle(NORMAL);
}

// Voltmeter across the bar: + lead on the bottom (-y) face, - lead on the top
function drawVoltmeter(g, m) {
  const mid = (g.bx0 + g.bx1) / 2;
  const boxW = Math.min(170, g.bx1 - g.bx0 - 40), boxH = 30;
  const boxX = mid - boxW / 2, boxY = 56;
  const xTop = mid - boxW / 4;                 // lead from the top face
  const xBot = mid + boxW / 4;                 // lead from the bottom face
  const xSide = g.bx1 + 30;

  stroke('dimgray');
  strokeWeight(1.5);
  noFill();
  line(xTop, g.by0, xTop, boxY + boxH);                     // top face to meter
  line(xBot, g.by1, xBot, g.by1 + 24);                      // bottom face down
  line(xBot, g.by1 + 24, xSide, g.by1 + 24);                // across
  line(xSide, g.by1 + 24, xSide, boxY + boxH / 2);          // up the right side
  line(xSide, boxY + boxH / 2, boxX + boxW, boxY + boxH / 2); // into the meter
  fill('dimgray');
  noStroke();
  circle(xTop, g.by0, 6);
  circle(xBot, g.by1, 6);

  // Meter body
  stroke('dimgray');
  strokeWeight(1.5);
  fill('white');
  rect(boxX, boxY, boxW, boxH, 6);
  noStroke();
  const col = m.VH > 0 ? 'crimson' : m.VH < 0 ? 'royalblue' : 'dimgray';
  fill(col);
  textStyle(BOLD);
  textSize(15);
  richText('V_{H} = ' + fmtVoltage(m.VH), mid, boxY + boxH / 2, CENTER);
  textStyle(NORMAL);

  // Terminal polarity marks
  fill('dimgray');
  textSize(13);
  textAlign(CENTER, CENTER);
  text('−', xTop - 9, boxY + boxH + 9);
  text('+', boxX + boxW + 9, boxY + boxH / 2 - 9);
}

function drawAxes(ox, oy) {
  drawArrow(ox, oy, ox + 30, oy, color('black'), 1.5);
  drawArrow(ox, oy, ox, oy - 30, color('black'), 1.5);
  drawFieldSymbol(ox, oy, 11, true, 255);
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('x', ox + 34, oy);
  textAlign(CENTER, BOTTOM);
  text('y', ox, oy - 32);
  textAlign(RIGHT, TOP);
  text('z', ox - 6, oy + 4);
}

// Plain-language account of what the present settings show
function drawExplanation(g, isN, B, towardBottom) {
  const x = 84, y = 270, w = g.panelX - x - 12, h = drawHeight - y - 8;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  // Legend line for the field symbol
  const symX = x + 18, symY = y + 17;
  textSize(13);
  fill(123, 31, 162);
  textAlign(LEFT, CENTER);
  if (B === 0) {
    text('B = 0: no magnetic force, no Hall voltage.', x + 10, symY);
  } else {
    drawFieldSymbol(symX, symY, 15, B > 0, 255);
    noStroke();
    fill(123, 31, 162);
    text('B = ' + Math.abs(B).toFixed(2) + ' T, ' + (B > 0 ? 'out of the page (+z)' : 'into the page (−z)'),
         symX + 14, symY);
  }

  fill('black');
  textSize(13);
  textLeading(17);
  textAlign(LEFT, TOP);
  let msg;
  if (B === 0) {
    msg = (isN ? 'Electrons drift to the left' : 'Holes drift to the right') +
          ', straight along the bar. Raise B to deflect them.';
  } else {
    const face = towardBottom ? 'bottom' : 'top';
    const other = towardBottom ? 'top' : 'bottom';
    msg = (isN ? 'Electrons drift left' : 'Holes drift right') + '. The magnetic force pushes them toward the ' +
          face + ' face, which charges ' + (isN ? 'negative' : 'positive') + ' (the ' + other +
          ' face is left ' + (isN ? 'positive' : 'negative') + '). The Hall field force then balances ' +
          'the magnetic force.';
  }
  text(msg, x + 10, y + 32, w - 20, h - 36);
}

function drawInfoPanel(x, y, w, h, isN, conc, B, I, m) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const pad = 10;
  const small = w < 240;
  const ts = small ? 12 : 13;
  const lh = small ? 18 : 19;
  let cy = y + 16;
  textAlign(LEFT, CENTER);

  function header(t) {
    fill('black');
    textStyle(BOLD);
    textSize(ts + 1);
    text(t, x + pad, cy);
    textStyle(NORMAL);
    textSize(ts);
    cy += lh + 1;
  }
  function row(t, col) {
    fill(col || 'black');
    richText(t, x + pad, cy, LEFT);
    cy += lh;
  }

  header('Sample: ' + (isN ? 'n-type' : 'p-type') + ' Si, 300 K');
  row('L × W × t = 6 × 2 × 0.5 mm');
  row('I = ' + (I * 1000).toFixed(1) + ' mA along +x');
  row('B = ' + (B < 0 ? '−' : B > 0 ? '+' : '') + Math.abs(B).toFixed(2) + ' T along z');
  cy += 5;

  header('Measured');
  const vcol = m.VH > 0 ? 'crimson' : m.VH < 0 ? 'royalblue' : 'dimgray';
  textStyle(BOLD);
  row('V_{H} = ' + fmtVoltage(m.VH), vcol);
  textStyle(NORMAL);
  row('V_{x} = ' + fmtVoltage(m.Vx) + ' along the bar');
  cy += 5;

  header('Extracted');
  if (B === 0) {
    row('R_{H}: needs B ≠ 0', 'dimgray');
    row('Carrier type: unknown', 'dimgray');
    row('Concentration: unknown', 'dimgray');
  } else {
    const rcol = m.RH > 0 ? 'crimson' : 'royalblue';
    row('R_{H} = V_{H}t/(IB)', 'dimgray');
    textStyle(BOLD);
    row('     = ' + sci(m.RH, 2) + ' cm^{3}/C', rcol);
    textStyle(NORMAL);
    row('Sign ' + (m.RH < 0 ? 'negative: n-type' : 'positive: p-type'), rcol);
    row((isN ? 'n' : 'p') + ' = 1/(q|R_{H}|) = ' + sci(1 / (Q * Math.abs(m.RH)), 2) + ' cm^{−3}');
  }
  row('ρ = V_{x}Wt/(IL) = ' + fmtSig(m.rho) + ' Ω·cm');
  if (B !== 0) {
    row('μ_{H} = |R_{H}|/ρ = ' + Math.round(Math.abs(m.RH) / m.rho) + ' cm^{2}/V·s');
  } else {
    row('μ_{H}: needs B ≠ 0', 'dimgray');
  }
  row('v_{d} = ' + sci(m.vd, 1) + ' cm/s', 'dimgray');
}

function drawControlLabels(isN, conc, Bmag, I) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  richText('Carrier concentration: ' + sci(conc, 1) + ' cm^{−3}', 10, drawHeight + 55, LEFT);
  text('Magnetic field B: ' + Bmag.toFixed(2) + ' T', 10, drawHeight + 90);
  text('Applied current I: ' + (I * 1000).toFixed(1) + ' mA', 10, drawHeight + 125);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toggleAnimation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function drawArrow(x1, y1, x2, y2, col, weight) {
  stroke(col);
  strokeWeight(weight);
  line(x1, y1, x2, y2);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const s = 5 + 2 * weight;
  noStroke();
  fill(col);
  triangle(x2 + Math.cos(ang) * 3, y2 + Math.sin(ang) * 3,
           x2 - s * Math.cos(ang - 0.45), y2 - s * Math.sin(ang - 0.45),
           x2 - s * Math.cos(ang + 0.45), y2 - s * Math.sin(ang + 0.45));
}

// Voltage with an SI prefix and three significant figures
function fmtVoltage(v) {
  const a = Math.abs(v);
  if (a === 0) return '0 V';
  const sign = v < 0 ? '−' : '';
  if (a >= 1) return sign + a.toPrecision(3) + ' V';
  if (a >= 1e-3) return sign + (a * 1e3).toPrecision(3) + ' mV';
  return sign + (a * 1e6).toPrecision(3) + ' µV';
}

function fmtSig(x) {
  return x >= 100 ? Math.round(x).toString() : x.toPrecision(3);
}

// Scientific notation in richText markup, e.g. "−6.24 × 10^{3}"
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

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    const w = Math.floor(container.getBoundingClientRect().width);
    if (w > 0) canvasWidth = w;
    if (typeof concSlider !== 'undefined' && concSlider) {
      concSlider.size(canvasWidth - sliderLeftMargin - margin);
      fieldSlider.size(canvasWidth - sliderLeftMargin - margin);
      currentSlider.size(canvasWidth - sliderLeftMargin - margin);
    }
  }
}
