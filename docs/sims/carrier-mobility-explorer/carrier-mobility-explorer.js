// Carrier Mobility Explorer MicroSim
// CANVAS_HEIGHT: 668
//
// Two log-log plots for silicon: mobility vs. temperature (50-600 K) at the
// selected doping, and mobility vs. doping (1e14-1e19 cm^-3) at the probe
// temperature. Each scattering mechanism has its own partial mobility, and
// the total follows Matthiessen's rule: 1/mu = sum of 1/mu_i.
//
// Semi-empirical model (see index.md for details and limitations):
//   Acoustic phonons:      mu_ac ~ T^(-3/2)
//   Optical / intervalley: mu ~ T^(-1/2) [exp(theta/T) - 1]   (single phonon)
//       electrons: intervalley phonons, theta = 630 K
//       holes:     optical phonons, theta = 731 K (63 meV)
//   The two phonon prefactors are set so the lattice mobility at 300 K equals
//   the low-doping value of the fit below and its slope equals the chapter's
//   power law (T^-2.42 electrons, T^-2.20 holes).
//   Ionized impurities:    mu_ii(T, N) = mu_ii(300 K, N) (T/300)^(3/2), where
//       mu_ii(300 K, N) is whatever Matthiessen's rule needs to reproduce the
//       Caughey-Thomas-form fit  mu = mu_min + (mu_0 - mu_min)/(1 + (N/N_ref)^a)
//       electrons: 65, 1330 cm^2/V.s, 1.26e17 cm^-3, 0.85  (Chapter 8)
//       holes:     54.3, 461.2 cm^2/V.s, 2.35e17 cm^-3, 0.88  (Arora et al. 1982)

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 518;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 230;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Model parameters ----
const CARRIERS = {
  electrons: {
    label: 'Electrons',
    muMin: 65, mu0: 1330, nRef: 1.26e17, alpha: 0.85,   // Chapter 8 fit, 300 K
    latticeExponent: 2.42,                              // mu_L ~ T^-2.42
    phonon: 'intervalley', theta: 630                   // second phonon process
  },
  holes: {
    label: 'Holes',
    muMin: 54.3, mu0: 461.2, nRef: 2.35e17, alpha: 0.88, // Arora et al. fit, 300 K
    latticeExponent: 2.20,                               // mu_L ~ T^-2.20
    phonon: 'optical', theta: 731
  }
};

const MECHANISMS = [
  { key: 'acoustic',    name: 'Acoustic phonon',  short: 'Acoustic',     col: 'royalblue' },
  { key: 'optical',     name: 'Optical phonon',   short: 'Optical',      col: 'darkorange' },
  { key: 'intervalley', name: 'Intervalley',      short: 'Intervalley',  col: 'seagreen' },
  { key: 'impurity',    name: 'Ionized impurity', short: 'Ionized imp.', col: 'crimson' }
];

const T_MIN = 50, T_MAX = 600;         // K
const N_MIN_EXP = 14, N_MAX_EXP = 19;  // log10(cm^-3)
const MU_MIN_EXP = 1, MU_MAX_EXP = 6;  // log10(cm^2/V.s)

