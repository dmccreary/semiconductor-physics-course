// LED Efficiency and Laser Threshold Explorer MicroSim
// CANVAS_HEIGHT: 622
//
// One GaAs active layer (photon energy 1.42 eV, 873 nm), used two ways.
//
// LED mode (Section 17.2): the ABC model,
//   IQE = B n^2 / (A n + B n^2 + C n^3)
//   J   = q d (A n + B n^2 + C n^3) / eta_inj
//   EQE = eta_inj * IQE * LEE,   P_out = EQE (h nu / q) I
// Laser mode (Section 17.5): Fabry-Perot cavity with mirror reflectivity R
// and length L,
//   threshold:  Gamma g(n_th) = alpha_i + alpha_m,  alpha_m = (1/L) ln(1/R)
//   J_th = q d (A n_th + B n_th^2 + C n_th^3) / eta_i
//   P_out = eta_d (h nu / q) (I - I_th),  eta_d = eta_i alpha_m / (alpha_i + alpha_m)
// Gain models: bulk  g = a (n - n_tr),  a = 3e-16 cm^2, n_tr = 1e18 cm^-3
//              single quantum well  g = g_0 ln(n / n_tr)
// See index.md for the parameter values, their sources and the limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 472;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let labelWidth = 206;              // width reserved for a slider label in each column
let defaultTextSize = 14;

// ---- Constants and device parameters ----
const Q = 1.602e-19;               // elementary charge (C)
const PHOTON_EV = 1.42;            // photon energy = GaAs bandgap (eV)
const ETA_INJ = 0.95;              // injection efficiency (Section 17.2)
const LEE_FLAT = 1 / (4 * 3.5 * 3.5);   // extraction through one flat surface, n = 3.5 (2.0 %)
const ALPHA_I = 10;                // internal loss (cm^-1)
const LED_AREA = 1e-4;             // LED emitting area: 100 um x 100 um (cm^2)
const STRIPE_W = 5e-4;             // laser stripe width: 5 um (cm)
const I_MAX = { led: 1.0, laser: 0.1 };   // current axis (A)

// Active layers: bulk double heterostructure and a single quantum well
const LAYERS = {
  bulk: { name: 'bulk, 0.1 µm', d: 1e-5, gamma: 0.3,
          gain: (n) => 3e-16 * (n - 1e18) },             // chapter values for a and n_tr
  qw:   { name: 'single well, 8 nm', d: 8e-7, gamma: 0.03,
          gain: (n) => 2400 * Math.log(n / 2.6e18) }     // representative GaAs well
};

// ---- Controls ----
let modeRadio, qwCheckbox, resetButton;
let currentSlider, reflSlider, lengthSlider, aSlider, bSlider, cSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  modeRadio = createRadio();
  modeRadio.option('led', ' LED mode');
  modeRadio.option('laser', ' Laser mode');
  modeRadio.selected('led');
  modeRadio.position(10, drawHeight + 10);
  modeRadio.style('font-size', '14px');
  modeRadio.changed(syncSliders);

  qwCheckbox = createCheckbox(' Compare quantum well with bulk', false);
  qwCheckbox.position(218, drawHeight + 9);
  qwCheckbox.style('font-size', '14px');
  qwCheckbox.style('white-space', 'nowrap');

  resetButton = createButton('Reset');
  resetButton.position(470, drawHeight + 8);
  resetButton.mousePressed(resetDefaults);

  currentSlider = createSlider(0, 1, 0.5, 0.005);        // fraction of the current axis
  reflSlider = createSlider(0.3, 0.99, 0.3, 0.01);
  lengthSlider = createSlider(50, 500, 300, 10);         // micrometers
  aSlider = createSlider(6, 9, 7, 0.05);                 // log10(A / s^-1)
  bSlider = createSlider(-12, -9, -10, 0.05);            // log10(B / cm^3 s^-1)
  cSlider = createSlider(-32, -28, Math.log10(2e-30), 0.05);   // log10(C / cm^6 s^-1)
  layoutSliders();
  syncSliders();

  describe('A two-mode simulation of a semiconductor light source. In LED ' +
    'mode the left plot shows internal quantum efficiency against current ' +
    'density from the ABC recombination model, rising at low current, ' +
    'peaking, and drooping at high current, and the right plot shows light ' +
    'output against current. In laser mode the left plot shows modal gain ' +
    'against carrier density with a horizontal loss line whose crossing ' +
    'gives the threshold, and the right plot shows the light output rising ' +
    'linearly above the threshold current. Sliders set the drive current, ' +
    'the mirror reflectivity, the cavity length and the three ' +
    'recombination coefficients.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

function recombRate(c, n) { return c.A * n + c.B * n * n + c.C * n * n * n; }   // cm^-3 s^-1
function iqe(c, n) { return c.B * n / (c.A + c.B * n + c.C * n * n); }

// Current density (A/cm^2) that maintains carrier density n in a layer of thickness d
function currentDensity(c, layer, n) { return Q * layer.d * recombRate(c, n) / ETA_INJ; }

// Carrier density at current density J (bisection on a logarithmic scale)
function densityAt(c, layer, J) {
  if (J <= 0) return 0;
  let lo = 8, hi = 23;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (currentDensity(c, layer, Math.pow(10, m)) > J) hi = m; else lo = m;
  }
  return Math.pow(10, (lo + hi) / 2);
}

