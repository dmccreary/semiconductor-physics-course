// Carrier Concentration vs. Temperature MicroSim
// CANVAS_HEIGHT: 605
//
// Log-scale plot of the electron and hole concentrations in doped silicon
// from 50 K to 1000 K, with the freeze-out, extrinsic and intrinsic regimes
// shaded. A probe temperature gives numerical readouts.
//
// Physics model (non-degenerate silicon, one dopant species):
//   Charge neutrality:  n + N_A^- = p + N_D^+   solved for E_F by bisection
//   n = N_C exp(-(E_C - E_F)/kT),  p = N_V exp(-(E_F - E_V)/kT)
//   N_D^+/N_D = 1 / (1 + g_D exp((E_F - E_d)/kT)),  g_D = 2, phosphorus 45 meV
//   N_A^-/N_A = 1 / (1 + g_A exp((E_a - E_F)/kT)),  g_A = 4, boron 45 meV
//   N_C, N_V = 2.86e19, 3.10e19 cm^-3 at 300 K, scaled as T^(3/2)
//   E_g(T): Varshni form with the 0 K value set so n_i(300 K) = 9.65e9 cm^-3
// Regime boundaries drawn on the plot:
//   freeze-out / extrinsic : 90 % of the dopants ionized
//   extrinsic / intrinsic  : n_i(T) equals the doping concentration
// See index.md for the model details and limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 490;              // drawing region height
let controlHeight = 115;           // control region height (3 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 230;        // label + value sit left of the sliders
let defaultTextSize = 14;

// ---- Physical constants and silicon parameters ----
const KB_EV = 8.617333e-5;         // Boltzmann constant (eV/K)
const NC300 = 2.86e19;             // effective DOS, conduction band, 300 K (cm^-3)
const NV300 = 3.10e19;             // effective DOS, valence band, 300 K (cm^-3)
const NI300 = 9.65e9;              // intrinsic concentration at 300 K (cm^-3)
const VARSHNI_ALPHA = 4.73e-4;     // eV/K
const VARSHNI_BETA = 636;          // K
// 0 K gap chosen so sqrt(NC NV) exp(-Eg/2kT) = NI300 at 300 K (about 1.175 eV)
const EG0 = 2 * KB_EV * 300 * Math.log(Math.sqrt(NC300 * NV300) / NI300) +
            VARSHNI_ALPHA * 300 * 300 / (300 + VARSHNI_BETA);
const G_DONOR = 2;                 // donor level degeneracy
const G_ACCEPTOR = 4;              // acceptor level degeneracy
const DOPANT_MEV = 45;             // phosphorus and boron ionization energy (meV)

const T_MIN = 50, T_MAX = 1000;    // temperature axis (K), logarithmic
const C_MIN_EXP = 2, C_MAX_EXP = 20; // concentration axis: 1e2 to 1e20 cm^-3

// ---- Controls and state ----
let typeRadio, dopingSlider, tempSlider, niCheckbox, labelCheckbox;
let curve = [];                    // cached {T, n, p, ni, frac}
let curveKey = '';
let boundaries = { freeze: null, intrinsic: null };

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

  niCheckbox = createCheckbox(' Show ni(T) curve', true);
  niCheckbox.position(180, drawHeight + 10);

  labelCheckbox = createCheckbox(' Show regime labels', true);
  labelCheckbox.position(335, drawHeight + 10);

  // log10 of the doping concentration (cm^-3)
  dopingSlider = createSlider(14, 18, 15, 0.05);
  dopingSlider.position(sliderLeftMargin, drawHeight + 45);
  dopingSlider.size(canvasWidth - sliderLeftMargin - margin);

  // log10 of the probe temperature, to match the logarithmic axis
  tempSlider = createSlider(Math.log10(T_MIN), Math.log10(T_MAX), Math.log10(300), 0.001);
  tempSlider.position(sliderLeftMargin, drawHeight + 80);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Log-scale plot of electron and hole concentration in doped silicon ' +
    'versus temperature from 50 to 1000 kelvin. Three shaded bands mark the ' +
    'freeze-out regime at low temperature, the extrinsic regime where the ' +
    'majority carrier concentration equals the doping, and the intrinsic ' +
    'regime at high temperature. A dashed curve shows the intrinsic carrier ' +
    'concentration. A panel lists the values at the probe temperature. ' +
    'Controls choose n-type or p-type, the doping concentration, and the ' +
    'probe temperature.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

