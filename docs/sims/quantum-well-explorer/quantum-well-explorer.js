// Quantum Well Energy Level Explorer MicroSim
// CANVAS_HEIGHT: 566
//
// Bound states of a finite square quantum well of width L_z and depth dE_C
// (Section 19.3), with different effective masses in the well (m_w) and in
// the barriers (m_b):
//   even states:  (k/m_w) tan(k L_z/2) =  kappa/m_b
//   odd states:  -(k/m_w) cot(k L_z/2) =  kappa/m_b
//   k = sqrt(2 m_w E)/hbar,  kappa = sqrt(2 m_b (dE_C - E))/hbar
// solved by bisection. Energies are measured from the conduction band edge
// of the well material. The infinite-well values
//   E_n = n^2 pi^2 hbar^2 / (2 m_w L_z^2)
// are shown for comparison.
// Density of states (per unit volume of the well layer):
//   quantum well:  g = (m_w / (pi hbar^2 L_z)) x (number of subbands below E)
//   bulk:          g = (1/2 pi^2) (2 m_w/hbar^2)^(3/2) sqrt(E)
// See index.md for the effective masses and the limitations.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 486;              // drawing region height
let controlHeight = 80;            // control region height (2 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// ---- Constants ----
const H2M = 0.0380998;             // hbar^2 / (2 m_0) in eV nm^2
const Z_MAX = 15;                  // half-width of the position axis (nm)
const LEVEL_COLORS = ['royalblue', 'crimson', 'seagreen', 'darkorange'];

// Material systems: electron effective masses in units of m_0
const SYSTEMS = {
  gaas: { name: 'GaAs / AlGaAs', well: 'GaAs', barrier: 'Al_{0.3}Ga_{0.7}As', mw: 0.067, mb: 0.092 },
  ingaas: { name: 'InGaAs / InP', well: 'In_{0.53}Ga_{0.47}As', barrier: 'InP', mw: 0.041, mb: 0.080 },
  gan: { name: 'GaN / AlGaN', well: 'GaN', barrier: 'Al_{0.25}Ga_{0.75}N', mw: 0.20, mb: 0.23 }
};

