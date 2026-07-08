// Point Defect Visualizer
// CANVAS_HEIGHT: 520
// 2D top-down view of a 10x10 simple square lattice with point defects.

let containerWidth;
let canvasWidth = 820;
let drawHeight = 440;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 14;

let highlightSelect, randomizeBtn;
let defects = [];           // array of defect objects
let selectedDefect = null;  // currently displayed in info panel
let hoverDefect = null;

const GRID = 10;

const defectInfo = {
  "Vacancy": {
    short: "V",
    color: '#c62828',
    dim: "0D",
    mechanism: "A missing atom at a lattice site, created by thermal generation or radiation displacement.",
    charge: "V⁰, V⁺, V⁻, V²⁻ depending on Fermi level position.",
    impact: "Acts as a recombination center; reduces minority-carrier lifetime; small mobility scattering.",
    consequence: "Limits Si MOSFET subthreshold leakage and bipolar transistor current gain after radiation exposure."
  },
  "Self-Interstitial": {
    short: "I",
    color: '#ef6c00',
    dim: "0D",
    mechanism: "A host atom occupying a non-lattice (interstitial) site, typically displaced by ion implantation.",
    charge: "I⁰ and charged variants near band edges.",
    impact: "Mediates transient enhanced diffusion of dopants; creates strain fields that scatter carriers.",
    consequence: "Drives boron diffusion overshoot in shallow CMOS source/drain implants."
  },
  "Substitutional Donor (P)": {
    short: "P⁺",
    color: '#2e7d32',
    dim: "0D",
    mechanism: "A phosphorus atom replaces a Si host atom; the fifth valence electron is loosely bound at ~45 meV.",
    charge: "P⁰ (neutral) ↔ P⁺ + e⁻ (ionized at room T).",
    impact: "Donates electrons to the conduction band — controlled n-type doping.",
    consequence: "Basis of every n-type MOSFET source/drain region."
  },
  "Substitutional Deep Trap (Au)": {
    short: "Au",
    color: '#6a1b9a',
    dim: "0D",
    mechanism: "Gold replaces a Si host atom; introduces deep levels in the middle of the gap.",
    charge: "Au⁰, Au⁺, Au⁻ — amphoteric.",
    impact: "Powerful recombination center: cuts carrier lifetime by orders of magnitude.",
    consequence: "Used intentionally in fast-recovery rectifiers; an unwanted killer in CMOS."
  },
  "Frenkel Pair": {
    short: "F",
    color: '#0277bd',
    dim: "0D",
    mechanism: "A vacancy plus a nearby self-interstitial, formed when an atom is displaced but remains close.",
    charge: "Net neutral; individual partners can be charged.",
    impact: "Combined carrier-lifetime and mobility degradation; may recombine on annealing.",
    consequence: "Dominant damage state in neutron-irradiated power devices before annealing."
  }
};

const HIGHLIGHT_MAP = {
  "All defects":               null,
  "Vacancies only":            ["Vacancy"],
  "Interstitials only":        ["Self-Interstitial"],
  "Substitutional impurities": ["Substitutional Donor (P)", "Substitutional Deep Trap (Au)"],
  "Frenkel pairs":             ["Frenkel Pair"]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  highlightSelect = createSelect();
  for (const k of Object.keys(HIGHLIGHT_MAP)) highlightSelect.option(k);
  highlightSelect.selected("All defects");
  highlightSelect.position(190, drawHeight + 18);

  randomizeBtn = createButton('Randomize positions');
  randomizeBtn.position(440, drawHeight + 18);
  randomizeBtn.mousePressed(generateDefects);

  randomSeed(42);
  generateDefects();

  describe('Top-down view of a square lattice cross-section with point defects (vacancies, interstitials, substitutional impurities, Frenkel pairs). Click a defect to see its details.', LABEL);
}