// LED output power (W) at current I (A)
function ledPower(c, layer, I) {
  const n = densityAt(c, layer, I / LED_AREA);
  return ETA_INJ * iqe(c, n) * LEE_FLAT * PHOTON_EV * I;
}

// Laser threshold and slope for a cavity of length Lcm with facet reflectivity R
function laserParams(c, layer, R, Lcm) {
  const alphaM = Math.log(1 / R) / Lcm;                  // mirror loss (cm^-1)
  const loss = ALPHA_I + alphaM;
  const gth = loss / layer.gamma;                        // material gain needed (cm^-1)
  // carrier density where the gain reaches gth (the gain rises with n)
  let lo = 16, hi = 24;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (layer.gain(Math.pow(10, m)) > gth) hi = m; else lo = m;
  }
  const nth = Math.pow(10, (lo + hi) / 2);
  const jth = currentDensity(c, layer, nth);
  const ith = jth * STRIPE_W * Lcm;
  const etaD = ETA_INJ * alphaM / loss;
  return { alphaM: alphaM, loss: loss, gth: gth, nth: nth, jth: jth, ith: ith, etaD: etaD,
           slope: etaD * PHOTON_EV,                      // W/A, both facets
           reachable: nth < 2e19 };
}

function laserPower(lp, I) { return I > lp.ith ? lp.slope * (I - lp.ith) : 0; }

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const mode = modeRadio.value() === 'laser' ? 'laser' : 'led';
  const c = {
    A: Math.pow(10, aSlider.value()),
    B: Math.pow(10, bSlider.value()),
    C: Math.pow(10, cSlider.value())
  };
  const R = reflSlider.value();
  const Lcm = lengthSlider.value() * 1e-4;
  const I = currentSlider.value() * I_MAX[mode];
  const both = qwCheckbox.checked();

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const leftPad = 58, gap = 66, rightPad = 14;
  const plotW = (canvasWidth - leftPad - gap - rightPad) / 2;
  const lx0 = leftPad, lx1 = leftPad + plotW;
  const rx0 = lx1 + gap, rx1 = rx0 + plotW;
  const y0 = 58, y1 = 288;

  if (mode === 'led') {
    drawIqePlot(lx0, lx1, y0, y1, c, I, both);
    drawLedLI(rx0, rx1, y0, y1, c, I, both);
    drawLedReadout(c, I, both);
  } else {
    const lpBulk = laserParams(c, LAYERS.bulk, R, Lcm);
    const lpQw = laserParams(c, LAYERS.qw, R, Lcm);
    drawGainPlot(lx0, lx1, y0, y1, lpBulk, lpQw, both);
    drawLaserLI(rx0, rx1, y0, y1, c, lpBulk, lpQw, I, both);
    drawLaserReadout(lpBulk, lpQw, I, R, Lcm, both);
  }

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 16 : 20);
  textStyle(BOLD);
  text('LED Efficiency and Laser Threshold Explorer', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(mode, c, I, R, Lcm);
}