function bandGap(T) {
  return EG0 - VARSHNI_ALPHA * T * T / (T + VARSHNI_BETA);
}

function effectiveDOS(T) {
  const s = Math.pow(T / 300, 1.5);
  return { NC: NC300 * s, NV: NV300 * s };
}

function intrinsicConcentration(T) {
  const dos = effectiveDOS(T);
  return Math.sqrt(dos.NC * dos.NV) * Math.exp(-bandGap(T) / (2 * KB_EV * T));
}

// Solve charge neutrality at temperature T for doping N (cm^-3).
// Energies are measured from the valence band edge (E_V = 0).
function solveNeutrality(T, isDonor, N) {
  const kT = KB_EV * T;
  const ec = bandGap(T);
  const dos = effectiveDOS(T);
  const dE = DOPANT_MEV / 1000;
  const level = isDonor ? ec - dE : dE;

  function ionizedFraction(ef) {
    return isDonor
      ? 1 / (1 + G_DONOR * Math.exp((ef - level) / kT))
      : 1 / (1 + G_ACCEPTOR * Math.exp((level - ef) / kT));
  }
  // Net positive charge; decreases monotonically as E_F rises
  function netCharge(ef) {
    const n = dos.NC * Math.exp((ef - ec) / kT);
    const p = dos.NV * Math.exp(-ef / kT);
    const ion = N * ionizedFraction(ef);
    return isDonor ? p + ion - n : p - ion - n;
  }

  let lo = -0.4, hi = ec + 0.4;
  for (let i = 0; i < 70; i++) {
    const mid = 0.5 * (lo + hi);
    if (netCharge(mid) > 0) lo = mid; else hi = mid;
  }
  const ef = 0.5 * (lo + hi);
  return {
    T: T,
    n: dos.NC * Math.exp((ef - ec) / kT),
    p: dos.NV * Math.exp(-ef / kT),
    ni: intrinsicConcentration(T),
    frac: ionizedFraction(ef)
  };
}

// Temperature at which n_i(T) equals N (bisection; n_i rises monotonically)
function intrinsicTemperature(N) {
  let lo = 50, hi = 2000;
  for (let i = 0; i < 50; i++) {
    const mid = 0.5 * (lo + hi);
    if (intrinsicConcentration(mid) < N) lo = mid; else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// Lowest temperature at which 90 % of the dopants are ionized. The cached
// curve brackets the crossing and bisection refines it. (The ionized fraction
// is not monotonic over an unlimited range: it sags again far above 1000 K.)
function freezeOutTemperature(isDonor, N) {
  if (curve.length === 0 || curve[0].frac >= 0.9) return T_MIN;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].frac >= 0.9) {
      let lo = curve[i - 1].T, hi = curve[i].T;
      for (let k = 0; k < 30; k++) {
        const mid = 0.5 * (lo + hi);
        if (solveNeutrality(mid, isDonor, N).frac < 0.9) lo = mid; else hi = mid;
      }
      return 0.5 * (lo + hi);
    }
  }
  return null;
}

function rebuildCurve(isDonor, N) {
  const key = (isDonor ? 'n' : 'p') + '|' + N;
  if (key === curveKey) return;
  curveKey = key;
  curve = [];
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    const T = T_MIN * Math.pow(T_MAX / T_MIN, i / steps);
    curve.push(solveNeutrality(T, isDonor, N));
  }
  boundaries.freeze = freezeOutTemperature(isDonor, N);
  boundaries.intrinsic = intrinsicTemperature(N);
}

