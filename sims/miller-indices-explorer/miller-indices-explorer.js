// Miller Indices Crystal Plane Explorer
// CANVAS_HEIGHT: 540
// Visualizes the (hkl) plane through a 2x2x2 simple cubic supercell.

let containerWidth;
let canvasWidth = 850;
let drawHeight = 400;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let sliderLeftMargin = 80;
let defaultTextSize = 14;

let hSlider, kSlider, lSlider, presetSelect, resetBtn;
let phi = 30 * Math.PI / 180;
let tilt = 30;
const SUPERCELL = 2;
const A_SI = 5.431; // Å for d-spacing calc

const presets = {
  "Custom": null,
  "(100)": [1, 0, 0],
  "(110)": [1, 1, 0],
  "(111)": [1, 1, 1],
  "(200)": [2, 0, 0],
  "(210)": [2, 1, 0],
  "(211)": [2, 1, 1],
  "(010)": [0, 1, 0],
  "(001)": [0, 0, 1]
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  hSlider = createSlider(-3, 3, 1, 1);
  hSlider.position(sliderLeftMargin, drawHeight + 10);
  hSlider.size(220);

  kSlider = createSlider(-3, 3, 0, 1);
  kSlider.position(sliderLeftMargin, drawHeight + 40);
  kSlider.size(220);

  lSlider = createSlider(-3, 3, 0, 1);
  lSlider.position(sliderLeftMargin, drawHeight + 70);
  lSlider.size(220);

  presetSelect = createSelect();
  for (const k of Object.keys(presets)) presetSelect.option(k);
  presetSelect.selected("(100)");
  presetSelect.position(sliderLeftMargin, drawHeight + 105);
  presetSelect.changed(applyPreset);

  resetBtn = createButton('Reset view');
  resetBtn.position(sliderLeftMargin + 100, drawHeight + 105);
  resetBtn.mousePressed(() => { /* future hook */ });

  describe('Interactive 3D supercell showing the Miller (hkl) plane and its intercepts with the crystallographic axes.', LABEL);
}

function applyPreset() {
  const v = presets[presetSelect.value()];
  if (!v) return;
  hSlider.value(v[0]);
  kSlider.value(v[1]);
  lSlider.value(v[2]);
}

function project(p, centerX, centerY, scale) {
  const x = p[0] - SUPERCELL / 2;
  const y = p[1] - SUPERCELL / 2;
  const z = p[2] - SUPERCELL / 2;
  const cp = Math.cos(phi), sp = Math.sin(phi);
  const x1 = x * cp + z * sp;
  const y1 = y;
  const z1 = -x * sp + z * cp;
  const tr = (tilt - 90) * Math.PI / 180;
  const ct = Math.cos(tr), st = Math.sin(tr);
  const x2 = x1;
  const y2 = y1 * ct - z1 * st;
  const z2 = y1 * st + z1 * ct;
  const focal = 6.0;
  const persp = focal / (focal + z2);
  return {
    sx: centerX + x2 * scale * persp,
    sy: centerY - y2 * scale * persp,
    depth: z2,
    persp: persp
  };
}