// ---- Controls ----
let carrierSelect, dopingSlider, tempSlider, resetButton;
let checkboxes = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  carrierSelect = createSelect();
  carrierSelect.option('Electrons', 'electrons');
  carrierSelect.option('Holes', 'holes');
  carrierSelect.selected('electrons');
  carrierSelect.position(68, drawHeight + 9);
  carrierSelect.changed(syncCheckboxAvailability);

  resetButton = createButton('Reset');
  resetButton.position(175, drawHeight + 8);
  resetButton.mousePressed(resetDefaults);

  // One checkbox per scattering mechanism; the label color is the curve color
  let cx = 10;
  for (const m of MECHANISMS) {
    const cb = createCheckbox(' ' + m.name, true);
    cb.position(cx, drawHeight + 44);
    cb.style('color', m.col);
    cb.style('font-weight', 'bold');
    cb.style('font-size', '14px');
    cb.style('white-space', 'nowrap');
    checkboxes[m.key] = cb;
    cx += m.key === 'intervalley' ? 108 : 140;
  }

  // log10 of the ionized impurity concentration (cm^-3)
  dopingSlider = createSlider(N_MIN_EXP, N_MAX_EXP, 16, 0.05);
  dopingSlider.position(sliderLeftMargin, drawHeight + 80);
  dopingSlider.size(canvasWidth - sliderLeftMargin - margin);

  tempSlider = createSlider(T_MIN, T_MAX, 300, 1);
  tempSlider.position(sliderLeftMargin, drawHeight + 115);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);

  syncCheckboxAvailability();

  describe('Two log-log plots of carrier mobility in silicon. The left plot ' +
    'shows mobility versus temperature from 50 to 600 kelvin for the selected ' +
    'doping. The right plot shows mobility versus doping from ten to the ' +
    'fourteenth to ten to the nineteenth per cubic centimeter at the probe ' +
    'temperature. Colored curves give the partial mobility of each scattering ' +
    'mechanism and a thick black curve gives the total from Matthiessen\'s ' +
    'rule. A strip below the plots lists each partial mobility and its share ' +
    'of the total scattering. Checkboxes switch mechanisms on and off.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Shape of a single-phonon (optical or intervalley) limited mobility
function phononShape(T, theta) {
  return Math.pow(T, -0.5) * (Math.exp(theta / T) - 1);
}

// Prefactors of the two lattice terms at 300 K. They are chosen so that
// Matthiessen's rule gives mu0 at 300 K with logarithmic slope -latticeExponent.
function latticePrefactors(c) {
  const x = c.theta / 300;
  const slopePhonon = 0.5 + x * Math.exp(x) / (Math.exp(x) - 1);   // |d ln mu / d ln T|
  const wPhonon = (c.latticeExponent - 1.5) / (slopePhonon - 1.5); // share of 1/mu at 300 K
  return { acoustic300: c.mu0 / (1 - wPhonon), phonon300: c.mu0 / wPhonon };
}

// 300 K fit of mobility vs. ionized impurity concentration
function fit300(c, N) {
  return c.muMin + (c.mu0 - c.muMin) / (1 + Math.pow(N / c.nRef, c.alpha));
}

// Partial mobilities (cm^2/V.s) at temperature T and impurity concentration N.
// A mechanism that does not act on this carrier is returned as null.
function partialMobilities(carrierKey, T, N) {
  const c = CARRIERS[carrierKey];
  const pre = latticePrefactors(c);
  const acoustic = pre.acoustic300 * Math.pow(T / 300, -1.5);
  const phonon = pre.phonon300 * phononShape(T, c.theta) / phononShape(300, c.theta);
  const mu300 = fit300(c, N);
  const impurity300 = 1 / (1 / mu300 - 1 / c.mu0);
  const impurity = impurity300 * Math.pow(T / 300, 1.5);
  return {
    acoustic: acoustic,
    optical: c.phonon === 'optical' ? phonon : null,
    intervalley: c.phonon === 'intervalley' ? phonon : null,
    impurity: impurity
  };
}

// Matthiessen's rule over the mechanisms that are both active and switched on
function totalMobility(parts, enabled) {
  let inv = 0;
  for (const m of MECHANISMS) {
    if (parts[m.key] !== null && enabled[m.key]) inv += 1 / parts[m.key];
  }
  return inv > 0 ? 1 / inv : Infinity;
}

function enabledMap() {
  const e = {};
  for (const m of MECHANISMS) e[m.key] = checkboxes[m.key].checked();
  return e;
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const carrierKey = carrierSelect.value();
  const N = Math.pow(10, dopingSlider.value());
  const T = tempSlider.value();
  const enabled = enabledMap();

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry: two plots side by side
  const leftPad = 58, gap = 62, rightPad = 16;
  const plotW = (canvasWidth - leftPad - gap - rightPad) / 2;
  const y0 = 84, y1 = 332;
  const lx0 = leftPad, lx1 = leftPad + plotW;
  const rx0 = lx1 + gap, rx1 = rx0 + plotW;
  const yOfMu = (mu) => map(Math.log10(mu), MU_MIN_EXP, MU_MAX_EXP, y1, y0);
  const xOfT = (t) => map(Math.log10(t), Math.log10(T_MIN), Math.log10(T_MAX), lx0, lx1);
  const xOfN = (n) => map(Math.log10(n), N_MIN_EXP, N_MAX_EXP, rx0, rx1);

  drawPlotFrame(lx0, lx1, y0, y1, yOfMu);
  drawPlotFrame(rx0, rx1, y0, y1, yOfMu);

  // ---- Left plot: mobility vs. temperature at doping N ----
  textSize(12);
  for (const t of [50, 100, 200, 300, 400, 600]) {
    stroke('gainsboro'); strokeWeight(1);
    line(xOfT(t), y0, xOfT(t), y1);
    stroke('black');
    line(xOfT(t), y1, xOfT(t), y1 + 4);
    noStroke(); fill('black'); textAlign(CENTER, TOP);
    text(t, xOfT(t), y1 + 7);
  }
  const tPts = [];
  for (let i = 0; i <= 110; i++) tPts.push(T_MIN * Math.pow(T_MAX / T_MIN, i / 110));
  drawCurves(lx0, lx1, y0, y1, tPts, xOfT, yOfMu,
             (t) => partialMobilities(carrierKey, t, N), enabled);
  drawProbe(xOfT(T), y0, y1, yOfMu, partialMobilities(carrierKey, T, N), enabled);

  // ---- Right plot: mobility vs. doping at temperature T ----
  for (let e = N_MIN_EXP; e <= N_MAX_EXP; e++) {
    const xx = map(e, N_MIN_EXP, N_MAX_EXP, rx0, rx1);
    stroke('gainsboro'); strokeWeight(1);
    line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black');
    textSize(12);
    richText('10^{' + e + '}', xx, y1 + 13, CENTER);
  }
  const nPts = [];
  for (let i = 0; i <= 100; i++) nPts.push(Math.pow(10, N_MIN_EXP + (N_MAX_EXP - N_MIN_EXP) * i / 100));
  drawCurves(rx0, rx1, y0, y1, nPts, xOfN, yOfMu,
             (n) => partialMobilities(carrierKey, T, n), enabled);
  drawProbe(xOfN(N), y0, y1, yOfMu, partialMobilities(carrierKey, T, N), enabled);

  // Frames on top of the curves
  stroke('black'); strokeWeight(1); noFill();
  rect(lx0, y0, lx1 - lx0, y1 - y0);
  rect(rx0, y0, rx1 - rx0, y1 - y0);

  // Plot captions and axis titles
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  const tight = plotW < 275;
  richText((tight ? 'vs. temperature, N = ' : 'Mobility vs. temperature at N = ') + sci(N, 1) + ' cm^{−3}',
           (lx0 + lx1) / 2, y0 - 12, CENTER);
  richText((tight ? 'vs. doping, T = ' : 'Mobility vs. doping at T = ') + T + ' K',
           (rx0 + rx1) / 2, y0 - 12, CENTER);
  textStyle(NORMAL);
  textSize(13);
  textAlign(CENTER, TOP);
  text('Temperature (K)', (lx0 + lx1) / 2, y1 + 25);
  richText('Ionized impurity concentration (cm^{−3})', (rx0 + rx1) / 2, y1 + 33, CENTER);
  push();
  translate(14, (y0 + y1) / 2);
  rotate(-HALF_PI);
  richText('Mobility (cm^{2}/V·s)', 0, 0, CENTER);
  pop();

  drawTotalLegend();
  drawReadoutStrip(carrierKey, T, N, enabled);
  drawModelNote(T, N);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Carrier Mobility Explorer: Silicon', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(N, T);
}

function drawPlotFrame(x0, x1, y0, y1, yOfMu) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
  textSize(12);
  for (let e = MU_MIN_EXP; e <= MU_MAX_EXP; e++) {
    const y = yOfMu(Math.pow(10, e));
    stroke('gainsboro');
    line(x0, y, x1, y);
    noStroke();
    fill('black');
    richText('10^{' + e + '}', x0 - 6, y, RIGHT);
  }
}