function regimeAt(T) {
  if (T >= boundaries.intrinsic) return 'Intrinsic';
  if (boundaries.freeze === null || T < boundaries.freeze) return 'Freeze-out';
  return 'Extrinsic';
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const isDonor = typeRadio.value() !== 'p';
  const N = Math.pow(10, dopingSlider.value());
  const T = Math.round(Math.pow(10, tempSlider.value()));
  rebuildCurve(isDonor, N);
  const now = solveNeutrality(T, isDonor, N);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry
  const panelW = canvasWidth >= 700 ? 232 : 198;
  const panelX = canvasWidth - panelW - 10;
  const x0 = 62, x1 = panelX - 16;
  const y0 = 64, y1 = 404;
  const xOfT = (t) => map(Math.log10(t), Math.log10(T_MIN), Math.log10(T_MAX), x0, x1);
  const yOfC = (c) => map(Math.log10(Math.max(c, 1e-300)), C_MIN_EXP, C_MAX_EXP, y1, y0);

  // Plot background
  stroke('silver');
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  drawRegimes(x0, x1, y0, y1, xOfT);
  drawGridAndAxes(x0, x1, y0, y1, xOfT, yOfC);

  // Clip the curves to the plot rectangle
  push();
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();

  // Doping level reference line
  stroke('dimgray');
  strokeWeight(1);
  drawingContext.setLineDash([2, 4]);
  line(x0, yOfC(N), x1, yOfC(N));
  drawingContext.setLineDash([]);

  // n_i(T) reference curve
  noFill();
  if (niCheckbox.checked()) {
    stroke('gray');
    strokeWeight(2);
    drawingContext.setLineDash([6, 5]);
    beginShape();
    for (const pt of curve) vertex(xOfT(pt.T), yOfC(pt.ni));
    endShape();
    drawingContext.setLineDash([]);
  }

  // Minority then majority carrier curves
  const colN = color('royalblue'), colP = color('crimson');
  strokeWeight(isDonor ? 2 : 3.5);
  stroke(colP);
  beginShape(); for (const pt of curve) vertex(xOfT(pt.T), yOfC(pt.p)); endShape();
  strokeWeight(isDonor ? 3.5 : 2);
  stroke(colN);
  beginShape(); for (const pt of curve) vertex(xOfT(pt.T), yOfC(pt.n)); endShape();

  // Probe line and markers
  stroke('dimgray');
  strokeWeight(1);
  line(xOfT(T), y0, xOfT(T), y1);
  stroke('white');
  strokeWeight(1.5);
  fill(colP);
  circle(xOfT(T), yOfC(now.p), 10);
  fill(colN);
  circle(xOfT(T), yOfC(now.n), 10);
  pop();

  // Doping-level label at the left end of the dotted line
  noStroke();
  fill('dimgray');
  textSize(12);
  richText(isDonor ? 'N_{D}' : 'N_{A}', x0 + 5, yOfC(N) - 9, LEFT);

  drawLegend(x0, x1, y1, isDonor);
  drawInfoPanel(panelX, 46, panelW, 360, now, isDonor, N);
  drawModelNote(N);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Carrier Concentration vs. Temperature', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(isDonor, N, T);
}

