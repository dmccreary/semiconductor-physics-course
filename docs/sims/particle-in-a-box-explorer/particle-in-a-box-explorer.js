// Particle in a Box - Energy Level Explorer
// CANVAS_HEIGHT: 540
// 1D infinite potential well showing quantized energy levels and wave functions.

let containerWidth;
let canvasWidth = 850;
let drawHeight = 420;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 14;

let lSlider, nSlider, particleSelect, psiSquaredCheckbox;
let highlightedLevel = -1;

const HBAR = 1.0546e-34;   // J*s
const ME   = 9.1094e-31;   // kg
const EV   = 1.602e-19;    // J/eV
const HC_EV_NM = 1240;     // eV*nm

const particles = {
  "Electron (m = m_e)":         1.0,
  "GaAs electron (m = 0.067 m_e)": 0.067,
  "GaAs heavy hole (m = 0.5 m_e)": 0.5
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  lSlider = createSlider(1, 20, 10, 0.1);
  lSlider.position(sliderLeftMargin, drawHeight + 8);
  lSlider.size(canvasWidth - sliderLeftMargin - margin);

  nSlider = createSlider(1, 6, 4, 1);
  nSlider.position(sliderLeftMargin, drawHeight + 38);
  nSlider.size(canvasWidth - sliderLeftMargin - margin);

  particleSelect = createSelect();
  for (const k of Object.keys(particles)) particleSelect.option(k);
  particleSelect.selected("GaAs electron (m = 0.067 m_e)");
  particleSelect.position(sliderLeftMargin, drawHeight + 68);

  psiSquaredCheckbox = createCheckbox('Show probability density |ψ|²', true);
  psiSquaredCheckbox.position(20, drawHeight + 100);

  describe('Infinite potential well showing quantized energy levels and wave functions. Adjust well width L, number of levels, and particle effective mass.', LABEL);
}

