// Minority Carrier Diffusion Length Visualizer MicroSim
// CANVAS_HEIGHT: 572
//
// Minority holes diffuse into an n-type semiconductor and recombine. Random
// walkers show individual carriers, a histogram shows their density, and an
// analytical curve shows the solution of the minority carrier diffusion
// equation (Chapter 10):
//     D_p d2(dp)/dx2 - dp/tau_p + G = 0,    L_p = sqrt(D_p tau_p)
// Three situations:
//   steady injection at x = 0:   dp(x) = dp(0) exp(-x/L_p)
//   pulse injected at x = 0:     dp(x,t) ~ exp(-x^2/(4 D_p t)) exp(-t/tau_p) / sqrt(pi D_p t)
//   uniform illumination with a recombining surface at x = 0
//   (D_p d(dp)/dx = S dp at the surface):
//                                dp(x) = G tau_p [1 - (S L_p/(D_p + S L_p)) exp(-x/L_p)]
// The walkers are simulated in normalized units (x/L_p, t/tau_p), so one
// lifetime always takes the same time on screen.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 422;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 290;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Simulation constants (normalized units) ----
const DT = 1 / 90;                 // time step in lifetimes (1 lifetime = 1.5 s at 60 fps)
const STEP = Math.sqrt(2 * DT);    // rms diffusion step in diffusion lengths
const N_STEADY = 800;              // steady-state walker count for injection at x = 0
const N_PULSE = 1200;              // walkers in one injected pulse
const DOMAIN = 13;                 // illumination mode: slab depth in diffusion lengths
const BULK_DENSITY = 320;          // illumination mode: walkers per diffusion length in the bulk
const NUM_BINS = 24;

