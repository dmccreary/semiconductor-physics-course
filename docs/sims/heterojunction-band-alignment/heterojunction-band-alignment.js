// Heterojunction Band Alignment Visualizer MicroSim
// CANVAS_HEIGHT: 632
//
// Two semiconductors are placed side by side on a common vacuum level
// (Anderson's rule) and their band edges are compared:
//   Delta E_C = chi_A - chi_B            (conduction band offset)
//   Delta E_V = (E_gB - E_gA) - Delta E_C  (valence band offset)
// so that Delta E_C + Delta E_V = Delta E_g. The alignment is classified as
//   Type I   (straddling): one gap lies entirely inside the other
//   Type II  (staggered):  both edges step the same way, gaps still overlap
//   Type III (broken):     E_C of one material lies below E_V of the other
// The right-hand panel sketches the junction in equilibrium: the Fermi level
// is flat, the vacuum level is continuous, and the band offsets are kept at
// the interface. The band bending there is schematic (see index.md).
//
// Material data: 300 K bandgaps as used in this book and commonly tabulated
// electron affinities. Al(x)Ga(1-x)As uses the measured 67:33 offset split
// quoted in Section 12.6.1 rather than Anderson's rule.

// ---- Canvas layout (standard MicroSim regions) ----
let canvasWidth = 800;             // responsive; reset from container width
let drawHeight = 517;              // drawing region height
let controlHeight = 115;           // control region height (3 rows)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 270;        // label + value sit left of the slider
let defaultTextSize = 14;

// ---- Material data (300 K) ----
// eg: bandgap (eV); chi: electron affinity (eV); col: fill color of the gap
const MATERIALS = [
  { key: 'Si',     label: 'Si',   eg: 1.12,  chi: 4.05, gap: 'indirect', col: [176, 196, 222] },
  { key: 'Ge',     label: 'Ge',   eg: 0.66,  chi: 4.00, gap: 'indirect', col: [200, 200, 200] },
  { key: 'GaAs',   label: 'GaAs', eg: 1.424, chi: 4.07, gap: 'direct',   col: [255, 218, 185] },
  { key: 'AlGaAs', label: 'AlGaAs', alloy: true,                          col: [255, 239, 170] },
  { key: 'InAs',   label: 'InAs', eg: 0.36,  chi: 4.90, gap: 'direct',   col: [216, 191, 216] },
  { key: 'InP',    label: 'InP',  eg: 1.35,  chi: 4.38, gap: 'direct',   col: [188, 226, 200] },
  { key: 'GaSb',   label: 'GaSb', eg: 0.72,  chi: 4.06, gap: 'direct',   col: [240, 200, 200] },
  { key: 'GaN',    label: 'GaN',  eg: 3.40,  chi: 4.10, gap: 'direct',   col: [190, 220, 245] },
  { key: 'CdTe',   label: 'CdTe', eg: 1.50,  chi: 4.28, gap: 'direct',   col: [225, 215, 190] }
];

const EF_OFFSET = 0.10;            // Fermi level sits this far from the majority band edge (eV)

