// Quantum Tunneling Probability Explorer
// CANVAS_HEIGHT: 560
// Rectangular barrier transmission with adjustable V0, d, E, and effective mass.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 420;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 14;

let v0Slider, dSlider, eSlider, particleSelect, waveCheckbox;

const HBAR = 1.0546e-34;
const ME   = 9.1094e-31;
const EV   = 1.602e-19;

const particles = {
  "Electron (m = m_e)": 1.0,
  "GaAs e (m = 0.067 m_e)": 0.067
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  v0Slider = createSlider(0.1, 5.0, 1.0, 0.05);
  v0Slider.position(sliderLeftMargin, drawHeight + 8);
  v0Slider.size(canvasWidth - sliderLeftMargin - margin);

  dSlider = createSlider(0.1, 3.0, 1.0, 0.05);
  dSlider.position(sliderLeftMargin, drawHeight + 38);
  dSlider.size(canvasWidth - sliderLeftMargin - margin);

  eSlider = createSlider(0.05, 4.9, 0.5, 0.05);
  eSlider.position(sliderLeftMargin, drawHeight + 68);
  eSlider.size(canvasWidth - sliderLeftMargin - margin);

  particleSelect = createSelect();
  for (const k of Object.keys(particles)) particleSelect.option(k);
  particleSelect.selected("Electron (m = m_e)");
  particleSelect.position(sliderLeftMargin, drawHeight + 100);

  waveCheckbox = createCheckbox('Show wave function', true);
  waveCheckbox.position(20, drawHeight + 110);

  describe('Rectangular potential barrier with adjustable height V0, width d, and incident particle energy E. Shows transmission probability and wave function shape.', LABEL);
}