// ---- Controls and state ----
let tauSlider, diffSlider, surfaceSlider, startButton, pulseButton, analyticCheckbox, lightCheckbox;
let isRunning = false;             // loads paused; press Start to animate
let mode = 'steady';               // 'steady' | 'pulse' | 'light'
let walkers = [];                  // {xi, v}: depth in diffusion lengths, vertical position 0..1
let pulseTime = 0;                 // time since the pulse, in lifetimes
let injectCarry = 0;               // fractional walkers carried between frames
let stateKey = '';                 // mode and surface parameter the walkers were sampled for
let smoothCounts = [];             // time-averaged histogram counts
let smoothKey = '';                // mode and axis scale the average belongs to

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.mousePressed(toggleRun);

  pulseButton = createButton('Pulse injection');
  pulseButton.position(68, drawHeight + 8);
  pulseButton.mousePressed(startPulse);

  analyticCheckbox = createCheckbox(' Show analytical solution', true);
  analyticCheckbox.position(190, drawHeight + 10);
  analyticCheckbox.style('white-space', 'nowrap');

  lightCheckbox = createCheckbox(' Uniform illumination', false);
  lightCheckbox.position(392, drawHeight + 10);
  lightCheckbox.style('white-space', 'nowrap');
  lightCheckbox.changed(() => { mode = lightCheckbox.checked() ? 'light' : 'steady'; });

  // log10 of the minority carrier lifetime in seconds: 1 ns to 1 ms
  tauSlider = createSlider(-9, -3, -4, 0.02);
  // diffusion coefficient in cm^2/s
  diffSlider = createSlider(1, 25, 12, 0.5);
  // log10 of the surface recombination velocity in cm/s: 1 to 1e6
  surfaceSlider = createSlider(0, 6, 3, 0.05);
  const sliders = [tauSlider, diffSlider, surfaceSlider];
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].position(sliderLeftMargin, drawHeight + 45 + 35 * i);
    sliders[i].size(canvasWidth - sliderLeftMargin - margin);
  }

  describe('Minority carriers diffusing into a semiconductor. A strip at the ' +
    'top shows individual holes as dots performing a random walk from the ' +
    'left face into the bulk and disappearing when they recombine. Below it, ' +
    'a histogram of the carrier density is compared with the analytical ' +
    'exponential decay, and a dashed line marks the diffusion length. ' +
    'Sliders set the minority carrier lifetime and the diffusion ' +
    'coefficient. A pulse button shows the decay in time, and an ' +
    'illumination option shows the profile near a recombining surface.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Diffusion length in cm for D in cm^2/s and tau in s
function diffusionLength(D, tau) {
  return Math.sqrt(D * tau);
}

// Analytical profile at depth xi = x/L_p (and time tn = t/tau_p for the pulse).
// s = S L_p / D_p is the dimensionless surface recombination strength.
function analyticProfile(whichMode, xi, tn, s) {
  if (whichMode === 'steady') return Math.exp(-xi);
  if (whichMode === 'light') return 1 - (s / (1 + s)) * Math.exp(-xi);
  if (tn <= 0) return 0;
  return Math.exp(-xi * xi / (4 * tn)) * Math.exp(-tn) / Math.sqrt(Math.PI * tn);
}

// Smallest 1-2-5 number that is at least x
function niceCeil(x) {
  const e = Math.floor(Math.log10(x));
  const m = x / Math.pow(10, e);
  const n = m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10;
  return n * Math.pow(10, e);
}

// ---------------------------------------------------------------------------
// Random walkers
// ---------------------------------------------------------------------------

// Fill the walker list from the steady-state distribution of the current mode
function sampleSteadyState(s) {
  walkers = [];
  if (mode === 'steady') {
    for (let i = 0; i < N_STEADY; i++) {
      walkers.push({ xi: -Math.log(1 - random()), v: random(0.06, 0.94) });
    }
  } else if (mode === 'light') {
    const a = s / (1 + s);
    const target = Math.round(BULK_DENSITY * (DOMAIN - a));     // integral of the profile
    while (walkers.length < target) {
      const xi = random(0, DOMAIN);
      if (random() < 1 - a * Math.exp(-xi)) walkers.push({ xi: xi, v: random(0.06, 0.94) });
    }
  }
}

function stepWalkers(s, stripAspect) {
  const absorbP = Math.min(1, s * Math.sqrt(Math.PI * DT));   // partly absorbing surface
  const survive = Math.exp(-DT);
  const next = [];
  for (const w of walkers) {
    if (random() > survive) continue;                         // recombined in the bulk
    w.xi += STEP * randomGaussian();
    w.v += STEP * randomGaussian() * stripAspect;
    if (w.v < 0.04) w.v = 0.08 - w.v;
    if (w.v > 0.96) w.v = 1.92 - w.v;
    w.v = constrain(w.v, 0.04, 0.96);
    if (w.xi < 0) {
      if (mode === 'light' && random() < absorbP) continue;   // recombined at the surface
      w.xi = -w.xi;
    }
    if (mode === 'light' && w.xi > DOMAIN) w.xi = 2 * DOMAIN - w.xi;
    next.push(w);
  }
  walkers = next;

  // Sources
  if (mode === 'steady') {
    injectCarry += N_STEADY * DT;
    while (injectCarry >= 1) {
      walkers.push({ xi: 0, v: random(0.06, 0.94) });
      injectCarry -= 1;
    }
  } else if (mode === 'light') {
    injectCarry += BULK_DENSITY * DOMAIN * DT;
    while (injectCarry >= 1) {
      walkers.push({ xi: random(0, DOMAIN), v: random(0.06, 0.94) });
      injectCarry -= 1;
    }
  } else {
    pulseTime += DT;
    if (pulseTime > 6 || walkers.length === 0) {              // pulse has decayed
      mode = 'steady';
      walkers = [];
      stateKey = 'steady|running';
    }
  }
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const tau = Math.pow(10, tauSlider.value());
  const D = diffSlider.value();
  const S = Math.pow(10, surfaceSlider.value());
  const L = diffusionLength(D, tau);            // cm
  const s = S * L / D;                          // dimensionless surface strength
  const xMax = niceCeil(5 * L);                 // cm, axis length
  const xiMax = xMax / L;                       // axis length in diffusion lengths

  // Geometry
  const panelW = canvasWidth >= 700 ? 240 : 204;
  const panelX = canvasWidth - panelW - 10;
  const x0 = 58, x1 = panelX - 18;
  const stripY0 = 66, stripY1 = 140;
  const y0 = 170, y1 = 366;
  const pxPerL = (x1 - x0) / xiMax;

  // Keep the walkers consistent with the mode (and surface strength) while paused
  const key = mode + '|' + (mode === 'light' ? s.toPrecision(3) : '') + (isRunning ? '|running' : '');
  if (mode !== 'pulse' && !isRunning && key !== stateKey) sampleSteadyState(s);
  if (isRunning && mode !== 'pulse' && stateKey.split('|')[0] !== mode) sampleSteadyState(s);
  stateKey = key;
  if (isRunning) stepWalkers(s, pxPerL / (stripY1 - stripY0));

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawStrip(x0, x1, stripY0, stripY1, pxPerL, xiMax);
  drawProfilePlot(x0, x1, y0, y1, L, xMax, xiMax, s);
  drawInfoPanel(panelX, 44, panelW, drawHeight - 52, D, tau, L, S, s);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Minority Carrier Diffusion Length', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(tau, D, S);
}

// Top strip: the semiconductor with individual holes as dots
function drawStrip(x0, x1, sy0, sy1, pxPerL, xiMax) {
  // caption
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, BOTTOM);
  const cap = mode === 'light' ? 'n-type bulk under uniform light; recombining surface at x = 0'
            : mode === 'pulse' ? 'n-type bulk; one pulse of holes injected at x = 0'
            : 'n-type bulk; holes injected steadily at x = 0';
  text(cap, x0, sy0 - 5);

  stroke('dimgray');
  strokeWeight(1);
  fill(225, 240, 255);
  rect(x0, sy0, x1 - x0, sy1 - sy0);

  if (mode === 'light') {
    // incoming light
    stroke('goldenrod');
    strokeWeight(1.5);
    for (let i = 0; i < 9; i++) {
      const lx = x0 + (x1 - x0) * (i + 0.5) / 9;
      line(lx, sy0 + 2, lx, sy0 + 13);
      line(lx, sy0 + 13, lx - 3, sy0 + 8);
      line(lx, sy0 + 13, lx + 3, sy0 + 8);
    }
    // recombining surface
    stroke('firebrick');
    strokeWeight(4);
    line(x0, sy0, x0, sy1);
  } else {
    // injecting contact
    noStroke();
    fill('crimson');
    rect(x0 - 9, sy0, 9, sy1 - sy0);
  }

  // holes (only a fraction of the walkers is drawn so the strip stays readable)
  noStroke();
  fill(220, 20, 60, 190);
  const stride = mode === 'light' ? 8 : 3;
  for (let i = 0; i < walkers.length; i += stride) {
    const w = walkers[i];
    if (w.xi > xiMax) continue;
    circle(x0 + w.xi * pxPerL, lerp(sy0, sy1, w.v), 5);
  }
}