// ---- Controls ----
let matASelect, matBSelect, dopASelect, dopBSelect, alloySlider, vacuumCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  matASelect = createSelect();
  matBSelect = createSelect();
  for (const m of MATERIALS) {
    const name = m.alloy ? 'AlGaAs (x by slider)' : m.label;
    matASelect.option(name, m.key);
    matBSelect.option(name, m.key);
  }
  matASelect.selected('GaAs');
  matBSelect.selected('AlGaAs');
  matASelect.changed(syncAlloySlider);
  matBSelect.changed(syncAlloySlider);

  dopASelect = createSelect();
  dopBSelect = createSelect();
  for (const s of [dopASelect, dopBSelect]) {
    s.option('n-type', 'n');
    s.option('p-type', 'p');
  }
  dopASelect.selected('p');
  dopBSelect.selected('n');

  alloySlider = createSlider(0, 1, 0.3, 0.01);
  alloySlider.position(sliderLeftMargin, drawHeight + 45);

  vacuumCheckbox = createCheckbox(' Show vacuum level reference', true);
  vacuumCheckbox.position(10, drawHeight + 80);
  vacuumCheckbox.style('font-size', '14px');

  layoutControls();
  syncAlloySlider();

  describe('Two band diagrams for a pair of semiconductors chosen from two ' +
    'menus. The left diagram places both materials on a common vacuum level ' +
    'and marks each electron affinity and bandgap, with arrows for the ' +
    'conduction and valence band offsets. The right diagram sketches the ' +
    'junction in equilibrium with a flat Fermi level and band bending. A ' +
    'panel below states whether the alignment is Type I straddling, Type II ' +
    'staggered, or Type III broken gap, shows the Anderson rule arithmetic, ' +
    'and says where electrons and holes collect. A slider sets the aluminum ' +
    'fraction of aluminum gallium arsenide.', LABEL);
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Al(x)Ga(1-x)As at 300 K. Bandgap: direct below x = 0.45, indirect (X valley)
// above. The valence band edge moves down by 0.33 * 1.247 x eV, which gives the
// 67:33 split of the direct-gap difference quoted in Section 12.6.1. The
// electron affinity returned here is the effective value that reproduces
// those offsets on a common vacuum level.
function algaas(x) {
  const egGaAs = 1.424, chiGaAs = 4.07;
  const eg = x < 0.45 ? egGaAs + 1.247 * x : 1.900 + 0.125 * x + 0.143 * x * x;
  const dEv = 0.33 * 1.247 * x;                  // valence band step relative to GaAs
  const dEc = (eg - egGaAs) - dEv;               // conduction band step relative to GaAs
  return { eg: eg, chi: chiGaAs - dEc, gap: x < 0.45 ? 'direct' : 'indirect' };
}

// Band edges of one side on the vacuum scale (vacuum level = 0, energies in eV)
function sideData(key, doping, x) {
  const m = MATERIALS.find((mm) => mm.key === key);
  const props = m.alloy ? algaas(x) : m;
  const ec = -props.chi, ev = -props.chi - props.eg;
  const delta = Math.min(EF_OFFSET, props.eg / 2);
  const ef = doping === 'n' ? ec - delta : ev + delta;
  let name = m.label;
  if (m.alloy) {
    name = x <= 0.005 ? 'GaAs' : x >= 0.995 ? 'AlAs'
      : 'Al_{' + x.toFixed(2) + '}Ga_{' + (1 - x).toFixed(2) + '}As';
  }
  return {
    key: key, name: name, eg: props.eg, chi: props.chi, gap: props.gap,
    ec: ec, ev: ev, ef: ef, doping: doping, col: m.col, alloy: !!m.alloy,
    workFunction: -ef
  };
}

