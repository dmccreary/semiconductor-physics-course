// Dimensionality and Density of States Explorer
// CANVAS_HEIGHT: 560
// Plots g(E) for 3D bulk, 2D quantum well, 1D quantum wire, and 0D quantum dot.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 420;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 14;

let dimSelect, mSlider, lSlider, gainCheckbox;

const HBAR = 1.0546e-34;
const ME   = 9.1094e-31;
const EV   = 1.602e-19;

const dimensions = ["3D (Bulk)", "2D (Quantum Well)", "1D (Quantum Wire)", "0D (Quantum Dot)"];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  dimSelect = createSelect();
  for (const k of dimensions) dimSelect.option(k);
  dimSelect.selected("3D (Bulk)");
  dimSelect.position(sliderLeftMargin, drawHeight + 8);

  mSlider = createSlider(0.05, 1.0, 0.067, 0.001);
  mSlider.position(sliderLeftMargin, drawHeight + 38);
  mSlider.size(canvasWidth - sliderLeftMargin - margin);

  lSlider = createSlider(1, 20, 10, 0.1);
  lSlider.position(sliderLeftMargin, drawHeight + 68);
  lSlider.size(canvasWidth - sliderLeftMargin - margin);

  gainCheckbox = createCheckbox('Show gain bandwidth (schematic)', false);
  gainCheckbox.position(20, drawHeight + 110);

  describe('Density of states g(E) plotted for 3D, 2D, 1D, and 0D semiconductor structures.', LABEL);
}

