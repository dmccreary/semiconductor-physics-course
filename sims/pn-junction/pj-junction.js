// P-N Junction Voltage Controller MicroSim
// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 130;
let defaultTextSize = 16;

// Responsive design variables
let containerWidth;
let containerHeight = canvasHeight;

// Physics simulation variables
let voltageSlider;
let appliedVoltage = 0; // Initial voltage
let junctionX; // X position of the junction
let depletionWidth = 60; // Width of depletion region
let baseDepletionWidth = 60; // Base depletion width at 0V

// Carrier arrays
let electrons = [];
let holes = [];
let maxCarriers = 30;

// Wire positions
let wireHeight = 15;
let wireThickness = 8;

// Animation control
let isRunning = true;
let startButton;
let resetButton;

// Colors
let pRegionColor;
let nRegionColor;
let depletionColor;
let wireColor;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  
  // Initialize junction position
  junctionX = containerWidth / 2;
  
  // Initialize colors
  pRegionColor = color(255, 200, 200); // Light red for P-region
  nRegionColor = color(200, 200, 255); // Light blue for N-region
  depletionColor = color(240, 240, 240); // Light gray for depletion
  wireColor = color(100, 100, 100); // Gray for wires
  
  // Create voltage slider
  voltageSlider = createSlider(-50, 20, 0); // -5.0V to +2.0V in 0.1V steps
  voltageSlider.position(sliderLeftMargin, drawHeight + 30);
  voltageSlider.size(containerWidth - sliderLeftMargin - 15);
  
  // Create control buttons
  startButton = createButton('Pause');
  startButton.position(10, drawHeight + 35);
  startButton.mousePressed(toggleSimulation);
  
  resetButton = createButton('Reset');
  resetButton.position(70, drawHeight + 35);
  resetButton.mousePressed(resetSimulation);
  
  // Initialize carriers
  initializeCarriers();
  
  describe('P-N Junction Voltage Controller showing carrier movement and depletion region changes with applied voltage', LABEL);
}

function draw() {
  // Update voltage from slider
  appliedVoltage = voltageSlider.value() / 10.0; // Convert to actual voltage
  
  // Calculate depletion width based on voltage
  // Forward bias decreases width, reverse bias increases width
  depletionWidth = baseDepletionWidth + (-appliedVoltage * 15);
  depletionWidth = constrain(depletionWidth, 10, 150);
  
  // Draw background areas
  drawBackgroundAreas();
  
  // Draw semiconductor regions
  drawSemiconductorRegions();
  
  // Draw wires
  drawWires();
  
  // Draw electric field visualization
  drawElectricField();
  
  // Update and draw carriers
  if (isRunning) {
    updateCarriers();
  }
  drawCarriers();
  
  // Draw title and labels
  drawTitle();
  drawControlLabels();
}

function drawBackgroundAreas() {
  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, containerWidth, drawHeight);
  
  // Controls area background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, containerWidth, controlHeight);
}

function drawSemiconductorRegions() {
  noStroke();
  
  // P-region (left side)
  fill(pRegionColor);
  rect(margin, wireHeight + wireThickness + 10, 
       junctionX - depletionWidth/2 - margin, 
       drawHeight - 2*wireHeight - 2*wireThickness - 20);
  
  // N-region (right side)
  fill(nRegionColor);
  rect(junctionX + depletionWidth/2, wireHeight + wireThickness + 10,
       containerWidth - margin - (junctionX + depletionWidth/2),
       drawHeight - 2*wireHeight - 2*wireThickness - 20);
  
  // Depletion region
  fill(depletionColor);
  rect(junctionX - depletionWidth/2, wireHeight + wireThickness + 10,
       depletionWidth,
       drawHeight - 2*wireHeight - 2*wireThickness - 20);
  
  // Draw region labels
  fill('black');
  textSize(18);
  textAlign(CENTER, CENTER);
  text('P', margin + (junctionX - depletionWidth/2 - margin)/2, 
       drawHeight/2);
  text('N', junctionX + depletionWidth/2 + (containerWidth - margin - (junctionX + depletionWidth/2))/2, 
       drawHeight/2);
  
  // Draw junction line
  stroke('black');
  strokeWeight(2);
  line(junctionX, wireHeight + wireThickness + 10, 
       junctionX, drawHeight - wireHeight - wireThickness - 10);
}

