// Energy Band Diagram Explorer
// CANVAS_HEIGHT: 540
// Interactive band diagram showing how E_g, T determine conductor / semiconductor / insulator behavior.

let containerWidth;
let canvasWidth = 800;
let drawHeight = 440;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 14;

let egSlider, tempSlider, materialSelect;
let eg = 1.12;
let temperature = 300;

const materials = {
  "Custom": null,
  "Ge (0.66 eV)": 0.66,
  "Si (1.12 eV)": 1.12,
  "GaAs (1.42 eV)": 1.42,
  "GaN (3.40 eV)": 3.40,
  "Diamond (5.50 eV - insulator)": 5.50,
  "SiO2 (9.0 eV - insulator)": 9.0
};

const MAX_CB_ELECTRONS = 8;
const VB_ELECTRON_COUNT = 20;
let cbElectrons = [];
let vbElectronPositions = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  egSlider = createSlider(0, 7, 1.12, 0.01);
  egSlider.position(sliderLeftMargin, drawHeight + 8);
  egSlider.size(canvasWidth - sliderLeftMargin - margin);

  tempSlider = createSlider(0, 600, 300, 1);
  tempSlider.position(sliderLeftMargin, drawHeight + 38);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);

  materialSelect = createSelect();
  for (const k of Object.keys(materials)) {
    materialSelect.option(k);
  }
  materialSelect.selected("Si (1.12 eV)");
  materialSelect.position(sliderLeftMargin, drawHeight + 70);
  materialSelect.changed(onMaterialChange);

  randomSeed(7);
  for (let i = 0; i < VB_ELECTRON_COUNT; i++) {
    vbElectronPositions.push({ rx: random(0.05, 0.95), ry: random(0.15, 0.85) });
  }
  for (let i = 0; i < MAX_CB_ELECTRONS; i++) {
    cbElectrons.push({ rx: random(), phase: random(TWO_PI), speed: random(0.012, 0.025), alpha: 0 });
  }

  describe('Energy band diagram showing valence and conduction bands separated by a bandgap, with adjustable bandgap energy and temperature.', LABEL);
}

function onMaterialChange() {
  const sel = materialSelect.value();
  if (sel !== "Custom" && materials[sel] !== null) {
    egSlider.value(materials[sel]);
  }
}