// Offsets (B relative to A, chapter sign convention) and the alignment type
function alignment(A, B) {
  const dEc = A.chi - B.chi;                     // = E_C(B) - E_C(A)
  const dEg = B.eg - A.eg;
  const dEv = dEg - dEc;                         // = E_V(A) - E_V(B)
  const tol = 0.005;
  let type;
  if (Math.abs(dEc) < tol && Math.abs(dEv) < tol) type = 'none';
  else if (A.ec < B.ev - tol || B.ec < A.ev - tol) type = 'III';
  else if ((dEc >= -tol && dEv >= -tol) || (dEc <= tol && dEv <= tol)) type = 'I';
  else type = 'II';
  return { dEc: dEc, dEv: dEv, dEg: dEg, type: type };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function draw() {
  updateCanvasSize();
  if (width !== canvasWidth) resizeCanvas(canvasWidth, canvasHeight);

  const x = alloySlider.value();
  const A = sideData(matASelect.value(), dopASelect.value(), x);
  const B = sideData(matBSelect.value(), dopBSelect.value(), x);
  const al = alignment(A, B);

  // Region backgrounds (required MicroSim style)
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Geometry: two panels side by side
  const leftPad = 50, gap = 62, rightPad = 12;
  const total = canvasWidth - leftPad - gap - rightPad;
  const lx0 = leftPad, lx1 = leftPad + total * 0.54;
  const rx0 = lx1 + gap, rx1 = canvasWidth - rightPad;
  const y0 = 62, y1 = 362;

  drawFlatBandPanel(lx0, lx1, y0, y1, A, B, al);
  drawEquilibriumPanel(rx0, rx1, y0, y1, A, B, al);
  drawSummary(A, B, al);

  // Title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 640 ? 17 : 20);
  textStyle(BOLD);
  text('Heterojunction Band Alignment Visualizer', canvasWidth / 2, 10);
  textStyle(NORMAL);

  drawControlLabels(x);
}

function typeColor(type) {
  return type === 'I' ? 'seagreen' : type === 'II' ? 'darkorange'
       : type === 'III' ? 'crimson' : 'dimgray';
}

function sideLabel(letter, S) {
  return letter + ': ' + S.doping + '-' + S.name;
}

// ---- Left panel: both materials on a common vacuum level ----
function drawFlatBandPanel(x0, x1, y0, y1, A, B, al) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  const showVac = vacuumCheckbox.checked();
  // the highest drawn level sits 56 px (48 px with the vacuum level) below the
  // top, the lowest valence band edge 44 px above the bottom
  const eMax = showVac ? 0 : Math.max(A.ec, B.ec), eMin = Math.min(A.ev, B.ev);
  const topPx = showVac ? 48 : 56, botPx = 44;
  const pxPerEv = (y1 - y0 - topPx - botPx) / (eMax - eMin);
  const yOf = (e) => y0 + topPx + (eMax - e) * pxPerEv;
  const eLow = eMin - botPx / pxPerEv, eHigh = eMax + topPx / pxPerEv;

  // Energy ticks, measured from the vacuum level
  const stepE = (eHigh - eLow) > 5 ? 1 : 0.5;
  textSize(12);
  for (let e = Math.ceil((eLow + 0.1) / stepE) * stepE; e <= Math.min(eHigh - 0.1, 0.01); e += stepE) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOf(e), x1, yOf(e));
    stroke('black');
    line(x0 - 4, yOf(e), x0, yOf(e));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(Math.abs(e) < 1e-9 ? '0' : e.toFixed(stepE < 1 ? 1 : 0).replace('-', '−'), x0 - 6, yOf(e));
  }

  // Two blocks with a gap between them for the offset arrows
  const w = x1 - x0;
  const midW = Math.max(96, w * 0.27);
  const ax0 = x0 + 8, ax1 = x0 + (w - midW) / 2;
  const bx0 = x1 - (w - midW) / 2, bx1 = x1 - 8;

  const sides = [[A, ax0, ax1, 'A'], [B, bx0, bx1, 'B']];
  for (const [S, sx0, sx1, letter] of sides) {
    // forbidden gap
    noStroke();
    fill(S.col[0], S.col[1], S.col[2], 150);
    rect(sx0, yOf(S.ec), sx1 - sx0, yOf(S.ev) - yOf(S.ec));
    // band edges
    stroke('black');
    strokeWeight(2.5);
    line(sx0, yOf(S.ec), sx1, yOf(S.ec));
    line(sx0, yOf(S.ev), sx1, yOf(S.ev));
    // Fermi level
    stroke('darkgreen');
    strokeWeight(1.5);
    drawingContext.setLineDash([6, 4]);
    line(sx0, yOf(S.ef), sx1, yOf(S.ef));
    drawingContext.setLineDash([]);
    // vacuum level and electron affinity
    const cx = (sx0 + sx1) / 2;
    if (showVac) {
      stroke('dimgray');
      strokeWeight(1.5);
      line(sx0, yOf(0), sx1, yOf(0));
      const xa = sx0 + (sx1 - sx0) * 0.72;
      doubleArrow(xa, yOf(0), xa, yOf(S.ec), 'dimgray');
      textSize(12);
      chipText('χ = ' + S.chi.toFixed(2), xa - 6, (yOf(0) + yOf(S.ec)) / 2, RIGHT, 'dimgray');
    }
    // bandgap arrow and labels
    const xg = sx0 + (sx1 - sx0) * 0.72;
    const gapPx = yOf(S.ev) - yOf(S.ec);
    textSize(12);
    if (gapPx > 30) {
      doubleArrow(xg, yOf(S.ec), xg, yOf(S.ev), 'black');
      chipText('E_{g} = ' + S.eg.toFixed(2), xg - 6, (yOf(S.ec) + yOf(S.ev)) / 2, RIGHT, 'black');
    } else {
      noStroke(); fill('black');
      richText('E_{g} = ' + S.eg.toFixed(2), cx, yOf(S.ev) + 26, CENTER);
    }
    noStroke();
    fill('black');
    richText('E_{C}', sx0 + 3, yOf(S.ec) - 9, LEFT);
    richText('E_{V}', sx0 + 3, yOf(S.ev) + 10, LEFT);
    if (gapPx > 30) {                          // no room for the label in a narrow gap
      fill('darkgreen');
      richText('E_{F}', sx1 - 3, yOf(S.ef) + (S.doping === 'n' ? 9 : -9), RIGHT);
    }
    // side name above the block
    fill('black');
    textStyle(BOLD);
    fitText(sideLabel(letter, S), cx, y0 + 13, sx1 - sx0 + 14);
    textStyle(NORMAL);
  }
  if (showVac) {
    noStroke();
    fill('dimgray');
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text('vacuum level', (ax1 + bx0) / 2, yOf(0) - 4);
    stroke('dimgray');
    strokeWeight(1);
    drawingContext.setLineDash([2, 4]);
    line(ax1, yOf(0), bx0, yOf(0));
    drawingContext.setLineDash([]);
  }

  // Offsets in the middle gap
  const mx = (ax1 + bx0) / 2;
  const col = typeColor(al.type);
  for (const [ea, eb, label, up] of [[A.ec, B.ec, 'ΔE_{C}', true], [A.ev, B.ev, 'ΔE_{V}', false]]) {
    stroke('gray');
    strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(ax1, yOf(ea), mx + 4, yOf(ea));
    line(mx - 4, yOf(eb), bx0, yOf(eb));
    drawingContext.setLineDash([]);
    if (Math.abs(yOf(ea) - yOf(eb)) > 9) {
      doubleArrow(mx, yOf(ea), mx, yOf(eb), col);
    } else {
      stroke(col);
      strokeWeight(2);
      line(mx, yOf(ea), mx, yOf(eb));
    }
    const mag = Math.abs(ea - eb);
    // two-line label above the conduction band step or below the valence band step
    const yEdge = up ? Math.min(yOf(ea), yOf(eb)) : Math.max(yOf(ea), yOf(eb));
    noStroke();
    fill(col);
    textSize(12);
    textStyle(BOLD);
    richText(label, mx, yEdge + (up ? -26 : 12), CENTER);
    richText(mag.toFixed(2) + ' eV', mx, yEdge + (up ? -12 : 26), CENTER);
    textStyle(NORMAL);
  }

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD); textAlign(CENTER, CENTER);
  text(canvasWidth < 700 ? 'Before contact' : 'Before contact: common vacuum level', (x0 + x1) / 2, y0 - 12);
  textStyle(NORMAL);
  push();
  translate(x0 - 36, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13); textAlign(CENTER, CENTER);
  text('Energy below vacuum (eV)', 0, 0);
  pop();
}

