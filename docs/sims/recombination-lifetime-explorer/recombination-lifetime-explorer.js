// Recombination Lifetime Explorer MicroSim
// CANVAS_HEIGHT: 627
//
// Three linked panels for an n-type semiconductor at 300 K:
//   left   - band diagram with the radiative, SRH and Auger recombination
//            paths; arrow weight shows each path's share of the total rate
//   middle - decay of the excess carrier density after injection
//   right  - carrier lifetime vs. doping for each mechanism and in total
//
// Net recombination rates (Chapter 10), with n = n0 + dn and p = p0 + dn:
//   Radiative:  U = B (n p - ni^2)
//   SRH:        U = (n p - ni^2) / [tau_p0 (n + n1) + tau_n0 (p + p1)]
//               tau_n0 = tau_p0 = 1/(sigma v_th N_t)
//               n1 = ni exp((Et - Ei)/kT),  p1 = ni exp((Ei - Et)/kT)
//   Auger:      U = (Cn n + Cp p)(n p - ni^2)
// The lifetime of each mechanism is tau = dn / U, and rates add:
//   1/tau_eff = 1/tau_rad + 1/tau_SRH + 1/tau_Auger
// See index.md for parameter values, sources and limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 442;              // drawing region height
let controlHeight = 185;           // control region height (5 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 290;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Physical constants and material parameters (300 K) ----
const KT = 0.025852;               // thermal energy at 300 K (eV)
const SIGMA = 1e-15;               // capture cross section, electrons and holes (cm^2)
const V_TH = 1e7;                  // thermal velocity (cm/s)

const MATERIALS = {
  Si:   { label: 'Si (indirect gap)', ni: 9.65e9, eg: 1.12, B: 1e-15, Cn: 2.8e-31, Cp: 0.99e-31 },
  GaAs: { label: 'GaAs (direct gap)', ni: 2.1e6,  eg: 1.42, B: 1e-10, Cn: 1e-30,   Cp: 1e-30 }
};

const MECH = {
  srh: { name: 'SRH (traps)', short: 'SRH',       col: 'royalblue' },
  rad: { name: 'Radiative',   short: 'Radiative', col: 'darkorange' },
  aug: { name: 'Auger',       short: 'Auger',     col: 'seagreen' }
};
const MECH_KEYS = ['rad', 'srh', 'aug'];

const ND_MIN_EXP = 14, ND_MAX_EXP = 19;   // doping axis, log10(cm^-3)
const TAU_MIN_EXP = -10, TAU_MAX_EXP = 1; // lifetime axis, log10(s)
const DN_MAX = 1e19;                      // largest excess density modeled (cm^-3)

