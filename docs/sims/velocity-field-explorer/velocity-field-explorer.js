// Velocity-Field Relationship Explorer MicroSim
// CANVAS_HEIGHT: 632
//
// Log-log plot of drift velocity vs. electric field for electrons and holes
// in Si, GaAs and Ge, with the low-field tangent, the critical field, and a
// schematic inset of the carrier energy distribution.
//
// Models (see index.md for sources and limitations):
//   Si, Ge, GaAs holes (Caughey-Thomas form, Chapter 8):
//       v(E) = mu0 E / [1 + (E/Ec)^beta]^(1/beta),  Ec = vsat/mu0
//       beta = 2 for electrons, 1 for holes
//   GaAs electrons (transferred-electron form):
//       v(E) = [mu0 E + vsat (E/E0)^4] / [1 + (E/E0)^4],  E0 = 4 kV/cm
//   Silicon temperature dependence (200-400 K):
//       mu0 = 1400 (T/300)^-2.42, 450 (T/300)^-2.20 cm^2/V.s   (Chapter 8)
//       vsat = 1.07e7 (T/300)^-0.87, 8.4e6 (T/300)^-0.52 cm/s  (Canali et al. 1975)
//   GaAs and Ge are shown at 300 K only.
//   Inset: heated Maxwellian with T_e = T + (2/3) q tau_E v E / k_B, tau_E = 0.3 ps.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 482;              // drawing region height
let controlHeight = 150;           // control region height (4 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 230;        // label + value sit left of the sliders
let defaultTextSize = 14;

const KB_EV = 8.617333e-5;         // Boltzmann constant (eV/K)
const TAU_E = 0.3e-12;             // energy relaxation time for the inset (s)

// ---- Material parameters at 300 K ----
const MATERIALS = {
  Si: {
    name: 'Si', phononMeV: 63, hasTempModel: true,
    electrons: { mu300: 1400, muExp: 2.42, vsat300: 1.07e7, vsatExp: 0.87, beta: 2 },
    holes:     { mu300: 450,  muExp: 2.20, vsat300: 8.4e6,  vsatExp: 0.52, beta: 1 }
  },
  GaAs: {
    name: 'GaAs', phononMeV: 36, hasTempModel: false,
    electrons: { mu300: 8500, vsat300: 8.0e6, transferred: true, e0: 4000 },
    holes:     { mu300: 400,  vsat300: 1.0e7, beta: 1 }
  },
  Ge: {
    name: 'Ge', phononMeV: 37, hasTempModel: false,
    electrons: { mu300: 3900, vsat300: 6.0e6, beta: 2 },
    holes:     { mu300: 1900, vsat300: 6.0e6, beta: 1 }
  }
};

const E_MIN_EXP = 2, E_MAX_EXP = 6;   // field axis: 1e2 to 1e6 V/cm
const V_MIN_EXP = 5, V_MAX_EXP = 8;   // velocity axis: 1e5 to 1e8 cm/s

// ---- Controls ----
let materialSelect, carrierSelect, tempSlider, fieldSlider, criticalCheckbox, tangentCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  materialSelect = createSelect();
  materialSelect.option('Si');
  materialSelect.option('GaAs');
  materialSelect.option('Ge');
  materialSelect.selected('Si');
  materialSelect.position(72, drawHeight + 9);
  materialSelect.changed(syncTemperatureControl);

  carrierSelect = createSelect();
  carrierSelect.option('Electrons', 'electrons');
  carrierSelect.option('Holes', 'holes');
  carrierSelect.selected('electrons');
  carrierSelect.position(212, drawHeight + 9);

  criticalCheckbox = createCheckbox(' Show critical field marker', true);
  criticalCheckbox.position(10, drawHeight + 44);
  criticalCheckbox.style('white-space', 'nowrap');

  tangentCheckbox = createCheckbox(' Show low-field tangent line', true);
  tangentCheckbox.position(225, drawHeight + 44);
  tangentCheckbox.style('white-space', 'nowrap');

  tempSlider = createSlider(200, 400, 300, 1);
  tempSlider.position(sliderLeftMargin, drawHeight + 80);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);

  // log10 of the electric field in V/cm, from 100 V/cm to about 316 kV/cm
  fieldSlider = createSlider(2, 5.5, 4, 0.01);
  fieldSlider.position(sliderLeftMargin, drawHeight + 115);
  fieldSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Log-log plot of carrier drift velocity versus electric field for ' +
    'electrons or holes in silicon, gallium arsenide or germanium. The curve ' +
    'rises linearly at low field and flattens at the saturation velocity. ' +
    'Optional overlays show the low-field tangent line and the critical ' +
    'field. A panel lists the low-field mobility, saturation velocity, ' +
    'critical field and the drift velocity at the selected field. An inset ' +
    'sketches how the carrier energy distribution broadens at high field.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Parameters of the selected carrier at lattice temperature T (K)