function getPlanePolygon(h, k, l) {
  // Plane: h*x + k*y + l*z = 1 (using a=1 unit cell). We clip to cube [0,SUPERCELL]^3.
  if (h === 0 && k === 0 && l === 0) return [];
  const vertices = [];
  for (let i = 0; i <= SUPERCELL; i += SUPERCELL) {
    for (let j = 0; j <= SUPERCELL; j += SUPERCELL) {
      for (let m = 0; m <= SUPERCELL; m += SUPERCELL) {
        vertices.push([i, j, m]);
      }
    }
  }
  const edges = [
    [0,1],[2,3],[4,5],[6,7],
    [0,2],[1,3],[4,6],[5,7],
    [0,4],[1,5],[2,6],[3,7]
  ];

  const f = (v) => h * v[0] + k * v[1] + l * v[2] - 1;
  const intersections = [];

  for (const e of edges) {
    const v1 = vertices[e[0]];
    const v2 = vertices[e[1]];
    const f1 = f(v1), f2 = f(v2);
    if ((f1 > 0 && f2 < 0) || (f1 < 0 && f2 > 0)) {
      const t = f1 / (f1 - f2);
      intersections.push([
        v1[0] + (v2[0] - v1[0]) * t,
        v1[1] + (v2[1] - v1[1]) * t,
        v1[2] + (v2[2] - v1[2]) * t
      ]);
    } else if (f1 === 0) {
      intersections.push([v1[0], v1[1], v1[2]]);
    } else if (f2 === 0) {
      intersections.push([v2[0], v2[1], v2[2]]);
    }
  }
  // Dedup
  const uniq = [];
  for (const p of intersections) {
    if (!uniq.some(q => Math.abs(q[0]-p[0])<1e-6 && Math.abs(q[1]-p[1])<1e-6 && Math.abs(q[2]-p[2])<1e-6)) {
      uniq.push(p);
    }
  }
  if (uniq.length < 3) return [];
  // Sort by angle around centroid
  const cx = uniq.reduce((s,p)=>s+p[0],0) / uniq.length;
  const cy = uniq.reduce((s,p)=>s+p[1],0) / uniq.length;
  const cz = uniq.reduce((s,p)=>s+p[2],0) / uniq.length;
  // Build a 2D basis on the plane
  const n = [h, k, l];
  const nLen = Math.sqrt(h*h + k*k + l*l);
  const nn = [n[0]/nLen, n[1]/nLen, n[2]/nLen];
  // Choose any vector not parallel
  let u = [1, 0, 0];
  if (Math.abs(nn[0]) > 0.9) u = [0, 1, 0];
  // Make u perpendicular to nn
  const dot = u[0]*nn[0] + u[1]*nn[1] + u[2]*nn[2];
  u = [u[0]-dot*nn[0], u[1]-dot*nn[1], u[2]-dot*nn[2]];
  const uLen = Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]);
  u = [u[0]/uLen, u[1]/uLen, u[2]/uLen];
  // v = nn x u
  const v = [
    nn[1]*u[2]-nn[2]*u[1],
    nn[2]*u[0]-nn[0]*u[2],
    nn[0]*u[1]-nn[1]*u[0]
  ];
  uniq.forEach(p => {
    const dx = p[0]-cx, dy = p[1]-cy, dz = p[2]-cz;
    p.angle = Math.atan2(
      dx*v[0] + dy*v[1] + dz*v[2],
      dx*u[0] + dy*u[1] + dz*u[2]
    );
  });
  uniq.sort((a,b) => a.angle - b.angle);
  return uniq;
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
  text('Miller Indices Crystal Plane Explorer', canvasWidth / 2, 8);
  textStyle(NORMAL);

  const h = hSlider.value();
  const k = kSlider.value();
  const l = lSlider.value();

  const leftPanelW = canvasWidth * 0.6;
  const rightPanelX = leftPanelW + 10;
  const rightPanelW = canvasWidth - rightPanelX - margin;

  const viewX = leftPanelW / 2;
  const viewY = drawHeight / 2 + 20;
  const viewScale = Math.min(leftPanelW, drawHeight - 70) * 0.25;

  // Compute cube corners (supercell)
  const corners = [];
  for (let x = 0; x <= SUPERCELL; x += SUPERCELL) {
    for (let y = 0; y <= SUPERCELL; y += SUPERCELL) {
      for (let z = 0; z <= SUPERCELL; z += SUPERCELL) {
        corners.push({ pos: [x, y, z], proj: project([x,y,z], viewX, viewY, viewScale) });
      }
    }
  }
  const cubeEdges = [
    [0,1],[2,3],[4,5],[6,7],
    [0,2],[1,3],[4,6],[5,7],
    [0,4],[1,5],[2,6],[3,7]
  ];
  // Draw cube outline
  for (const e of cubeEdges) {
    const a = corners[e[0]].proj;
    const b = corners[e[1]].proj;
    const avgDepth = (a.depth + b.depth) / 2;
    if (avgDepth > 0) {
      stroke(180);
      strokeWeight(1);
      drawDashedLine(a.sx, a.sy, b.sx, b.sy);
    } else {
      stroke(60);
      strokeWeight(1.5);
      line(a.sx, a.sy, b.sx, b.sy);
    }
  }
  noStroke();

  // Atoms at integer positions
  const atoms = [];
  for (let i = 0; i <= SUPERCELL; i++) {
    for (let j = 0; j <= SUPERCELL; j++) {
      for (let m = 0; m <= SUPERCELL; m++) {
        atoms.push({ pos: [i, j, m], proj: project([i,j,m], viewX, viewY, viewScale) });
      }
    }
  }
  // Determine which atoms lie on the plane h*x + k*y + l*z = 1 (using fractional coords in single-cell terms).
  // We use integer coords i,j,m and check if h*i + k*j + l*m == 1.
  const onPlane = atoms.map(a => (h * a.pos[0] + k * a.pos[1] + l * a.pos[2] === 1));

  // Compute plane polygon
  const polyPoints = getPlanePolygon(h, k, l);
  const projPoly = polyPoints.map(p => project(p, viewX, viewY, viewScale));

  // Draw plane (translucent)
  if (projPoly.length >= 3) {
    fill(33, 150, 243, 110);
    stroke(13, 71, 161, 200);
    strokeWeight(1.5);
    beginShape();
    for (const p of projPoly) vertex(p.sx, p.sy);
    endShape(CLOSE);
    noStroke();
  }

  // Draw atoms (back to front)
  const sortedAtoms = atoms.map((a, idx) => ({ a, on: onPlane[idx] }));
  sortedAtoms.sort((p, q) => q.a.proj.depth - p.a.proj.depth);
  for (const item of sortedAtoms) {
    const a = item.a;
    const r = 10 * a.proj.persp;
    stroke(40);
    strokeWeight(1);
    fill(item.on ? '#ff9800' : '#9e9e9e');
    circle(a.proj.sx, a.proj.sy, r * 2);
  }
  noStroke();

  // Axes indicator
  drawAxesIndicator(40, drawHeight - 50);

  // Intercept markers — if any of hkl is non-zero, draw a triangle at the intercept on each axis
  drawInterceptMarkers(h, k, l, viewX, viewY, viewScale);

  // RIGHT INFO PANEL
  drawInfoPanel(rightPanelX, 50, rightPanelW, h, k, l);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text("h: " + h, 10, drawHeight + 20);
  text("k: " + k, 10, drawHeight + 50);
  text("l: " + l, 10, drawHeight + 80);
  text("Preset:", 10, drawHeight + 115);
}