function plotFrame(x0, x1, y0, y1) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
}

function plotTitles(x0, x1, y0, y1, title, xTitle, yTitle) {
  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD);
  richText(title, (x0 + x1) / 2, y0 - 12, CENTER);
  textStyle(NORMAL);
  richText(xTitle, (x0 + x1) / 2, y1 + 31, CENTER);
  push();
  translate(x0 - 44, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13);
  richText(yTitle, 0, 0, CENTER);
  pop();
}

function clipTo(x0, x1, y0, y1) {
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
}

// ---- LED: internal quantum efficiency against current density ----
function drawIqePlot(x0, x1, y0, y1, c, I, both) {
  plotFrame(x0, x1, y0, y1);
  const J_LO = -2, J_HI = 5;                             // log10(A/cm^2)
  const xOfJ = (j) => map(Math.log10(j), J_LO, J_HI, x0, x1);
  const yOfE = (e) => map(e, 0, 1.22, y1, y0);   // head-room above 100 % holds the legend

  textSize(12);
  for (const e of [0, 0.2, 0.4, 0.6, 0.8, 1.0]) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOfE(e), x1, yOfE(e));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(Math.round(e * 100), x0 - 6, yOfE(e));
  }
  for (let e = J_LO; e <= J_HI; e++) {
    const xx = map(e, J_LO, J_HI, x0, x1);
    stroke('gainsboro'); strokeWeight(1);
    line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black');
    if (e % 2 === 0 || x1 - x0 > 300) richText('10^{' + String(e).replace('-', '−') + '}', xx, y1 + 13, CENTER);
  }

  push();
  clipTo(x0, x1, y0, y1);
  const layer = LAYERS.bulk;
  // sweep the carrier density and plot against the current density it needs
  const ns = [];
  for (let i = 0; i <= 220; i++) ns.push(Math.pow(10, 13 + 9 * i / 220));
  const share = (f, lay, col, w, dash) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    drawingContext.setLineDash(dash);
    beginShape();
    for (const n of ns) {
      const j = currentDensity(c, lay, n);
      if (j > 1e-4 && j < 1e7) vertex(xOfJ(j), yOfE(f(n)));
    }
    endShape();
    drawingContext.setLineDash([]);
  };
  share((n) => c.A / (c.A + c.B * n + c.C * n * n), layer, 'gray', 1.5, [5, 4]);          // SRH share
  share((n) => c.C * n * n / (c.A + c.B * n + c.C * n * n), layer, 'darkorange', 1.5, [5, 4]);  // Auger share
  if (both) share((n) => iqe(c, n), LAYERS.qw, 'seagreen', 2.5, []);
  share((n) => iqe(c, n), layer, 'royalblue', 3, []);
  pop();

  // Peak of the IQE: n = sqrt(A/C)
  const nPeak = Math.sqrt(c.A / c.C);
  const jPeak = currentDensity(c, layer, nPeak);
  if (jPeak > Math.pow(10, J_LO) && jPeak < Math.pow(10, J_HI)) {
    stroke('royalblue');
    strokeWeight(1);
    drawingContext.setLineDash([2, 3]);
    line(xOfJ(jPeak), yOfE(iqe(c, nPeak)), xOfJ(jPeak), y1);
    drawingContext.setLineDash([]);
  }

  // Probe at the present current density
  const J = I / LED_AREA;
  if (J > Math.pow(10, J_LO)) {
    const n = densityAt(c, layer, J);
    const xp = constrain(xOfJ(J), x0, x1);
    stroke('dimgray');
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);
    line(xp, y0, xp, y1);
    drawingContext.setLineDash([]);
    stroke('white');
    strokeWeight(1.5);
    fill('royalblue');
    circle(xp, yOfE(iqe(c, n)), 10);
  }

  // Legend in two columns above the 100 % line
  const items = [['royalblue', [], 3, 'IQE (radiative)'], ['gray', [5, 4], 1.5, 'SRH share'],
                 ['darkorange', [5, 4], 1.5, 'Auger share']];
  if (both) items.push(['seagreen', [], 2.5, 'IQE, 8 nm well']);
  const colW = (x1 - x0 - 12) / 2;
  for (let i = 0; i < items.length; i++) {
    const lx = x0 + 8 + (i % 2) * colW, ly = y0 + 11 + Math.floor(i / 2) * 15;
    stroke(items[i][0]);
    strokeWeight(items[i][2]);
    drawingContext.setLineDash(items[i][1]);
    line(lx, ly, lx + 20, ly);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(LEFT, CENTER);
    text(items[i][3], lx + 25, ly);
  }
  textSize(11);
  const narrow = x1 - x0 < 290;
  chipText(narrow ? 'SRH-limited' : 'low current: SRH wins', x0 + 6, y1 - 12, LEFT, 'dimgray');
  chipText(narrow ? 'droop' : 'high current: droop', x1 - 6, y1 - 12, RIGHT, 'dimgray');

  plotTitles(x0, x1, y0, y1, 'Internal quantum efficiency (%)', 'Current density J (A/cm^{2})', 'IQE (%)');
}