function computeTransmission(V0, d_nm, E, mFactor) {
  const d = d_nm * 1e-9;
  const m = ME * mFactor;
  if (E >= V0) {
    // Above-barrier; classical regime — approximate T ~ 1 (slight oscillations exist exactly)
    return { T: 0.999, kappa: 0, regime: "classical" };
  }
  const dE_J = (V0 - E) * EV;
  const kappa = Math.sqrt(2 * m * dE_J) / HBAR;       // 1/m
  const kappaD = kappa * d;
  // Exact T for rectangular barrier
  let T;
  if (kappaD > 100) {
    // avoid overflow; approximate T ~ 16 E (V0-E) / V0^2 * exp(-2 kappa d)
    T = 16 * E * (V0 - E) / (V0 * V0) * Math.exp(-2 * kappaD);
  } else {
    const sinh2 = Math.sinh(kappaD) * Math.sinh(kappaD);
    T = 1 / (1 + (V0 * V0 * sinh2) / (4 * E * (V0 - E)));
  }
  return { T, kappa: kappa * 1e-9, regime: "tunneling" }; // kappa returned in nm^-1
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
  text('Quantum Tunneling Probability Explorer', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const V0 = v0Slider.value();
  const d = dSlider.value();
  const E = eSlider.value();
  const mFactor = particles[particleSelect.value()];
  const showWave = waveCheckbox.checked();

  const tr = computeTransmission(V0, d, E, mFactor);
  const T = tr.T;
  const kappa = tr.kappa; // nm^-1

  const leftPanelW = canvasWidth * 0.6;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  // Diagram area
  const plotX = margin + 30;
  const plotY = 50;
  const plotW = leftPanelW - plotX - 10;
  const plotH = drawHeight - plotY - 40;
  const plotBottom = plotY + plotH;

  // Y axis: energy from 0 to max(V0+1, E+1)
  const eAxisMax = Math.max(V0, E) + 1.0;
  const yFromE = (eV) => map(eV, 0, eAxisMax, plotBottom, plotY);

  // Y axis label
  fill('black');
  push();
  translate(plotX - 22, (plotY + plotBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("Energy (eV)", 0, 0);
  pop();

  // Layout: left region | barrier region | right region
  // barrier width d nm, scale: 1 nm = pxPerNm
  const totalNm = 6.0; // total horizontal range shown
  const pxPerNm = plotW / totalNm;
  const barrierWidthPx = d * pxPerNm;
  const barrierStartX = plotX + (plotW - barrierWidthPx) / 2;
  const barrierEndX = barrierStartX + barrierWidthPx;

  // X axis
  stroke('black');
  strokeWeight(1.5);
  line(plotX, plotBottom, plotX + plotW, plotBottom);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(12);
  text("Position x (nm)", plotX + plotW / 2, plotBottom + 22);

  // X tick labels
  textAlign(CENTER, TOP);
  textSize(10);
  fill(80);
  for (let nm = 0; nm <= totalNm; nm += 1) {
    const px = plotX + nm * pxPerNm;
    stroke(80);
    line(px, plotBottom, px, plotBottom + 4);
    noStroke();
    text(nm.toFixed(0), px, plotBottom + 6);
  }

  // Potential profile: V=0 outside, V0 inside barrier
  const V0_y = yFromE(V0);

  // Barrier rectangle (light red)
  fill(255, 205, 210);
  noStroke();
  rect(barrierStartX, V0_y, barrierWidthPx, plotBottom - V0_y);

  // Potential outline
  stroke('#b71c1c');
  strokeWeight(2);
  noFill();
  line(plotX, plotBottom, barrierStartX, plotBottom);
  line(barrierStartX, plotBottom, barrierStartX, V0_y);
  line(barrierStartX, V0_y, barrierEndX, V0_y);
  line(barrierEndX, V0_y, barrierEndX, plotBottom);
  line(barrierEndX, plotBottom, plotX + plotW, plotBottom);
  noStroke();

  // Labels for V0 and d
  fill('#b71c1c');
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text("V₀ = " + V0.toFixed(2) + " eV", (barrierStartX + barrierEndX) / 2, V0_y - 4);
  textAlign(CENTER, TOP);
  textSize(11);
  text("d = " + d.toFixed(2) + " nm", (barrierStartX + barrierEndX) / 2, V0_y + (plotBottom - V0_y) / 2);

  // Energy line for E
  const E_y = yFromE(E);
  stroke('#2e7d32');
  strokeWeight(2);
  drawDashedLine(plotX, E_y, plotX + plotW, E_y);
  noStroke();
  fill('#2e7d32');
  textAlign(LEFT, BOTTOM);
  textSize(12);
  text("E = " + E.toFixed(2) + " eV", plotX + 6, E_y - 4);

  // Wave function
  if (showWave) {
    drawWaveFunction(plotX, plotW, plotBottom, E_y, V0_y, barrierStartX, barrierEndX, E, V0, kappa, T);
  }

  // Above-barrier note
  if (E > V0) {
    fill('#ef6c00');
    textAlign(CENTER, BOTTOM);
    textSize(12);
    textStyle(BOLD);
    text("Classical regime: E > V₀  →  T ≈ 1", plotX + plotW / 2, plotY + 14);
    textStyle(NORMAL);
  }

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, 50, rightPanelW, T, kappa, V0, d, E, mFactor);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Barrier height V₀ (eV): " + V0.toFixed(2), 10, drawHeight + 18);
  text("Barrier width d (nm): " + d.toFixed(2), 10, drawHeight + 48);
  text("Particle energy E (eV): " + E.toFixed(2), 10, drawHeight + 78);
  text("Particle:", 10, drawHeight + 108);
}

function drawWaveFunction(plotX, plotW, plotBottom, E_y, V0_y, barrierStartX, barrierEndX, E, V0, kappa_nm_inv, T) {
  // Draw qualitative wave function: oscillating outside, decaying in barrier.
  // Center vertically on E_y (incident + reflected on left, transmitted on right).
  const ampLeft = 22;
  const ampRight = ampLeft * Math.sqrt(Math.max(T, 0.000001));
  const steps = 320;

  // Wavelength (k = sqrt(2mE)/hbar) — convert to pixels
  const m = ME * 1.0; // for plotting only, use m_e regardless of effective mass
  const k_inv_m = Math.sqrt(2 * m * E * EV) / HBAR;
  const lambda_nm = 2 * Math.PI / (k_inv_m * 1e-9); // nm
  const pxPerNm = plotW / 6.0;
  const lambda_px = lambda_nm * pxPerNm;
  const omega_px = (lambda_px > 0) ? (2 * Math.PI / lambda_px) : 0.5;

  // Compute wave on left side (incident + reflected)
  // For simplicity, just sinusoidal of unit amplitude (visually).
  noFill();
  stroke('#1565c0');
  strokeWeight(2);
  beginShape();
  for (let s = 0; s <= steps; s++) {
    const x = plotX + (s / steps) * (barrierStartX - plotX);
    const dist = x - plotX;
    const y = E_y - ampLeft * Math.cos(omega_px * dist);
    vertex(x, y);
  }
  endShape();

  // Inside barrier — exponentially decaying (or both decaying + growing for above barrier)
  if (E < V0) {
    // exp decay
    const kappaPxInv = kappa_nm_inv / pxPerNm; // 1/px
    beginShape();
    for (let s = 0; s <= steps; s++) {
      const x = barrierStartX + (s / steps) * (barrierEndX - barrierStartX);
      const dist = x - barrierStartX;
      const decay = Math.exp(-kappaPxInv * dist);
      const y = E_y - ampLeft * decay;
      vertex(x, y);
    }
    endShape();
  } else {
    // oscillating in barrier (above barrier)
    const k2_inv_m = Math.sqrt(2 * m * (E - V0) * EV) / HBAR;
    const lambda2_nm = 2 * Math.PI / (k2_inv_m * 1e-9);
    const lambda2_px = lambda2_nm * pxPerNm;
    const omega2_px = (lambda2_px > 0) ? (2 * Math.PI / lambda2_px) : 0.5;
    beginShape();
    for (let s = 0; s <= steps; s++) {
      const x = barrierStartX + (s / steps) * (barrierEndX - barrierStartX);
      const dist = x - barrierStartX;
      const y = E_y - ampLeft * Math.cos(omega2_px * dist);
      vertex(x, y);
    }
    endShape();
  }

  // Right side: transmitted (amplitude sqrt(T))
  beginShape();
  for (let s = 0; s <= steps; s++) {
    const x = barrierEndX + (s / steps) * (plotX + plotW - barrierEndX);
    const dist = x - barrierEndX;
    const y = E_y - ampRight * Math.cos(omega_px * dist);
    vertex(x, y);
  }
  endShape();
  noStroke();
}

function drawInfoPanel(x, y, w, T, kappa, V0, d, E, mFactor) {
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
  text("Tunneling Result", x + pad, cy);
  cy += 28;

  textStyle(NORMAL);
  textSize(13);

  // T formatted
  let Tstr;
  if (T > 0.01) {
    Tstr = (T * 100).toFixed(2) + "%";
  } else if (T > 1e-50) {
    const expVal = Math.floor(Math.log10(T));
    const mantissa = T / Math.pow(10, expVal);
    Tstr = mantissa.toFixed(2) + " × 10^" + expVal;
  } else {
    Tstr = "≈ 0";
  }
  textStyle(BOLD);
  textSize(15);
  fill('#0d47a1');
  text("T = " + Tstr, x + pad, cy);
  cy += 28;

  textStyle(NORMAL);
  textSize(12);
  fill('black');
  if (E < V0) {
    text("κ = " + kappa.toFixed(2) + " nm⁻¹", x + pad, cy);
    cy += 18;
    text("(decay constant in barrier)", x + pad, cy);
    cy += 24;
  } else {
    text("E > V₀ — no decay", x + pad, cy);
    cy += 24;
  }

  // Context interpretation
  textStyle(BOLD);
  text("Regime:", x + pad, cy);
  cy += 18;
  textStyle(NORMAL);
  let regime, regimeColor;
  if (T < 1e-10) {
    regime = "Negligible tunneling.";
    regimeColor = color(120);
  } else if (T < 1e-3) {
    regime = "Detectable tunneling — relevant for gate oxide leakage.";
    regimeColor = color(245, 124, 0);
  } else {
    regime = "Significant tunneling — device function enabled.";
    regimeColor = color(46, 125, 50);
  }
  fill(regimeColor);
  text(regime, x + pad, cy, w - 2 * pad);
  cy += 42;

  fill('black');
  textStyle(BOLD);
  textSize(12);
  text("Application context:", x + pad, cy);
  cy += 18;
  textStyle(NORMAL);
  let app = "";
  if (V0 >= 2.8 && V0 <= 3.4 && d >= 1.2 && d <= 2.0) {
    app = "At d ≈ 1.5 nm, V₀ ≈ 3.1 eV (SiO₂/Si), T ≈ 10⁻⁷ — the gate-oxide leakage regime that drove the move to high-κ dielectrics.";
  } else if (d <= 0.5 && T > 1e-3) {
    app = "Sub-nanometer barriers give substantial tunneling — basis of Esaki tunnel diodes and resonant-tunneling structures.";
  } else if (V0 < 0.4) {
    app = "Low-barrier Schottky and tunnel-FET regions show enhanced tunneling — relevant for sub-thermal subthreshold swings.";
  } else {
    app = "Adjust V₀ ≈ 3.1 eV, d ≈ 1.5 nm to see the Si/SiO₂ gate-oxide tunneling regime.";
  }
  fill(60);
  text(app, x + pad, cy, w - 2 * pad);
}

function drawDashedLine(x1, y1, x2, y2) {
  const len = dist(x1, y1, x2, y2);
  if (len === 0) return;
  const dashLen = 6;
  const gapLen = 4;
  const total = dashLen + gapLen;
  const dirX = (x2 - x1) / len;
  const dirY = (y2 - y1) / len;
  let dd = 0;
  while (dd < len) {
    const sx = x1 + dirX * dd;
    const sy = y1 + dirY * dd;
    const ex = x1 + dirX * Math.min(dd + dashLen, len);
    const ey = y1 + dirY * Math.min(dd + dashLen, len);
    line(sx, sy, ex, ey);
    dd += total;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  v0Slider.size(canvasWidth - sliderLeftMargin - margin);
  dSlider.size(canvasWidth - sliderLeftMargin - margin);
  eSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