function drawInterceptMarkers(h, k, l, cx, cy, sc) {
  const markers = [];
  // intercepts where the plane h*x + k*y + l*z = 1 crosses each axis
  if (h !== 0) markers.push({ pos: [1/h, 0, 0], color: 'red' });
  if (k !== 0) markers.push({ pos: [0, 1/k, 0], color: 'green' });
  if (l !== 0) markers.push({ pos: [0, 0, 1/l], color: 'blue' });
  for (const m of markers) {
    const p = project(m.pos, cx, cy, sc);
    fill(m.color);
    noStroke();
    triangle(p.sx, p.sy - 7, p.sx - 6, p.sy + 5, p.sx + 6, p.sy + 5);
  }
}

function drawAxesIndicator(cx, cy) {
  const sc = 28;
  const o  = project([0,0,0], 0, 0, sc);
  const xa = project([1,0,0], 0, 0, sc);
  const ya = project([0,1,0], 0, 0, sc);
  const za = project([0,0,1], 0, 0, sc);
  push();
  translate(cx, cy);
  strokeWeight(2);
  stroke('red');   line(o.sx, o.sy, xa.sx, xa.sy);
  stroke('green'); line(o.sx, o.sy, ya.sx, ya.sy);
  stroke('blue');  line(o.sx, o.sy, za.sx, za.sy);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  fill('red');   text("a", xa.sx + 3, xa.sy);
  fill('green'); text("b", ya.sx + 3, ya.sy);
  fill('blue');  text("c", za.sx + 3, za.sy);
  textStyle(NORMAL);
  pop();
}