function carrierParams(materialKey, carrierKey, T) {
  const mat = MATERIALS[materialKey];
  const c = mat[carrierKey];
  const Teff = mat.hasTempModel ? T : 300;
  const r = Teff / 300;
  const mu0 = c.muExp ? c.mu300 * Math.pow(r, -c.muExp) : c.mu300;
  const vsat = c.vsatExp ? c.vsat300 * Math.pow(r, -c.vsatExp) : c.vsat300;
  return { mu0: mu0, vsat: vsat, beta: c.beta, transferred: !!c.transferred,
           e0: c.e0, ec: vsat / mu0, T: Teff, phononMeV: mat.phononMeV };
}

// Drift velocity (cm/s) at field E (V/cm)
function driftVelocity(p, E) {
  if (p.transferred) {
    const r4 = Math.pow(E / p.e0, 4);
    return (p.mu0 * E + p.vsat * r4) / (1 + r4);
  }
  return p.mu0 * E / Math.pow(1 + Math.pow(E / p.ec, p.beta), 1 / p.beta);
}

// Two-piece linear model: v = mu0 E below the critical field, vsat above it
function twoPieceVelocity(p, E) {
  return Math.min(p.mu0 * E, p.vsat);
}

// Field of maximum velocity for the transferred-electron curve
function peakField(p) {
  let best = 100, bestV = 0;
  for (let i = 0; i <= 400; i++) {
    const E = Math.pow(10, 2 + 4 * i / 400);
    const v = driftVelocity(p, E);
    if (v > bestV) { bestV = v; best = E; }
  }
  return { field: best, velocity: bestV };
}

// Carrier temperature from a simple energy balance (illustrative)
function carrierTemperature(p, E) {
  const v = driftVelocity(p, E);
  return p.T + (2 / 3) * (v * E * TAU_E) / KB_EV;   // v E has units of V/s
}