// Draw each enabled partial mobility and the Matthiessen total, clipped to the plot
function drawCurves(x0, x1, y0, y1, xs, xMap, yOfMu, partsAt, enabled) {
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();

  const all = xs.map(partsAt);
  noFill();
  for (const m of MECHANISMS) {
    if (all[0][m.key] === null || !enabled[m.key]) continue;
    stroke(m.col);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < xs.length; i++) {
      vertex(xMap(xs[i]), yOfMu(Math.min(all[i][m.key], 1e9)));
    }
    endShape();
  }
  stroke('black');
  strokeWeight(3.5);
  beginShape();
  let any = false;
  for (let i = 0; i < xs.length; i++) {
    const tot = totalMobility(all[i], enabled);
    if (isFinite(tot)) { vertex(xMap(xs[i]), yOfMu(Math.min(tot, 1e9))); any = true; }
  }
  endShape();
  pop();

  if (!any) {
    noStroke();
    fill('firebrick');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('No scattering switched on:\nmobility would be unlimited.', (x0 + x1) / 2, (y0 + y1) / 2);
  }
}

function drawProbe(x, y0, y1, yOfMu, parts, enabled) {
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(x, y0, x, y1);
  drawingContext.setLineDash([]);
  const tot = totalMobility(parts, enabled);
  if (isFinite(tot) && tot < Math.pow(10, MU_MAX_EXP) && tot > Math.pow(10, MU_MIN_EXP)) {
    stroke('white');
    strokeWeight(1.5);
    fill('black');
    circle(x, yOfMu(tot), 10);
  }
}

// Legend row between the title and the plots
function drawTotalLegend() {
  const label = 'Total mobility (Matthiessen\'s rule)';
  const label2 = 'Colored curves: one scattering mechanism each';
  textSize(13);
  const narrow = canvasWidth < 640;
  const w = 34 + textWidth(label) + (narrow ? 0 : 28 + textWidth(label2));
  let x = canvasWidth / 2 - w / 2;
  const y = 46;
  stroke('black');
  strokeWeight(3.5);
  line(x, y, x + 26, y);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(label, x + 34, y);
  if (!narrow) {
    fill('dimgray');
    text(label2, x + 34 + textWidth(label) + 28, y);
  }
}