function generateDefects() {
  defects = [];
  selectedDefect = null;

  // Choose lattice sites for substitutional defects + vacancy
  const used = new Set();
  function randomSite() {
    while (true) {
      const i = floor(random(1, GRID - 1));
      const j = floor(random(1, GRID - 1));
      const k = i + "," + j;
      if (!used.has(k)) { used.add(k); return [i, j]; }
    }
  }
  function randomInterstitialOffset() {
    const i = floor(random(1, GRID - 1));
    const j = floor(random(1, GRID - 1));
    return [i + 0.5, j + 0.5];
  }

  // 3 vacancies (not part of Frenkel)
  for (let k = 0; k < 3; k++) {
    const p = randomSite();
    defects.push({ type: "Vacancy", lattice: true, i: p[0], j: p[1] });
  }
  // 3 self-interstitials
  for (let k = 0; k < 3; k++) {
    const p = randomInterstitialOffset();
    defects.push({ type: "Self-Interstitial", lattice: false, i: p[0], j: p[1] });
  }
  // 2 P donors
  for (let k = 0; k < 2; k++) {
    const p = randomSite();
    defects.push({ type: "Substitutional Donor (P)", lattice: true, i: p[0], j: p[1] });
  }
  // 2 Au deep traps
  for (let k = 0; k < 2; k++) {
    const p = randomSite();
    defects.push({ type: "Substitutional Deep Trap (Au)", lattice: true, i: p[0], j: p[1] });
  }
  // 2 Frenkel pairs (vacancy + adjacent interstitial)
  for (let k = 0; k < 2; k++) {
    const p = randomSite();
    const vi = p[0], vj = p[1];
    // adjacent interstitial position
    const ii = vi + 0.5 + (random() > 0.5 ? 0 : -1);
    const jj = vj + 0.5;
    defects.push({ type: "Frenkel Pair", subtype: "V", lattice: true,  i: vi, j: vj, pairKey: 'fp' + k });
    defects.push({ type: "Frenkel Pair", subtype: "I", lattice: false, i: ii, j: jj, pairKey: 'fp' + k });
  }
}

function getLatticeOrigin(panelLeft, panelTop, panelW, panelH) {
  const cell = Math.min(panelW, panelH) / (GRID + 0.5);
  const totalW = cell * (GRID - 1);
  const totalH = cell * (GRID - 1);
  const ox = panelLeft + (panelW - totalW) / 2;
  const oy = panelTop + (panelH - totalH) / 2;
  return { ox, oy, cell };
}

function defectScreenPos(d, layout) {
  return {
    x: layout.ox + d.i * layout.cell,
    y: layout.oy + d.j * layout.cell
  };
}