function regimeName(p, E) {
  if (p.transferred) {
    if (E < peakField(p).field) return 'Rising toward the velocity peak';
    return driftVelocity(p, E) > 1.1 * p.vsat ? 'Negative differential mobility'
                                              : 'Saturated (past the velocity peak)';
  }
  const x = E / p.ec;
  if (x < 0.3) return 'Linear (v ≈ μ₀E)';
  if (x < 3) return 'Transition';
  return 'Velocity saturation';
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const matKey = materialSelect.value();
  const carKey = carrierSelect.value();
  const T = tempSlider.value();
  const E = Math.pow(10, fieldSlider.value());
  const p = carrierParams(matKey, carKey, T);
  const otherKey = carKey === 'electrons' ? 'holes' : 'electrons';
  const pOther = carrierParams(matKey, otherKey, T);
  const mainCol = carKey === 'electrons' ? color('royalblue') : color('crimson');
  const otherCol = carKey === 'electrons' ? color(220, 20, 60, 110) : color(65, 105, 225, 110);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry
  const panelW = canvasWidth >= 700 ? 244 : 204;
  const panelX = canvasWidth - panelW - 10;
  const x0 = 62, x1 = panelX - 16;
  const y0 = 64, y1 = 404;
  const xOfE = (e) => map(Math.log10(e), E_MIN_EXP, E_MAX_EXP, x0, x1);
  const yOfV = (v) => map(Math.log10(v), V_MIN_EXP, V_MAX_EXP, y1, y0);

  // Plot background
  stroke('silver');
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  drawRegimeBands(p, x0, x1, y0, y1, xOfE);

  // Grid
  textSize(12);
  for (let e = E_MIN_EXP; e <= E_MAX_EXP; e++) {
    const xx = xOfE(Math.pow(10, e));
    stroke('gainsboro'); strokeWeight(1);
    line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    noStroke(); fill('black');
    richText('10^{' + e + '}', xx, y1 + 14, CENTER);
  }
  for (let e = V_MIN_EXP; e <= V_MAX_EXP; e++) {
    const yy = yOfV(Math.pow(10, e));
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yy, x1, yy);
    noStroke(); fill('black');
    richText('10^{' + e + '}', x0 - 6, yy, RIGHT);
  }

  // Curves, clipped to the plot rectangle
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();

  if (tangentCheckbox.checked()) {
    stroke('dimgray');
    strokeWeight(1.5);
    drawingContext.setLineDash([7, 5]);
    line(xOfE(1e2), yOfV(p.mu0 * 1e2), xOfE(1e6), yOfV(p.mu0 * 1e6));
    drawingContext.setLineDash([]);
  }
  if (criticalCheckbox.checked()) {
    stroke('darkorange');
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    line(x0, yOfV(p.vsat), x1, yOfV(p.vsat));
    const eMark = p.transferred ? peakField(p).field : p.ec;
    line(xOfE(eMark), y0, xOfE(eMark), y1);
    drawingContext.setLineDash([]);
  }

  noFill();
  stroke(otherCol);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i <= 160; i++) {
    const e = Math.pow(10, E_MIN_EXP + (E_MAX_EXP - E_MIN_EXP) * i / 160);
    vertex(xOfE(e), yOfV(driftVelocity(pOther, e)));
  }
  endShape();
  stroke(mainCol);
  strokeWeight(3.5);
  beginShape();
  for (let i = 0; i <= 160; i++) {
    const e = Math.pow(10, E_MIN_EXP + (E_MAX_EXP - E_MIN_EXP) * i / 160);
    vertex(xOfE(e), yOfV(driftVelocity(p, e)));
  }
  endShape();

  // Probe point
  const vNow = driftVelocity(p, E);
  stroke('dimgray');
  strokeWeight(1);
  line(xOfE(E), y0, xOfE(E), y1);
  stroke('white');
  strokeWeight(1.5);
  fill(mainCol);
  circle(xOfE(E), yOfV(vNow), 11);
  pop();

  // Overlay labels
  noStroke();
  textSize(12);
  if (criticalCheckbox.checked()) {
    fill('chocolate');
    richText('v_{sat}', x0 + 6, yOfV(p.vsat) - 9, LEFT);
    const eMark = p.transferred ? peakField(p).field : p.ec;
    richText(p.transferred ? 'E_{peak}' : 'E_{c}', xOfE(eMark) + 5, y1 - 10, LEFT);
  }
  if (tangentCheckbox.checked()) {
    fill('dimgray');
    // label sits to the left of the line, just below the top of the plot
    const vLabel = Math.pow(10, V_MAX_EXP - 0.22);
    const lx = constrain(xOfE(Math.min(vLabel / p.mu0, 1e6)) - 10, x0 + 62, x1 - 4);
    richText('v = μ_{0}E', lx, yOfV(vLabel), RIGHT);
  }

  // Direct labels for the two curves at the right edge of the plot
  textSize(12);
  const vEndMain = driftVelocity(p, 1e6), vEndOther = driftVelocity(pOther, 1e6);
  let yMain = yOfV(vEndMain) + 13, yOther = yOfV(vEndOther) + 13;
  if (Math.abs(yMain - yOther) < 14) {
    if (vEndMain >= vEndOther) { yMain = yOfV(vEndMain) - 11; } else { yOther = yOfV(vEndOther) - 11; }
  }
  fill(mainCol);
  textStyle(BOLD);
  textAlign(RIGHT, CENTER);
  text(carKey, x1 - 6, yMain);
  textStyle(NORMAL);
  fill(carKey === 'electrons' ? 'crimson' : 'royalblue');
  text(otherKey, x1 - 6, yOther);

  // Frame and axis titles
  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('Electric field (V/cm)', (x0 + x1) / 2, y1 + 26);
  push();
  translate(15, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Drift velocity (cm/s)', 0, 0);
  pop();

  drawInfoPanel(panelX, 44, panelW, 218, p, matKey, carKey, E, vNow);
  drawEnergyInset(panelX, 270, panelW, 200, p, E);
  drawModelNote(matKey);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Velocity-Field Relationship Explorer', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(matKey, T, E);
}