// ---- Controls ----
let systemSelect, psiCheckbox, probCheckbox, resetButton;
let widthSlider, depthSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  systemSelect = createSelect();
  systemSelect.option('GaAs / AlGaAs', 'gaas');
  systemSelect.option('InGaAs / InP', 'ingaas');
  systemSelect.option('GaN / AlGaN', 'gan');
  systemSelect.selected('gaas');
  systemSelect.position(78, drawHeight + 9);

  psiCheckbox = createCheckbox(' Show wavefunctions', true);
  psiCheckbox.position(222, drawHeight + 9);
  psiCheckbox.style('font-size', '14px');
  psiCheckbox.style('white-space', 'nowrap');

  probCheckbox = createCheckbox(' as |ψ|²', false);
  probCheckbox.position(388, drawHeight + 9);
  probCheckbox.style('font-size', '14px');
  probCheckbox.style('white-space', 'nowrap');

  resetButton = createButton('Reset');
  resetButton.mousePressed(resetDefaults);

  widthSlider = createSlider(1, 20, 10, 0.5);            // well width (nm)
  depthSlider = createSlider(0.10, 0.50, 0.25, 0.01);    // conduction band offset (eV)
  layoutControls();

  describe('A finite square quantum well. The left plot shows the ' +
    'conduction band edge against position with the bound energy levels ' +
    'and their wavefunctions, which spread a short way into the barriers. ' +
    'The right plot shows the density of states on the same energy axis: ' +
    'a staircase for the quantum well, with one step at each energy ' +
    'level, and a smooth square-root curve for the bulk material. A table ' +
    'lists each level for the finite well and for an infinite well of ' +
    'the same width. Sliders set the well width and the band offset, and ' +
    'a menu selects the material system.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Bound states of the finite well. L in nm, V0 in eV.
// Returns [{n, E (eV), Einf (eV), k, kappa (1/nm), even, amp, outside}]
function boundStates(L, V0, mw, mb) {
  const theta0 = Math.sqrt(mw * V0 / H2M) * L / 2;       // k L/2 at E = V0
  const count = Math.max(1, Math.ceil(2 * theta0 / Math.PI - 1e-9));
  const states = [];
  for (let n = 1; n <= count; n++) {
    const even = n % 2 === 1;
    const f = (th) => {
      const k = 2 * th / L;
      const E = H2M * k * k / mw;
      const kap = Math.sqrt(Math.max(mb * (V0 - E) / H2M, 0));
      return even ? (k / mw) * Math.sin(th) - (kap / mb) * Math.cos(th)
                  : (k / mw) * Math.cos(th) + (kap / mb) * Math.sin(th);
    };
    let a = (n - 1) * Math.PI / 2 + 1e-12;
    let b = Math.min(n * Math.PI / 2, theta0);
    const fa = f(a);
    for (let i = 0; i < 80; i++) {
      const m = (a + b) / 2;
      if ((f(m) > 0) === (fa > 0)) a = m; else b = m;
    }
    const th = (a + b) / 2;
    const k = 2 * th / L;
    const E = H2M * k * k / mw;
    const kap = Math.sqrt(Math.max(mb * (V0 - E) / H2M, 1e-12));
    // probability inside and outside the well, for the fraction in the barriers
    const edge = even ? Math.cos(th) : Math.sin(th);     // value at the right well edge
    const inside = L / 2 + (even ? 1 : -1) * Math.sin(k * L) / (2 * k);
    const outside = edge * edge / kap;
    states.push({ n: n, E: E, Einf: H2M * Math.pow(n * Math.PI / L, 2) / mw,
                  k: k, kap: kap, even: even, edge: edge,
                  outside: outside / (inside + outside) });
  }
  return states;
}

// Wavefunction of a state at position z (nm), scaled to a maximum of about 1
function psi(s, z, L) {
  const h = L / 2;
  if (Math.abs(z) <= h) return s.even ? Math.cos(s.k * z) : Math.sin(s.k * z);
  const tail = s.edge * Math.exp(-s.kap * (Math.abs(z) - h));
  return s.even ? tail : Math.sign(z) * tail;
}

// Density of states in 10^19 cm^-3 eV^-1 (E in eV, L in nm)
function dosStep(mw, L) { return mw / (2 * Math.PI * H2M * L) * 100; }       // one subband
function dosBulk(mw, E) { return Math.pow(mw / H2M, 1.5) * Math.sqrt(Math.max(E, 0)) / (2 * Math.PI * Math.PI) * 100; }

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const sys = SYSTEMS[systemSelect.value()] || SYSTEMS.gaas;
  const L = widthSlider.value();
  const V0 = depthSlider.value();
  const states = boundStates(L, V0, sys.mw, sys.mb);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const gap = 22;
  const x0 = 58, xr = canvasWidth - 14;
  const wellW = Math.round((xr - x0 - gap) * 0.58);
  const wx0 = x0, wx1 = x0 + wellW, dx0 = wx1 + gap, dx1 = xr;
  const y0 = 58, y1 = 322;
  const eTop = V0 * 1.22, eBot = -V0 * 0.105;             // energy window (eV)
  const yOfE = (e) => map(e, eBot, eTop, y1, y0);

  drawWellPlot(sys, L, V0, states, wx0, wx1, y0, y1, yOfE, eTop);
  drawDosPlot(sys, L, V0, states, dx0, dx1, y0, y1, yOfE, eTop);
  drawTable(sys, L, V0, states, 12, canvasWidth - 12, 366, drawHeight - 8);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Quantum Well Energy Level Explorer', canvasWidth / 2, 9);
  textStyle(NORMAL);

  drawControlLabels(L, V0);
}

function plotFrame(x0, x1, y0, y1) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);
}

function plotBorder(x0, x1, y0, y1) {
  stroke('black');
  strokeWeight(1);
  noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
}

function clipTo(x0, x1, y0, y1) {
  drawingContext.beginPath();
  drawingContext.rect(x0, y0, x1 - x0, y1 - y0);
  drawingContext.clip();
}

function energyTicks(V0) {
  const step = niceStep(V0 * 1000 / 5);                  // meV
  const ticks = [];
  for (let e = 0; e <= V0 * 1220 + 1e-6; e += step) ticks.push(e);
  return ticks;
}