// ---- LED: light output against current ----
function drawLedLI(x0, x1, y0, y1, c, I, both) {
  plotFrame(x0, x1, y0, y1);
  const iMax = I_MAX.led;
  const nPeak = Math.sqrt(c.A / c.C);
  const eqePeak = ETA_INJ * iqe(c, nPeak) * LEE_FLAT;
  const pTop = eqePeak * PHOTON_EV * iMax;               // ceiling: peak efficiency at every current
  const pMax = niceCeil(pTop * 1e3 * 1.05) / 1e3;        // W
  const xOfI = (i) => map(i, 0, iMax, x0, x1);
  const yOfP = (p) => map(p, 0, pMax, y1, y0);

  gridLinear(x0, x1, y0, y1, 0, iMax * 1e3, 200, xOfI, 1e-3, 0, pMax * 1e3, yOfP, 1e-3);

  push();
  clipTo(x0, x1, y0, y1);
  stroke('gray');
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(xOfI(0), yOfP(0), xOfI(iMax), yOfP(pTop));
  drawingContext.setLineDash([]);
  const li = (lay, col, w) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    beginShape();
    for (let k = 0; k <= 100; k++) {
      const i = iMax * k / 100;
      vertex(xOfI(i), yOfP(ledPower(c, lay, i)));
    }
    endShape();
  };
  if (both) li(LAYERS.qw, 'seagreen', 2.5);
  li(LAYERS.bulk, 'royalblue', 3);
  pop();

  probeDot(xOfI(I), yOfP(ledPower(c, LAYERS.bulk, I)), y0, y1, 'royalblue');

  const items = [['royalblue', [], 3, 'LED output']];
  if (both) items.push(['seagreen', [], 2.5, '8 nm quantum well']);
  items.push(['gray', [5, 4], 1.5, 'if IQE stayed at its peak']);
  drawLegend(items, x0 + 8, y0 + 12, 162);

  plotTitles(x0, x1, y0, y1, 'LED output (flat chip, LEE = 2.0 %)', 'Current I (mA)', 'P_{out} (mW)');
}