// Light bands and labels for the transport regimes of the selected carrier
function drawRegimeBands(p, x0, x1, y0, y1, xOfE) {
  let bands;
  if (p.transferred) {
    const ep = peakField(p).field;
    bands = [
      { a: 1e2, b: ep, t: 'linear rise', col: [165, 214, 167, 70] },
      { a: ep, b: 1e6, t: 'negative differential mobility', col: [255, 204, 128, 80] }
    ];
  } else {
    bands = [
      { a: 1e2, b: 0.3 * p.ec, t: 'linear', col: [165, 214, 167, 70] },
      { a: 0.3 * p.ec, b: 3 * p.ec, t: 'transition', col: [255, 245, 157, 90] },
      { a: 3 * p.ec, b: 1e6, t: 'saturation', col: [255, 204, 128, 80] }
    ];
  }
  noStroke();
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  for (const b of bands) {
    const xa = constrain(xOfE(Math.max(b.a, 1e2)), x0, x1);
    const xb = constrain(xOfE(Math.min(b.b, 1e6)), x0, x1);
    if (xb - xa < 1) continue;
    fill(b.col[0], b.col[1], b.col[2], b.col[3]);
    rect(xa, y0, xb - xa, y1 - y0);
    if (xb - xa > textWidth(b.t) + 6) {
      fill('dimgray');
      text(b.t, (xa + xb) / 2, y0 - 4);
    }
  }
  textStyle(NORMAL);
}

function drawInfoPanel(x, y, w, h, p, matKey, carKey, E, vNow) {
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

  fill(carKey === 'electrons' ? 'royalblue' : 'crimson');
  textStyle(BOLD);
  textSize(ts + 1);
  text(matKey + ' ' + carKey + ' at ' + p.T + ' K', x + pad, cy);
  textStyle(NORMAL);
  fill('black');
  textSize(ts);
  cy += 21;
  richText('μ_{0} = ' + Math.round(p.mu0).toLocaleString('en-US') + ' cm^{2}/V·s', x + pad, cy, LEFT);
  cy += 19;
  richText('v_{sat} = ' + sci(p.vsat, 2) + ' cm/s', x + pad, cy, LEFT);
  cy += 19;
  if (p.transferred) {
    const pk = peakField(p);
    richText('E_{peak} = ' + fmtField(pk.field), x + pad, cy, LEFT);
    cy += 19;
    richText('v_{peak} = ' + sci(pk.velocity, 2) + ' cm/s', x + pad, cy, LEFT);
  } else {
    richText('E_{c} = v_{sat}/μ_{0} = ' + fmtField(p.ec), x + pad, cy, LEFT);
  }
  cy += 27;

  textStyle(BOLD);
  textSize(ts + 1);
  text('At E = ' + fmtField(E), x + pad, cy);
  cy += 21;
  fill(carKey === 'electrons' ? 'royalblue' : 'crimson');
  textSize(ts + 2);
  richText('v_{d} = ' + sci(vNow, 2) + ' cm/s', x + pad, cy, LEFT);
  textStyle(NORMAL);
  fill('black');
  textSize(ts);
  cy += 21;
  if (p.transferred) {
    richText('μ_{0}E would give ' + sci(p.mu0 * E, 2) + ' cm/s', x + pad, cy, LEFT);
  } else {
    richText('Two-piece model: ' + sci(twoPieceVelocity(p, E), 2) + ' cm/s', x + pad, cy, LEFT);
  }
  cy += 19;
  if (!p.transferred) {
    richText('E/E_{c} = ' + (E / p.ec).toPrecision(3) + ',  v_{d}/v_{sat} = ' + (vNow / p.vsat).toFixed(2), x + pad, cy, LEFT);
    cy += 22;
  } else {
    cy += 3;
  }
  textStyle(BOLD);
  fill('chocolate');
  textSize(small && p.transferred ? 11.5 : ts);
  text(regimeName(p, E), x + pad, cy);
  textStyle(NORMAL);
}

