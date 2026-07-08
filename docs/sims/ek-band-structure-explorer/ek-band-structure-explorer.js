// Interactive E-k Band Structure Explorer
// CANVAS_HEIGHT: 580
// Schematic E-k diagrams along high-symmetry directions for Si, Ge, GaAs, GaN, and the free-electron case.

let containerWidth;
let canvasWidth = 950;
let drawHeight = 440;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 14;

let materialSelect, massCheckbox, pathSelect;

const materials = {
  "Si (indirect, 1.12 eV)": {
    eg: 1.12,
    type: "indirect",
    cbmLabel: "X (near k≈0.85)",
    mn: 1.08, mhh: 0.49, mlh: 0.16,
    path: "L–Γ–X",
    bands: [
      // valence: HH and LH at Γ
      { k0: 0, vE: 0,    curv: 'down', alpha: 0.6,  color: '#2e7d32', label: 'HH', labelK: -0.75, dashed: false },
      { k0: 0, vE: 0,    curv: 'down', alpha: 1.6,  color: '#66bb6a', label: 'LH', labelK: -0.35, dashed: false },
      { k0: 0, vE: -0.04,curv: 'down', alpha: 0.7,  color: '#a5d6a7', label: 'SO', labelK: 0.6,  dashed: false },
      // conduction: X valleys at ±0.85
      { k0:  0.85, vE: 1.12, curv: 'up', alpha: 2.5, color: '#1565c0', label: 'CBM (X)' , dashed: false },
      { k0: -0.85, vE: 1.12, curv: 'up', alpha: 2.5, color: '#1565c0', label: '',           dashed: false },
      // Γ CB (higher, ~3.4 eV)
      { k0: 0, vE: 3.4, curv: 'up', alpha: 1.2, color: '#90caf9', label: 'Γ (higher)', dashed: false }
    ]
  },
  "Ge (indirect, 0.66 eV)": {
    eg: 0.66,
    type: "indirect",
    cbmLabel: "L (k=±1.0)",
    mn: 0.55, mhh: 0.33, mlh: 0.043,
    path: "L–Γ–X",
    bands: [
      { k0: 0, vE: 0,    curv: 'down', alpha: 0.45, color: '#2e7d32', label: 'HH', labelK: -0.75, dashed: false },
      { k0: 0, vE: 0,    curv: 'down', alpha: 2.5,  color: '#66bb6a', label: 'LH', labelK: -0.3,  dashed: false },
      // CBM at L (k=±1)
      { k0:  1.0, vE: 0.66, curv: 'up', alpha: 1.8, color: '#1565c0', label: 'CBM (L)', dashed: false },
      { k0: -1.0, vE: 0.66, curv: 'up', alpha: 1.8, color: '#1565c0', label: '',         dashed: false },
      // Γ CB
      { k0: 0, vE: 0.80, curv: 'up', alpha: 2.4, color: '#90caf9', label: 'Γ', dashed: false },
      // X CB
      { k0: 1.0, vE: 1.10, curv: 'up', alpha: 1.5, color: '#bbdefb', label: 'X', dashed: true }
    ]
  },
  "GaAs (direct, 1.42 eV)": {
    eg: 1.42,
    type: "direct",
    cbmLabel: "Γ",
    mn: 0.067, mhh: 0.51, mlh: 0.082,
    path: "L–Γ–X",
    bands: [
      { k0: 0, vE: 0,    curv: 'down', alpha: 0.55, color: '#2e7d32', label: 'HH', labelK: -0.75, dashed: false },
      { k0: 0, vE: 0,    curv: 'down', alpha: 2.8,  color: '#66bb6a', label: 'LH', labelK: -0.3,  dashed: false },
      { k0: 0, vE: 1.42, curv: 'up', alpha: 4.0, color: '#1565c0', label: 'CBM (Γ)', dashed: false },
      { k0: 1.0, vE: 1.90, curv: 'up', alpha: 1.6, color: '#90caf9', label: 'X', dashed: true },
      { k0: -1.0, vE: 1.71, curv: 'up', alpha: 1.6, color: '#90caf9', label: 'L', dashed: true }
    ]
  },
  "GaN (direct, 3.40 eV)": {
    eg: 3.40,
    type: "direct",
    cbmLabel: "Γ",
    mn: 0.2, mhh: 1.4, mlh: 0.3,
    path: "K–Γ–M",
    bands: [
      { k0: 0, vE: 0,    curv: 'down', alpha: 0.30, color: '#2e7d32', label: 'HH', labelK: -0.8,  dashed: false },
      { k0: 0, vE: 0,    curv: 'down', alpha: 1.0,  color: '#66bb6a', label: 'LH', labelK: -0.45, dashed: false },
      { k0: 0, vE: 3.40, curv: 'up', alpha: 2.0, color: '#1565c0', label: 'CBM (Γ)', dashed: false }
    ]
  },
  "Free Electron": {
    eg: 0,
    type: "free",
    cbmLabel: "—",
    mn: 1.0, mhh: null, mlh: null,
    path: "−π/a – 0 – π/a",
    bands: [
      // Single parabola E = (ħ²k²/2m_e) — but show a "Bragg gap" at zone boundary
      { k0: 0, vE: 0, curv: 'up', alpha: 2.5, color: '#1565c0', label: 'Free electron', dashed: false }
    ]
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  materialSelect = createSelect();
  for (const k of Object.keys(materials)) materialSelect.option(k);
  materialSelect.selected("Si (indirect, 1.12 eV)");
  materialSelect.position(sliderLeftMargin, drawHeight + 8);

  massCheckbox = createCheckbox('Show effective-mass parabolas', true);
  massCheckbox.position(20, drawHeight + 50);

  pathSelect = createSelect();
  pathSelect.option('L–Γ–X (cubic)');
  pathSelect.option('K–Γ–M (hexagonal)');
  pathSelect.selected('L–Γ–X (cubic)');
  pathSelect.position(sliderLeftMargin, drawHeight + 78);

  describe('Schematic E-k diagram for selected semiconductor along a high-symmetry path. Shows VBM, CBM, bandgap, and effective-mass parabolas.', LABEL);
}

function draw() {
  updateCanvasSize();

  background('aliceblue');
  stroke('silver');
  strokeWeight(1);
  noFill();
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(20);
  textStyle(BOLD);
  text('E-k Band Structure', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const matName = materialSelect.value();
  const mat = materials[matName];

  const leftPanelW = canvasWidth * 0.7;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  const plotX = margin + 36;
  const plotY = 50;
  const plotW = leftPanelW - plotX - 10;
  const plotH = drawHeight - plotY - 50;
  const plotBottom = plotY + plotH;

  // E axis: from -1.0 to E_g + 3.5
  const eMin = -1.5;
  const eMax = (matName === "Free Electron") ? 5.0 : (mat.eg + 3.5);
  const yFromE = (E) => map(E, eMin, eMax, plotBottom, plotY);

  const kMin = -1.0, kMax = 1.0;
  const xFromK = (k) => map(k, kMin, kMax, plotX, plotX + plotW);

  // Axes
  stroke('black');
  strokeWeight(1.5);
  line(plotX, plotBottom, plotX + plotW, plotBottom);
  line(plotX, plotY, plotX, plotBottom);

  // x ticks for high-symmetry points
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  textStyle(BOLD);
  let pathLabels;
  if (mat.path === "K–Γ–M") pathLabels = [["K", -1.0], ["Γ", 0.0], ["M", 1.0]];
  else if (matName === "Free Electron") pathLabels = [["-π/a", -1.0], ["0", 0.0], ["π/a", 1.0]];
  else pathLabels = [["L", -1.0], ["Γ", 0.0], ["X", 1.0]];
  for (const p of pathLabels) {
    const xp = xFromK(p[1]);
    stroke('black');
    strokeWeight(1.5);
    line(xp, plotBottom, xp, plotBottom + 6);
    noStroke();
    text(p[0], xp, plotBottom + 8);
  }
  textStyle(NORMAL);
  textSize(12);
  text("Wave vector k", plotX + plotW / 2, plotBottom + 32);

  // E axis label
  push();
  translate(plotX - 24, (plotY + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Energy E (eV)", 0, 0);
  pop();

  // VBM (E=0) and CBM (E_g) reference lines
  stroke(150);
  strokeWeight(1);
  drawDashedLine(plotX, yFromE(0), plotX + plotW, yFromE(0));
  if (matName !== "Free Electron") {
    drawDashedLine(plotX, yFromE(mat.eg), plotX + plotW, yFromE(mat.eg));
  }
  noStroke();
  fill(80);
  textSize(11);
  // both labels sit inside the gap region at the left edge, where no
  // band curve can pass (keeps them clear of CBM markers and curves)
  drawSubscriptLabel("E", "V", plotX + 24, yFromE(0) - 3);
  if (matName !== "Free Electron") drawSubscriptLabel("E", "C", plotX + 24, yFromE(mat.eg) + 14);

  // Shade gap region
  if (matName !== "Free Electron") {
    noStroke();
    fill(255, 235, 59, 60);
    rect(plotX, yFromE(mat.eg), plotW, yFromE(0) - yFromE(mat.eg));
    fill(80);
    textAlign(CENTER, CENTER);
    textSize(11);
    text("Eg = " + mat.eg.toFixed(2) + " eV", plotX + plotW / 2, (yFromE(0) + yFromE(mat.eg)) / 2);
  }

  // Draw each band
  for (const b of mat.bands) {
    drawBand(b, xFromK, yFromE, kMin, kMax, eMin, eMax, mat);
  }

  // Free Electron specific: draw Bragg gap at zone edges
  if (matName === "Free Electron") {
    // Mark a gap at zone boundaries
    stroke('#b71c1c');
    strokeWeight(2);
    line(xFromK(-1.0), yFromE(2.0), xFromK(-1.0), yFromE(2.5));
    line(xFromK( 1.0), yFromE(2.0), xFromK( 1.0), yFromE(2.5));
    noStroke();
    fill('#b71c1c');
    textAlign(CENTER, TOP);
    textSize(10);
    text("Bragg gap", xFromK(-1.0), yFromE(2.0) + 4);
    text("Bragg gap", xFromK( 1.0), yFromE(2.0) + 4);
  }

  // Effective-mass parabolas (overlay)
  if (massCheckbox.checked() && matName !== "Free Electron") {
    drawEffectiveMassParabolas(mat, xFromK, yFromE);
  }

  // Mark CBM and VBM
  if (matName !== "Free Electron") {
    // VBM at Γ
    fill('#1b5e20');
    stroke(40);
    strokeWeight(1);
    circle(xFromK(0), yFromE(0), 9);
    // CBM
    fill('#0d47a1');
    if (mat.type === "indirect") {
      // get cbm location from bands (find cbm in bands)
      // For Si k=±0.85, for Ge k=±1.0
      const cbm = mat.bands.find(b => b.label.startsWith('CBM'));
      if (cbm) circle(xFromK(cbm.k0), yFromE(cbm.vE), 9);
    } else if (mat.type === "direct") {
      circle(xFromK(0), yFromE(mat.eg), 9);
    }
    noStroke();
  }

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, 50, rightPanelW, matName, mat);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Material:", 10, drawHeight + 18);
  text("BZ path:", 10, drawHeight + 88);
}

function drawBand(b, xFromK, yFromE, kMin, kMax, eMin, eMax, mat) {
  noFill();
  stroke(b.color);
  strokeWeight(2);
  if (b.dashed) drawingContext.setLineDash([5, 4]);
  beginShape();
  for (let k = kMin; k <= kMax; k += 0.01) {
    const E = (b.curv === 'down')
      ? (b.vE - b.alpha * (k - b.k0) * (k - b.k0))
      : (b.vE + b.alpha * (k - b.k0) * (k - b.k0));
    if (E < eMin || E > eMax) {
      if (drawingContext) {
        // commit and start new shape
        endShape();
        beginShape();
        continue;
      }
    } else {
      vertex(xFromK(k), yFromE(E));
    }
  }
  endShape();
  if (b.dashed) drawingContext.setLineDash([]);
  noStroke();

  // Label — anchored at labelK (if given) so bands sharing the same
  // vertex (HH/LH/SO at Γ) don't stack their labels on one point.
  if (b.label && b.label.length > 0) {
    fill(b.color);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    const lk = (b.labelK !== undefined) ? b.labelK : b.k0;
    const lE = (b.curv === 'down')
      ? (b.vE - b.alpha * (lk - b.k0) * (lk - b.k0))
      : (b.vE + b.alpha * (lk - b.k0) * (lk - b.k0));
    const lx = xFromK(lk);
    const ly = (b.curv === 'down') ? yFromE(lE) + 12 : yFromE(lE) - 12;
    text(b.label, lx, ly);
  }
}

function drawEffectiveMassParabolas(mat, xFromK, yFromE) {
  // Red dashed parabola at CBM (using m_n*)
  const cbm = mat.bands.find(b => b.label.startsWith('CBM') || b.label === 'CBM (Γ)');
  if (cbm) {
    drawingContext.setLineDash([4, 3]);
    stroke('#d32f2f');
    strokeWeight(1.5);
    noFill();
    const alphaFit = 1.0 / mat.mn;
    beginShape();
    for (let k = cbm.k0 - 0.4; k <= cbm.k0 + 0.4; k += 0.01) {
      const E = cbm.vE + alphaFit * (k - cbm.k0) * (k - cbm.k0);
      if (E < mat.eg + 3.5) vertex(xFromK(k), yFromE(E));
    }
    endShape();
    drawingContext.setLineDash([]);
    noStroke();
    fill('#d32f2f');
    textSize(10);
    text("m* = " + mat.mn.toFixed(2) + " m₀", xFromK(cbm.k0), yFromE(cbm.vE) - 28);
  }
  // Blue dashed parabolas at VBM for HH and LH
  drawingContext.setLineDash([4, 3]);
  stroke('#1565c0');
  strokeWeight(1.5);
  noFill();
  const alphaHH = 1.0 / mat.mhh;
  beginShape();
  for (let k = -0.3; k <= 0.3; k += 0.01) {
    const E = -alphaHH * k * k;
    vertex(xFromK(k), yFromE(E));
  }
  endShape();
  if (mat.mlh) {
    const alphaLH = 1.0 / mat.mlh;
    beginShape();
    for (let k = -0.3; k <= 0.3; k += 0.01) {
      const E = -alphaLH * k * k;
      vertex(xFromK(k), yFromE(E));
    }
    endShape();
  }
  drawingContext.setLineDash([]);
  noStroke();
}

function drawInfoPanel(x, y, w, name, mat) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, drawHeight - y - 20);
  noStroke();

  const pad = 12;
  let cy = y + 14;

  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text(name.split(' (')[0], x + pad, cy);
  cy += 28;

  textStyle(NORMAL);
  textSize(13);
  if (mat.eg > 0) {
    text("Bandgap: " + mat.eg.toFixed(2) + " eV", x + pad, cy);
    cy += 20;
  }

  if (mat.type === "direct") {
    fill('#2e7d32');
    textStyle(BOLD);
    text("Direct gap", x + pad, cy);
    textStyle(NORMAL);
    fill('black');
  } else if (mat.type === "indirect") {
    fill('#e65100');
    textStyle(BOLD);
    text("Indirect gap", x + pad, cy);
    textStyle(NORMAL);
    fill('black');
  } else {
    fill('#1565c0');
    textStyle(BOLD);
    text("Free electron", x + pad, cy);
    textStyle(NORMAL);
    fill('black');
  }
  cy += 26;

  textSize(12);
  text("CBM: " + mat.cbmLabel, x + pad, cy);
  cy += 22;
  text("BZ path: " + mat.path, x + pad, cy);
  cy += 26;

  if (mat.mn) {
    text("Electron m*: " + mat.mn.toFixed(3) + " m₀", x + pad, cy);
    cy += 18;
  }
  if (mat.mhh) {
    text("Heavy hole m*: " + mat.mhh.toFixed(3) + " m₀", x + pad, cy);
    cy += 18;
  }
  if (mat.mlh) {
    text("Light hole m*: " + mat.mlh.toFixed(3) + " m₀", x + pad, cy);
    cy += 22;
  }

  fill(80);
  textSize(11);
  text("Schematic only — curves approximate the qualitative E(k) along the chosen path.", x + pad, cy, w - 2 * pad);
}

function drawDashedLine(x1, y1, x2, y2) {
  const len = dist(x1, y1, x2, y2);
  if (len === 0) return;
  const dashLen = 5;
  const gapLen = 3;
  const total = dashLen + gapLen;
  const dirX = (x2 - x1) / len;
  const dirY = (y2 - y1) / len;
  let d = 0;
  while (d < len) {
    const sx = x1 + dirX * d;
    const sy = y1 + dirY * d;
    const ex = x1 + dirX * Math.min(d + dashLen, len);
    const ey = y1 + dirY * Math.min(d + dashLen, len);
    line(sx, sy, ex, ey);
    d += total;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}

// Draw "E" with a true subscript, anchored at the right-bottom corner.
function drawSubscriptLabel(main, sub, xRight, yBottom) {
  push();
  const ms = textSize();
  const ss = ms * 0.75;
  textAlign(LEFT, BOTTOM);
  const mainW = textWidth(main);
  textSize(ss);
  const subW = textWidth(sub);
  textSize(ms);
  const startX = xRight - mainW - subW;
  text(main, startX, yBottom);
  textSize(ss);
  text(sub, startX + mainW, yBottom + 2);
  pop();
}