function isHighlighted(type) {
  const filter = HIGHLIGHT_MAP[highlightSelect.value()];
  if (!filter) return true;
  return filter.includes(type);
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
  text('Point Defect Visualizer', canvasWidth / 2, 8);
  textStyle(NORMAL);

  drawLegend(margin + 4, 40);

  const leftPanelW = canvasWidth * 0.65;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;
  const panelTop = 54;
  const panelH = drawHeight - panelTop - 15;

  // Lattice panel background
  fill('#fffde7');
  stroke(200);
  rect(margin, panelTop, leftPanelW - margin - 5, panelH);
  noStroke();

  const layout = getLatticeOrigin(margin + 8, panelTop + 8, leftPanelW - margin - 21, panelH - 16);

  // Draw host atom lattice
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      // Skip lattice sites occupied by substitutional or vacancy defects
      if (siteOccupied(i, j)) continue;
      const sx = layout.ox + i * layout.cell;
      const sy = layout.oy + j * layout.cell;
      fill('#90caf9');
      stroke(50);
      strokeWeight(0.8);
      circle(sx, sy, 14);
    }
  }
  noStroke();

  // Draw Frenkel-pair arcs first (so atoms overlay)
  const pairs = {};
  for (const d of defects) {
    if (d.type === "Frenkel Pair") {
      if (!pairs[d.pairKey]) pairs[d.pairKey] = [];
      pairs[d.pairKey].push(d);
    }
  }
  for (const key in pairs) {
    if (pairs[key].length === 2 && isHighlighted("Frenkel Pair")) {
      const a = defectScreenPos(pairs[key][0], layout);
      const b = defectScreenPos(pairs[key][1], layout);
      stroke(2, 119, 189, 200);
      strokeWeight(1.5);
      noFill();
      drawDashedCurve(a.x, a.y, b.x, b.y);
      noStroke();
    }
  }

  // Draw each defect
  hoverDefect = null;
  const mx = mouseX, my = mouseY;
  for (const d of defects) {
    const info = defectInfo[d.type];
    const pos = defectScreenPos(d, layout);
    const highlighted = isHighlighted(d.type);
    const alpha = highlighted ? 255 : 60;

    // Check hover
    if (dist(mx, my, pos.x, pos.y) < 12) hoverDefect = d;

    if (d.type === "Vacancy" || (d.type === "Frenkel Pair" && d.subtype === "V")) {
      // dashed circle outline
      stroke(198, 40, 40, alpha);
      strokeWeight(1.8);
      noFill();
      drawDashedCircle(pos.x, pos.y, 18);
      noStroke();
      fill(198, 40, 40, alpha);
      textAlign(CENTER, CENTER);
      textSize(11);
      textStyle(BOLD);
      text("V", pos.x, pos.y);
      textStyle(NORMAL);
    } else if (d.type === "Self-Interstitial" || (d.type === "Frenkel Pair" && d.subtype === "I")) {
      // small orange circle at midpoint
      noStroke();
      fill(239, 108, 0, alpha);
      circle(pos.x, pos.y, 11);
      fill(255, 255, 255, alpha);
      textAlign(CENTER, CENTER);
      textSize(9);
      textStyle(BOLD);
      text("I", pos.x, pos.y);
      textStyle(NORMAL);
    } else if (d.type === "Substitutional Donor (P)") {
      noStroke();
      fill(46, 125, 50, alpha);
      circle(pos.x, pos.y, 16);
      fill(255, 255, 255, alpha);
      textAlign(CENTER, CENTER);
      textSize(10);
      textStyle(BOLD);
      text("P⁺", pos.x, pos.y);
      textStyle(NORMAL);
    } else if (d.type === "Substitutional Deep Trap (Au)") {
      noStroke();
      fill(106, 27, 154, alpha);
      circle(pos.x, pos.y, 16);
      fill(255, 255, 255, alpha);
      textAlign(CENTER, CENTER);
      textSize(9);
      textStyle(BOLD);
      text("Au", pos.x, pos.y);
      textStyle(NORMAL);
    }

    // hover/selected glow
    if (d === hoverDefect || d === selectedDefect) {
      noFill();
      stroke(255, 200, 0, 220);
      strokeWeight(2);
      circle(pos.x, pos.y, 26);
      noStroke();
    }
  }

  // Tooltip
  if (hoverDefect) {
    const info = defectInfo[hoverDefect.type];
    if (info) {
      const tx = mx + 14, ty = my + 6;
      const tw = 220;
      fill(255, 250, 220, 240);
      stroke(120);
      strokeWeight(1);
      rect(tx, ty, tw, 56, 4);
      noStroke();
      fill('black');
      textAlign(LEFT, TOP);
      textSize(12);
      textStyle(BOLD);
      text(hoverDefect.type, tx + 6, ty + 4);
      textStyle(NORMAL);
      textSize(11);
      text(info.impact, tx + 6, ty + 22, tw - 12);
    }
  }

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, panelTop, rightPanelW, panelH);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Highlight defect type:", 10, drawHeight + 30);
}