function levelColor(n) { return n <= 4 ? LEVEL_COLORS[n - 1] : 'gray'; }

// ---- Left plot: the well, its levels and wavefunctions ----
function drawWellPlot(sys, L, V0, states, x0, x1, y0, y1, yOfE, eTop) {
  plotFrame(x0, x1, y0, y1);
  const xOfZ = (z) => map(z, -Z_MAX, Z_MAX, x0, x1);
  const xl = xOfZ(-L / 2), xr = xOfZ(L / 2);

  // Grid and axes
  textSize(12);
  for (const e of energyTicks(V0)) {
    const yy = yOfE(e / 1000);
    stroke('gainsboro');
    strokeWeight(1);
    line(x0, yy, x1, yy);
    stroke('black');
    line(x0 - 4, yy, x0, yy);
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(e, x0 - 7, yy);
  }
  for (let z = -Z_MAX; z <= Z_MAX; z += 5) {
    const xx = xOfZ(z);
    stroke('black');
    strokeWeight(1);
    line(xx, y1, xx, y1 + 4);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    text(String(z).replace('-', '−'), xx, y1 + 6);
  }

  push();
  clipTo(x0, x1, y0, y1);

  // Barrier and well shading
  noStroke();
  fill(225, 228, 235);
  rect(x0, yOfE(V0), xl - x0, y1 - yOfE(V0));
  rect(xr, yOfE(V0), x1 - xr, y1 - yOfE(V0));
  fill(255, 248, 225);
  rect(x0, y0, x1 - x0, yOfE(V0) - y0);                  // continuum above the barriers

  // Infinite-well levels of the same width (dashed, inside the well)
  for (let n = 1; n <= 4; n++) {
    const einf = H2M * Math.pow(n * Math.PI / L, 2) / sys.mw;
    if (einf > eTop) break;
    stroke(levelColor(n));
    strokeWeight(1);
    drawingContext.setLineDash([2, 4]);
    line(xl, yOfE(einf), xr, yOfE(einf));
    drawingContext.setLineDash([]);
  }

  // Bound levels and wavefunctions
  const showPsi = psiCheckbox.checked(), asProb = probCheckbox.checked();
  const gapE = states.length > 1 ? states[1].E - states[0].E : V0 - states[0].E;
  const ampPx = constrain(Math.abs(yOfE(0) - yOfE(gapE)) * 0.42, 9, 26);
  for (const s of states) {
    const col = levelColor(s.n);
    const yy = yOfE(s.E);
    stroke(col);
    strokeWeight(s.n <= 4 ? 2 : 1);
    line(xl, yy, xr, yy);
    if (s.n > 4 || !showPsi) continue;
    // wavefunction on its level as the baseline
    const c = color(col);
    stroke(col);
    strokeWeight(1);
    drawingContext.setLineDash([1, 3]);
    line(x0, yy, xl, yy);
    line(xr, yy, x1, yy);
    drawingContext.setLineDash([]);
    if (asProb) fill(red(c), green(c), blue(c), 60); else noFill();
    strokeWeight(2);
    beginShape();
    if (asProb) vertex(x0, yy);
    for (let px = x0; px <= x1; px += 2) {
      const z = map(px, x0, x1, -Z_MAX, Z_MAX);
      const v = psi(s, z, L);
      vertex(px, yy - (asProb ? v * v * 1.25 : v) * ampPx);
    }
    if (asProb) vertex(x1, yy);
    endShape();
  }

  // The potential: conduction band edge
  stroke('black');
  strokeWeight(2.5);
  noFill();
  beginShape();
  vertex(x0, yOfE(V0));
  vertex(xl, yOfE(V0));
  vertex(xl, yOfE(0));
  vertex(xr, yOfE(0));
  vertex(xr, yOfE(V0));
  vertex(x1, yOfE(V0));
  endShape();
  pop();

  // Level labels at the right edge of the well (skipped where they would overlap)
  textSize(11);
  textStyle(BOLD);
  let lastY = 1e9;
  for (const s of states) {
    if (s.n > 4) break;
    const ly = yOfE(s.E) - 9;
    if (lastY - ly < 13) continue;
    chipText('E_{' + s.n + '}', Math.min(xr + 5, x1 - 44), ly, LEFT, levelColor(s.n));
    lastY = ly;
  }
  textStyle(NORMAL);

  // Region labels
  textSize(11);
  noStroke();
  fill('dimgray');
  if (xl - x0 > 70) richText(sys.barrier, (x0 + xl) / 2, y1 - 9, CENTER);
  if (x1 - xr > 96) richText(sys.barrier, (xr + x1) / 2 - 10, y1 - 9, CENTER);
  if (xr - xl > 60) richText(sys.well, (xl + xr) / 2, y1 - 9, CENTER);
  fill(150, 110, 0);
  richText('continuum: electrons are not confined', (x0 + x1) / 2, y0 + 11, CENTER);

  // Well depth: double arrow at the right edge
  const ax = x1 - 11, ya = yOfE(V0) + 3, yb = yOfE(0) - 1;
  stroke('black');
  strokeWeight(1);
  line(ax, ya, ax, yb);
  line(ax - 5, yb, ax + 5, yb);
  noStroke();
  fill('black');
  triangle(ax, ya - 2, ax - 4, ya + 6, ax + 4, ya + 6);
  triangle(ax, yb + 1, ax - 4, yb - 7, ax + 4, yb - 7);
  push();
  translate(ax - 11, (ya + yb) / 2);
  rotate(-HALF_PI);
  textSize(12);
  chipText('ΔE_{C} = ' + Math.round(V0 * 1000) + ' meV', 0, 0, CENTER, 'black');
  pop();

  plotBorder(x0, x1, y0, y1);
  push();
  translate(x0 - 44, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke();
  fill('black');
  textSize(13);
  richText('Energy above the well band edge (meV)', 0, 0, CENTER);
  pop();
  noStroke();
  fill('black');
  textSize(13);
  textAlign(CENTER, CENTER);
  text('Position z (nm)', (x0 + x1) / 2, y1 + 31);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text('Well and bound states', x0, y0 - 4);
  textStyle(NORMAL);
  if (x1 - x0 > 300) {
    textSize(11);
    const lab = 'infinite-well levels';
    const lw = textWidth(lab);
    stroke('dimgray');
    strokeWeight(1);
    drawingContext.setLineDash([2, 4]);
    line(x1 - lw - 30, y0 - 11, x1 - lw - 6, y0 - 11);
    drawingContext.setLineDash([]);
    noStroke();
    fill('dimgray');
    textAlign(RIGHT, CENTER);
    text(lab, x1, y0 - 11);
  }
}

// ---- Right plot: density of states on the same energy axis ----
function drawDosPlot(sys, L, V0, states, x0, x1, y0, y1, yOfE, eTop) {
  plotFrame(x0, x1, y0, y1);
  const g1 = dosStep(sys.mw, L);
  const gMax = niceCeil(Math.max(g1 * states.length, dosBulk(sys.mw, V0)) * 1.12);
  const xOfG = (g) => map(g, 0, gMax, x0, x1);

  // Grid
  textSize(12);
  for (const e of energyTicks(V0)) {
    stroke('gainsboro');
    strokeWeight(1);
    line(x0, yOfE(e / 1000), x1, yOfE(e / 1000));
  }
  const gStep = niceStep(gMax / 4);
  for (let g = 0; g <= gMax * 1.0001; g += gStep) {
    const xx = xOfG(g);
    stroke('gainsboro');
    strokeWeight(1);
    line(xx, y0, xx, y1);
    stroke('black');
    line(xx, y1, xx, y1 + 4);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    text(Number(g.toPrecision(6)), xx, y1 + 6);
  }

  push();
  clipTo(x0, x1, y0, y1);
  noStroke();
  fill(255, 248, 225);
  rect(x0, y0, x1 - x0, yOfE(V0) - y0);

  // Bulk: square-root curve
  noFill();
  stroke('gray');
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  beginShape();
  for (let i = 0; i <= 120; i++) {
    const u = i / 120, e = V0 * u * u;                  // dense near E = 0
    vertex(xOfG(dosBulk(sys.mw, e)), yOfE(e));
  }
  endShape();
  drawingContext.setLineDash([]);

  // Quantum well: staircase, one step for each bound level
  noStroke();
  fill(65, 105, 225, 40);
  beginShape();
  vertex(x0, yOfE(0));
  for (let i = 0; i < states.length; i++) {
    vertex(xOfG(g1 * i), yOfE(states[i].E));
    vertex(xOfG(g1 * (i + 1)), yOfE(states[i].E));
  }
  vertex(xOfG(g1 * states.length), yOfE(V0));
  vertex(x0, yOfE(V0));
  endShape(CLOSE);
  for (let i = 0; i < states.length; i++) {
    const top = i + 1 < states.length ? states[i + 1].E : V0;
    stroke('midnightblue');
    strokeWeight(2.5);
    line(xOfG(g1 * i), yOfE(states[i].E), xOfG(g1 * (i + 1)), yOfE(states[i].E));
    line(xOfG(g1 * (i + 1)), yOfE(states[i].E), xOfG(g1 * (i + 1)), yOfE(top));
    // tick in the color of the level, to tie the step to the level in the left plot
    stroke(levelColor(states[i].n));
    strokeWeight(4);
    line(x0, yOfE(states[i].E), x0 + 9, yOfE(states[i].E));
  }
  stroke('midnightblue');
  strokeWeight(2.5);
  line(x0, yOfE(0), x0, yOfE(states[0].E));
  pop();

  // Legend
  if (x1 - x0 > 170) {
    textSize(11);
    const bulkLab = 'bulk ' + sys.well;
    const boxW = Math.max(richWidth(bulkLab), textWidth('quantum well')) + 38;
    const lx = x1 - boxW - 2, ly = y1 - 34;
    noStroke();
    fill(255, 255, 255, 220);
    rect(lx - 6, ly - 9, boxW + 4, 36, 3);
    stroke('midnightblue'); strokeWeight(2.5);
    line(lx, ly, lx + 20, ly);
    stroke('gray'); strokeWeight(2);
    drawingContext.setLineDash([6, 4]);
    line(lx, ly + 17, lx + 20, ly + 17);
    drawingContext.setLineDash([]);
    noStroke(); fill('black'); textAlign(LEFT, CENTER);
    text('quantum well', lx + 26, ly);
    richText(bulkLab, lx + 26, ly + 17, LEFT);
  }

  // Caution for the nitride system
  if (systemSelect.value() === 'gan') {
    textSize(11);
    noStroke();
    fill('firebrick');
    richText(x1 - x0 > 215 ? 'GaN: polarization field left out' : 'no polarization field', (x0 + x1) / 2, y0 + 11, CENTER);
  }

  plotBorder(x0, x1, y0, y1);
  noStroke();
  fill('black');
  textSize(13);
  textAlign(CENTER, CENTER);
  richText(x1 - x0 > 200 ? 'Density of states (10^{19} cm^{−3} eV^{−1})' : 'g (10^{19} cm^{−3} eV^{−1})',
           (x0 + x1) / 2, y1 + 31, CENTER);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text('Density of states', x0, y0 - 4);
  textStyle(NORMAL);
}

// ---- Table of levels and summary ----
function drawTable(sys, L, V0, states, x0, x1, y0, y1) {
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x0, y0, x1 - x0, y1 - y0, 6);

  const wide = x1 - x0 > 560;
  const tx1 = wide ? x0 + Math.round((x1 - x0) * 0.56) : x1;   // right edge of the table part
  const c = [x0 + 12, x0 + 44, 0, 0, 0];
  const span = tx1 - 14 - c[1];
  c[2] = c[1] + span * 0.36; c[3] = c[1] + span * 0.70; c[4] = tx1 - 14;

  let y = y0 + 15;
  noStroke();
  fill('dimgray');
  textSize(12);
  richText('n', c[0], y, LEFT);
  richText('E_{n}, this well', c[2], y, RIGHT);
  richText('infinite well', c[3], y, RIGHT);
  richText('in barriers', c[4], y, RIGHT);
  stroke('gainsboro');
  line(x0 + 8, y + 10, tx1 - 8, y + 10);
  y += 22;
  textSize(13);
  for (let n = 1; n <= 4; n++) {
    const s = states[n - 1];
    const einf = H2M * Math.pow(n * Math.PI / L, 2) / sys.mw;
    noStroke();
    fill(levelColor(n));
    textStyle(BOLD);
    richText(String(n), c[0], y, LEFT);
    textStyle(NORMAL);
    fill('black');
    if (s) {
      richText(fmtE(s.E), c[2], y, RIGHT);
      richText((100 * s.outside).toFixed(1) + ' %', c[4], y, RIGHT);
    } else {
      fill('gray');
      richText('not bound', c[2], y, RIGHT);
      richText('—', c[4], y, RIGHT);
    }
    fill('dimgray');
    richText(fmtE(einf), c[3], y, RIGHT);
    y += 19;
  }

  // Summary text
  const g2d = sys.mw / (2 * Math.PI * H2M) * 1e14;        // cm^-2 eV^-1
  const lines = [
    'Well ' + sys.well + ': m_{w} = ' + fmtMass(sys.mw) + ' m_{0}',
    'Barrier ' + sys.barrier + ': m_{b} = ' + fmtMass(sys.mb) + ' m_{0}',
    'Bound states: ' + states.length + (states.length > 4 ? ' (first 4 listed)' : ''),
    'Step: m_{w}/πħ^{2} = ' + sci(g2d, 2) + ' cm^{−2} eV^{−1}',
    '÷ L_{z} = ' + sci(g2d / (L * 1e-7), 2) + ' cm^{−3} eV^{−1}'
  ];
  if (wide) {
    stroke('gainsboro');
    line(tx1, y0 + 8, tx1, y1 - 8);
    noStroke();
    fill('black');
    textSize(12);
    let yy = y0 + 16;
    for (const ln of lines) {
      richText(ln, tx1 + 12, yy, LEFT);
      yy += 19;
    }
  }
}