// Schematic inset: Maxwellian energy distribution at the lattice temperature
// and at the carrier temperature from the energy balance
function drawEnergyInset(x, y, w, h, p, E) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const small = w < 230;
  fill('black');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(small ? 12 : 13);
  text('Carrier energy distribution', x + 10, y + 15);
  textStyle(NORMAL);

  const Te = carrierTemperature(p, E);
  const ix0 = x + 14, ix1 = x + w - 14;
  const iy0 = y + 62, iy1 = y + h - 34;
  const eMax = 0.6;                         // eV
  const xOfEn = (en) => map(en, 0, eMax, ix0, ix1);

  stroke('silver');
  fill('white');
  rect(ix0, iy0, ix1 - ix0, iy1 - iy0);

  // Optical phonon energy marker
  const ePh = p.phononMeV / 1000;
  stroke('seagreen');
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(xOfEn(ePh), iy0, xOfEn(ePh), iy1);
  drawingContext.setLineDash([]);

  // Peak-normalized Maxwellian: f ~ sqrt(e) exp(-e/kT), maximum at kT/2
  function maxwell(en, temp) {
    const kT = KB_EV * temp;
    const ep = kT / 2;
    return Math.sqrt(en / ep) * Math.exp(-(en - ep) / kT);
  }
  noFill();
  strokeWeight(2);
  stroke('gray');
  beginShape();
  for (let i = 0; i <= 150; i++) {
    const en = eMax * Math.pow(i / 150, 2);
    vertex(xOfEn(en), map(maxwell(en, p.T), 0, 1.08, iy1, iy0));
  }
  endShape();
  stroke('orangered');
  strokeWeight(2.5);
  beginShape();
  for (let i = 0; i <= 150; i++) {
    const en = eMax * Math.pow(i / 150, 2);
    vertex(xOfEn(en), map(maxwell(en, Te), 0, 1.08, iy1, iy0));
  }
  endShape();

  // Legend lines above the inset plot
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  fill('dimgray');
  text('lattice: ' + p.T + ' K', x + 14, y + 35);
  fill('orangered');
  richText('carriers: T_{e} ≈ ' + fmtTemp(Te), x + 14, y + 51, LEFT);
  fill('seagreen');
  textAlign(RIGHT, CENTER);
  text('ħω = ' + p.phononMeV + ' meV', x + w - 12, y + 35);

  // Energy axis
  fill('black');
  textAlign(CENTER, TOP);
  for (const en of [0, 0.2, 0.4, 0.6]) {
    text(en.toFixed(1), xOfEn(en), iy1 + 3);
  }
  text('Kinetic energy (eV), schematic', (ix0 + ix1) / 2, iy1 + 17);
}

function drawModelNote(matKey) {
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textLeading(15);
  fill('dimgray');
  const note = MATERIALS[matKey].hasTempModel
    ? 'Thin curve: the other carrier type in the same material.'
    : 'Thin curve: the other carrier type. Temperature dependence is modeled for silicon only, so ' +
      matKey + ' is shown at 300 K.';
  text(note, 10, 448, canvasWidth - (canvasWidth >= 700 ? 244 : 204) - 30, 32);
}

function drawControlLabels(matKey, T, E) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Material:', 10, drawHeight + 20);
  text('Carrier:', 156, drawHeight + 20);
  fill(MATERIALS[matKey].hasTempModel ? 'black' : 'gray');
  text('Temperature: ' + (MATERIALS[matKey].hasTempModel ? T : 300) + ' K', 10, drawHeight + 90);
  fill('black');
  text('Electric field: ' + fmtField(E), 10, drawHeight + 125);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// The temperature slider only acts on silicon
function syncTemperatureControl() {
  const active = MATERIALS[materialSelect.value()].hasTempModel;
  tempSlider.elt.disabled = !active;
  tempSlider.style('opacity', active ? '1' : '0.4');
}

function fmtField(E) {
  if (E >= 1000) return (E / 1000).toPrecision(3) + ' kV/cm';
  return Math.round(E) + ' V/cm';
}

function fmtTemp(T) {
  if (T >= 10000) return Math.round(T / 1000) + ',000 K';
  if (T >= 1000) return (Math.round(T / 10) * 10).toLocaleString('en-US') + ' K';
  return Math.round(T) + ' K';
}

// Scientific notation in richText markup, e.g. "8.50 × 10^{6}"
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
    if (typeof tempSlider !== 'undefined' && tempSlider) {
      tempSlider.size(canvasWidth - sliderLeftMargin - margin);
      fieldSlider.size(canvasWidth - sliderLeftMargin - margin);
    }
  }
}