// ---- Controls and state ----
let materialSelect, startButton, trapSlider, levelSlider, dopingSlider, injectionSlider;
let isRunning = false;             // loads paused; press Start to animate
let dots = [];                     // animated transitions: {key, phase}
let decayCache = { key: '', data: null };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  materialSelect = createSelect();
  for (const k of Object.keys(MATERIALS)) materialSelect.option(MATERIALS[k].label, k);
  materialSelect.selected('Si');
  materialSelect.position(72, drawHeight + 9);

  startButton = createButton('Start');
  startButton.position(232, drawHeight + 8);
  startButton.mousePressed(toggleAnimation);

  // log10 of the trap density (cm^-3)
  trapSlider = createSlider(10, 14, 12, 0.05);
  // trap level relative to the intrinsic level (eV)
  levelSlider = createSlider(-0.5, 0.5, 0, 0.01);
  // log10 of the donor concentration (cm^-3)
  dopingSlider = createSlider(ND_MIN_EXP, ND_MAX_EXP, 16, 0.05);
  // log10 of the injection level dn/n0
  injectionSlider = createSlider(-4, 2, -2, 0.05);
  const sliders = [trapSlider, levelSlider, dopingSlider, injectionSlider];
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].position(sliderLeftMargin, drawHeight + 45 + 35 * i);
    sliders[i].size(canvasWidth - sliderLeftMargin - margin);
  }

  describe('Three panels about carrier recombination in an n-type ' +
    'semiconductor. The left panel is a band diagram with three ' +
    'recombination paths: radiative band-to-band, Shockley-Read-Hall through ' +
    'a trap level, and Auger. The middle panel plots the decay of the excess ' +
    'carrier density with time on a logarithmic scale. The right panel plots ' +
    'carrier lifetime against doping for each mechanism and for all three ' +
    'together. Sliders set the trap density, the trap energy level, the ' +
    'doping, and the injection level.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Net recombination rates (cm^-3 s^-1) for excess density dn in n-type material
function recombinationRates(mat, ND, Nt, EtMinusEi, dn) {
  const n0 = ND;
  const p0 = mat.ni * mat.ni / ND;
  const n = n0 + dn, p = p0 + dn;
  const np = n * p - mat.ni * mat.ni;
  const tau0 = 1 / (SIGMA * V_TH * Nt);                  // tau_n0 = tau_p0
  const n1 = mat.ni * Math.exp(EtMinusEi / KT);
  const p1 = mat.ni * Math.exp(-EtMinusEi / KT);
  const srh = np / (tau0 * (n + n1) + tau0 * (p + p1));
  const rad = mat.B * np;
  const aug = (mat.Cn * n + mat.Cp * p) * np;
  return { srh: srh, rad: rad, aug: aug, total: srh + rad + aug, tau0: tau0 };
}

// Excess carrier density for an injection ratio dn/n0. It is capped at
// DN_MAX because the rate expressions are not meaningful beyond that.
function excessDensity(ratio, ND) {
  return Math.min(ratio * ND, DN_MAX);
}

// Lifetimes (s) tau = dn / U for each mechanism and in total
function lifetimes(mat, ND, Nt, EtMinusEi, dn) {
  const u = recombinationRates(mat, ND, Nt, EtMinusEi, dn);
  return { srh: dn / u.srh, rad: dn / u.rad, aug: dn / u.aug, eff: dn / u.total,
           share: { srh: u.srh / u.total, rad: u.rad / u.total, aug: u.aug / u.total } };
}

// Integrate d(dn)/dt = -U(dn) from dn0, for the total rate and for each
// mechanism acting alone. Returns normalized curves dn(t)/dn0 on a uniform grid.
function decayCurves(mat, ND, Nt, EtMinusEi, dn0, tMax, steps) {
  const out = { t: [], total: [], srh: [], rad: [], aug: [] };
  const keys = ['total', 'srh', 'rad', 'aug'];
  const y = { total: Math.log(dn0), srh: Math.log(dn0), rad: Math.log(dn0), aug: Math.log(dn0) };
  const floorLog = Math.log(dn0) - 12;                 // stop following below e^-12
  const rateOf = (key, lnDn) => {
    const d = Math.exp(lnDn);
    return recombinationRates(mat, ND, Nt, EtMinusEi, d)[key] / d;   // 1/tau
  };
  for (let i = 0; i <= steps; i++) {
    out.t.push(tMax * i / steps);
    for (const k of keys) out[k].push(Math.exp(y[k]) / dn0);
    if (i === steps) break;
    const dtStep = tMax / steps;
    for (const k of keys) {
      let t = 0, guard = 0;
      while (t < dtStep && y[k] > floorLog && guard < 4000) {
        // midpoint rule on ln(dn), sub-stepped so each step is a small fraction of tau
        const r1 = rateOf(k, y[k]);
        const dt = Math.min(dtStep - t, 0.1 / r1);
        const r2 = rateOf(k, y[k] - 0.5 * dt * r1);
        y[k] -= dt * r2;
        t += dt;
        guard++;
      }
      if (y[k] <= floorLog) y[k] = floorLog;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const matKey = materialSelect.value();
  const mat = MATERIALS[matKey];
  const Nt = Math.pow(10, trapSlider.value());
  const Et = levelSlider.value();
  const ND = Math.pow(10, dopingSlider.value());
  const ratio = Math.pow(10, injectionSlider.value());
  const dn = excessDensity(ratio, ND);
  const tau = lifetimes(mat, ND, Nt, Et, dn);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Three panels side by side
  const gap = 8;
  const pw = (canvasWidth - 20 - 2 * gap) / 3;
  const py = 44, ph = 296;
  const xA = 10, xB = xA + pw + gap, xC = xB + pw + gap;
  for (const x of [xA, xB, xC]) {
    fill(255, 255, 255, 235);
    stroke('silver');
    strokeWeight(1);
    rect(x, py, pw, ph, 8);
  }

  drawBandPanel(xA, py, pw, ph, mat, Et, tau);
  drawDecayPanel(xB, py, pw, ph, mat, matKey, ND, Nt, Et, dn);
  drawLifetimePanel(xC, py, pw, ph, mat, ND, Nt, Et, ratio, tau);
  drawReadoutStrip(matKey, ND, dn, ratio, tau);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Recombination Lifetime Explorer', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(Nt, Et, ND, ratio);
}

function panelTitle(t, x, y, w) {
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(w < 200 ? 12 : 13);
  textAlign(CENTER, CENTER);
  text(t, x + w / 2, y + 15);
  textStyle(NORMAL);
}

// ---- Left panel: band diagram with the three recombination paths ----
function drawBandPanel(x, y, w, h, mat, Et, tau) {
  panelTitle('Recombination paths', x, y, w);

  const bx0 = x + 34, bx1 = x + w - 10;
  const yC = y + 82, yV = y + h - 84;           // band edges on screen
  const yMid = (yC + yV) / 2;
  const yOfE = (e) => yMid - e / (mat.eg / 2) * (yV - yC) / 2;   // e relative to Ei
  const yT = yOfE(Et);

  // Bands
  noStroke();
  fill(100, 181, 246, 110);
  rect(bx0, y + 34, bx1 - bx0, yC - (y + 34));
  fill(129, 199, 132, 110);
  rect(bx0, yV, bx1 - bx0, 34);
  stroke('firebrick'); strokeWeight(2);
  line(bx0, yC, bx1, yC);
  stroke('navy');
  line(bx0, yV, bx1, yV);
  stroke('gray'); strokeWeight(1);
  drawingContext.setLineDash([3, 4]);
  line(bx0, yMid, bx1, yMid);
  drawingContext.setLineDash([]);

  noStroke();
  textSize(12);
  fill('firebrick'); richText('E_{C}', bx0 - 5, yC, RIGHT);
  fill('navy');      richText('E_{V}', bx0 - 5, yV, RIGHT);
  fill('gray');      richText('E_{i}', bx0 - 5, yMid, RIGHT);

  // Path columns
  const xs = { rad: bx0 + (bx1 - bx0) * 0.17, srh: bx0 + (bx1 - bx0) * 0.50, aug: bx0 + (bx1 - bx0) * 0.80 };
  const weight = (k) => 1.2 + 5 * Math.sqrt(tau.share[k]);
  const alpha = (k) => 70 + 185 * Math.sqrt(tau.share[k]);
  const colOf = (k) => { const c = color(MECH[k].col); c.setAlpha(alpha(k)); return c; };

  // Radiative: one vertical transition and a photon
  drawArrow(xs.rad, yC + 7, xs.rad, yV - 7, colOf('rad'), weight('rad'));
  drawPhoton(xs.rad + 8, yMid + 16, colOf('rad'));

  // SRH: capture into the trap, then into the valence band
  stroke(MECH.srh.col); strokeWeight(3);
  line(xs.srh - 16, yT, xs.srh + 16, yT);
  if (yT - yC > 22) drawArrow(xs.srh, yC + 7, xs.srh, yT - 4, colOf('srh'), weight('srh'));
  if (yV - yT > 22) drawArrow(xs.srh, yT + 4, xs.srh, yV - 7, colOf('srh'), weight('srh'));
  noStroke();
  fill(MECH.srh.col);
  textSize(12);
  // the label moves to the left of the trap when the Auger column is close
  if (xs.aug - xs.srh < 60) richText('E_{t}', xs.srh - 19, yT, RIGHT);
  else richText('E_{t}', xs.srh + 20, yT, LEFT);

  // Auger: the energy goes to a second electron, which is kicked up the band
  drawArrow(xs.aug - 7, yC + 7, xs.aug - 7, yV - 7, colOf('aug'), weight('aug'));
  drawArrow(xs.aug + 9, yC - 4, xs.aug + 9, y + 40, colOf('aug'), Math.max(1.2, weight('aug') * 0.7));

  // Electrons at the top of each path, holes at the bottom
  for (const k of MECH_KEYS) {
    const px = k === 'aug' ? xs.aug - 7 : xs[k];
    stroke('white'); strokeWeight(1);
    fill('royalblue');
    circle(px, yC - 1, 9);
    noFill();
    stroke('crimson'); strokeWeight(1.5);
    circle(px, yV + 1, 9);
  }
  stroke('white'); strokeWeight(1);
  fill('royalblue');
  circle(xs.aug + 9, yC - 1, 9);

  // Animated transitions (only while running)
  if (isRunning) {
    for (const k of MECH_KEYS) {
      if (random() < 0.06 * tau.share[k] + 0.0015) dots.push({ key: k, phase: 0 });
    }
    for (const d of dots) d.phase += 0.02;
    dots = dots.filter(d => d.phase < 1);
  }
  noStroke();
  for (const d of dots) {
    const px = d.key === 'aug' ? xs.aug - 7 : xs[d.key];
    fill(MECH[d.key].col);
    circle(px, lerp(yC, yV, d.phase), 8);
    if (d.key === 'aug') circle(xs.aug + 9, lerp(yC, y + 42, d.phase), 7);
  }

  // Labels and shares under the diagram
  textAlign(CENTER, CENTER);
  for (const k of MECH_KEYS) {
    const px = k === 'aug' ? xs.aug + 1 : xs[k];
    noStroke();
    fill(MECH[k].col);
    textStyle(BOLD);
    textSize(w < 200 ? 11.5 : 12);
    text(MECH[k].short, px, y + h - 34);
    textStyle(NORMAL);
    fill('black');
    text(w < 200 ? fmtShare(tau.share[k]).replace(/ /g, '') : fmtShare(tau.share[k]), px, y + h - 17);
  }
}

// Wavy arrow for an emitted photon
function drawPhoton(x, y, col) {
  noFill();
  stroke(col);
  strokeWeight(1.5);
  beginShape();
  for (let i = 0; i <= 24; i++) vertex(x + i, y + 3.5 * Math.sin(i * 0.9));
  endShape();
  noStroke();
  fill(col);
  triangle(x + 30, y, x + 23, y - 4, x + 23, y + 4);
  textSize(11.5);
  textAlign(LEFT, CENTER);
  text('hν', x + 8, y - 12);
}

// ---- Middle panel: excess carrier decay ----
function drawDecayPanel(x, y, w, h, mat, matKey, ND, Nt, Et, dn) {
  panelTitle('Decay of δp(t) / δp(0)', x, y, w);

  const x0 = x + 38, x1 = x + w - 14;
  const y0 = y + 36, y1 = y + h - 44;
  // Time axis: six low-level-injection lifetimes
  const tauLow = lifetimes(mat, ND, Nt, Et, ND * 1e-6).eff;
  const tMax = 6 * tauLow;
  const key = [matKey, ND, Nt, Et, dn].join('|');
  if (decayCache.key !== key) {
    decayCache = { key: key, data: decayCurves(mat, ND, Nt, Et, dn, tMax, 90) };
  }
  const data = decayCache.data;
  const xOfT = (t) => map(t, 0, tMax, x0, x1);
  const yOfF = (f) => map(Math.log10(Math.max(f, 1e-9)), -3, 0, y1, y0);

  stroke('silver'); strokeWeight(1); fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
  textSize(12);
  for (let e = 0; e >= -3; e--) {
    const yy = yOfF(Math.pow(10, e));
    stroke('gainsboro'); line(x0, yy, x1, yy);
    noStroke(); fill('black');
    richText(e === 0 ? '1' : '10^{' + String(e).replace('-', '−') + '}', x0 - 5, yy, RIGHT);
  }
  const tickStep = w < 215 ? 3 : 2;      // fewer time labels in a narrow panel
  for (let i = 0; i <= 6; i += tickStep) {
    const xx = xOfT(tMax * i / 6);
    stroke('gainsboro'); line(xx, y0, xx, y1);
    noStroke(); fill('black');
    // the last label is right-aligned so it stays inside the panel
    textAlign(i === 6 ? RIGHT : CENTER, TOP);
    text(i === 0 ? '0' : fmtTime(tMax * i / 6), i === 6 ? x1 + 8 : xx, y1 + 5);
  }

  // 1/e level
  stroke('gray'); strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(x0, yOfF(1 / Math.E), x1, yOfF(1 / Math.E));
  drawingContext.setLineDash([]);
  noStroke(); fill('gray');
  textAlign(RIGHT, BOTTOM);
  text('1/e', x1 - 3, yOfF(1 / Math.E) - 1);

  // Curves, clipped to the plot
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  noFill();
  for (const k of MECH_KEYS) {
    stroke(MECH[k].col);
    strokeWeight(1.8);
    beginShape();
    for (let i = 0; i < data.t.length; i++) vertex(xOfT(data.t[i]), yOfF(data[k][i]));
    endShape();
  }
  stroke('black');
  strokeWeight(3.2);
  beginShape();
  for (let i = 0; i < data.t.length; i++) vertex(xOfT(data.t[i]), yOfF(data.total[i]));
  endShape();
  pop();

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Time after injection', (x0 + x1) / 2, y1 + 23);
}

// ---- Right panel: lifetime vs. doping ----
function drawLifetimePanel(x, y, w, h, mat, ND, Nt, Et, ratio, tau) {
  panelTitle('Lifetime τ vs. doping', x, y, w);

  const x0 = x + 42, x1 = x + w - 14;
  const y0 = y + 36, y1 = y + h - 44;
  const xOfN = (n) => map(Math.log10(n), ND_MIN_EXP, ND_MAX_EXP, x0, x1);
  const yOfTau = (t) => map(Math.log10(t), TAU_MIN_EXP, TAU_MAX_EXP, y1, y0);

  stroke('silver'); strokeWeight(1); fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
  textSize(12);
  const tauTicks = [[-9, '1 ns'], [-6, '1 µs'], [-3, '1 ms'], [0, '1 s']];
  for (let e = TAU_MIN_EXP; e <= TAU_MAX_EXP; e++) {
    stroke(e % 3 === 0 ? 'lightgray' : 'whitesmoke');
    line(x0, yOfTau(Math.pow(10, e)), x1, yOfTau(Math.pow(10, e)));
  }
  noStroke(); fill('black');
  textAlign(RIGHT, CENTER);
  for (const tk of tauTicks) text(tk[1], x0 - 5, yOfTau(Math.pow(10, tk[0])));
  for (let e = ND_MIN_EXP; e <= ND_MAX_EXP; e++) {
    const xx = xOfN(Math.pow(10, e));
    stroke('gainsboro'); line(xx, y0, xx, y1);
    noStroke(); fill('black');
    if (w >= 230 || e % 2 === 0) richText('10^{' + e + '}', xx, y1 + 12, CENTER);
  }

  // Curves at the current injection ratio, clipped to the plot
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const nd = Math.pow(10, ND_MIN_EXP + (ND_MAX_EXP - ND_MIN_EXP) * i / 80);
    pts.push({ nd: nd, tau: lifetimes(mat, nd, Nt, Et, excessDensity(ratio, nd)) });
  }
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
  noFill();
  for (const k of MECH_KEYS) {
    stroke(MECH[k].col);
    strokeWeight(1.8);
    beginShape();
    for (const p of pts) vertex(xOfN(p.nd), yOfTau(Math.min(p.tau[k], 1e6)));
    endShape();
  }
  stroke('black');
  strokeWeight(3.2);
  beginShape();
  for (const p of pts) vertex(xOfN(p.nd), yOfTau(p.tau.eff));
  endShape();

  // Strip along the bottom: which mechanism is fastest at each doping
  noStroke();
  for (let i = 0; i < pts.length - 1; i++) {
    let best = 'srh';
    for (const k of MECH_KEYS) if (pts[i].tau[k] < pts[i].tau[best]) best = k;
    fill(MECH[best].col);
    rect(xOfN(pts[i].nd), y1 - 7, xOfN(pts[i + 1].nd) - xOfN(pts[i].nd) + 1, 7);
  }

  // Marker at the selected doping
  stroke('dimgray'); strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(xOfN(ND), y0, xOfN(ND), y1);
  drawingContext.setLineDash([]);
  stroke('white'); strokeWeight(1.5); fill('black');
  circle(xOfN(ND), yOfTau(tau.eff), 10);
  pop();

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);

  noStroke();
  fill('black');
  textSize(12);
  richText('Doping N_{D} (cm^{−3})', (x0 + x1) / 2, y1 + 31, CENTER);
}

// ---- Strip under the panels: lifetimes and shares at the selected point ----
function drawReadoutStrip(matKey, ND, dn, ratio, tau) {
  const x = 10, y = 348, w = canvasWidth - 20, h = 86;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const small = canvasWidth < 680;
  const level = ratio < 0.1 ? 'low-level injection' : ratio > 10 ? 'high-level injection' : 'intermediate injection';
  fill('black');
  textStyle(BOLD);
  textSize(small ? 12 : 13);
  const capped = ratio * ND > DN_MAX;
  richText('n-type ' + matKey + ':  N_{D} = ' + sci(ND, 1) + ' cm^{−3},  δn = ' + sci(dn, 1) +
           ' cm^{−3}' + (capped ? ' (capped)' : small ? '' : '  (' + level + ')'), x + 12, y + 16, LEFT);
  textStyle(NORMAL);

  let dominant = 'srh';
  for (const k of MECH_KEYS) if (tau[k] < tau[dominant]) dominant = k;

  const cols = [
    { key: 'srh', label: small ? 'SRH' : MECH.srh.name, col: MECH.srh.col },
    { key: 'rad', label: MECH.rad.name, col: MECH.rad.col },
    { key: 'aug', label: MECH.aug.name, col: MECH.aug.col },
    { key: 'eff', label: 'Effective', col: 'black' }
  ];
  const colW = (w - 24) / cols.length;
  for (let i = 0; i < cols.length; i++) {
    const c = cols[i];
    const cx = x + 12 + i * colW;
    textAlign(LEFT, CENTER);
    fill(c.col);
    textStyle(BOLD);
    textSize(small ? 12 : 13);
    text(c.label, cx, y + 39);
    fill('black');
    textSize(small ? 12 : 13);
    if (c.key !== 'eff') textStyle(NORMAL);
    text('τ = ' + fmtTime(tau[c.key]), cx, y + 57);
    textStyle(NORMAL);
    textSize(12);
    if (c.key === 'eff') {
      fill(MECH[dominant].col);
      text('Dominant: ' + MECH[dominant].short, cx, y + 74);
    } else {
      fill('dimgray');
      text(fmtShare(tau.share[c.key]) + ' of the rate', cx, y + 74);
    }
  }
}

function drawControlLabels(Nt, Et, ND, ratio) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Material:', 10, drawHeight + 20);
  richText('Trap density N_{t}: ' + sci(Nt, 1) + ' cm^{−3}', 10, drawHeight + 55, LEFT);
  richText('Trap level E_{t} − E_{i}: ' + (Et >= 0 ? '+' : '−') + Math.abs(Et).toFixed(2) + ' eV', 10, drawHeight + 90, LEFT);
  richText('Doping N_{D}: ' + sci(ND, 1) + ' cm^{−3}', 10, drawHeight + 125, LEFT);
  richText('Injection level δn/n_{0}: ' + fmtRatio(ratio), 10, drawHeight + 160, LEFT);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toggleAnimation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
  if (!isRunning) dots = [];
}

