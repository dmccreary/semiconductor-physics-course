// Cubic Crystal Structure Explorer
// CANVAS_HEIGHT: 560
// Manual 3D perspective projection of conventional unit cells for SC, BCC, FCC, Diamond, Zincblende.

let containerWidth;
let canvasWidth = 900;
let drawHeight = 440;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 200;
let defaultTextSize = 14;

let structureSelect, rotSlider, tiltSlider, bondsCheckbox, outlineCheckbox;

const structures = {
  "Simple Cubic (SC)":       { atomsPerCell: 1, cn: 6,  apf: "52.4%", nn: "a",       examples: "(α-Po only — rare)" },
  "Body-Centered Cubic (BCC)":{ atomsPerCell: 2, cn: 8,  apf: "68.0%", nn: "a√3/2",   examples: "α-Fe, Cr, W" },
  "Face-Centered Cubic (FCC)":{ atomsPerCell: 4, cn: 12, apf: "74.0%", nn: "a√2/2",   examples: "Al, Cu, Ni, γ-Fe" },
  "Diamond Cubic":            { atomsPerCell: 8, cn: 4,  apf: "34.0%", nn: "a√3/4",   examples: "Si, Ge, C (diamond)" },
  "Zincblende (GaAs)":        { atomsPerCell: 8, cn: 4,  apf: "34.0%", nn: "a√3/4",   examples: "GaAs, InP, ZnS, CdTe" }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  structureSelect = createSelect();
  for (const k of Object.keys(structures)) structureSelect.option(k);
  structureSelect.selected("Face-Centered Cubic (FCC)");
  structureSelect.position(sliderLeftMargin, drawHeight + 8);

  rotSlider = createSlider(0, 360, 30, 1);
  rotSlider.position(sliderLeftMargin, drawHeight + 38);
  rotSlider.size(canvasWidth - sliderLeftMargin - margin);

  tiltSlider = createSlider(10, 80, 35, 1);
  tiltSlider.position(sliderLeftMargin, drawHeight + 68);
  tiltSlider.size(canvasWidth - sliderLeftMargin - margin);

  bondsCheckbox = createCheckbox('Show bonds', true);
  bondsCheckbox.position(20, drawHeight + 95);

  outlineCheckbox = createCheckbox('Show unit cell outline', true);
  outlineCheckbox.position(180, drawHeight + 95);

  describe('Interactive 3D model of cubic crystal unit cells. Rotate and tilt to view SC, BCC, FCC, Diamond, and Zincblende structures.', LABEL);
}

function getAtoms(struct) {
  const atoms = [];
  // 8 corner atoms (always present), color blue
  for (let x = 0; x <= 1; x++) {
    for (let y = 0; y <= 1; y++) {
      for (let z = 0; z <= 1; z++) {
        atoms.push({ pos: [x, y, z], color: '#1976d2', radius: 16, label: "corner" });
      }
    }
  }
  if (struct === "Body-Centered Cubic (BCC)") {
    atoms.push({ pos: [0.5, 0.5, 0.5], color: '#43a047', radius: 16, label: "body-center" });
  }
  if (struct === "Face-Centered Cubic (FCC)" || struct === "Diamond Cubic" || struct === "Zincblende (GaAs)") {
    const faces = [[0.5,0.5,0],[0.5,0.5,1],[0.5,0,0.5],[0.5,1,0.5],[0,0.5,0.5],[1,0.5,0.5]];
    for (const f of faces) {
      const col = (struct === "Zincblende (GaAs)") ? '#fb8c00' : '#1976d2';
      atoms.push({ pos: f, color: col, radius: 16, label: (struct === "Zincblende (GaAs)") ? "Ga (face)" : "face-center" });
    }
  }
  if (struct === "Diamond Cubic") {
    const tet = [[0.25,0.25,0.25],[0.75,0.75,0.25],[0.75,0.25,0.75],[0.25,0.75,0.75]];
    for (const t of tet) atoms.push({ pos: t, color: '#fb8c00', radius: 15, label: "tetrahedral" });
  }
  if (struct === "Zincblende (GaAs)") {
    const tet = [[0.25,0.25,0.25],[0.75,0.75,0.25],[0.75,0.25,0.75],[0.25,0.75,0.75]];
    for (const t of tet) atoms.push({ pos: t, color: '#7b1fa2', radius: 15, label: "As" });
  }
  return atoms;
}