// ---- Laser: modal gain against carrier density, with the loss line ----
function drawGainPlot(x0, x1, y0, y1, lpBulk, lpQw, both) {
  plotFrame(x0, x1, y0, y1);
  const N_MAX = 8e18, G_MIN = -60, G_MAX = 300;
  const xOfN = (n) => map(n, 0, N_MAX, x0, x1);
  const yOfG = (g) => map(g, G_MIN, G_MAX, y1, y0);

  textSize(12);
  for (let g = 0; g <= G_MAX; g += 50) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOfG(g), x1, yOfG(g));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    if (g % 100 === 0) text(g, x0 - 6, yOfG(g));
  }
  for (let k = 0; k <= 8; k += 2) {
    const xx = xOfN(k * 1e18);
    stroke('gainsboro'); strokeWeight(1);
    line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    text(k, xx, y1 + 7);
  }
  stroke('black');
  strokeWeight(1);
  line(x0, yOfG(0), x1, yOfG(0));

  // Loss: internal loss plus mirror loss
  push();
  clipTo(x0, x1, y0, y1);
  noStroke();
  fill(255, 228, 225, 170);
  rect(x0, yOfG(lpBulk.loss), x1 - x0, yOfG(0) - yOfG(lpBulk.loss));
  stroke('firebrick');
  strokeWeight(2);
  line(x0, yOfG(lpBulk.loss), x1, yOfG(lpBulk.loss));
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(x0, yOfG(ALPHA_I), x1, yOfG(ALPHA_I));
  drawingContext.setLineDash([]);

  // Modal gain curves
  const curve = (lay, col, w) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    beginShape();
    for (let k = 1; k <= 160; k++) {
      const n = N_MAX * k / 160;
      vertex(xOfN(n), yOfG(Math.max(lay.gamma * lay.gain(n), -400)));
    }
    endShape();
  };
  if (both) curve(LAYERS.qw, 'seagreen', 2.5);
  curve(LAYERS.bulk, 'royalblue', 3);
  pop();

  // Threshold points
  const mark = (lp, col) => {
    if (lp.nth > N_MAX || lp.loss > G_MAX) return;
    stroke(col);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);
    line(xOfN(lp.nth), yOfG(lp.loss), xOfN(lp.nth), y1);
    drawingContext.setLineDash([]);
    stroke('white');
    strokeWeight(1.5);
    fill(col);
    circle(xOfN(lp.nth), yOfG(lp.loss), 10);
  };
  if (both) mark(lpQw, 'seagreen');
  mark(lpBulk, 'royalblue');

  textSize(11);
  if (lpBulk.loss <= G_MAX - 14) {
    chipText('loss α_{i} + α_{m} = ' + lpBulk.loss.toFixed(1) + ' cm^{−1}', x1 - 6, yOfG(lpBulk.loss) - 10, RIGHT, 'firebrick');
  } else {
    chipText('loss ' + lpBulk.loss.toFixed(0) + ' cm^{−1} is above this scale', x1 - 6, y0 + 12, RIGHT, 'firebrick');
  }
  // Legend below the zero line, where no curve passes on the right
  const items = [['royalblue', 3, 'bulk, Γ = 0.3']];
  if (both) items.push(['seagreen', 2.5, 'well, Γ = 0.03']);
  for (let i = 0; i < items.length; i++) {
    const ly = y1 - 10 - 14 * (items.length - 1 - i);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(RIGHT, CENTER);
    text(items[i][2], x1 - 8, ly);
    const tw = textWidth('well, Γ = 0.03');
    stroke(items[i][0]);
    strokeWeight(items[i][1]);
    line(x1 - 14 - tw - 20, ly, x1 - 14 - tw, ly);
  }

  plotTitles(x0, x1, y0, y1, 'Threshold condition: modal gain = loss',
             'Carrier density n (10^{18} cm^{−3})', 'Γg (cm^{−1})');
}