function draw() {
  updateCanvasSize();

  eg = egSlider.value();
  temperature = tempSlider.value();

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
  text('Energy Band Diagram Explorer', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const leftPanelW = canvasWidth * 0.6;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  const diagramX = margin + 40;
  const diagramW = leftPanelW - diagramX - 10;
  const diagramTop = 50;
  const diagramBottom = drawHeight - 50;
  const diagramH = diagramBottom - diagramTop;

  let cbH = 90;
  let vbH = 90;
  let gapPx = eg * 28.6;

  // Constrain total to fit
  const totalNeeded = cbH + vbH + gapPx;
  if (totalNeeded > diagramH) {
    const overshoot = totalNeeded - diagramH;
    cbH = Math.max(40, cbH - overshoot / 2);
    vbH = Math.max(40, vbH - overshoot / 2);
    gapPx = diagramH - cbH - vbH;
  }

  const totalUsedH = cbH + gapPx + vbH;
  const stackTop = diagramTop + (diagramH - totalUsedH) / 2;
  const cbY = stackTop;
  const cbBottom = cbY + cbH;
  const gapY = cbBottom;
  const vbY = gapY + gapPx;
  const vbBottom = vbY + vbH;

  let matClass, gapTint;
  if (eg < 0.3) {
    matClass = "Conductor";
    gapTint = color(255, 205, 210);
  } else if (eg <= 4.5) {
    matClass = "Semiconductor";
    gapTint = color(255, 249, 196);
  } else {
    matClass = "Insulator";
    gapTint = color(245, 245, 245);
  }

  // Forbidden gap tint
  noStroke();
  fill(gapTint);
  if (gapPx > 0) rect(diagramX, gapY, diagramW, gapPx);

  // CB rectangle
  fill('#b3e5fc');
  stroke(150);
  rect(diagramX, cbY, diagramW, cbH);

  // VB rectangle
  fill('#c8e6c9');
  stroke(150);
  rect(diagramX, vbY, diagramW, vbH);
  noStroke();

  fill('black');
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text("Conduction Band (CB)", diagramX + diagramW / 2, cbY + cbH / 2);
  text("Valence Band (VB)", diagramX + diagramW / 2, vbY + vbH / 2);
  textStyle(NORMAL);

  if (gapPx > 32) {
    fill(80);
    textSize(13);
    text("Forbidden Gap", diagramX + diagramW / 2, gapY + gapPx / 2 - 8);
    text("Eg = " + eg.toFixed(2) + " eV", diagramX + diagramW / 2, gapY + gapPx / 2 + 10);
  } else if (gapPx > 12) {
    fill(80);
    textSize(11);
    text("Eg = " + eg.toFixed(2) + " eV", diagramX + diagramW / 2, gapY + gapPx / 2);
  }

  // short stub so the dashed line stops before the label text
  stroke('red');
  strokeWeight(1.5);
  drawDashedLine(diagramX - 8, cbBottom, diagramX + diagramW, cbBottom);
  noStroke();
  fill('red');
  textSize(13);
  textStyle(BOLD);
  drawSubscriptLabel("E", "C", diagramX - 12, cbBottom + 6);

  stroke('blue');
  strokeWeight(1.5);
  drawDashedLine(diagramX - 8, vbY, diagramX + diagramW, vbY);
  noStroke();
  fill('blue');
  drawSubscriptLabel("E", "V", diagramX - 12, vbY + 6);
  textStyle(NORMAL);

  // Conduction electron count from simplified Boltzmann factor
  let nCB;
  if (temperature <= 0) {
    nCB = 0;
  } else {
    const kT = 0.026 * temperature / 300;
    nCB = Math.round(8 * Math.exp(-eg / (2 * kT)));
    nCB = Math.max(0, Math.min(8, nCB));
  }

  // VB electrons
  fill('#1565c0');
  noStroke();
  for (let i = 0; i < VB_ELECTRON_COUNT; i++) {
    const vx = diagramX + vbElectronPositions[i].rx * diagramW;
    const vy = vbY + 10 + vbElectronPositions[i].ry * (vbH - 20);
    circle(vx, vy, 8);
  }

  // CB electrons (animated) + holes in VB
  for (let i = 0; i < cbElectrons.length; i++) {
    const e = cbElectrons[i];
    const target = (i < nCB) ? 230 : 0;
    e.alpha = lerp(e.alpha, target, 0.04);
    e.phase += e.speed;

    const driftX = (e.rx + 0.18 * sin(e.phase)) % 1;
    const ex = diagramX + 14 + ((driftX + 1) % 1) * (diagramW - 28);
    const ey = cbY + 18 + (sin(e.phase * 0.6 + i) * 0.4 + 0.5) * (cbH - 36);

    if (e.alpha > 5) {
      fill(66, 165, 245, e.alpha);
      noStroke();
      circle(ex, ey, 10);

      noFill();
      stroke(21, 101, 192, e.alpha);
      strokeWeight(1.5);
      circle(ex, vbY + vbH / 2, 9);
      noStroke();
    }
  }

  // Material class label
  let classColor;
  if (matClass === "Conductor") classColor = color(211, 47, 47);
  else if (matClass === "Semiconductor") classColor = color(245, 124, 0);
  else classColor = color(97, 97, 97);
  fill(classColor);
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text(matClass, diagramX + diagramW / 2, vbBottom + 8);
  textStyle(NORMAL);

  drawInfoPanel(rightPanelX, diagramTop, rightPanelW, nCB, matClass);

  drawControlLabels();
}

function drawInfoPanel(x, y, w, nCB, matClass) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, drawHeight - y - 20);
  noStroke();

  let cy = y + 14;
  const pad = 12;

  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  text("Bandgap = " + eg.toFixed(2) + " eV", x + pad, cy);
  cy += 30;

  textStyle(NORMAL);
  textSize(14);
  text("Temperature = " + temperature + " K", x + pad, cy);
  cy += 22;

  text("Class: " + matClass, x + pad, cy);
  cy += 22;

  text("CB electrons ≈ " + nCB + " (symbolic)", x + pad, cy);
  cy += 26;

  const lambda = (eg > 0) ? (1240 / eg) : Infinity;
  const lambdaStr = (eg > 0) ? lambda.toFixed(0) + " nm" : "∞";
  text("Photon energy = Eg", x + pad, cy);
  cy += 20;
  text("λ = 1240 / Eg = " + lambdaStr, x + pad, cy);
  cy += 24;

  let region;
  if (eg <= 0) region = "—";
  else if (lambda < 400) region = "UV";
  else if (lambda < 450) region = "Visible-violet";
  else if (lambda < 495) region = "Visible-blue";
  else if (lambda < 570) region = "Visible-green";
  else if (lambda < 590) region = "Visible-yellow";
  else if (lambda < 620) region = "Visible-orange";
  else if (lambda <= 750) region = "Visible-red";
  else if (lambda <= 1400) region = "Near-IR";
  else region = "Mid-IR";

  text("Region: " + region, x + pad, cy);
  cy += 28;

  if (lambda >= 400 && lambda <= 700) {
    const swatchColor = wavelengthToColor(lambda);
    fill(swatchColor);
    stroke('black');
    rect(x + pad, cy, 30, 20);
    noStroke();
    fill('black');
    textSize(13);
    text("emission color", x + pad + 38, cy + 4);
  }
}

function wavelengthToColor(wl) {
  const hue = constrain((700 - wl) / 300 * 270, 0, 270);
  colorMode(HSB, 360, 100, 100);
  const c = color(hue, 85, 92);
  colorMode(RGB, 255);
  return c;
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Bandgap Eg (eV): " + eg.toFixed(2), 10, drawHeight + 18);
  text("Temperature (K): " + temperature, 10, drawHeight + 48);
  text("Material:", 10, drawHeight + 80);
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
  egSlider.size(canvasWidth - sliderLeftMargin - margin);
  tempSlider.size(canvasWidth - sliderLeftMargin - margin);
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