// ---- Right panel: the junction in equilibrium (schematic band bending) ----
function drawEquilibriumPanel(x0, x1, y0, y1, A, B, al) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x0, y0, x1 - x0, y1 - y0);

  // Energies measured from the common Fermi level
  const cA = A.ec - A.ef, cB = B.ec - B.ef;      // E_C - E_F far from the junction
  const vbi = B.workFunction - A.workFunction;   // vacuum level step from A to B (eV)
  const bendA = 0.5 * vbi, bendB = 0.5 * vbi;    // schematic: split equally
  const xi = (x0 + x1) / 2;                      // interface
  const wBend = (x1 - x0) * 0.30;                // bending width on each side (px)
  const ecA = (px) => cA + bendA * Math.pow(constrain(1 - (xi - px) / wBend, 0, 1), 2);
  const ecB = (px) => cB - bendB * Math.pow(constrain(1 - (px - xi) / wBend, 0, 1), 2);

  const all = [cA, cA + bendA, cB, cB - bendB,
               cA - A.eg, cA + bendA - A.eg, cB - B.eg, cB - bendB - B.eg];
  const eMax = Math.max(...all), eMin = Math.min(...all);
  const topPx = 44, botPx = 40;
  const pxPerEv = (y1 - y0 - topPx - botPx) / (eMax - eMin);
  const yOf = (e) => y0 + topPx + (eMax - e) * pxPerEv;
  const eLow = eMin - botPx / pxPerEv, eHigh = eMax + topPx / pxPerEv;

  const stepE = (eHigh - eLow) > 5 ? 1 : 0.5;
  textSize(12);
  for (let e = Math.ceil((eLow + 0.1) / stepE) * stepE; e <= eHigh - 0.1; e += stepE) {
    stroke('gainsboro'); strokeWeight(1);
    line(x0, yOf(e), x1, yOf(e));
    stroke('black');
    line(x0 - 4, yOf(e), x0, yOf(e));
    noStroke(); fill('black'); textAlign(RIGHT, CENTER);
    text(Math.abs(e) < 1e-9 ? '0' : e.toFixed(stepE < 1 ? 1 : 0).replace('-', '−'), x0 - 6, yOf(e));
  }

  // Filled gaps and band edges for both sides
  const N = 40;
  for (const [S, f, xa, xb] of [[A, ecA, x0, xi], [B, ecB, xi, x1]]) {
    noStroke();
    fill(S.col[0], S.col[1], S.col[2], 150);
    beginShape();
    for (let i = 0; i <= N; i++) { const px = xa + (xb - xa) * i / N; vertex(px, yOf(f(px))); }
    for (let i = N; i >= 0; i--) { const px = xa + (xb - xa) * i / N; vertex(px, yOf(f(px) - S.eg)); }
    endShape(CLOSE);
    noFill();
    stroke('black');
    strokeWeight(2.5);
    for (const off of [0, -S.eg]) {
      beginShape();
      for (let i = 0; i <= N; i++) { const px = xa + (xb - xa) * i / N; vertex(px, yOf(f(px) + off)); }
      endShape();
    }
  }
  // Vertical steps at the interface
  const col = typeColor(al.type);
  stroke(col);
  strokeWeight(2.5);
  line(xi, yOf(ecA(xi)), xi, yOf(ecB(xi)));
  line(xi, yOf(ecA(xi) - A.eg), xi, yOf(ecB(xi) - B.eg));

  // Flat Fermi level
  stroke('darkgreen');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 4]);
  line(x0, yOf(0), x1, yOf(0));
  drawingContext.setLineDash([]);

  // Carriers that collect at the interface where a band edge reaches the Fermi level
  const dots = [];
  if (ecA(xi) < 0.03 && bendA < 0) dots.push([xi - 12, ecA(xi - 12), 'royalblue', -1]);
  if (ecB(xi) < 0.03 && bendB > 0) dots.push([xi + 12, ecB(xi + 12), 'royalblue', -1]);
  if (ecA(xi) - A.eg > -0.03 && bendA > 0) dots.push([xi - 12, ecA(xi - 12) - A.eg, 'crimson', 1]);
  if (ecB(xi) - B.eg > -0.03 && bendB < 0) dots.push([xi + 12, ecB(xi + 12) - B.eg, 'crimson', 1]);
  for (const [px, e, c, s] of dots) {
    noStroke();
    fill(c);
    for (let k = 0; k < 3; k++) circle(px + (px < xi ? -k * 9 : k * 9), yOf(e) + s * 7, 6);
  }

  // Labels
  noStroke();
  textSize(12);
  fill('black');
  richText('E_{C}', x0 + 5, yOf(cA) - 9, LEFT);
  richText('E_{V}', x0 + 5, yOf(cA - A.eg) + 10, LEFT);
  chipText('E_{F}', x1 - 8, yOf(0), RIGHT, 'darkgreen');
  fill('black');
  textStyle(BOLD);
  fitText(sideLabel('A', A), (x0 + xi) / 2, y0 + 13, xi - x0 - 8);
  fitText(sideLabel('B', B), (xi + x1) / 2, y0 + 13, x1 - xi - 8);
  textStyle(NORMAL);
  textSize(12);
  chipText('built-in step qV_{bi} = ' + Math.abs(vbi).toFixed(2) + ' eV', (x0 + x1) / 2, y1 - 12, CENTER, 'dimgray');

  stroke('black'); strokeWeight(1); noFill();
  rect(x0, y0, x1 - x0, y1 - y0);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD); textAlign(CENTER, CENTER);
  text(canvasWidth < 700 ? 'In contact (schematic)' : 'In contact, equilibrium (schematic)',
       (x0 + x1) / 2, y0 - 12);
  textStyle(NORMAL);
  push();
  translate(x0 - 42, (y0 + y1) / 2);
  rotate(-HALF_PI);
  noStroke(); fill('black'); textSize(13); textAlign(CENTER, CENTER);
  richText('E − E_{F} (eV)', 0, 0, CENTER);
  pop();
}