// ---- Laser: light output against current ----
function drawLaserLI(x0, x1, y0, y1, c, lpBulk, lpQw, I, both) {
  plotFrame(x0, x1, y0, y1);
  const iMax = I_MAX.laser;
  let pTop = Math.max(laserPower(lpBulk, iMax), both ? laserPower(lpQw, iMax) : 0, 0.02);
  const pMax = niceCeil(pTop * 1e3 * 1.08) / 1e3;
  const xOfI = (i) => map(i, 0, iMax, x0, x1);
  const yOfP = (p) => map(p, 0, pMax, y1, y0);

  gridLinear(x0, x1, y0, y1, 0, iMax * 1e3, 20, xOfI, 1e-3, 0, pMax * 1e3, yOfP, 1e-3);

  push();
  clipTo(x0, x1, y0, y1);
  // LED of the same material for comparison
  stroke('gray');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let k = 0; k <= 50; k++) {
    const i = iMax * k / 50;
    vertex(xOfI(i), yOfP(ledPower(c, LAYERS.bulk, i)));
  }
  endShape();
  const li = (lp, col, w) => {
    stroke(col);
    strokeWeight(w);
    noFill();
    beginShape();
    vertex(xOfI(0), yOfP(0));
    vertex(xOfI(Math.min(lp.ith, iMax)), yOfP(0));
    if (lp.ith < iMax) vertex(xOfI(iMax), yOfP(laserPower(lp, iMax)));
    endShape();
  };
  if (both) li(lpQw, 'seagreen', 2.5);
  li(lpBulk, 'royalblue', 3);
  pop();

  // Threshold marker
  if (lpBulk.ith < iMax) {
    textSize(11);
    chipText('I_{th}', xOfI(lpBulk.ith), y1 - 12, CENTER, 'royalblue');
  }
  probeDot(xOfI(I), yOfP(laserPower(lpBulk, I)), y0, y1, 'royalblue');

  const items = [['royalblue', [], 3, 'laser, bulk layer']];
  if (both) items.push(['seagreen', [], 2.5, 'laser, quantum well']);
  items.push(['gray', [], 2, 'LED, same material']);
  drawLegend(items, x0 + 8, y0 + 12, 140);

  plotTitles(x0, x1, y0, y1, 'Light output against current', 'Current I (mA)', 'P_{out} (mW)');
}

// Linear grid with tick labels; values are in display units, scale converts to SI
function gridLinear(x0, x1, y0, y1, xMin, xMax, xStep, xMap, xScale, yMin, yMax, yMap, yScale) {
  textSize(12);
  for (let v = xMin; v <= xMax + 1e-9; v += xStep) {
    const xx = xMap(v * xScale);
    stroke('gainsboro'); strokeWeight(1);
    if (v > xMin) line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    text(v, xx, y1 + 7);
  }
  const yStep = niceStep((yMax - yMin) / 5);
  for (let v = yMin; v <= yMax + 1e-9; v += yStep) {
    const yy = yMap(v * yScale);
    stroke('gainsboro'); strokeWeight(1);
    if (v > yMin) line(x0, yy, x1, yy);
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(Number(v.toPrecision(6)), x0 - 6, yy);
  }
}

function probeDot(xp, yp, y0, y1, col) {
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xp, y0, xp, y1);
  drawingContext.setLineDash([]);
  stroke('white');
  strokeWeight(1.5);
  fill(col);
  circle(xp, constrain(yp, y0, y1), 10);
}

function drawLegend(items, lx, ly, w) {
  noStroke();
  fill(255, 255, 255, 220);
  rect(lx - 4, ly - 9, w, 15 * items.length + 3, 4);
  for (let i = 0; i < items.length; i++) {
    stroke(items[i][0]);
    strokeWeight(items[i][2]);
    drawingContext.setLineDash(items[i][1]);
    line(lx, ly + i * 15, lx + 20, ly + i * 15);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(LEFT, CENTER);
    text(items[i][3], lx + 25, ly + i * 15);
  }
}

// ---- Readouts ----
function readoutBox() {
  const x = 10, y = 338, w = canvasWidth - 20, h = 126;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();
  return { x: x + 12, y: y, small: canvasWidth < 720 };
}

