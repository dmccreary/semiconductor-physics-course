// Crystal Defect Hierarchy Network (vis-network)
// CANVAS_HEIGHT: 560

document.addEventListener('DOMContentLoaded', function () {
  const cat = {
    "0D Point Defects": { color: '#90caf9', dim: '0D' },
    "1D Line Defects":  { color: '#ffb74d', dim: '1D' },
    "2D Planar Defects":{ color: '#a5d6a7', dim: '2D' },
    "3D Volume Defects":{ color: '#ef9a9a', dim: '3D' }
  };

  const defectDetails = {
    "Vacancy": {
      parent: "0D Point Defects",
      mechanism: "A missing atom at a lattice site, often created by thermal generation or Frenkel/Schottky pair formation.",
      degrades: "Carrier lifetime (recombination center); diffusion rate; resistivity.",
      example: "Silicon vacancy V_Si — basis of the divacancy defect that limits minority-carrier lifetime in radiation-damaged Si."
    },
    "Self-Interstitial": {
      parent: "0D Point Defects",
      mechanism: "A host atom occupying an interstitial (non-lattice) site, typically displaced by irradiation or ion implantation.",
      degrades: "Carrier lifetime; mobility (via lattice strain).",
      example: "Si_I interstitial — drives transient enhanced diffusion (TED) of boron after implant."
    },
    "Substitutional Impurity": {
      parent: "0D Point Defects",
      mechanism: "A foreign atom replaces a host atom on the lattice. Donors and acceptors are intentional examples; deep traps are unintentional.",
      degrades: "Depends on dopant: shallow donors/acceptors give carriers; deep impurities (Au, Fe) cut lifetime.",
      example: "Phosphorus in Si — donates one electron per atom, basis of n-type doping."
    },
    "Frenkel Pair": {
      parent: "0D Point Defects",
      mechanism: "A vacancy plus a nearby self-interstitial, formed when an atom is displaced from its site but stays close. Common in irradiated materials.",
      degrades: "Carrier lifetime; mobility; introduces deep levels.",
      example: "Frenkel pairs in GaN power devices after neutron irradiation."
    },
    "Schottky Defect": {
      parent: "0D Point Defects",
      mechanism: "A pair of vacancies (cation + anion) in an ionic crystal, formed to preserve charge neutrality.",
      degrades: "Ionic conductivity; dielectric properties.",
      example: "NaCl Schottky defects (more relevant for ionic crystals than for Si)."
    },
    "Edge Dislocation": {
      parent: "1D Line Defects",
      mechanism: "An extra half-plane of atoms inserted into the lattice — the dislocation line is the edge of that half-plane. Burgers vector ⊥ line.",
      degrades: "Mobility (scattering); minority-carrier lifetime (recombination); leakage current.",
      example: "Misfit dislocations at SiGe/Si heterojunction interfaces above critical thickness."
    },
    "Screw Dislocation": {
      parent: "1D Line Defects",
      mechanism: "A spiral ramp around the dislocation line. Burgers vector ∥ line. Often nucleates during crystal growth.",
      degrades: "Leakage current; lifetime; provides easy diffusion paths (pipe diffusion).",
      example: "Threading screw dislocations in GaN epi-layers grown on sapphire."
    },
    "Stacking Fault": {
      parent: "2D Planar Defects",
      mechanism: "A region where the FCC stacking sequence (ABCABC) is broken locally (e.g., ABCBCABC).",
      degrades: "Carrier lifetime; introduces deep levels at the fault plane.",
      example: "Stacking faults in 4H-SiC power devices — a major bipolar-degradation mechanism."
    },
    "Grain Boundary": {
      parent: "2D Planar Defects",
      mechanism: "Interface between two crystallites with different orientations. High density of dangling bonds and impurity segregation.",
      degrades: "Mobility (scattering); lifetime; turns single-crystal-quality devices into polycrystalline behavior.",
      example: "Grain boundaries in polysilicon TFT channels — limit on-current in display backplanes."
    },
    "Surface State": {
      parent: "2D Planar Defects",
      mechanism: "Dangling bonds at the free surface of a crystal pin the Fermi level and trap carriers.",
      degrades: "Surface recombination velocity; threshold voltage stability; flat-band voltage.",
      example: "Si dangling bonds at SiO₂/Si interface — controlled by hydrogen passivation (Pb centers)."
    },
    "Interface State": {
      parent: "2D Planar Defects",
      mechanism: "Trap states at the boundary between two different materials (e.g., oxide/semiconductor).",
      degrades: "V_T shift; subthreshold swing; mobility (Coulomb scattering).",
      example: "D_it at SiC/SiO₂ interface — ~10× higher than Si/SiO₂, limits SiC MOSFET inversion mobility."
    },
    "Precipitate": {
      parent: "3D Volume Defects",
      mechanism: "A small cluster of a second phase that has nucleated inside the crystal (e.g., oxygen-rich SiOx clusters in Si).",
      degrades: "Lifetime; mechanical strain; leakage paths.",
      example: "Oxygen precipitates in Czochralski Si — intentionally engineered for internal gettering."
    },
    "Void": {
      parent: "3D Volume Defects",
      mechanism: "A 3D empty region (cluster of vacancies) inside the crystal. May form during crystal growth or irradiation.",
      degrades: "Mechanical strength; lifetime; can short out vertical-device current paths.",
      example: "Grown-in voids in Si CZ wafers (COPs — crystal-originated particles)."
    }
  };

  const nodes = [];
  const edges = [];

  // Root
  nodes.push({
    id: 'root',
    label: 'Crystal\nDefects',
    level: 0,
    shape: 'box',
    color: { background: '#cfd8dc', border: '#455a64' },
    font: { size: 15, multi: true, bold: true },
    margin: 10
  });

  // Level 1 — categories
  for (const [name, info] of Object.entries(cat)) {
    const id = 'cat-' + info.dim;
    nodes.push({
      id: id,
      label: name.replace(' Defects', '\nDefects'),
      level: 1,
      shape: 'box',
      color: { background: info.color, border: '#333' },
      font: { size: 13, bold: true, multi: true },
      margin: 8
    });
    edges.push({ from: 'root', to: id });
  }

  // Level 2 — specific defects
  for (const [name, det] of Object.entries(defectDetails)) {
    const parentInfo = cat[det.parent];
    nodes.push({
      id: name,
      label: name,
      level: 2,
      shape: 'box',
      color: { background: lighten(parentInfo.color), border: '#444' },
      font: { size: 12 },
      margin: 6
    });
    edges.push({ from: 'cat-' + parentInfo.dim, to: name });
  }

  const container = document.getElementById('netbox');
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'LR',
        sortMethod: 'directed',
        levelSeparation: 150,
        nodeSpacing: 34,
        treeSpacing: 34
      }
    },
    physics: { enabled: false },
    interaction: {
      hover: true,
      zoomView: true,
      dragView: true,
      tooltipDelay: 150
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 0.6 } },
      color: { color: '#90a4ae' },
      smooth: { type: 'cubicBezier', forceDirection: 'horizontal', roundness: 0.4 },
      font: { size: 10, color: '#607d8b', strokeWidth: 0 }
    }
  };
  const network = new vis.Network(container, data, options);

  network.on('click', function (params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    const det = defectDetails[id];
    const info = document.getElementById('info');
    if (det) {
      const dimColor = cat[det.parent].color;
      info.innerHTML =
        '<h3>' + id + '</h3>' +
        '<p><span class="dim" style="background:' + dimColor + '; color:#222">' + cat[det.parent].dim + ' &mdash; ' + det.parent + '</span></p>' +
        '<p><b>Mechanism:</b> ' + det.mechanism + '</p>' +
        '<p><b>Degraded device parameters:</b> ' + det.degrades + '</p>' +
        '<p><b>Example:</b> ' + det.example + '</p>';
    } else if (id === 'root') {
      info.innerHTML = '<h3>Crystal Defects</h3><p>Defects are classified by dimensionality (0D, 1D, 2D, 3D). Click a leaf node to see how each type forms and which device parameters it degrades.</p>';
    } else {
      // category
      const dim = id.replace('cat-', '');
      info.innerHTML = '<h3>' + dim + ' category</h3><p>Click one of the child defect nodes for a detailed description.</p>';
    }
  });

  function lighten(hex) {
    // simple lightening for level-2 nodes
    const c = hex.replace('#','');
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    const lr = Math.round(r + (255 - r) * 0.55);
    const lg = Math.round(g + (255 - g) * 0.55);
    const lb = Math.round(b + (255 - b) * 0.55);
    return '#' + lr.toString(16).padStart(2,'0') + lg.toString(16).padStart(2,'0') + lb.toString(16).padStart(2,'0');
  }
});