// ---- Summary panel: type, Anderson's rule arithmetic, carrier confinement ----
function drawSummary(A, B, al) {
  const x = 10, y = 376, w = canvasWidth - 20, h = 133;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();

  const small = canvasWidth < 720;
  const names = {
    I: 'Type I: straddling gap',
    II: 'Type II: staggered gap',
    III: 'Type III: broken gap',
    none: 'No band offsets (same material on both sides)'
  };
  fill(typeColor(al.type));
  textStyle(BOLD);
  textSize(small ? 15 : 17);
  textAlign(LEFT, CENTER);
  text(names[al.type], x + 12, y + 18);
  textStyle(NORMAL);

  const sgn = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
  fill('black');
  textSize(small ? 12 : 13);
  richText('ΔE_{C} = χ_{A} − χ_{B} = ' + A.chi.toFixed(2) + ' − ' + B.chi.toFixed(2) +
           ' = ' + sgn(al.dEc) + ' eV', x + 12, y + 43, LEFT);
  richText('ΔE_{V} = (E_{gB} − E_{gA}) − ΔE_{C} = (' + B.eg.toFixed(2) + ' − ' + A.eg.toFixed(2) +
           ') − (' + sgn(al.dEc) + ') = ' + sgn(al.dEv) + ' eV', x + 12, y + 63, LEFT);

  // Where the carriers collect
  let msg;
  const eSide = A.ec < B.ec ? A : B, hSide = A.ev > B.ev ? A : B;
  if (al.type === 'none') {
    msg = 'A homojunction: there is no step in either band edge.';
  } else if (al.type === 'I') {
    msg = 'Electrons and holes both collect in ' + eSide.name + ', the narrower gap. ' +
          'Both carriers are confined in the same layer.';
  } else if (al.type === 'II') {
    msg = 'Electrons collect in ' + eSide.name + ' (lower E_{C}) and holes in ' + hSide.name +
          ' (higher E_{V}). The carriers are separated in space.';
  } else {
    const overlap = hSide.ev - eSide.ec;
    msg = 'E_{C} of ' + eSide.name + ' lies ' + overlap.toFixed(2) + ' eV below E_{V} of ' + hSide.name +
          '. Electrons can pass from that valence band into the conduction band.';
  }
  fill(typeColor(al.type));
  textSize(small ? 12 : 13);
  richText(msg, x + 12, y + 86, LEFT);

  // Model note
  fill('dimgray');
  textSize(small ? 11 : 12);
  let note;
  if (A.alloy || B.alloy) {
    note = 'AlGaAs: χ is an effective value set by the measured 67:33 offset split (Section 12.6.1)' +
           (alloySlider.value() >= 0.45 ? '; the gap is indirect for x ≥ 0.45.' : '.');
  } else {
    note = 'Anderson\'s rule is a first estimate. Measured offsets can differ by a few tenths of an eV.';
  }
  richText(note, x + 12, y + 110, LEFT);
  textAlign(RIGHT, CENTER);
  fill('dimgray');
  if (!small) text('A is on the left, B on the right', x + w - 12, y + 18);
}