function subbandEnergies(L_nm, mFactor, eMaxEV) {
  // Subband energies E_n = n^2 * pi^2 * hbar^2 / (2 m L^2), one quantum-confined dimension
  const L = L_nm * 1e-9;
  const m = ME * mFactor;
  const E1_J = (Math.PI * Math.PI * HBAR * HBAR) / (2 * m * L * L);
  const E1_eV = E1_J / EV;
  const out = [];
  for (let n = 1; n <= 20; n++) {
    const En = n * n * E1_eV;
    if (En > eMaxEV) break;
    out.push(En);
  }
  return out;
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
  text('Density of States g(E)', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const dim = dimSelect.value();
  const mFactor = mSlider.value();
  const L = lSlider.value();

  // L (confinement size) has no effect on bulk 3D DOS — grey it out
  const lActive = (dim !== "3D (Bulk)");
  if (lActive) lSlider.removeAttribute('disabled');
  else lSlider.attribute('disabled', '');

  const leftPanelW = canvasWidth * 0.65;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  const plotX = margin + 36;
  const plotY = 50;
  const plotW = leftPanelW - plotX - 10;
  const plotH = drawHeight - plotY - 50;
  const plotBottom = plotY + plotH;

  const eMax = 0.4; // eV above E_c
  const xFromE = (E) => map(E, 0, eMax, plotX, plotX + plotW);
  const yFromG = (g) => map(g, 0, 1.0, plotBottom, plotY + 10);

  // Axes
  stroke('black');
  strokeWeight(1.5);
  line(plotX, plotBottom, plotX + plotW, plotBottom);
  line(plotX, plotY, plotX, plotBottom);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(12);
  text("E − Ec (eV)", plotX + plotW / 2, plotBottom + 22);
  for (let e = 0; e <= eMax + 0.001; e += 0.1) {
    const xp = xFromE(e);
    stroke(80);
    line(xp, plotBottom, xp, plotBottom + 4);
    noStroke();
    textSize(10);
    text(e.toFixed(1), xp, plotBottom + 6);
  }

  push();
  translate(plotX - 24, (plotY + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("g(E) (normalized)", 0, 0);
  pop();

  // Compute and draw g(E) curve(s) for selected dimensionality
  let color3D = color(25, 118, 210);
  let color2D = color(67, 160, 71);
  let color1D = color(245, 124, 0);
  let color0D = color(211, 47, 47);
  let chosenColor, formula;

  if (dim === "3D (Bulk)") {
    chosenColor = color3D;
    formula = "g₃D(E) ∝ √(E − Ec) · (m*)³ᐟ²";
    noFill();
    stroke(chosenColor);
    strokeWeight(2.5);
    beginShape();
    // normalize sqrt(eMax) = max value of sqrt(E)
    const norm = Math.sqrt(eMax);
    for (let e = 0; e <= eMax; e += 0.005) {
      const g = Math.sqrt(e) / norm;
      vertex(xFromE(e), yFromG(g));
    }
    endShape();
    noStroke();
  } else if (dim === "2D (Quantum Well)") {
    chosenColor = color2D;
    formula = "g₂D(E) = (m*/πħ²) · Σ Θ(E − Eₙ)  (staircase)";
    const subs = subbandEnergies(L, mFactor, eMax);
    // step height ∝ 1; cumulative steps; normalize so max ≤ 1
    // total steps below eMax
    const maxCount = subs.length;
    const stepH = 1.0 / Math.max(maxCount, 1);
    stroke(chosenColor);
    strokeWeight(2.5);
    noFill();
    // draw staircase
    let cumG = 0;
    let prevX = plotX;
    let prevY = yFromG(0);
    beginShape();
    vertex(prevX, prevY);
    for (let i = 0; i < subs.length; i++) {
      const e = subs[i];
      const xp = xFromE(e);
      // horizontal segment to xp
      vertex(xp, prevY);
      // jump up
      cumG += stepH;
      const yp = yFromG(cumG);
      vertex(xp, yp);
      prevY = yp;
    }
    // continue to right edge
    vertex(plotX + plotW, prevY);
    endShape();
    noStroke();
    // Subband E_n markers
    fill(60);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    for (let i = 0; i < subs.length && i < 5; i++) {
      const xp = xFromE(subs[i]);
      text("E" + (i + 1), xp, plotBottom - 4);
      stroke(120, 120, 120, 150);
      line(xp, plotBottom, xp, yFromG(0.05));
      noStroke();
    }
  } else if (dim === "1D (Quantum Wire)") {
    chosenColor = color1D;
    formula = "g₁D(E) ∝ Σ (E − Eₙ)⁻¹ᐟ²";
    const subs = subbandEnergies(L, mFactor, eMax);
    stroke(chosenColor);
    strokeWeight(2.5);
    noFill();
    // For visualization sum up 1/sqrt(E - E_n) clamped
    beginShape();
    for (let e = 0; e <= eMax; e += 0.002) {
      let g = 0;
      for (const en of subs) {
        if (e > en + 1e-5) {
          g += 0.06 / Math.sqrt(e - en);
        }
      }
      g = Math.min(g, 1.0);
      vertex(xFromE(e), yFromG(g));
    }
    endShape();
    noStroke();
    fill(60);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    for (let i = 0; i < subs.length && i < 5; i++) {
      const xp = xFromE(subs[i]);
      text("E" + (i + 1), xp, plotBottom - 4);
    }
  } else if (dim === "0D (Quantum Dot)") {
    chosenColor = color0D;
    formula = "g₀D(E) = Σ δ(E − Eₙ)  (discrete)";
    const subs = subbandEnergies(L, mFactor, eMax);
    stroke(chosenColor);
    strokeWeight(3);
    for (let i = 0; i < subs.length && i < 8; i++) {
      const xp = xFromE(subs[i]);
      const peakH = 0.95 - 0.08 * i;
      const yt = yFromG(Math.max(peakH, 0.3));
      // arrow shaft
      line(xp, plotBottom, xp, yt);
      // arrowhead
      triangle(xp - 4, yt + 6, xp + 4, yt + 6, xp, yt);
    }
    noStroke();
    fill(60);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    for (let i = 0; i < subs.length && i < 5; i++) {
      const xp = xFromE(subs[i]);
      text("E" + (i + 1), xp, plotBottom - 4);
    }
  }

  // Gain bandwidth overlay (schematic)
  if (gainCheckbox.checked()) {
    const ec = 0.04;
    let widthEV;
    if (dim === "3D (Bulk)") widthEV = 0.10;
    else if (dim === "2D (Quantum Well)") widthEV = 0.05;
    else if (dim === "1D (Quantum Wire)") widthEV = 0.03;
    else widthEV = 0.015;
    const x1 = xFromE(ec);
    const x2 = xFromE(ec + widthEV);
    fill(255, 235, 59, 100);
    noStroke();
    rect(x1, plotY + 10, x2 - x1, plotBottom - plotY - 10);
    fill(120, 100, 0);
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text("Schematic gain bandwidth", (x1 + x2) / 2, plotY + 30);
  }

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, 50, rightPanelW, dim, formula, mFactor, L);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Dimensionality:", 10, drawHeight + 18);
  text("m*/m₀: " + mFactor.toFixed(3), 10, drawHeight + 48);
  fill(lActive ? 'black' : 'gray');
  text("L (nm): " + L.toFixed(1) + (lActive ? "" : "  (no effect in 3D)"), 10, drawHeight + 78);
}

function drawInfoPanel(x, y, w, dim, formula, mFactor, L) {
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
  text(dim, x + pad, cy, w - 2 * pad);
  cy += 28;

  textStyle(NORMAL);
  textSize(12);
  text(formula, x + pad, cy, w - 2 * pad);
  cy += 32;

  // Device app
  textStyle(BOLD);
  textSize(13);
  text("Device:", x + pad, cy);
  textStyle(NORMAL);
  cy += 18;
  let app, threshold, threshColor;
  if (dim === "3D (Bulk)") {
    app = "Bulk diode lasers, photodetectors, double-heterostructure LEDs.";
    threshold = "Threshold: highest (broad g, weak peak).";
    threshColor = color(120);
  } else if (dim === "2D (Quantum Well)") {
    app = "QW laser diodes (most commercial telecom and pump lasers).";
    threshold = "Threshold: ~3× lower than bulk thanks to step DOS.";
    threshColor = color(46, 125, 50);
  } else if (dim === "1D (Quantum Wire)") {
    app = "Quantum-wire lasers (nanowire and etched ridge structures).";
    threshold = "Threshold: lower still — 1D peaks concentrate gain.";
    threshColor = color(245, 124, 0);
  } else {
    app = "Quantum-dot lasers (1.3 µm InAs/GaAs telecom dots).";
    threshold = "Threshold: lowest; delta-like DOS concentrates carriers at one energy.";
    threshColor = color(211, 47, 47);
  }
  textSize(12);
  text(app, x + pad, cy, w - 2 * pad);
  cy += 40;

  fill(threshColor);
  textStyle(BOLD);
  text(threshold, x + pad, cy, w - 2 * pad);
  textStyle(NORMAL);
  cy += 50;

  // Quantum confinement E1 for context
  if (dim !== "3D (Bulk)") {
    const L_m = L * 1e-9;
    const E1 = (Math.PI * Math.PI * HBAR * HBAR) / (2 * ME * mFactor * L_m * L_m) / EV;
    fill('black');
    textSize(12);
    textStyle(BOLD);
    text("Confinement energy:", x + pad, cy);
    textStyle(NORMAL);
    cy += 18;
    const E1str = (E1 > 1) ? E1.toFixed(2) + " eV" : (E1 * 1000).toFixed(1) + " meV";
    text("E₁ = " + E1str + " (m*=" + mFactor.toFixed(3) + ", L=" + L.toFixed(1) + " nm)", x + pad, cy, w - 2 * pad);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  mSlider.size(canvasWidth - sliderLeftMargin - margin);
  lSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