// Density histogram of the walkers with the analytical curve on top
function drawProfilePlot(x0, x1, y0, y1, L, xMax, xiMax, s) {
  const Y_MAX = 1.2;
  const yOf = (v) => map(Math.min(v, Y_MAX), 0, Y_MAX, y1, y0);
  const xOfXi = (xi) => map(xi, 0, xiMax, x0, x1);

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  // grid and axes
  textSize(12);
  for (const v of [0, 0.25, 0.5, 0.75, 1]) {
    stroke('gainsboro');
    line(x0, yOf(v), x1, yOf(v));
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(v === 0 ? '0' : v.toFixed(2), x0 - 6, yOf(v));
  }
  for (let i = 0; i <= 4; i++) {
    const xx = map(i, 0, 4, x0, x1);
    stroke('gainsboro');
    line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    noStroke();
    fill('black');
    textAlign(i === 4 ? RIGHT : CENTER, TOP);
    text(fmtLength(xMax * i / 4, xMax), i === 4 ? x1 + 6 : xx, y1 + 7);
  }

  // histogram of walker density, normalized to the reference density
  const binW = xiMax / NUM_BINS;
  const counts = new Array(NUM_BINS).fill(0);
  for (const w of walkers) {
    const b = Math.floor(w.xi / binW);
    if (b >= 0 && b < NUM_BINS) counts[b]++;
  }
  // While running, average the counts over about ten frames to calm the noise.
  // The pulse is not averaged because its profile changes quickly.
  const sKey = mode + '|' + xiMax.toPrecision(4);
  if (!isRunning || mode === 'pulse' || sKey !== smoothKey || smoothCounts.length !== NUM_BINS) {
    smoothCounts = counts.slice();
  } else {
    for (let b = 0; b < NUM_BINS; b++) smoothCounts[b] = 0.9 * smoothCounts[b] + 0.1 * counts[b];
  }
  smoothKey = sKey;
  const ref = mode === 'steady' ? N_STEADY : mode === 'light' ? BULK_DENSITY : N_PULSE;
  noStroke();
  fill(240, 128, 128, 150);
  for (let b = 0; b < NUM_BINS; b++) {
    const dens = smoothCounts[b] / (ref * binW);
    const bx = xOfXi(b * binW);
    rect(bx, yOf(dens), xOfXi((b + 1) * binW) - bx - 1, y1 - yOf(dens));
  }

  // diffusion length marker
  const xL = xOfXi(1);
  stroke('darkorange');
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(xL, y0, xL, y1);
  if (mode === 'steady') line(x0, yOf(1 / Math.E), xL, yOf(1 / Math.E));
  drawingContext.setLineDash([]);
  noStroke();
  fill('chocolate');
  textSize(13);
  textStyle(BOLD);
  richText('L_{p}', xL + 5, y0 + 12, LEFT);
  textStyle(NORMAL);
  if (mode === 'steady') {
    textSize(12);
    textAlign(LEFT, BOTTOM);
    text('1/e', x0 + 4, yOf(1 / Math.E) - 2);
  }

  // analytical solution
  if (analyticCheckbox.checked()) {
    push();
    drawingContext.beginPath();
    drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
    drawingContext.clip();
    noFill();
    stroke('black');
    strokeWeight(2.5);
    beginShape();
    for (let i = 0; i <= 120; i++) {
      const xi = xiMax * i / 120;
      vertex(xOfXi(xi), map(analyticProfile(mode, xi, pulseTime, s), 0, Y_MAX, y1, y0));
    }
    endShape();
    pop();
  }

  stroke('black');
  strokeWeight(1);
  noFill();
  rect(x0, y0, x1 - x0, y1 - y0);

  // legend, upper right corner of the plot
  const lx = x1 - 168, ly = y0 + 10;
  noStroke();
  fill(255, 255, 255, 220);
  rect(lx - 6, ly - 9, 170, analyticCheckbox.checked() ? 38 : 20, 5);
  fill(240, 128, 128, 200);
  rect(lx, ly - 5, 22, 10);
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('random-walk holes', lx + 28, ly);
  if (analyticCheckbox.checked()) {
    stroke('black');
    strokeWeight(2.5);
    line(lx, ly + 18, lx + 22, ly + 18);
    noStroke();
    text('analytical solution', lx + 28, ly + 18);
  }

  // axis titles
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('Depth x', (x0 + x1) / 2, y1 + 25);
  push();
  translate(15, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textSize(13);
  richText(mode === 'light' ? 'δp(x) / (G τ_{p})' : mode === 'pulse' ? 'δp(x, t), relative' : 'δp(x) / δp(0)',
           0, 0, CENTER);
  pop();
}

function drawInfoPanel(x, y, w, h, D, tau, L, S, s) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const pad = 10;
  const small = w < 230;
  const ts = small ? 12 : 13;
  let cy = y + 17;
  textAlign(LEFT, CENTER);

  fill('black');
  textStyle(BOLD);
  textSize(ts + 1);
  text('Minority holes in n-type', x + pad, cy);
  textStyle(NORMAL);
  textSize(ts);
  cy += 23;
  richText('D_{p} = ' + D.toFixed(1) + ' cm^{2}/s', x + pad, cy, LEFT);
  cy += 20;
  richText('τ_{p} = ' + fmtTime(tau), x + pad, cy, LEFT);
  cy += 26;
  richText('L_{p} = √(D_{p} τ_{p})', x + pad, cy, LEFT);
  cy += 24;
  fill('chocolate');
  textStyle(BOLD);
  textSize(ts + 5);
  richText('L_{p} = ' + fmtLength(L, L), x + pad, cy, LEFT);
  textStyle(NORMAL);
  textSize(ts);
  fill('black');
  cy += 32;

  textStyle(BOLD);
  textSize(ts + 1);
  if (mode === 'steady') {
    text('Steady injection', x + pad, cy);
    textStyle(NORMAL);
    textSize(ts);
    cy += 22;
    richText('δp(x) = δp(0) e^{−x/L_{p}}', x + pad, cy, LEFT);
    cy += 22;
    textSize(12);
    textLeading(16);
    textAlign(LEFT, TOP);
    text('At one diffusion length the excess hole density has dropped to 1/e = 37 % ' +
         'of its value at x = 0.', x + pad, cy - 6, w - 2 * pad, 80);
  } else if (mode === 'pulse') {
    text('Pulse injection', x + pad, cy);
    textStyle(NORMAL);
    textSize(ts);
    cy += 22;
    richText('t = ' + pulseTime.toFixed(2) + ' τ_{p} = ' + fmtTime(pulseTime * tau), x + pad, cy, LEFT);
    cy += 20;
    text('Holes left: ' + (100 * walkers.length / N_PULSE).toFixed(0) + ' %', x + pad, cy);
    cy += 20;
    richText('e^{−t/τ_{p}} = ' + (100 * Math.exp(-pulseTime)).toFixed(0) + ' %', x + pad, cy, LEFT);
    cy += 22;
    textSize(12);
    textLeading(16);
    textAlign(LEFT, TOP);
    text('The pulse spreads by diffusion while recombination removes holes everywhere.',
         x + pad, cy - 6, w - 2 * pad, 70);
  } else {
    text('Illumination + surface', x + pad, cy);
    textStyle(NORMAL);
    textSize(ts);
    cy += 22;
    richText('S = ' + sci(S, 1) + ' cm/s', x + pad, cy, LEFT);
    cy += 20;
    richText('S L_{p} / D_{p} = ' + fmtNumber(s), x + pad, cy, LEFT);
    cy += 20;
    richText('δp(0) / δp(bulk) = ' + (1 / (1 + s)).toPrecision(2), x + pad, cy, LEFT);
    cy += 22;
    textSize(12);
    textLeading(16);
    textAlign(LEFT, TOP);
    text('Surface recombination drains carriers from a layer about one diffusion length deep.',
         x + pad, cy - 6, w - 2 * pad, 70);
  }

  // footer: animation time scale
  fill('dimgray');
  textSize(12);
  textLeading(15);
  textAlign(LEFT, BOTTOM);
  text(isRunning ? 'Animation: one lifetime takes about 1.5 s on screen.'
                 : 'Press Start to run the random walk.', x + pad, y + h - 38, w - 2 * pad, 32);
}

