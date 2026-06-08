// Direct vs Indirect Bandgap E-k Diagram Explorer
// CANVAS_HEIGHT: 580
// Shows E-k diagrams for direct-gap (GaAs, InP, GaN) and indirect-gap (Si, Ge) materials.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 480;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 14;

let materialSelect, phononCheckbox, animateButton;
let animationT = -1;
const ANIM_DURATION = 90;

const materials = {
  "GaAs (direct, 1.42 eV)":  { eg: 1.42, type: "direct",   cbmK: 0.0,   label: "Γ",        apps: "laser diodes, RF amplifiers" },
  "InP (direct, 1.35 eV)":   { eg: 1.35, type: "direct",   cbmK: 0.0,   label: "Γ",        apps: "telecom lasers, photodetectors" },
  "GaN (direct, 3.40 eV)":   { eg: 3.40, type: "direct",   cbmK: 0.0,   label: "Γ",        apps: "blue/UV LEDs, power transistors" },
  "Silicon (indirect, 1.12 eV)":   { eg: 1.12, type: "indirect", cbmK: 0.85,  label: "near X", apps: "CMOS ICs, solar cells" },
  "Germanium (indirect, 0.66 eV)": { eg: 0.66, type: "indirect", cbmK: 1.0,   label: "L",      apps: "early transistors, IR detectors" }
};

