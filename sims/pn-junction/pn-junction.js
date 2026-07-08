// P-N Junction Voltage Explorer MicroSim
// CANVAS_HEIGHT: 450
//
// Students apply forward and reverse bias to a silicon p-n junction and
// watch the depletion region, space charge, electric field, and mobile
// carriers respond in real time.
//
// Physics model (silicon step junction, T = 300 K, Na = Nd = 1e16 cm^-3):
//   Built-in potential:  Vbi = (kT/q) ln(Na*Nd / ni^2)  ~ 0.695 V
//   Depletion width:     W(V) = W0 * sqrt((Vbi - V) / Vbi)
//   Diode current:       I(V) = Is * (exp(V / VT) - 1)
// The carrier animation is qualitative: crossing rate grows roughly
// exponentially with forward bias; reverse bias sweeps carriers away
// from the junction. See index.md for model details and limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 400;             // responsive; reset from container width
let drawHeight = 400;              // drawing region height
let controlHeight = 50;            // control region height (1 row)
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 270;        // 2 buttons + voltage label sit left of slider
let defaultTextSize = 16;

// ---- Device geometry (recomputed on resize) ----
let barTop = 64;                   // top of the semiconductor bar
let barBottom = 224;               // bottom of the semiconductor bar
let contactWidth = 18;             // metal contact plate width
let barLeft, barRight, junctionX;  // set in computeGeometry()

// ---- Physics constants ----
const VT = 0.02585;                // thermal voltage kT/q at 300 K (V)
const VBI = 0.695;                 // built-in potential (V)
const W0_UM = 0.425;               // zero-bias depletion width (micrometers)
const IS = 1e-12;                  // reverse saturation current (A)

// ---- Display scaling ----
const W0_PX = 56;                  // zero-bias depletion width on screen (px)

// ---- Simulation state ----
let voltageSlider, startButton, resetButton;
let appliedVoltage = 0;
let depletionPx = W0_PX;           // current depletion width on screen (px)
let carriers = [];                 // mobile electrons and holes
let flashes = [];                  // recombination flash effects
const CARRIERS_PER_SIDE = 22;
let isRunning = true;
let mouseOverCanvas = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Animate only while the mouse is over the canvas (saves CPU in iframes)
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  computeGeometry();

  startButton = createButton('Pause');
  startButton.position(10, drawHeight + 12);
  startButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(74, drawHeight + 12);
  resetButton.mousePressed(resetSimulation);

  // Applied bias: -5.00 V (deep reverse) to +0.75 V (strong forward).
  // Above ~0.75 V a real diode is limited by series resistance, so the
  // ideal-diode model stops being meaningful.
  voltageSlider = createSlider(-5, 0.75, 0, 0.05);
  voltageSlider.position(sliderLeftMargin, drawHeight + 14);
  voltageSlider.size(canvasWidth - sliderLeftMargin - margin);

  initCarriers();

  describe('Interactive p-n junction simulation. A voltage slider applies ' +
    'forward or reverse bias to a silicon diode. The display shows the ' +
    'p-type and n-type regions, the depletion region with fixed ionized ' +
    'dopants, the internal electric field arrow, and animated electrons ' +
    'and holes. Forward bias narrows the depletion region and carriers ' +
    'stream across the junction; reverse bias widens the depletion region ' +
    'and blocks current. Readouts show the depletion width in micrometers ' +
    'and the diode current from the Shockley equation.', LABEL);
}

function draw() {
  ensureCanvasMatchesContainer();

  appliedVoltage = voltageSlider.value();
  depletionPx = depletionWidthPx(appliedVoltage);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawDevice();
  drawIons();
  drawFieldArrow();
  drawCircuit();

  if (isRunning && mouseOverCanvas) {
    updateCarriers();
    updateFlashes();
  }
  drawCarriers();
  drawFlashes();
  drawRegionLabels();

  drawTitle();
  drawBiasStatus();
  drawLegend();
  drawReadouts();
  drawHoverHint();
  drawControlLabels();
}

// ---------------------------------------------------------------------------
// Physics helpers
// ---------------------------------------------------------------------------

// Depletion width on screen, from W(V) = W0 * sqrt((Vbi - V)/Vbi)
function depletionWidthPx(v) {
  const rel = Math.max(VBI - v, 0.002) / VBI;
  const w = W0_PX * Math.sqrt(rel);
  const maxW = 0.45 * (barRight - barLeft);
  return constrain(w, 8, maxW);
}

// Physical depletion width in micrometers for the readout
function depletionWidthUm(v) {
  const rel = Math.max(VBI - v, 0) / VBI;
  return W0_UM * Math.sqrt(rel);
}

// Ideal Shockley diode equation
function diodeCurrent(v) {
  return IS * (Math.exp(v / VT) - 1);
}