function drawControlLabels(tau, D, S) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  richText('Minority carrier lifetime τ_{p}: ' + fmtTime(tau), 10, drawHeight + 55, LEFT);
  richText('Diffusion coefficient D_{p}: ' + D.toFixed(1) + ' cm^{2}/s', 10, drawHeight + 90, LEFT);
  fill(mode === 'light' ? 'black' : 'gray');
  richText('Surface recombination S: ' + sci(S, 1) + ' cm/s', 10, drawHeight + 125, LEFT);
  surfaceSlider.elt.disabled = mode !== 'light';
  surfaceSlider.style('opacity', mode === 'light' ? '1' : '0.4');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toggleRun() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

// Inject one burst of holes at x = 0 and watch it spread and decay
function startPulse() {
  lightCheckbox.checked(false);
  mode = 'pulse';
  pulseTime = 0;
  injectCarry = 0;
  walkers = [];
  for (let i = 0; i < N_PULSE; i++) walkers.push({ xi: 0, v: random(0.06, 0.94) });
  if (!isRunning) toggleRun();
}

// Length with units chosen from the axis scale (both arguments in cm)
function fmtLength(x, scale) {
  if (x === 0) return '0';
  if (scale >= 0.1) return trimNumber(x * 10) + ' mm';
  return trimNumber(x * 1e4) + ' µm';
}