function drawRegimes(x0, x1, y0, y1, xOfT) {
  const tf = boundaries.freeze === null ? T_MAX : constrain(boundaries.freeze, T_MIN, T_MAX);
  const ti = constrain(boundaries.intrinsic, T_MIN, T_MAX);
  const xa = xOfT(tf), xb = xOfT(Math.max(ti, tf));

  noStroke();
  fill(144, 202, 249, 90);            // freeze-out
  rect(x0, y0, xa - x0, y1 - y0);
  fill(165, 214, 167, 90);            // extrinsic
  rect(xa, y0, xb - xa, y1 - y0);
  fill(255, 204, 128, 110);           // intrinsic
  rect(xb, y0, x1 - xb, y1 - y0);

  // Boundary lines
  stroke('slategray');
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  if (xa > x0 + 1 && xa < x1 - 1) line(xa, y0, xa, y1);
  if (xb > x0 + 1 && xb < x1 - 1) line(xb, y0, xb, y1);
  drawingContext.setLineDash([]);

  if (!labelCheckbox.checked()) return;

  // Regime labels above the plot, kept from overlapping one another
  noStroke();
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  const labels = [
    { t: 'Freeze-out', a: x0, b: xa, col: 'steelblue' },
    { t: 'Extrinsic', a: xa, b: xb, col: 'seagreen' },
    { t: 'Intrinsic', a: xb, b: x1, col: 'chocolate' }
  ];
  let shown = labels.filter(L => L.b - L.a >= 3);
  for (const L of shown) L.w = textWidth(L.t);
  // Drop the label of the narrowest band until the rest fit side by side
  while (shown.length > 0) {
    let minX = x0;
    for (const L of shown) {                       // push right past the previous label
      L.x = Math.max((L.a + L.b) / 2 - L.w / 2, minX);
      minX = L.x + L.w + 10;
    }
    let maxX = x1;
    for (let i = shown.length - 1; i >= 0; i--) {  // pull left to stay inside the plot
      shown[i].x = Math.min(shown[i].x, maxX - shown[i].w);
      maxX = shown[i].x - 10;
    }
    if (shown[0].x >= x0 - 1) break;
    let narrow = 0;
    for (let i = 1; i < shown.length; i++) {
      if (shown[i].b - shown[i].a < shown[narrow].b - shown[narrow].a) narrow = i;
    }
    shown.splice(narrow, 1);
  }
  for (const L of shown) {
    fill(L.col);
    text(L.t, L.x, y0 - 4);
  }
  textStyle(NORMAL);
}