// Format a current with engineering units (fA through A)
function formatCurrent(i) {
  const a = Math.abs(i);
  if (a < 1e-15) return '0 A';
  const units = [[1, 'A'], [1e-3, 'mA'], [1e-6, 'µA'],
                 [1e-9, 'nA'], [1e-12, 'pA'], [1e-15, 'fA']];
  for (const [scale, label] of units) {
    if (a >= scale) return (i / scale).toFixed(1) + ' ' + label;
  }
  return '0 A';
}

// ---------------------------------------------------------------------------
// Carrier simulation (qualitative)
// ---------------------------------------------------------------------------

function initCarriers() {
  carriers = [];
  flashes = [];
  const hw = depletionPx / 2;
  for (let i = 0; i < CARRIERS_PER_SIDE; i++) {
    // Electrons are majority carriers in the n region (right side)
    carriers.push(makeCarrier('electron',
      random(junctionX + hw + 12, barRight - 10)));
    // Holes are majority carriers in the p region (left side)
    carriers.push(makeCarrier('hole',
      random(barLeft + 10, junctionX - hw - 12)));
  }
}

function makeCarrier(type, x) {
  return {
    type: type,
    x: x,
    y: random(barTop + 18, barBottom - 12),
    vx: random(-0.5, 0.5),
    vy: random(-0.5, 0.5),
    state: 'free',        // 'free' in home region, 'crossing' under injection
    targetX: 0            // recombination point while crossing
  };
}

function updateCarriers() {
  const v = appliedVoltage;
  const forward = v > 0.05;
  const reverse = v < -0.05;
  const hw = depletionPx / 2;
  const leftEdge = junctionX - hw;
  const rightEdge = junctionX + hw;
  // Probability per frame that a carrier near the depletion edge is
  // injected across the barrier. Grows exponentially with forward bias
  // to echo the exp(V/VT) diode law (rate constant tuned for display).
  const crossProb = forward ? 0.0005 * (Math.exp(v / 0.15) - 1) : 0;

  for (const c of carriers) {
    const sign = (c.type === 'electron') ? 1 : -1; // +1: home is n (right)

    if (c.state === 'crossing') {
      // Injected minority carrier: drift straight across the junction,
      // then recombine and reappear at the ohmic contact (steady state).
      c.x += -sign * (2.0 + v * 1.2);
      c.y += c.vy * 0.3;
      const arrived = (c.type === 'electron') ? (c.x <= c.targetX)
                                              : (c.x >= c.targetX);
      if (arrived || !forward) {
        if (arrived) {
          flashes.push({ x: c.x, y: c.y, age: 0 });
        }
        respawnAtContact(c);
      }
      continue;
    }

    // Free majority carrier: thermal jitter plus bias-dependent drift
    c.vx += random(-0.25, 0.25);
    c.vy += random(-0.25, 0.25);
    if (forward) {
      c.vx += -sign * 0.03;                       // pulled toward junction
    } else if (reverse) {
      c.vx += sign * 0.02 * Math.min(-v, 3);      // swept away from junction
    }
    c.vx = constrain(c.vx, -1.2, 1.2);
    c.vy = constrain(c.vy, -0.9, 0.9);
    c.x += c.vx;
    c.y += c.vy;

    // Keep majority carriers in their home region, outside the depletion
    // region (mobile carriers are depleted there by definition).
    if (c.type === 'electron') {
      c.x = constrain(c.x, rightEdge + 6, barRight - 8);
    } else {
      c.x = constrain(c.x, barLeft + 8, leftEdge - 6);
    }
    if (c.y <= barTop + 18 || c.y >= barBottom - 12) {
      c.vy *= -0.8;
      c.y = constrain(c.y, barTop + 18, barBottom - 12);
    }

    // Injection: carriers close to the barrier may be launched across
    const nearEdge = (c.type === 'electron') ? (c.x < rightEdge + 30)
                                             : (c.x > leftEdge - 30);
    if (forward && nearEdge && random(1) < crossProb) {
      c.state = 'crossing';
      // Recombine one diffusion-length-ish distance into the other side
      const depth = 40 + random(70);
      c.targetX = (c.type === 'electron') ? Math.max(junctionX - depth, barLeft + 12)
                                          : Math.min(junctionX + depth, barRight - 12);
    }
  }
}

function respawnAtContact(c) {
  c.state = 'free';
  c.vx = 0;
  c.vy = random(-0.5, 0.5);
  c.y = random(barTop + 18, barBottom - 12);
  // Majority carriers are resupplied by the metal contact of the home region
  c.x = (c.type === 'electron') ? barRight - 8 - random(20)
                                : barLeft + 8 + random(20);
}