function drawWires() {
  fill(wireColor);
  noStroke();
  
  // Top wire (connected to P-region)
  rect(margin, wireHeight, junctionX - margin - 20, wireThickness);
  
  // Bottom wire (connected to N-region)
  rect(junctionX + 20, drawHeight - wireHeight - wireThickness, 
       containerWidth - margin - (junctionX + 20), wireThickness);
  
  // Wire connection lines
  stroke(wireColor);
  strokeWeight(3);
  line(junctionX - 20, wireHeight + wireThickness, 
       junctionX - 20, wireHeight + wireThickness + 10);
  line(junctionX + 20, drawHeight - wireHeight - wireThickness - 10,
       junctionX + 20, drawHeight - wireHeight - wireThickness);
  
  // Voltage polarity indicators
  fill('black');
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  
  if (appliedVoltage > 0) {
    text('+', margin + 10, wireHeight + wireThickness/2);
    text('-', containerWidth - margin - 10, drawHeight - wireHeight - wireThickness/2);
  } else if (appliedVoltage < 0) {
    text('-', margin + 10, wireHeight + wireThickness/2);
    text('+', containerWidth - margin - 10, drawHeight - wireHeight - wireThickness/2);
  }
}

function drawElectricField() {
  // Draw electric field arrows in depletion region
  if (depletionWidth > 20) {
    stroke('purple');
    strokeWeight(2);
    
    let fieldStrength = abs(appliedVoltage) + 1;
    let arrowSpacing = 15;
    let numArrows = floor(depletionWidth / arrowSpacing);
    
    for (let i = 0; i < numArrows; i++) {
      let x = junctionX - depletionWidth/2 + i * arrowSpacing + 10;
      let y1 = drawHeight/2 - 20;
      let y2 = drawHeight/2 + 20;
      
      // Draw field line
      line(x, y1, x, y2);
      
      // Draw arrow head (direction depends on field)
      let arrowSize = 5;
      if (appliedVoltage >= 0) {
        // Forward bias - reduced field
        line(x, y2, x - arrowSize, y2 - arrowSize);
        line(x, y2, x + arrowSize, y2 - arrowSize);
      } else {
        // Reverse bias - enhanced field
        line(x, y1, x - arrowSize, y1 + arrowSize);
        line(x, y1, x + arrowSize, y1 + arrowSize);
      }
    }
  }
}

function initializeCarriers() {
  electrons = [];
  holes = [];
  
  // Initialize electrons in N-region
  for (let i = 0; i < maxCarriers/2; i++) {
    electrons.push({
      x: random(junctionX + depletionWidth/2 + 10, containerWidth - margin - 10),
      y: random(wireHeight + wireThickness + 20, drawHeight - wireHeight - wireThickness - 20),
      vx: random(-1, 1),
      vy: random(-1, 1),
      originalX: 0,
      originalY: 0
    });
  }
  
  // Initialize holes in P-region
  for (let i = 0; i < maxCarriers/2; i++) {
    holes.push({
      x: random(margin + 10, junctionX - depletionWidth/2 - 10),
      y: random(wireHeight + wireThickness + 20, drawHeight - wireHeight - wireThickness - 20),
      vx: random(-1, 1),
      vy: random(-1, 1),
      originalX: 0,
      originalY: 0
    });
  }
  
  // Store original positions for reset
  for (let electron of electrons) {
    electron.originalX = electron.x;
    electron.originalY = electron.y;
  }
  for (let hole of holes) {
    hole.originalX = hole.x;
    hole.originalY = hole.y;
  }
}