function getBonds(struct, atoms) {
  // Only meaningful for diamond/zincblende: bond each tetrahedral atom to 4 NN corners/faces.
  const bonds = [];
  if (struct !== "Diamond Cubic" && struct !== "Zincblende (GaAs)") return bonds;
  // Find tetrahedral-position atoms (last 4)
  const tet = atoms.filter(a => a.label === "tetrahedral" || a.label === "As");
  const others = atoms.filter(a => a.label !== "tetrahedral" && a.label !== "As");
  for (const t of tet) {
    // bond to the 4 nearest non-tet atoms
    const dists = others.map(o => ({ atom: o, d: dist3(t.pos, o.pos) }));
    dists.sort((a, b) => a.d - b.d);
    for (let i = 0; i < 4; i++) {
      bonds.push({ a: t, b: dists[i].atom });
    }
  }
  return bonds;
}

function dist3(p, q) {
  const dx = p[0] - q[0], dy = p[1] - q[1], dz = p[2] - q[2];
  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

function project(p, phi, tilt, centerX, centerY, scale) {
  // Center coords about (0.5, 0.5, 0.5)
  const x = p[0] - 0.5, y = p[1] - 0.5, z = p[2] - 0.5;
  // Rotate about Y by phi
  const cp = Math.cos(phi), sp = Math.sin(phi);
  const x1 = x * cp + z * sp;
  const y1 = y;
  const z1 = -x * sp + z * cp;
  // Rotate about X by (tilt - 90°)
  const tr = (tilt - 90) * Math.PI / 180;
  const ct = Math.cos(tr), st = Math.sin(tr);
  const x2 = x1;
  const y2 = y1 * ct - z1 * st;
  const z2 = y1 * st + z1 * ct;
  // Perspective
  const focal = 3.0;
  const persp = focal / (focal + z2);
  return {
    sx: centerX + x2 * scale * persp,
    sy: centerY - y2 * scale * persp,
    depth: z2,
    persp: persp
  };
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
  text('Cubic Crystal Structure Explorer', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const structName = structureSelect.value();
  const struct = structures[structName];
  const phi = rotSlider.value() * Math.PI / 180;
  const tilt = tiltSlider.value();

  const leftPanelW = canvasWidth * 0.65;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  const viewX = leftPanelW / 2;
  const viewY = drawHeight / 2 + 20;
  const viewScale = Math.min(leftPanelW, drawHeight - 60) * 0.42;

  // Compute unit cell corners
  const corners = [];
  for (let x = 0; x <= 1; x++) {
    for (let y = 0; y <= 1; y++) {
      for (let z = 0; z <= 1; z++) {
        corners.push({ pos: [x, y, z], proj: project([x,y,z], phi, tilt, viewX, viewY, viewScale) });
      }
    }
  }

  // Edges of the cube (12)
  const edges = [
    [0,1],[2,3],[4,5],[6,7],
    [0,2],[1,3],[4,6],[5,7],
    [0,4],[1,5],[2,6],[3,7]
  ];

  // Optionally draw outline (back edges thin/light, front edges bold)
  if (outlineCheckbox.checked()) {
    for (const e of edges) {
      const a = corners[e[0]].proj;
      const b = corners[e[1]].proj;
      const avgDepth = (a.depth + b.depth) / 2;
      if (avgDepth > 0) {
        // back edges — dashed thin
        stroke(160);
        strokeWeight(1);
        drawDashedLine(a.sx, a.sy, b.sx, b.sy);
      } else {
        stroke(70);
        strokeWeight(1.5);
        line(a.sx, a.sy, b.sx, b.sy);
      }
    }
    noStroke();
  }

  // Atoms and bonds
  const atoms = getAtoms(structName);
  // Project each atom
  for (const a of atoms) {
    a.proj = project(a.pos, phi, tilt, viewX, viewY, viewScale);
  }
  const bonds = getBonds(structName, atoms);

  // Draw bonds (depth sort by midpoint)
  if (bondsCheckbox.checked()) {
    const bondList = bonds.map(b => ({
      a: b.a.proj, b: b.b.proj,
      depth: (b.a.proj.depth + b.b.proj.depth) / 2
    }));
    bondList.sort((p, q) => q.depth - p.depth);
    for (const bl of bondList) {
      stroke(120, 120, 120, 200);
      strokeWeight(2);
      line(bl.a.sx, bl.a.sy, bl.b.sx, bl.b.sy);
    }
    noStroke();
  }

  // Sort atoms back-to-front
  atoms.sort((p, q) => q.proj.depth - p.proj.depth);
  for (const a of atoms) {
    const r = a.radius * a.proj.persp;
    // shadow / outline
    stroke(40);
    strokeWeight(1);
    fill(a.color);
    circle(a.proj.sx, a.proj.sy, r * 2);
    // small highlight
    noStroke();
    fill(255, 255, 255, 90);
    circle(a.proj.sx - r * 0.3, a.proj.sy - r * 0.3, r * 0.7);
  }

  // Crystallographic axes (small) in lower-left of view region
  drawAxes(viewX - leftPanelW / 2 + 50, drawHeight - 40, phi, tilt);

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, 50, rightPanelW, structName, struct);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("Structure:", 10, drawHeight + 18);
  text("Rotate (°): " + rotSlider.value(), 10, drawHeight + 48);
  text("Tilt (°): " + tiltSlider.value(), 10, drawHeight + 78);
}

function drawAxes(cx, cy, phi, tilt) {
  // small axis indicator
  const sc = 30;
  const xa = project([1,0.5,0.5], phi, tilt, 0, 0, sc);
  const ya = project([0.5,1,0.5], phi, tilt, 0, 0, sc);
  const za = project([0.5,0.5,1], phi, tilt, 0, 0, sc);
  // origin
  const o  = project([0.5,0.5,0.5], phi, tilt, 0, 0, sc);

  push();
  translate(cx, cy);
  strokeWeight(2);
  stroke('red');
  line(o.sx, o.sy, xa.sx, xa.sy);
  stroke('green');
  line(o.sx, o.sy, ya.sx, ya.sy);
  stroke('blue');
  line(o.sx, o.sy, za.sx, za.sy);
  noStroke();
  textSize(11);
  fill('red'); text("x", xa.sx + 3, xa.sy);
  fill('green'); text("y", ya.sx + 3, ya.sy);
  fill('blue'); text("z", za.sx + 3, za.sy);
  pop();
}

function drawInfoPanel(x, y, w, name, s) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, drawHeight - y - 20);
  noStroke();

  let cy = y + 14;
  const pad = 12;

  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text(name, x + pad, cy, w - 2 * pad);
  cy += 38;

  textStyle(NORMAL);
  textSize(13);
  text("Atoms per unit cell: " + s.atomsPerCell, x + pad, cy);
  cy += 22;
  text("Coordination number: " + s.cn, x + pad, cy);
  cy += 22;
  text("APF: " + s.apf, x + pad, cy);
  cy += 22;
  text("NN distance: " + s.nn, x + pad, cy);
  cy += 28;
  textStyle(BOLD);
  text("Example materials:", x + pad, cy);
  cy += 18;
  textStyle(NORMAL);
  fill(60);
  text(s.examples, x + pad, cy, w - 2 * pad);
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
  rotSlider.size(canvasWidth - sliderLeftMargin - margin);
  tiltSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