// Model note under the readout strip; becomes a caution where the simple
// ionized-impurity law is least reliable
function drawModelNote(T, N) {
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textLeading(15);
  let note;
  if (N >= 1e18 && T < 250) {
    fill('firebrick');
    note = 'Caution: at heavy doping and low temperature the carriers are degenerate, and real ' +
           'mobility stays higher than the three-halves power law for impurity scattering predicts.';
  } else {
    fill('dimgray');
    note = 'Model: partial mobilities are calibrated to silicon at 300 K. Away from room ' +
           'temperature the curves show the trends, not measured values.';
  }
  text(note, 12, 484, canvasWidth - 24, 32);
}

// Strip under the plots: partial mobilities at the probe point and each
// mechanism's share of the total scattering (share of 1/mu)
function drawReadoutStrip(carrierKey, T, N, enabled) {
  const x = 10, y = 380, w = canvasWidth - 20, h = 98;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const parts = partialMobilities(carrierKey, T, N);
  const tot = totalMobility(parts, enabled);
  const small = canvasWidth < 680;

  // Header: total mobility and the dominant mechanism
  let dominant = null;
  for (const m of MECHANISMS) {
    if (parts[m.key] === null || !enabled[m.key]) continue;
    if (dominant === null || parts[m.key] < parts[dominant.key]) dominant = m;
  }
  fill('black');
  textStyle(BOLD);
  textSize(small ? 13 : 14);
  const head = CARRIERS[carrierKey].label + ' at ' + T + ' K:  μ = ' +
               (isFinite(tot) ? fmtMu(tot) + ' cm^{2}/V·s' : 'unlimited');
  const hw = richText(head, x + 12, y + 17, LEFT);
  if (dominant) {
    fill(dominant.col);
    textSize(small ? 12 : 14);
    text((small ? 'Limited by: ' : 'Dominant scattering: ') + dominant.name.toLowerCase(),
         x + 12 + hw + (small ? 12 : 24), y + 17);
  }
  textStyle(NORMAL);

  // One column per mechanism
  const colW = (w - 24) / MECHANISMS.length;
  for (let i = 0; i < MECHANISMS.length; i++) {
    const m = MECHANISMS[i];
    const cx = x + 12 + i * colW;
    const active = parts[m.key] !== null;
    const on = active && enabled[m.key];
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(small ? 12 : 13);
    fill(active ? m.col : 'gray');
    text(small ? m.short : m.name, cx, y + 42);
    textStyle(NORMAL);
    textSize(12);
    fill(on ? 'black' : 'gray');
    if (!active) {
      text('not active for', cx, y + 60);
      text(carrierKey === 'electrons' ? 'electrons in Si' : 'holes in Si', cx, y + 76);
    } else if (!on) {
      text('switched off', cx, y + 60);
    } else {
      richText('μ = ' + fmtMu(parts[m.key]), cx, y + 60, LEFT);
      const share = 100 * tot / parts[m.key];
      text(share.toFixed(share < 9.95 ? 1 : 0) + ' % of 1/μ', cx, y + 76);
      // share bar
      fill('gainsboro');
      rect(cx, y + 86, colW - 16, 5, 2);
      fill(m.col);
      rect(cx, y + 86, (colW - 16) * share / 100, 5, 2);
    }
  }
}

function drawControlLabels(N, T) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Carrier:', 10, drawHeight + 20);
  richText('Doping: ' + sci(N, 1) + ' cm^{−3}', 10, drawHeight + 90, LEFT);
  text('Temperature: ' + T + ' K', 10, drawHeight + 125);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Grey out the checkbox of a mechanism that does not act on the selected carrier
function syncCheckboxAvailability() {
  const c = CARRIERS[carrierSelect.value()];
  for (const m of MECHANISMS) {
    const inactive = (m.key === 'optical' && c.phonon !== 'optical') ||
                     (m.key === 'intervalley' && c.phonon !== 'intervalley');
    const input = checkboxes[m.key].elt.querySelector('input') || checkboxes[m.key].elt;
    input.disabled = inactive;
    checkboxes[m.key].style('opacity', inactive ? '0.4' : '1');
  }
}

function resetDefaults() {
  carrierSelect.selected('electrons');
  dopingSlider.value(16);
  tempSlider.value(300);
  for (const m of MECHANISMS) checkboxes[m.key].checked(true);
  syncCheckboxAvailability();
}

// Mobility with a sensible number of digits
function fmtMu(mu) {
  if (mu >= 1e6) return sci(mu, 1);
  if (mu >= 100) return Math.round(mu).toLocaleString('en-US');
  return mu.toFixed(1);
}

// Scientific notation in richText markup, e.g. "1.0 × 10^{16}"
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
