// Fermi-Dirac Distribution and Carrier Concentration Explorer
// CANVAS_HEIGHT: 560
// Shows the Fermi-Dirac sigmoid alongside an energy band diagram and computes n, p, n_i, n*p.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 420;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 14;

let tSlider, efSlider, materialSelect;

const KB_EV = 8.617e-5; // eV/K

const materials = {
  "Silicon (E_g=1.12 eV)":  { eg: 1.12, NC300: 2.8e19, NV300: 1.04e19 },
  "GaAs (E_g=1.42 eV)":     { eg: 1.42, NC300: 4.7e17, NV300: 9.0e18 },
  "Ge (E_g=0.66 eV)":       { eg: 0.66, NC300: 1.04e19, NV300: 6.0e18 }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  tSlider = createSlider(100, 700, 300, 1);
  tSlider.position(sliderLeftMargin, drawHeight + 8);
  tSlider.size(canvasWidth - sliderLeftMargin - margin);

  efSlider = createSlider(-0.6, 0.6, 0.0, 0.005);
  efSlider.position(sliderLeftMargin, drawHeight + 38);
  efSlider.size(canvasWidth - sliderLeftMargin - margin);

  materialSelect = createSelect();
  for (const k of Object.keys(materials)) materialSelect.option(k);
  materialSelect.selected("Silicon (E_g=1.12 eV)");
  materialSelect.position(sliderLeftMargin, drawHeight + 68);

  describe('Fermi-Dirac probability function plotted alongside an energy band diagram showing how Fermi level position and temperature set electron and hole concentrations.', LABEL);
}

function compute(T, EfMinusEi, matKey) {
  const mat = materials[matKey];
  const kT = KB_EV * T;
  const scale = Math.pow(T / 300, 1.5);
  const NC = mat.NC300 * scale;
  const NV = mat.NV300 * scale;
  const ni = Math.sqrt(NC * NV) * Math.exp(-mat.eg / (2 * kT));
  const n = ni * Math.exp(EfMinusEi / kT);
  const p = ni * Math.exp(-EfMinusEi / kT);
  // f at E_C: assume E_i is midgap, so E_C - E_F = (E_g/2) - (E_F - E_i)
  const EC_minus_EF = mat.eg / 2 - EfMinusEi;
  const fAtEC = 1 / (1 + Math.exp(EC_minus_EF / kT));
  return { NC, NV, ni, n, p, fAtEC, eg: mat.eg, kT };
}