function updateFlashes() {
  for (const f of flashes) f.age++;
  flashes = flashes.filter(f => f.age < 16);
}

function drawCarriers() {
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  for (const c of carriers) {
    if (c.type === 'electron') {
      fill('royalblue');
      stroke('navy');
    } else {
      fill('crimson');
      stroke('darkred');
    }
    strokeWeight(1);
    circle(c.x, c.y, 11);
    noStroke();
    fill('white');
    text(c.type === 'electron' ? '−' : '+', c.x, c.y);
  }
  textStyle(NORMAL);
}

// Gold rings mark electron-hole recombination events
function drawFlashes() {
  noFill();
  for (const f of flashes) {
    stroke(218, 165, 32, map(f.age, 0, 16, 220, 0));
    strokeWeight(2);
    circle(f.x, f.y, 8 + f.age * 1.5);
  }
}

// ---------------------------------------------------------------------------
// Device drawing
// ---------------------------------------------------------------------------

function drawDevice() {
  const hw = depletionPx / 2;
  const barHeight = barBottom - barTop;

  // Metal contacts on each end of the bar
  fill('dimgray');
  noStroke();
  rect(barLeft - contactWidth, barTop, contactWidth, barHeight);
  rect(barRight, barTop, contactWidth, barHeight);

  // Neutral p region (left, holes) and n region (right, electrons)
  fill('mistyrose');
  rect(barLeft, barTop, (junctionX - hw) - barLeft, barHeight);
  fill('lightcyan');
  rect(junctionX + hw, barTop, barRight - (junctionX + hw), barHeight);

  // Depletion region: mobile carriers removed, fixed ions remain
  fill('gainsboro');
  rect(junctionX - hw, barTop, depletionPx, barHeight);

  // Bar outline
  noFill();
  stroke('gray');
  strokeWeight(1);
  rect(barLeft, barTop, barRight - barLeft, barHeight);

  // Dashed metallurgical junction line
  stroke(60);
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 5]);
  line(junctionX, barTop, junctionX, barBottom);
  drawingContext.setLineDash([]);

  // Polarity signs on the contacts when bias is applied
  if (Math.abs(appliedVoltage) > 0.02) {
    noStroke();
    fill('white');
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    const leftSign = appliedVoltage > 0 ? '+' : '−';
    const rightSign = appliedVoltage > 0 ? '−' : '+';
    text(leftSign, barLeft - contactWidth / 2, barTop + 16);
    text(rightSign, barRight + contactWidth / 2, barTop + 16);
    textStyle(NORMAL);
  }
}

// Fixed ionized dopants that make up the space charge: negative acceptor
// ions on the p side, positive donor ions on the n side.
function drawIons() {
  const hw = depletionPx / 2;
  if (hw < 8) return;   // depletion nearly collapsed at strong forward bias
  const rowYs = [96, 132, 168, 204];
  const size = 13;
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  for (let off = 8; off <= hw - 4; off += 14) {
    for (const y of rowYs) {
      // Acceptor ion (p side of the junction)
      stroke('gray');
      strokeWeight(1);
      fill(255, 255, 255, 190);
      rect(junctionX - off - size / 2, y - size / 2, size, size, 3);
      noStroke();
      fill('dimgray');
      text('−', junctionX - off, y + 0.5);
      // Donor ion (n side of the junction)
      stroke('gray');
      strokeWeight(1);
      fill(255, 255, 255, 190);
      rect(junctionX + off - size / 2, y - size / 2, size, size, 3);
      noStroke();
      fill('dimgray');
      text('+', junctionX + off, y + 0.5);
    }
  }
  textStyle(NORMAL);
}

// The built-in field points from the positive donor ions (n side) toward
// the negative acceptor ions (p side): right to left in this layout.
function drawFieldArrow() {
  const hw = depletionPx / 2;
  if (hw < 10) return;
  const y = 244;
  const x1 = junctionX + hw;   // tail (n side)
  const x2 = junctionX - hw;   // head (p side)
  // Thicker arrow for larger total band bending (Vbi - V)
  const wgt = map(VBI - appliedVoltage, 0, 6, 1.5, 4);
  stroke('purple');
  strokeWeight(wgt);
  line(x1, y, x2, y);
  line(x2, y, x2 + 8, y - 5);
  line(x2, y, x2 + 8, y + 5);
  noStroke();
  fill('purple');
  textSize(15);
  textAlign(CENTER, TOP);
  text('E field', junctionX, y - 16);
}