function drawLedReadout(c, I, both) {
  const b = readoutBox();
  const layer = LAYERS.bulk;
  const J = I / LED_AREA;
  const n = densityAt(c, layer, J);
  const q = n > 0 ? iqe(c, n) : 0;
  const eqe = ETA_INJ * q * LEE_FLAT;
  const nPeak = Math.sqrt(c.A / c.C);
  const lh = 20;
  let cy = b.y + 16;

  textSize(b.small ? 12 : 13);
  fill('royalblue');
  textStyle(BOLD);
  richText('LED at I = ' + fmtmA(I) + ':  J = ' + fmtSig(J) + ' A/cm^{2},  carrier density n = ' +
           (n > 0 ? sci(n, 1) : '0') + ' cm^{−3}', b.x, cy, LEFT);
  textStyle(NORMAL);
  fill('black');
  cy += lh;
  if (n > 0) {
    const tot = c.A + c.B * n + c.C * n * n;
    richText('Recombination shares:  SRH ' + pct(c.A / tot) + '   radiative ' + pct(c.B * n / tot) +
             '   Auger ' + pct(c.C * n * n / tot), b.x, cy, LEFT);
  } else {
    richText('Raise the drive current to see the recombination shares.', b.x, cy, LEFT);
  }
  cy += lh;
  richText('EQE = η_{inj} × IQE × LEE = 0.95 × ' + q.toFixed(3) + ' × 0.0204 = ' + (100 * eqe).toFixed(2) + ' %',
           b.x, cy, LEFT);
  cy += lh;
  richText('P_{out} = EQE × (hν/q) × I = ' + (eqe).toFixed(4) + ' × 1.42 V × ' + fmtmA(I) + ' = ' +
           fmtPower(eqe * PHOTON_EV * I), b.x, cy, LEFT);
  cy += lh;
  richText('IQE peaks at n = (A/C)^{1/2} = ' + sci(nPeak, 1) + ' cm^{−3}:  IQE_{max} = B/(B + 2(AC)^{1/2}) = ' +
           pct(iqe(c, nPeak)) + ' at J = ' + fmtSig(currentDensity(c, layer, nPeak)) + ' A/cm^{2}', b.x, cy, LEFT);
  cy += lh;
  fill('dimgray');
  textSize(b.small ? 11 : 12);
  richText('Photon energy 1.42 eV (873 nm).  Area 100 µm × 100 µm.  Active layer 0.1 µm' +
           (both ? ' (blue) or 8 nm (green).' : ' thick.'), b.x, cy, LEFT);
}

function drawLaserReadout(lpBulk, lpQw, I, R, Lcm, both) {
  const b = readoutBox();
  const lh = 20;
  let cy = b.y + 16;
  textSize(b.small ? 12 : 13);
  fill('firebrick');
  textStyle(BOLD);
  richText('Mirror loss α_{m} = (1/L) ln(1/R) = ' + lpBulk.alphaM.toFixed(1) + ' cm^{−1}     total loss α_{i} + α_{m} = ' +
           lpBulk.loss.toFixed(1) + ' cm^{−1}', b.x, cy, LEFT);
  textStyle(NORMAL);
  cy += lh;

  const describeLaser = (lp, label, col) => {
    fill(col);
    textStyle(BOLD);
    const w = richText(label, b.x, cy, LEFT);
    textStyle(NORMAL);
    fill('black');
    if (!lp.reachable) {
      richText('needs g = ' + fmtSig(lp.gth) + ' cm^{−1}: beyond what this layer can supply. No lasing.',
               b.x + w + 8, cy, LEFT);
      cy += lh;
      return;
    }
    richText('g_{th} = ' + fmtSig(lp.gth) + ' cm^{−1}   n_{th} = ' + sci(lp.nth, 2) + ' cm^{−3}   J_{th} = ' +
             fmtSig(lp.jth) + ' A/cm^{2}   I_{th} = ' + fmtmA(lp.ith), b.x + w + 8, cy, LEFT);
    cy += lh;
  };
  describeLaser(lpBulk, 'Bulk:', 'royalblue');
  if (both) describeLaser(lpQw, 'Well:', 'seagreen');

  fill('black');
  if (lpBulk.reachable) {
    richText('η_{d} = η_{i} α_{m}/(α_{i} + α_{m}) = ' + lpBulk.etaD.toFixed(3) + '     slope = η_{d} hν/q = ' +
             lpBulk.slope.toFixed(2) + ' W/A (both facets)', b.x, cy, LEFT);
    cy += lh;
    const p = laserPower(lpBulk, I);
    fill('royalblue');
    textStyle(BOLD);
    richText('At I = ' + fmtmA(I) + ':  ' + (I > lpBulk.ith
      ? 'P_{out} = ' + lpBulk.slope.toFixed(2) + ' W/A × (' + fmtmA(I) + ' − ' + fmtmA(lpBulk.ith) + ') = ' + fmtPower(p)
      : 'below threshold, no laser output'), b.x, cy, LEFT);
    textStyle(NORMAL);
    cy += lh;
  }
  fill('dimgray');
  textSize(b.small ? 11 : 12);
  richText('Photon energy 1.42 eV (873 nm).  Stripe 5 µm wide.  α_{i} = 10 cm^{−1},  η_{i} = 0.95.' +
           (both ? '' : '  Bulk layer 0.1 µm, Γ = 0.3.'), b.x, b.y + 16 + 5 * lh, LEFT);
}