function drawControlLabels(x) {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Material A:', 10, drawHeight + 20);
  text('Material B:', controlColumnB(), drawHeight + 20);
  const usesAlloy = matASelect.value() === 'AlGaAs' || matBSelect.value() === 'AlGaAs';
  fill(usesAlloy ? 'black' : 'gray');
  text('AlGaAs aluminum fraction x: ' + x.toFixed(2), 10, drawHeight + 55);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function controlColumnB() {
  return Math.max(308, Math.round(canvasWidth / 2) - 8);
}

function layoutControls() {
  const bx = controlColumnB();
  matASelect.position(88, drawHeight + 9);
  matASelect.size(140);
  dopASelect.position(234, drawHeight + 9);
  matBSelect.position(bx + 78, drawHeight + 9);
  matBSelect.size(140);
  dopBSelect.position(bx + 224, drawHeight + 9);
  alloySlider.size(canvasWidth - sliderLeftMargin - margin);
}

// The alloy slider only matters when one side is AlGaAs
function syncAlloySlider() {
  const usesAlloy = matASelect.value() === 'AlGaAs' || matBSelect.value() === 'AlGaAs';
  alloySlider.elt.disabled = !usesAlloy;
  alloySlider.style('opacity', usesAlloy ? '1' : '0.4');
}

function doubleArrow(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(1.5);
  line(x1, y1, x2, y2);
  const dir = y2 > y1 ? 1 : -1;
  const s = Math.min(5, Math.abs(y2 - y1) / 2.5);
  line(x1, y1, x1 - s * 0.7, y1 + dir * s);
  line(x1, y1, x1 + s * 0.7, y1 + dir * s);
  line(x2, y2, x2 - s * 0.7, y2 - dir * s);
  line(x2, y2, x2 + s * 0.7, y2 - dir * s);
}

// richText on a translucent white chip, so it stays readable over filled shapes
function chipText(str, x, y, align, col) {
  const w = richWidth(str), ts = textSize();
  const left = align === RIGHT ? x - w : align === CENTER ? x - w / 2 : x;
  noStroke();
  fill(255, 255, 255, 205);
  rect(left - 3, y - ts * 0.62, w + 6, ts * 1.3, 3);
  fill(col);
  richText(str, x, y, align);
}

// Centered richText that shrinks from 13 px until it fits in maxWidth
function fitText(str, cx, y, maxWidth) {
  let size = 13;
  textSize(size);
  while (size > 10 && richWidth(str) > maxWidth) {
    size -= 0.5;
    textSize(size);
  }
  richText(str, cx, y, CENTER);
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
    if (typeof alloySlider !== 'undefined' && alloySlider && typeof vacuumCheckbox !== 'undefined' && vacuumCheckbox) {
      layoutControls();
    }
  }
}