function updateCarriers() {
  // Update electrons
  for (let electron of electrons) {
    // Add drift due to applied voltage
    if (appliedVoltage > 0) {
      // Forward bias - electrons move toward junction
      electron.vx += (junctionX - electron.x) * 0.001 * appliedVoltage;
    } else {
      // Reverse bias - electrons move away from junction
      electron.vx += (electron.originalX - electron.x) * 0.002;
    }
    
    // Add random thermal motion
    electron.vx += random(-0.5, 0.5);
    electron.vy += random(-0.5, 0.5);
    
    // Limit velocity
    electron.vx = constrain(electron.vx, -3, 3);
    electron.vy = constrain(electron.vy, -2, 2);
    
    // Update position
    electron.x += electron.vx;
    electron.y += electron.vy;
    
    // Boundary checking for N-region
    if (appliedVoltage <= 0) {
      // Reverse bias - keep in N-region
      electron.x = constrain(electron.x, junctionX + depletionWidth/2 + 5, containerWidth - margin - 5);
    } else {
      // Forward bias - allow crossing
      if (electron.x < margin + 5) electron.x = margin + 5;
      if (electron.x > containerWidth - margin - 5) electron.x = containerWidth - margin - 5;
    }
    
    electron.y = constrain(electron.y, wireHeight + wireThickness + 15, 
                          drawHeight - wireHeight - wireThickness - 15);
    
    // Bounce off boundaries
    if (electron.y <= wireHeight + wireThickness + 15 || 
        electron.y >= drawHeight - wireHeight - wireThickness - 15) {
      electron.vy *= -0.8;
    }
  }
  
  // Update holes
  for (let hole of holes) {
    // Add drift due to applied voltage
    if (appliedVoltage > 0) {
      // Forward bias - holes move toward junction
      hole.vx += (junctionX - hole.x) * 0.001 * appliedVoltage;
    } else {
      // Reverse bias - holes move away from junction
      hole.vx += (hole.originalX - hole.x) * 0.002;
    }
    
    // Add random thermal motion
    hole.vx += random(-0.5, 0.5);
    hole.vy += random(-0.5, 0.5);
    
    // Limit velocity
    hole.vx = constrain(hole.vx, -3, 3);
    hole.vy = constrain(hole.vy, -2, 2);
    
    // Update position
    hole.x += hole.vx;
    hole.y += hole.vy;
    
    // Boundary checking for P-region
    if (appliedVoltage <= 0) {
      // Reverse bias - keep in P-region
      hole.x = constrain(hole.x, margin + 5, junctionX - depletionWidth/2 - 5);
    } else {
      // Forward bias - allow crossing
      if (hole.x < margin + 5) hole.x = margin + 5;
      if (hole.x > containerWidth - margin - 5) hole.x = containerWidth - margin - 5;
    }
    
    hole.y = constrain(hole.y, wireHeight + wireThickness + 15, 
                      drawHeight - wireHeight - wireThickness - 15);
    
    // Bounce off boundaries
    if (hole.y <= wireHeight + wireThickness + 15 || 
        hole.y >= drawHeight - wireHeight - wireThickness - 15) {
      hole.vy *= -0.8;
    }
  }
}

function drawCarriers() {
  // Draw electrons (red circles with minus sign)
  fill('red');
  stroke('darkred');
  strokeWeight(1);
  for (let electron of electrons) {
    circle(electron.x, electron.y, 8);
    fill('white');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text('-', electron.x, electron.y);
    fill('red');
    stroke('darkred');
  }
  
  // Draw holes (blue circles with plus sign)
  fill('blue');
  stroke('darkblue');
  strokeWeight(1);
  for (let hole of holes) {
    circle(hole.x, hole.y, 8);
    fill('white');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text('+', hole.x, hole.y);
    fill('blue');
    stroke('darkblue');
  }
}

function drawTitle() {
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("P-N Junction Voltage Controller", containerWidth/2, margin);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  
  // Voltage label with current value
  text('Voltage: ' + appliedVoltage.toFixed(1) + 'V', 10, drawHeight + 15);
  
  // Bias condition indicator
  let biasText = '';
  if (appliedVoltage > 0.1) {
    biasText = ' (Forward Bias)';
  } else if (appliedVoltage < -0.1) {
    biasText = ' (Reverse Bias)';
  } else {
    biasText = ' (Zero Bias)';
  }
  
  textAlign(RIGHT, CENTER);
  text('Depletion Width: ' + depletionWidth.toFixed(0) + 'px' + biasText, 
       containerWidth - 10, drawHeight + 15);
}

function toggleSimulation() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
  appliedVoltage = 0;
  voltageSlider.value(0);
  depletionWidth = baseDepletionWidth;
  
  // Reset carrier positions
  for (let i = 0; i < electrons.length; i++) {
    electrons[i].x = electrons[i].originalX;
    electrons[i].y = electrons[i].originalY;
    electrons[i].vx = random(-1, 1);
    electrons[i].vy = random(-1, 1);
  }
  
  for (let i = 0; i < holes.length; i++) {
    holes[i].x = holes[i].originalX;
    holes[i].y = holes[i].originalY;
    holes[i].vx = random(-1, 1);
    holes[i].vy = random(-1, 1);
  }
  
  redraw();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  junctionX = containerWidth / 2;
  initializeCarriers();
  redraw();
  
  // Resize slider
  voltageSlider.size(containerWidth - sliderLeftMargin - 15);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}