function fmt(x) {
  if (x < 1e-20) return "≈ 0";
  if (x > 1e6) {
    const exp = Math.floor(Math.log10(x));
    const m = x / Math.pow(10, exp);
    return m.toFixed(2) + " × 10^" + exp;
  }
  return x.toFixed(2);
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
  text('Fermi-Dirac Distribution and Carrier Concentration', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const T = tSlider.value();
  const Ef = efSlider.value();
  const matKey = materialSelect.value();
  const mat = materials[matKey];
  const r = compute(T, Ef, matKey);

  const leftPanelW = canvasWidth * 0.55;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  // Energy axis range
  const eRange = mat.eg / 2 + 0.6; // span ±eRange from E_i (midgap)
  const ei = 0; // by convention midgap
  const ec = mat.eg / 2;
  const ev = -mat.eg / 2;

  const plotY = 60;
  const plotBottom = drawHeight - 30;
  const yFromE = (E) => map(E, -eRange, +eRange, plotBottom, plotY);

  // Bands strip on left
  const bandX = margin + 40;
  const bandW = 120;
  // CB region
  fill('#b3e5fc');
  noStroke();
  rect(bandX, yFromE(eRange), bandW, yFromE(ec) - yFromE(eRange));
  // VB region
  fill('#c8e6c9');
  rect(bandX, yFromE(ev), bandW, yFromE(-eRange) - yFromE(ev));
  // gap (white-ish)
  noFill();

  // Shade CB with intensity ~ n / N_C (capped at 1)
  const nShade = Math.min(r.n / r.NC, 1.0);
  fill(21, 101, 192, 80 + 150 * nShade);
  rect(bandX, yFromE(eRange), bandW, yFromE(ec) - yFromE(eRange));
  // Shade VB with intensity ~ p / N_V
  const pShade = Math.min(r.p / r.NV, 1.0);
  fill(46, 125, 50, 80 + 150 * pShade);
  rect(bandX, yFromE(ev), bandW, yFromE(-eRange) - yFromE(ev));

  // Band labels
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text("CB", bandX + bandW / 2, (yFromE(eRange) + yFromE(ec)) / 2);
  text("VB", bandX + bandW / 2, (yFromE(ev) + yFromE(-eRange)) / 2);
  textStyle(NORMAL);

  // f(E) plot to the right of bands
  const fPlotX = bandX + bandW + 30;
  const fPlotW = leftPanelW - fPlotX - 5;
  // x axis: f from 0 to 1
  const xFromF = (f) => map(f, 0, 1, fPlotX, fPlotX + fPlotW);

  // axes
  stroke('black');
  strokeWeight(1);
  line(fPlotX, plotY, fPlotX, plotBottom);                       // y-axis
  line(fPlotX, plotBottom, fPlotX + fPlotW, plotBottom);          // x-axis
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(11);
  for (const f of [0, 0.5, 1]) {
    const xp = xFromF(f);
    stroke('black');
    line(xp, plotBottom, xp, plotBottom + 4);
    noStroke();
    text(f.toFixed(1), xp, plotBottom + 6);
  }
  text("f(E)", fPlotX + fPlotW / 2, plotBottom + 22);

  // Draw sigmoid
  noFill();
  stroke('#6a1b9a');
  strokeWeight(2.5);
  beginShape();
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const E = -eRange + (i / steps) * (2 * eRange);
    const f = 1 / (1 + Math.exp((E - Ef) / r.kT));
    vertex(xFromF(f), yFromE(E));
  }
  endShape();
  noStroke();

  // Dashed E_C, E_V lines through the whole plot
  stroke('red'); strokeWeight(1.5);
  drawDashedLine(bandX, yFromE(ec), fPlotX + fPlotW, yFromE(ec));
  stroke('blue'); strokeWeight(1.5);
  drawDashedLine(bandX, yFromE(ev), fPlotX + fPlotW, yFromE(ev));
  // E_F (moveable)
  stroke('#6a1b9a'); strokeWeight(1.5);
  drawDashedLine(bandX, yFromE(Ef), fPlotX + fPlotW, yFromE(Ef));
  // E_i (midgap)
  stroke(120); strokeWeight(1);
  drawDashedLine(bandX, yFromE(ei), fPlotX + fPlotW, yFromE(ei));
  noStroke();

  // Labels
  fill('red');
  textAlign(RIGHT, CENTER);
  textSize(12);
  text("E_C", bandX - 5, yFromE(ec));
  fill('blue');
  text("E_V", bandX - 5, yFromE(ev));
  fill('#6a1b9a');
  text("E_F", bandX - 5, yFromE(Ef));
  fill(120);
  textSize(10);
  text("E_i", bandX - 5, yFromE(ei) + 12);

  // Energy axis title
  push();
  translate(bandX - 28, (plotY + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(12);
  fill('black');
  text("Energy E (eV)", 0, 0);
  pop();

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, 60, rightPanelW, r, T, Ef);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Temperature (K): " + T, 10, drawHeight + 18);
  text("E_F − E_i (eV): " + Ef.toFixed(3), 10, drawHeight + 48);
  text("Material:", 10, drawHeight + 78);
}

function drawInfoPanel(x, y, w, r, T, Ef) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, drawHeight - y - 20);
  noStroke();

  const pad = 12;
  let cy = y + 12;

  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text("Computed Values", x + pad, cy);
  cy += 30;

  textStyle(NORMAL);
  textSize(13);

  text("f(E_C) = " + r.fAtEC.toExponential(2), x + pad, cy);
  cy += 22;

  text("n_i = " + fmt(r.ni) + " cm⁻³", x + pad, cy);
  cy += 22;

  text("n = " + fmt(r.n) + " cm⁻³", x + pad, cy);
  cy += 22;

  text("p = " + fmt(r.p) + " cm⁻³", x + pad, cy);
  cy += 22;

  text("n · p = " + fmt(r.n * r.p) + " cm⁻⁶", x + pad, cy);
  cy += 20;
  textSize(11);
  fill(80);
  text("(should equal n_i² = " + fmt(r.ni * r.ni) + ")", x + pad, cy);
  fill('black');
  cy += 26;

  textSize(13);
  text("N_C = " + fmt(r.NC) + " cm⁻³", x + pad, cy);
  cy += 20;
  text("N_V = " + fmt(r.NV) + " cm⁻³", x + pad, cy);
  cy += 28;

  // Material class
  let cls;
  let clsColor;
  const ratio = r.n / r.p;
  if (ratio > 100) { cls = "n-type"; clsColor = color(21, 101, 192); }
  else if (ratio < 0.01) { cls = "p-type"; clsColor = color(46, 125, 50); }
  else { cls = "intrinsic"; clsColor = color(120); }

  textStyle(BOLD);
  textSize(14);
  fill(clsColor);
  text("Material class: " + cls, x + pad, cy, w - 2 * pad);
  textStyle(NORMAL);
  fill('black');
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
  tSlider.size(canvasWidth - sliderLeftMargin - margin);
  efSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