// External circuit: wires from each contact to a battery symbol. The long
// plate is the positive terminal; it connects to the p side under forward
// bias and to the n side under reverse bias.
function drawCircuit() {
  const busY = 300;
  const cx = canvasWidth / 2;
  const leftX = barLeft - contactWidth / 2;
  const rightX = barRight + contactWidth / 2;

  stroke('dimgray');
  strokeWeight(2);
  line(leftX, barBottom, leftX, busY);
  line(rightX, barBottom, rightX, busY);
  line(leftX, busY, cx - 14, busY);
  line(cx + 14, busY, rightX, busY);

  // Battery plates: long = +, short = -
  const posOnLeft = appliedVoltage >= 0;
  const longX = posOnLeft ? cx - 7 : cx + 7;
  const shortX = posOnLeft ? cx + 7 : cx - 7;
  strokeWeight(2.5);
  line(longX, busY - 13, longX, busY + 13);
  strokeWeight(4);
  line(shortX, busY - 6, shortX, busY + 6);

  // Terminal signs only when an EMF is actually applied
  if (Math.abs(appliedVoltage) > 0.02) {
    noStroke();
    fill('black');
    textSize(14);
    textAlign(CENTER, CENTER);
    text('+', longX + (posOnLeft ? -12 : 12), busY - 10);
    text('−', shortX + (posOnLeft ? 12 : -12), busY - 10);
  }
}

function drawRegionLabels() {
  const hw = depletionPx / 2;
  noStroke();
  fill('black');
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('p-type', (barLeft + junctionX - hw) / 2, 80);
  text('n-type', (junctionX + hw + barRight) / 2, 80);
  textStyle(NORMAL);
}

// ---------------------------------------------------------------------------
// Text, legend, readouts
// ---------------------------------------------------------------------------

function drawTitle() {
  noStroke();
  fill('black');
  textSize(24);
  textAlign(CENTER, TOP);
  text('P-N Junction Voltage Explorer', canvasWidth / 2, 8);
}

function drawBiasStatus() {
  noStroke();
  textSize(defaultTextSize);
  textAlign(CENTER, TOP);
  let msg, col;
  if (appliedVoltage > 0.05) {
    msg = 'Forward bias: barrier lowered — carriers cross';
    col = 'darkgreen';
  } else if (appliedVoltage < -0.05) {
    msg = 'Reverse bias: depletion widens — current blocked';
    col = 'chocolate';
  } else {
    msg = 'Equilibrium: drift and diffusion balance';
    col = 'dimgray';
  }
  fill(col);
  text(msg, canvasWidth / 2, 38);
}

function drawLegend() {
  const y = 272;
  const startX = canvasWidth / 2 - 118;
  textSize(15);
  textAlign(LEFT, CENTER);

  fill('royalblue');
  stroke('navy');
  strokeWeight(1);
  circle(startX, y, 11);
  noStroke();
  fill('black');
  text('electron', startX + 10, y);

  fill('crimson');
  stroke('darkred');
  strokeWeight(1);
  circle(startX + 87, y, 11);
  noStroke();
  fill('black');
  text('hole', startX + 97, y);

  stroke('gray');
  strokeWeight(1);
  fill(255, 255, 255, 190);
  rect(startX + 153, y - 6.5, 13, 13, 3);
  noStroke();
  fill('black');
  text('fixed ion', startX + 173, y);
}

function drawReadouts() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  const wUm = depletionWidthUm(appliedVoltage);
  const wText = (appliedVoltage >= VBI - 0.02)
    ? '< 0.06 µm'
    : wUm.toFixed(2) + ' µm';
  text('Depletion width: ' + wText, margin, 336);
  textAlign(RIGHT, CENTER);
  text('Current: ' + formatCurrent(diodeCurrent(appliedVoltage)),
       canvasWidth - margin, 336);
}

function drawHoverHint() {
  if (isRunning && !mouseOverCanvas) {
    noStroke();
    fill('gray');
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Move the mouse over the canvas to animate', canvasWidth / 2, 372);
  }
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Voltage: ' + appliedVoltage.toFixed(2) + ' V', 142, drawHeight + 25);
}

// ---------------------------------------------------------------------------
// Controls and responsive layout
// ---------------------------------------------------------------------------

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  voltageSlider.value(0);
  appliedVoltage = 0;
  depletionPx = depletionWidthPx(0);
  initCarriers();
}

function computeGeometry() {
  barLeft = margin + contactWidth;
  barRight = canvasWidth - margin - contactWidth;
  junctionX = canvasWidth / 2;
}

function ensureCanvasMatchesContainer() {
  const previousWidth = canvasWidth;
  updateCanvasSize();
  if (Math.abs(canvasWidth - previousWidth) > 1) {
    resizeCanvas(canvasWidth, canvasHeight);
    computeGeometry();
    voltageSlider.size(canvasWidth - sliderLeftMargin - margin);
    initCarriers();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeGeometry();
  voltageSlider.size(canvasWidth - sliderLeftMargin - margin);
  initCarriers();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