function computeEnergy(n, L_nm, mFactor) {
  // E_n in eV: E = n^2 * pi^2 * hbar^2 / (2 m L^2)
  const L = L_nm * 1e-9;
  const m = ME * mFactor;
  const E_J = (n * n * Math.PI * Math.PI * HBAR * HBAR) / (2 * m * L * L);
  return E_J / EV;
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
  text('Particle in a Box — Energy Level Explorer', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const L = lSlider.value();
  const nMax = nSlider.value();
  const mFactor = particles[particleSelect.value()];
  const showProb = psiSquaredCheckbox.checked();

  const leftPanelW = canvasWidth * 0.6;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  // Well drawing area
  const wellPad = 40;
  const wellLeft = margin + wellPad;
  const wellRight = leftPanelW - wellPad;
  const wellTop = 50;
  const wellBottom = drawHeight - 40;
  const wellW = wellRight - wellLeft;
  const wellH = wellBottom - wellTop;

  // Compute energies
  const energies = [];
  for (let n = 1; n <= nMax; n++) energies.push(computeEnergy(n, L, mFactor));
  const eMax = energies[nMax - 1] * 1.15; // for vertical scaling

  const yFromE = (E) => map(E, 0, eMax, wellBottom, wellTop);

  // Walls (infinite potential)
  stroke(40);
  strokeWeight(3);
  line(wellLeft, wellTop - 5, wellLeft, wellBottom);
  line(wellRight, wellTop - 5, wellRight, wellBottom);
  // bottom of well
  strokeWeight(2);
  line(wellLeft, wellBottom, wellRight, wellBottom);
  noStroke();

  // Wall fill (to show "infinite" walls)
  fill(200);
  rect(wellLeft - 18, wellTop - 5, 18, wellBottom - wellTop + 5);
  rect(wellRight, wellTop - 5, 18, wellBottom - wellTop + 5);

  // Wall labels
  fill('black');
  textAlign(CENTER, TOP);
  textSize(11);
  text("V = ∞", wellLeft - 9, wellTop - 18);
  text("V = ∞", wellRight + 9, wellTop - 18);
  text("x = 0", wellLeft, wellBottom + 4);
  text("x = L = " + L.toFixed(1) + " nm", wellRight, wellBottom + 4);

  // Y axis label
  push();
  translate(wellLeft - 28, (wellTop + wellBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Energy →", 0, 0);
  pop();

  // Draw each energy level
  for (let n = 1; n <= nMax; n++) {
    const E = energies[n - 1];
    const ly = yFromE(E);

    // Energy level line
    stroke(highlightedLevel === n ? color('#d32f2f') : color(80));
    strokeWeight(highlightedLevel === n ? 2 : 1.5);
    drawDashedLine(wellLeft, ly, wellRight, ly);
    noStroke();

    // Label
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(11);
    const Estr = (E >= 1) ? E.toFixed(2) + ' eV' : (E * 1000).toFixed(2) + ' meV';
    text("n=" + n + ",  E=" + Estr, wellRight + 6, ly);

    // Wave function (and |ψ|²) centered on the level line
    const ampPixels = Math.max(14, Math.min(38, wellH / (nMax + 1) * 0.35));
    const steps = 200;
    // Probability density fill (under |ψ|²)
    if (showProb) {
      noStroke();
      fill(33, 150, 243, 70);
      beginShape();
      vertex(wellLeft, ly);
      for (let s = 0; s <= steps; s++) {
        const x = s / steps; // 0..1
        const psi = Math.sin(n * Math.PI * x);
        const prob = psi * psi;
        vertex(wellLeft + x * wellW, ly - prob * ampPixels);
      }
      vertex(wellRight, ly);
      endShape(CLOSE);
    }
    // Wave function curve
    noFill();
    stroke(highlightedLevel === n ? '#d32f2f' : '#1565c0');
    strokeWeight(2);
    beginShape();
    for (let s = 0; s <= steps; s++) {
      const x = s / steps;
      const psi = Math.sin(n * Math.PI * x);
      vertex(wellLeft + x * wellW, ly - psi * ampPixels);
    }
    endShape();
    noStroke();
  }

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, 50, rightPanelW, energies, nMax, L, mFactor);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Well width L (nm): " + L.toFixed(1), 10, drawHeight + 18);
  text("Energy levels shown: " + nMax, 10, drawHeight + 48);
  text("Particle:", 10, drawHeight + 78);
}

function drawInfoPanel(x, y, w, energies, nMax, L, mFactor) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, drawHeight - y - 20);
  noStroke();

  const pad = 10;
  let cy = y + 12;

  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text("Energy Levels", x + pad, cy);
  cy += 22;

  textStyle(NORMAL);
  textSize(11);

  // Header
  textStyle(BOLD);
  text("n", x + pad, cy);
  text("E_n", x + pad + 22, cy);
  text("E_n/E₁", x + pad + 100, cy);
  text("λ (n→1)", x + pad + 150, cy);
  textStyle(NORMAL);
  cy += 16;
  stroke(180); line(x + pad, cy, x + w - pad, cy); noStroke();
  cy += 4;

  const E1 = energies[0];
  for (let n = 1; n <= nMax; n++) {
    const E = energies[n - 1];
    const Estr = (E >= 1) ? E.toFixed(3) + ' eV' : (E * 1000).toFixed(2) + ' meV';
    const ratio = (E / E1).toFixed(0);
    let lamStr = '—';
    if (n > 1) {
      const dE = E - E1;
      const lam = HC_EV_NM / dE;
      if (lam > 1000) lamStr = (lam / 1000).toFixed(2) + ' μm';
      else lamStr = lam.toFixed(0) + ' nm';
    }
    if (highlightedLevel === n) {
      fill('#ffe082');
      rect(x + pad - 2, cy - 2, w - 2 * pad + 4, 16);
    }
    fill('black');
    text(n, x + pad, cy);
    text(Estr, x + pad + 22, cy);
    text(ratio, x + pad + 100, cy);
    text(lamStr, x + pad + 150, cy);
    cy += 16;
  }

  cy += 12;
  textStyle(BOLD);
  textSize(12);
  const Z = (E1 >= 1) ? E1.toFixed(3) + ' eV' : (E1 * 1000).toFixed(2) + ' meV';
  text("Zero-point energy E₁ = " + Z, x + pad, cy);
  cy += 22;
  textStyle(NORMAL);
  textSize(11);
  text("E_n = n² × ħ²π² / (2 m* L²)", x + pad, cy);
  cy += 16;
  text("E_n / E₁ = n²", x + pad, cy);
  cy += 18;
  fill(80);
  text("Confinement scales as 1/L²:", x + pad, cy);
  cy += 14;
  text("doubling L → 4× lower E₁.", x + pad, cy);
  cy += 22;
  fill('black');
  text("m* / m_e = " + mFactor.toFixed(3), x + pad, cy);
}

function mousePressed() {
  // If user clicked near an energy line, highlight that level
  const L = lSlider.value();
  const nMax = nSlider.value();
  const mFactor = particles[particleSelect.value()];

  const wellPad = 40;
  const wellLeft = margin + wellPad;
  const wellRight = canvasWidth * 0.6 - wellPad;
  const wellTop = 50;
  const wellBottom = drawHeight - 40;
  if (mouseX < wellLeft || mouseX > wellRight) return;

  const energies = [];
  for (let n = 1; n <= nMax; n++) energies.push(computeEnergy(n, L, mFactor));
  const eMax = energies[nMax - 1] * 1.15;
  const yFromE = (E) => map(E, 0, eMax, wellBottom, wellTop);

  let closest = -1;
  let closestDist = 12;
  for (let n = 1; n <= nMax; n++) {
    const ly = yFromE(energies[n - 1]);
    if (Math.abs(mouseY - ly) < closestDist) {
      closestDist = Math.abs(mouseY - ly);
      closest = n;
    }
  }
  highlightedLevel = (closest === highlightedLevel) ? -1 : closest;
}

function drawDashedLine(x1, y1, x2, y2) {
  const len = dist(x1, y1, x2, y2);
  if (len === 0) return;
  const dashLen = 6;
  const gapLen = 4;
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
  lSlider.size(canvasWidth - sliderLeftMargin - margin);
  nSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