function drawControlLabels(L, V0) {
  const c2 = columnTwoX();
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Material:', 10, drawHeight + 20);
  richText('Well width L_{z}: ' + L.toFixed(1) + ' nm', 10, drawHeight + 55, LEFT);
  richText('Band offset ΔE_{C}: ' + V0.toFixed(2) + ' eV', c2, drawHeight + 55, LEFT);
}

// ---------------------------------------------------------------------------
// Controls and helpers
// ---------------------------------------------------------------------------

function columnTwoX() {
  return Math.round(canvasWidth / 2) + 8;
}

function layoutControls() {
  const c2 = columnTwoX();
  const lw1 = 172, lw2 = 186;
  widthSlider.position(10 + lw1, drawHeight + 45);
  widthSlider.size(Math.max(40, c2 - 10 - lw1 - 18));
  depthSlider.position(c2 + lw2, drawHeight + 45);
  depthSlider.size(Math.max(40, canvasWidth - (c2 + lw2) - margin));
  // On a narrow canvas the first checkbox label is shortened so the row still fits
  const narrow = canvasWidth < 550;
  const span = psiCheckbox.elt.querySelector('span');
  if (span) span.textContent = narrow ? ' Show ψ' : ' Show wavefunctions';
  psiCheckbox.position(narrow ? 198 : 222, drawHeight + 9);
  probCheckbox.position(narrow ? 282 : 388, drawHeight + 9);
  resetButton.position(Math.max(362, canvasWidth - 72), drawHeight + 8);
}

function resetDefaults() {
  systemSelect.selected('gaas');
  psiCheckbox.checked(true);
  probCheckbox.checked(false);
  widthSlider.value(10);
  depthSlider.value(0.25);
}

function fmtMass(m) { return m < 0.1 ? m.toFixed(3) : m.toFixed(2); }

// Energy in eV formatted in meV, or in eV above 1 eV
function fmtE(e) {
  const m = e * 1000;
  if (m >= 1000) return (e >= 10 ? e.toFixed(1) : e.toFixed(2)) + ' eV';
  return (m >= 100 ? m.toFixed(0) : m.toFixed(1)) + ' meV';
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

// Scientific notation in richText markup, e.g. "2.80 × 10^{13}"
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
    if (typeof depthSlider !== 'undefined' && depthSlider) layoutControls();
  }
}