let currentMaterial = "GaAs (direct, 1.42 eV)";

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  materialSelect = createSelect();
  for (const k of Object.keys(materials)) {
    materialSelect.option(k);
  }
  materialSelect.selected(currentMaterial);
  materialSelect.position(sliderLeftMargin, drawHeight + 8);
  materialSelect.changed(() => { currentMaterial = materialSelect.value(); animationT = -1; });

  phononCheckbox = createCheckbox('Show phonon arrow', false);
  phononCheckbox.position(sliderLeftMargin, drawHeight + 38);

  animateButton = createButton('Animate optical transition');
  animateButton.position(sliderLeftMargin, drawHeight + 68);
  animateButton.mousePressed(() => { animationT = 0; });

  describe('Interactive E-k diagram comparing direct and indirect bandgap materials. Select a material to see how the conduction band minimum aligns with the valence band maximum in k-space.', LABEL);
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
  text('Direct vs Indirect Bandgap E-k Diagram', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const mat = materials[currentMaterial];

  const leftPanelW = canvasWidth * 0.65;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  // E-k diagram bounds
  const plotX = margin + 40;
  const plotY = 50;
  const plotW = leftPanelW - plotX - 10;
  const plotH = drawHeight - plotY - 30;
  const plotBottom = plotY + plotH;

  // Energy range: from -0.5 eV to E_g + 0.8 eV
  const eMin = -0.5;
  const eMax = mat.eg + 0.8;
  const yFromE = (E) => map(E, eMin, eMax, plotBottom, plotY);

  // k range: -1.0 (L) to +1.0 (X) through Γ at 0
  const kMin = -1.0;
  const kMax = 1.0;
  const xFromK = (k) => map(k, kMin, kMax, plotX, plotX + plotW);

  // Axes
  stroke('black');
  strokeWeight(1.5);
  line(plotX, plotBottom, plotX + plotW, plotBottom);
  line(plotX, plotY, plotX, plotBottom);

  // Tick marks for k axis
  const kPoints = [{ k: -1.0, lbl: "L" }, { k: 0.0, lbl: "Γ" }, { k: 1.0, lbl: "X" }];
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(13);
  for (const p of kPoints) {
    const xp = xFromK(p.k);
    stroke('black');
    line(xp, plotBottom, xp, plotBottom + 5);
    noStroke();
    textStyle(BOLD);
    text(p.lbl, xp, plotBottom + 8);
    textStyle(NORMAL);
  }
  textAlign(CENTER, TOP);
  textSize(13);
  text("Crystal momentum k →", plotX + plotW / 2, plotBottom + 28);

  // Y axis label
  push();
  translate(plotX - 28, plotY + plotH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text("Energy E (eV) ↑", 0, 0);
  pop();

  // Dashed E_V and E_C lines
  stroke(120);
  strokeWeight(1);
  drawDashedLine(plotX, yFromE(0), plotX + plotW, yFromE(0));
  drawDashedLine(plotX, yFromE(mat.eg), plotX + plotW, yFromE(mat.eg));
  noStroke();
  fill(70);
  textAlign(LEFT, CENTER);
  textSize(12);
  text("E_V", plotX + plotW + 4, yFromE(0));
  text("E_C", plotX + plotW + 4, yFromE(mat.eg));

  // Valence band (downward parabola at Γ)
  // E(k) = -alpha_v * k^2, with vertex E=0 at k=0
  const alphaV = 1.5; // curvature
  noFill();
  stroke('#2e7d32');
  strokeWeight(2.5);
  // Fill area below
  fill(200, 230, 201, 120);
  noStroke();
  beginShape();
  vertex(plotX, plotBottom);
  for (let k = kMin; k <= kMax; k += 0.02) {
    const E = -alphaV * k * k;
    vertex(xFromK(k), yFromE(E));
  }
  vertex(plotX + plotW, plotBottom);
  endShape(CLOSE);

  noFill();
  stroke('#2e7d32');
  strokeWeight(2.5);
  beginShape();
  for (let k = kMin; k <= kMax; k += 0.02) {
    const E = -alphaV * k * k;
    vertex(xFromK(k), yFromE(E));
  }
  endShape();

  // VBM marker
  noStroke();
  fill('#1b5e20');
  circle(xFromK(0), yFromE(0), 9);
  fill('black');
  textAlign(LEFT, BOTTOM);
  textSize(11);
  text("VBM (Γ)", xFromK(0) + 8, yFromE(0) - 2);

  // Label for valence band
  textAlign(LEFT, TOP);
  textSize(13);
  textStyle(ITALIC);
  fill('#1b5e20');
  text("Valence Band", plotX + 6, yFromE(eMin) - 28);
  textStyle(NORMAL);

  // Conduction band
  // For direct: parabola at k=0, vertex E=eg
  // For Si (indirect): parabolas at k=±0.85, vertex E=eg
  // For Ge: parabolas at k=±1.0, vertex E=eg
  const alphaC = 2.5;
  if (mat.type === "direct") {
    drawCBParabola(0, mat.eg, alphaC, kMin, kMax, xFromK, yFromE);
    noStroke();
    fill('#1565c0');
    circle(xFromK(0), yFromE(mat.eg), 9);
    fill('black');
    textAlign(LEFT, TOP);
    textSize(11);
    text("CBM (Γ)", xFromK(0) + 8, yFromE(mat.eg) + 4);
  } else {
    // draw two symmetric parabolas
    drawCBParabola(mat.cbmK, mat.eg, alphaC, kMin, kMax, xFromK, yFromE);
    drawCBParabola(-mat.cbmK, mat.eg, alphaC, kMin, kMax, xFromK, yFromE);
    noStroke();
    fill('#1565c0');
    circle(xFromK(mat.cbmK), yFromE(mat.eg), 9);
    circle(xFromK(-mat.cbmK), yFromE(mat.eg), 9);
    fill('black');
    textAlign(CENTER, TOP);
    textSize(11);
    text("CBM (" + mat.label + ")", xFromK(mat.cbmK), yFromE(mat.eg) + 6);
  }

  // Conduction band label
  textAlign(RIGHT, TOP);
  textSize(13);
  textStyle(ITALIC);
  fill('#0d47a1');
  text("Conduction Band", plotX + plotW - 6, plotY + 4);
  textStyle(NORMAL);

  // Animation
  if (animationT >= 0) {
    animationT++;
    if (animationT > ANIM_DURATION) {
      animationT = -1;
    } else {
      drawTransition(mat, animationT / ANIM_DURATION, xFromK, yFromE, phononCheckbox.checked());
    }
  }

  // Phonon note for direct
  if (mat.type === "direct" && phononCheckbox.checked()) {
    fill(80);
    textAlign(LEFT, BOTTOM);
    textSize(11);
    text("(No phonon needed for direct transitions)", plotX + 10, plotBottom - 4);
  }

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, plotY, rightPanelW, mat);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Material:", 10, drawHeight + 18);
  text("Options:", 10, drawHeight + 48);
}

function drawCBParabola(k0, vertexE, alpha, kMin, kMax, xFromK, yFromE) {
  noFill();
  stroke('#0d47a1');
  strokeWeight(2.5);
  beginShape();
  for (let k = kMin; k <= kMax; k += 0.02) {
    const E = vertexE + alpha * (k - k0) * (k - k0);
    // only draw within plot region
    vertex(xFromK(k), yFromE(E));
  }
  endShape();
  noStroke();
}