function drawGridAndAxes(x0, x1, y0, y1, xOfT, yOfC) {
  textSize(12);
  // Concentration decades
  for (let e = C_MIN_EXP; e <= C_MAX_EXP; e += 2) {
    const y = yOfC(Math.pow(10, e));
    stroke(e % 4 === 0 ? 'lightgray' : 'gainsboro');
    strokeWeight(1);
    line(x0, y, x1, y);
    noStroke();
    fill('black');
    if (e % 4 === 0) richText('10^{' + e + '}', x0 - 6, y, RIGHT);
  }
  // Temperature ticks on the logarithmic axis
  for (const t of [50, 100, 200, 300, 500, 700, 1000]) {
    stroke('gainsboro');
    line(xOfT(t), y0, xOfT(t), y1);
    stroke('black');
    line(xOfT(t), y1, xOfT(t), y1 + 4);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    text(t, xOfT(t), y1 + 7);
  }
  stroke('black');
  noFill();
  rect(x0, y0, x1 - x0, y1 - y0);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('Temperature (K, log scale)', (x0 + x1) / 2, y1 + 24);
  push();
  translate(15, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textSize(14);
  richText('Carrier concentration (cm^{−3})', 0, 0, CENTER);
  pop();
}

function drawLegend(x0, x1, y1, isDonor) {
  // Legend inside the plot, lower left corner (minority curves stay to the right)
  const items = [
    { label: 'n (electrons)', col: color('royalblue'), dash: [], w: isDonor ? 3.5 : 2 },
    { label: 'p (holes)', col: color('crimson'), dash: [], w: isDonor ? 2 : 3.5 }
  ];
  if (niCheckbox.checked()) items.push({ label: 'n_{i}(T)', col: color('gray'), dash: [6, 5], w: 2 });
  const lx = x0 + 10;
  let ly = y1 - 16 * items.length - 4;
  noStroke();
  fill(255, 255, 255, 215);
  rect(lx - 5, ly - 10, 132, 16 * items.length + 8, 5);
  textSize(12);
  for (const it of items) {
    stroke(it.col);
    strokeWeight(it.w);
    drawingContext.setLineDash(it.dash);
    line(lx, ly, lx + 24, ly);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black');
    richText(it.label, lx + 30, ly, LEFT);
    ly += 16;
  }
}

function drawInfoPanel(x, y, w, h, now, isDonor, N) {
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const pad = 10;
  const small = w < 220;
  const ts = small ? 12 : 13;
  let cy = y + 17;

  fill('black');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(ts + 1);
  text(isDonor ? 'N-type silicon' : 'P-type silicon', x + pad, cy);
  textStyle(NORMAL);
  textSize(ts);
  cy += 20;
  text(isDonor ? 'Phosphorus donors, 45 meV' : 'Boron acceptors, 45 meV', x + pad, cy);
  cy += 20;
  richText((isDonor ? 'N_{D} = ' : 'N_{A} = ') + sci(N, 1) + ' cm^{−3}', x + pad, cy, LEFT);
  cy += 28;

  textStyle(BOLD);
  textSize(ts + 1);
  text('At T = ' + now.T + ' K', x + pad, cy);
  cy += 22;
  const regime = regimeAt(now.T);
  const rcol = regime === 'Freeze-out' ? 'steelblue' : regime === 'Extrinsic' ? 'seagreen' : 'chocolate';
  fill(rcol);
  textSize(ts + 3);
  text(regime + ' regime', x + pad, cy);
  textStyle(NORMAL);
  textSize(ts);
  cy += 26;

  fill('royalblue');
  richText('n' + valueText(now.n), x + pad, cy, LEFT);
  cy += 20;
  fill('crimson');
  richText('p' + valueText(now.p), x + pad, cy, LEFT);
  cy += 20;
  fill('dimgray');
  richText('n_{i}' + valueText(now.ni), x + pad, cy, LEFT);
  cy += 20;
  fill('black');
  text('Dopants ionized: ' + (100 * now.frac).toFixed(now.frac > 0.0995 ? 1 : 2) + ' %', x + pad, cy);
  cy += 30;

  // Regime boundaries for this doping level
  textStyle(BOLD);
  textSize(ts + 1);
  text('Regime boundaries', x + pad, cy);
  textStyle(NORMAL);
  textSize(ts);
  cy += 21;
  fill('steelblue');
  const tf = boundaries.freeze;
  text(tf === null ? 'Freeze-out: all T shown'
       : tf <= T_MIN ? 'Freeze-out: below 50 K' : 'Freeze-out: below ' + Math.round(tf) + ' K',
       x + pad, cy);
  cy += 19;
  fill('seagreen');
  const ti = boundaries.intrinsic;
  if (tf !== null) {
    text('Extrinsic: ' + Math.round(Math.max(tf, T_MIN)) + ' K to ' + Math.round(ti) + ' K', x + pad, cy);
  } else {
    text('Extrinsic: none', x + pad, cy);
  }
  cy += 19;
  fill('chocolate');
  text('Intrinsic: above ' + Math.round(ti) + ' K', x + pad, cy);
  cy += 24;

  fill('dimgray');
  textSize(12);
  textLeading(15);
  textAlign(LEFT, TOP);
  text('Boundaries: 90 % of dopants ionized, and ni(T) equal to the doping.',
       x + pad, cy - 6, w - 2 * pad, 50);
}

// Model note under the plot; becomes a caution at heavy doping
function drawModelNote(N) {
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textLeading(15);
  let note;
  if (N >= 3e17) {
    fill('firebrick');
    note = 'Caution: at heavy doping the dopant levels broaden into a band (Sec. 7.8), so real ' +
           'silicon is more fully ionized and its freeze-out boundary lies lower than shown.';
  } else {
    fill('dimgray');
    note = 'Model: silicon, one dopant species (45 meV), charge neutrality solved at each ' +
           'temperature with Boltzmann statistics.';
  }
  text(note, 10, 452, canvasWidth - 20, 34);
}

function drawControlLabels(isDonor, N, T) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  richText('Doping ' + (isDonor ? 'N_{D}' : 'N_{A}') + ': ' + sci(N, 1) + ' cm^{−3}', 10, drawHeight + 55, LEFT);
  text('Temperature: ' + T + ' K', 10, drawHeight + 90);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Scientific notation in richText markup, e.g. "9.31 × 10^{4}"
function sci(x, digits) {
  if (x === 0) return '0';
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = x / Math.pow(10, e);
  if (Number(m.toFixed(digits)) >= 10) { m /= 10; e += 1; }
  return m.toFixed(digits) + ' × 10^{' + String(e).replace('-', '−') + '}';
}

// " = 9.31 × 10^{4} cm^{−3}", or " < 1 cm^{−3}" when there is less than one
// carrier per cubic centimeter
function valueText(x) {
  return (x < 1 ? ' < 1' : ' = ' + sci(x, 2)) + ' cm^{−3}';
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