function drawArrow(x1, y1, x2, y2, col, weight) {
  stroke(col);
  strokeWeight(weight);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const s = 6 + 1.6 * weight;
  line(x1, y1, x2 - Math.cos(ang) * s * 0.6, y2 - Math.sin(ang) * s * 0.6);
  noStroke();
  fill(col);
  triangle(x2, y2,
           x2 - s * Math.cos(ang - 0.45), y2 - s * Math.sin(ang - 0.45),
           x2 - s * Math.cos(ang + 0.45), y2 - s * Math.sin(ang + 0.45));
}

// Time with an SI prefix and three significant figures
function fmtTime(t) {
  if (!isFinite(t)) return '∞';
  const units = [[1, 's'], [1e-3, 'ms'], [1e-6, 'µs'], [1e-9, 'ns'], [1e-12, 'ps']];
  if (t >= 1000) return sciPlain(t) + ' s';
  for (const u of units) {
    if (t >= u[0]) return (t / u[0]).toPrecision(3) + ' ' + u[1];
  }
  return (t / 1e-12).toPrecision(2) + ' ps';
}

function sciPlain(x) {
  const e = Math.floor(Math.log10(x));
  return (x / Math.pow(10, e)).toFixed(1) + 'e' + e;
}

function fmtShare(f) {
  const pct = 100 * f;
  if (pct >= 99.95) return '100 %';
  if (pct >= 9.95) return pct.toFixed(0) + ' %';
  if (pct >= 0.095) return pct.toFixed(1) + ' %';
  return '< 0.1 %';
}

function fmtRatio(r) {
  if (r >= 0.01 && r < 1000) return r >= 10 ? r.toFixed(0) : r >= 1 ? r.toFixed(1) : r.toPrecision(2);
  return sci(r, 1);
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
    if (typeof trapSlider !== 'undefined' && injectionSlider) {
      for (const s of [trapSlider, levelSlider, dopingSlider, injectionSlider]) {
        s.size(canvasWidth - sliderLeftMargin - margin);
      }
    }
  }
}