function drawInfoPanel(x, y, w, h, k, l) {
  fill('#fafafa');
  stroke('silver');
  rect(x, y, w, drawHeight - y - 20);
  noStroke();

  let cy = y + 14;
  const pad = 12;

  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);

  if (h === 0 && k === 0 && l === 0) {
    fill('#b71c1c');
    textStyle(BOLD);
    text("Invalid: (000) is not a Miller index.", x + pad, cy, w - 2 * pad);
    textStyle(NORMAL);
    return;
  }

  textStyle(BOLD);
  textSize(15);
  text("Miller plane (" + h + " " + k + " " + l + ")", x + pad, cy);
  cy += 32;

  textStyle(NORMAL);
  textSize(13);
  // intercepts
  const ax = (h === 0) ? "∞" : (1/h).toFixed(2);
  const bx = (k === 0) ? "∞" : (1/k).toFixed(2);
  const cz = (l === 0) ? "∞" : (1/l).toFixed(2);
  text("Intercepts on a, b, c:", x + pad, cy);
  cy += 18;
  text("   " + ax + ", " + bx + ", " + cz + " (× a)", x + pad, cy);
  cy += 26;

  text("Reciprocals: 1/(intercept):", x + pad, cy);
  cy += 18;
  text("   " + h + ", " + k + ", " + l, x + pad, cy);
  cy += 26;

  textStyle(BOLD);
  text("Miller indices: (" + h + " " + k + " " + l + ")", x + pad, cy);
  cy += 28;
  textStyle(NORMAL);

  // Family equivalence count (cubic system)
  // Simple heuristic: count permutations × sign changes of nonzero indices
  const familyCount = countFamilyMembers(h, k, l);
  text("Family {" + h + k + l + "} has " + familyCount + " equivalent planes", x + pad, cy, w - 2 * pad);
  cy += 32;

  // Interplanar spacing for Si
  const denom = Math.sqrt(h*h + k*k + l*l);
  const d = A_SI / denom;
  text("Interplanar spacing in Si:", x + pad, cy);
  cy += 18;
  text("   d = a / √(h²+k²+l²)", x + pad, cy);
  cy += 18;
  text("     = " + d.toFixed(3) + " Å", x + pad, cy);
}

function countFamilyMembers(h, k, l) {
  // Generate all unique permutations of [±h, ±k, ±l]
  const indices = [h, k, l].map(Math.abs);
  const seen = new Set();
  const sign = [-1, 1];
  // Permutations
  function perm(arr) {
    if (arr.length <= 1) return [arr];
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = arr.slice(0, i).concat(arr.slice(i + 1));
      for (const p of perm(rest)) {
        out.push([arr[i]].concat(p));
      }
    }
    return out;
  }
  for (const p of perm(indices)) {
    for (const s0 of sign) for (const s1 of sign) for (const s2 of sign) {
      const key = (s0 * p[0]) + "," + (s1 * p[1]) + "," + (s2 * p[2]);
      // ignore (0,0,0)
      if (s0*p[0]===0 && s1*p[1]===0 && s2*p[2]===0) continue;
      seen.add(key);
    }
  }
  // Each plane and its negation count as the same family member, divide by 2
  return seen.size / 2;
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