function drawControlLabels(mode, c, I, R, Lcm) {
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  const c2 = columnTwoX();
  const yRow = (i) => drawHeight + 55 + 35 * i;
  fill('black');
  text('Drive current I: ' + fmtmA(I), 10, yRow(0));
  fill(mode === 'laser' ? 'black' : 'gray');
  text('Mirror reflectivity R: ' + R.toFixed(2), 10, yRow(1));
  text('Cavity length L: ' + Math.round(Lcm * 1e4) + ' µm', 10, yRow(2));
  fill('black');
  richText('A (SRH): ' + sci(c.A, 1) + ' s^{−1}', c2, yRow(0), LEFT);
  richText('B (radiative): ' + sci(c.B, 1) + ' cm^{3}/s', c2, yRow(1), LEFT);
  richText('C (Auger): ' + sci(c.C, 1) + ' cm^{6}/s', c2, yRow(2), LEFT);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function columnTwoX() {
  return Math.round(canvasWidth / 2) + 8;
}

function layoutSliders() {
  const c2 = columnTwoX();
  const lw1 = 186;
  const left = [currentSlider, reflSlider, lengthSlider], right = [aSlider, bSlider, cSlider];
  for (let i = 0; i < 3; i++) {
    left[i].position(10 + lw1, drawHeight + 45 + 35 * i);
    left[i].size(c2 - 10 - lw1 - 16);
    right[i].position(c2 + labelWidth - 8, drawHeight + 45 + 35 * i);
    right[i].size(canvasWidth - (c2 + labelWidth - 8) - margin);
  }
}

// The cavity sliders only matter in laser mode
function syncSliders() {
  const laser = modeRadio.value() === 'laser';
  for (const s of [reflSlider, lengthSlider]) {
    s.elt.disabled = !laser;
    s.style('opacity', laser ? '1' : '0.4');
  }
}

function resetDefaults() {
  qwCheckbox.checked(false);
  currentSlider.value(0.5);
  reflSlider.value(0.3);
  lengthSlider.value(300);
  aSlider.value(7);
  bSlider.value(-10);
  cSlider.value(Math.log10(2e-30));
}

function pct(x) { return (100 * x).toFixed(1) + ' %'; }

function fmtmA(i) {
  const ma = i * 1e3;
  return (ma >= 100 ? Math.round(ma) : Number(ma.toPrecision(3))) + ' mA';
}

function fmtSig(x) {
  if (x === 0) return '0';
  if (x >= 1e5 || x < 0.01) return sci(x, 1);
  return x >= 100 ? Math.round(x).toString() : x.toPrecision(3);
}

function fmtPower(p) {
  if (p >= 1) return p.toPrecision(3) + ' W';
  if (p >= 1e-3) return (p * 1e3).toPrecision(3) + ' mW';
  if (p >= 1e-6) return (p * 1e6).toPrecision(3) + ' µW';
  return p === 0 ? '0 mW' : (p * 1e9).toPrecision(3) + ' nW';
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

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    const w = Math.floor(container.getBoundingClientRect().width);
    if (w > 0) canvasWidth = w;
    if (typeof cSlider !== 'undefined' && cSlider) layoutSliders();
  }
}