function trimNumber(v) {
  return Number(v.toPrecision(3)).toString();
}

function fmtNumber(v) {
  if (v >= 1000 || v < 0.01) return sci(v, 1);
  return Number(v.toPrecision(2)).toString();
}

// Time with an SI prefix and three significant figures
function fmtTime(t) {
  if (t === 0) return '0 s';
  const units = [[1, 's'], [1e-3, 'ms'], [1e-6, 'µs'], [1e-9, 'ns']];
  for (const u of units) {
    if (t >= u[0] * 0.9995) return Number((t / u[0]).toPrecision(3)).toString() + ' ' + u[1];
  }
  return Number((t / 1e-12).toPrecision(3)).toString() + ' ps';
}

// Scientific notation in richText markup, e.g. "1.0 × 10^{3}"
function sci(x, digits) {
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = x / Math.pow(10, e);
  if (Number(m.toFixed(digits)) >= 10) { m /= 10; e += 1; }
  return m.toFixed(digits) + ' × 10^{' + String(e).replace('-', '−') + '}';
}

// Draw text containing _{subscript} and ^{superscript} markup (one level of
// nesting inside a superscript is allowed, as in e^{−x/L_{p}}).
// (x, y) is the left / center / right anchor at the vertical center of the line.
function richText(str, x, y, align) {
  const segs = [];
  const re = /([_^])\{((?:[^{}]|\{[^{}]*\})*)\}/g;
  let last = 0, m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) segs.push({ t: str.slice(last, m.index), mode: 0 });
    segs.push({ t: m[2].replace(/_\{([^}]*)\}/g, '$1'), mode: m[1] === '_' ? 1 : 2 });
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
    if (typeof tauSlider !== 'undefined' && surfaceSlider) {
      for (const s of [tauSlider, diffSlider, surfaceSlider]) {
        s.size(canvasWidth - sliderLeftMargin - margin);
      }
    }
  }
}