function drawTransition(mat, t, xFromK, yFromE, showPhonon) {
  const startX = xFromK(0);
  const startY = yFromE(0);

  if (mat.type === "direct") {
    const endY = yFromE(mat.eg);
    const curY = lerp(startY, endY, t);
    // gold arrow
    stroke('#ffb300');
    strokeWeight(3);
    line(startX, startY, startX, curY);
    drawArrowHead(startX, curY, 0, -1, '#ffb300');
    noStroke();
    fill('#ffb300');
    textAlign(LEFT, CENTER);
    textSize(12);
    textStyle(BOLD);
    text("hν = " + mat.eg.toFixed(2) + " eV", startX + 8, (startY + curY) / 2);
    textStyle(NORMAL);
  } else {
    // Two-part: vertical to (0, eg) then horizontal to (cbmK, eg)
    const endY = yFromE(mat.eg);
    const endX = xFromK(mat.cbmK);
    if (t < 0.5) {
      const subT = t / 0.5;
      const curY = lerp(startY, endY, subT);
      stroke('#ffb300');
      strokeWeight(3);
      line(startX, startY, startX, curY);
      if (subT > 0.95) drawArrowHead(startX, curY, 0, -1, '#ffb300');
    } else {
      // photon part complete
      stroke('#ffb300');
      strokeWeight(3);
      line(startX, startY, startX, endY);

      const subT = (t - 0.5) / 0.5;
      const curX = lerp(startX, endX, subT);
      stroke('#f57c00');
      strokeWeight(3);
      line(startX, endY, curX, endY);
      if (subT > 0.95) {
        const dir = (endX > startX) ? 1 : -1;
        drawArrowHead(curX, endY, dir, 0, '#f57c00');
      }
    }

    noStroke();
    fill('#ffb300');
    textAlign(LEFT, CENTER);
    textSize(12);
    textStyle(BOLD);
    text("Photon (ΔE)", startX + 8, (startY + endY) / 2);

    if (showPhonon) {
      fill('#e65100');
      textAlign(CENTER, BOTTOM);
      text("Phonon (Δk)", (startX + xFromK(mat.cbmK)) / 2, endY - 6);
    }
    textStyle(NORMAL);
  }
}

function drawArrowHead(x, y, dx, dy, col) {
  push();
  translate(x, y);
  rotate(atan2(dy, dx));
  fill(col);
  noStroke();
  triangle(0, 0, -10, -5, -10, 5);
  pop();
}

function drawInfoPanel(x, y, w, mat) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, drawHeight - y - 30);
  noStroke();

  let cy = y + 14;
  const pad = 12;

  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  // material name without parens detail
  const matName = currentMaterial.split(' (')[0];
  text(matName, x + pad, cy);
  cy += 26;

  textStyle(NORMAL);
  textSize(14);
  text("E_g = " + mat.eg.toFixed(2) + " eV", x + pad, cy);
  cy += 22;

  textStyle(BOLD);
  if (mat.type === "direct") {
    fill('#2e7d32');
    text("Gap type: Direct", x + pad, cy);
  } else {
    fill('#e65100');
    text("Gap type: Indirect", x + pad, cy);
  }
  textStyle(NORMAL);
  fill('black');
  cy += 24;

  textSize(13);
  text("CBM location: " + mat.label, x + pad, cy);
  cy += 22;

  if (mat.type === "direct") {
    fill('#2e7d32');
    text("Optical emission: High", x + pad, cy);
  } else {
    fill('#e65100');
    text("Optical emission: Low", x + pad, cy);
    cy += 18;
    fill(80);
    textSize(12);
    text("(phonon-assisted)", x + pad, cy);
  }
  cy += 24;
  fill('black');
  textSize(13);
  text("Applications:", x + pad, cy);
  cy += 18;
  textSize(12);
  fill(60);
  text(mat.apps, x + pad, cy, w - 2 * pad);
  cy += 36;

  // Emission efficiency bar
  fill('black');
  textSize(12);
  text("Emission efficiency:", x + pad, cy);
  cy += 18;
  noStroke();
  fill(220);
  rect(x + pad, cy, w - 2 * pad, 14);
  if (mat.type === "direct") {
    fill('#43a047');
    rect(x + pad, cy, (w - 2 * pad), 14);
  } else {
    fill('#fb8c00');
    rect(x + pad, cy, (w - 2 * pad) * 0.10, 14);
  }
  stroke(120);
  noFill();
  rect(x + pad, cy, w - 2 * pad, 14);
  noStroke();
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