// Compact key for the defect glyphs, drawn in the strip below the title
function drawLegend(x, y) {
  push();
  textSize(11);
  textAlign(LEFT, CENTER);
  let cx = x;

  // Vacancy — dashed red circle
  stroke('#c62828'); strokeWeight(1.5); noFill();
  drawDashedCircle(cx + 7, y, 13);
  noStroke(); fill('#c62828');
  cx += 17;
  text("Vacancy", cx, y); cx += textWidth("Vacancy") + 16;

  // Self-interstitial — small orange dot
  noStroke(); fill('#ef6c00');
  circle(cx + 5, y, 10);
  cx += 13;
  text("Self-interstitial", cx, y); cx += textWidth("Self-interstitial") + 16;

  // P donor — green dot with P⁺
  fill('#2e7d32'); circle(cx + 7, y, 13);
  fill('white'); textAlign(CENTER, CENTER); textSize(8); text("P⁺", cx + 7, y);
  textSize(11); textAlign(LEFT, CENTER); fill('#2e7d32');
  cx += 17;
  text("P donor", cx, y); cx += textWidth("P donor") + 16;

  // Au deep trap — purple dot with Au
  fill('#6a1b9a'); circle(cx + 7, y, 13);
  fill('white'); textAlign(CENTER, CENTER); textSize(7); text("Au", cx + 7, y);
  textSize(11); textAlign(LEFT, CENTER); fill('#6a1b9a');
  cx += 17;
  text("Au deep trap", cx, y); cx += textWidth("Au deep trap") + 16;

  // Frenkel pair — short dashed blue arc
  stroke('#0277bd'); strokeWeight(1.5);
  for (let d = 0; d < 14; d += 5) line(cx + d, y, cx + d + 3, y);
  noStroke(); fill('#0277bd');
  cx += 18;
  text("Frenkel pair (V + I)", cx, y);
  pop();
}

function siteOccupied(i, j) {
  for (const d of defects) {
    if (d.lattice && d.i === i && d.j === j) return true;
  }
  return false;
}

function drawInfoPanel(x, y, w, h) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, h);
  noStroke();

  const pad = 12;
  let cy = y + 12;

  if (!selectedDefect) {
    fill(80);
    textAlign(LEFT, TOP);
    textSize(13);
    text("Click a defect to see its formation mechanism, electrical impact, and a real-world consequence.", x + pad, cy, w - 2 * pad);
    return;
  }

  const info = defectInfo[selectedDefect.type];
  fill(info.color);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text(selectedDefect.type, x + pad, cy, w - 2 * pad);
  cy += 30;

  textStyle(NORMAL);
  fill(60);
  textSize(12);
  text(info.dim + " (point defect)", x + pad, cy);
  cy += 22;

  fill('black');
  textSize(12);
  textStyle(BOLD);
  text("Mechanism:", x + pad, cy);
  textStyle(NORMAL);
  cy += 16;
  text(info.mechanism, x + pad, cy, w - 2 * pad);
  cy += 46;

  textStyle(BOLD);
  text("Charge states:", x + pad, cy);
  textStyle(NORMAL);
  cy += 16;
  text(info.charge, x + pad, cy, w - 2 * pad);
  cy += 36;

  textStyle(BOLD);
  text("Electrical impact:", x + pad, cy);
  textStyle(NORMAL);
  cy += 16;
  text(info.impact, x + pad, cy, w - 2 * pad);
  cy += 50;

  textStyle(BOLD);
  text("Real-world consequence:", x + pad, cy);
  textStyle(NORMAL);
  cy += 16;
  text(info.consequence, x + pad, cy, w - 2 * pad);
}

function mousePressed() {
  if (hoverDefect) {
    selectedDefect = hoverDefect;
  }
}

function drawDashedCircle(cx, cy, d) {
  const r = d / 2;
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    if (i % 2 === 0) {
      const a1 = (i / steps) * TWO_PI;
      const a2 = ((i + 1) / steps) * TWO_PI;
      arc(cx, cy, d, d, a1, a2);
    }
  }
}

function drawDashedCurve(x1, y1, x2, y2) {
  // Approximate a small arc between two points with dashes
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 10;
  const steps = 12;
  for (let i = 0; i < steps; i++) {
    if (i % 2 === 0) {
      const t1 = i / steps;
      const t2 = (i + 1) / steps;
      const px1 = bezierPoint(x1, mx, mx, x2, t1);
      const py1 = bezierPoint(y1, my, my, y2, t1);
      const px2 = bezierPoint(x1, mx, mx, x2, t2);
      const py2 = bezierPoint(y1, my, my, y2, t2);
      line(px1, py1, px2, py2);
    }
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
