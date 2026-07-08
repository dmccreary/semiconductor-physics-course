// Semiconductor Lattice Constant and Bandgap Map (Chart.js scatter)
// CANVAS_HEIGHT: 580

document.addEventListener('DOMContentLoaded', function () {
  const materials = {
    "Si":   { a: 5.431, eg: 1.12, type: "indirect", apps: "CMOS ICs, solar cells, MEMS" },
    "Ge":   { a: 5.658, eg: 0.66, type: "indirect", apps: "IR detectors, SiGe HBTs" },
    "GaAs": { a: 5.653, eg: 1.42, type: "direct",   apps: "laser diodes, RF amplifiers, solar cells" },
    "AlAs": { a: 5.661, eg: 2.16, type: "indirect", apps: "AlGaAs heterostructure barriers" },
    "InP":  { a: 5.869, eg: 1.35, type: "direct",   apps: "telecom lasers, photodetectors" },
    "InAs": { a: 6.058, eg: 0.36, type: "direct",   apps: "IR photodetectors, HEMTs" },
    "GaP":  { a: 5.451, eg: 2.26, type: "indirect", apps: "green LEDs, AlGaInP LED component" },
    "AlP":  { a: 5.467, eg: 2.45, type: "indirect", apps: "AlGaInP wide-gap alloy component" },
    "InSb": { a: 6.479, eg: 0.17, type: "direct",   apps: "long-wavelength IR detectors" },
    "GaSb": { a: 6.096, eg: 0.72, type: "direct",   apps: "mid-IR lasers, thermophotovoltaics" }
  };

  // Build scatter datasets by gap type
  const directPts = [];
  const indirectPts = [];
  for (const [name, m] of Object.entries(materials)) {
    const pt = { x: m.a, y: m.eg, label: name, meta: m };
    if (m.type === "direct") directPts.push(pt);
    else indirectPts.push(pt);
  }

  // Alloy interpolation lines
  // GaAs - AlAs: a varies linearly 5.653 -> 5.661, gap nonlinear (bowing param simplified)
  // InAs - GaAs: a varies 6.058 -> 5.653, gap 0.36 -> 1.42
  function alloyLine(matA, matB, name, color) {
    const a1 = materials[matA], a2 = materials[matB];
    const pts = [];
    for (let f = 0; f <= 1.0001; f += 0.05) {
      const a = a1.a + (a2.a - a1.a) * f;
      const eg = a1.eg + (a2.eg - a1.eg) * f;  // simple linear (Vegard-like)
      pts.push({ x: a, y: eg });
    }
    return {
      label: name,
      data: pts,
      type: 'line',
      borderColor: color,
      backgroundColor: color,
      borderWidth: 2,
      borderDash: [5, 4],
      pointRadius: 0,
      tension: 0.2,
      showLine: true,
      order: 5
    };
  }

  // Vertical reference plugin
  const verticalLinePlugin = {
    id: 'verticalLines',
    afterDraw(chart, args, opts) {
      const lines = opts.lines || [];
      const ctx = chart.ctx;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      ctx.save();
      for (const ln of lines) {
        if (!ln.show) continue;
        const x = xScale.getPixelForValue(ln.x);
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = ln.color;
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, yScale.top);
        ctx.lineTo(x, yScale.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = ln.color;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(ln.label, x + 4, yScale.top + 14);
      }
      ctx.restore();
    }
  };

  // Point label plugin
  const pointLabelPlugin = {
    id: 'pointLabels',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = '12px Arial';
      ctx.fillStyle = '#212529';
      const datasets = chart.data.datasets;
      datasets.forEach((ds, di) => {
        if (ds.type === 'line') return;
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((pt, i) => {
          const data = ds.data[i];
          if (data && data.label) {
            ctx.textAlign = 'left';
            ctx.fillText(data.label, pt.x + 8, pt.y + 4);
          }
        });
      });
      ctx.restore();
    }
  };

  const cfg = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Direct gap',
          data: directPts,
          backgroundColor: '#4caf50',
          borderColor: '#2e7d32',
          pointRadius: 7,
          pointHoverRadius: 10,
          order: 1
        },
        {
          label: 'Indirect gap',
          data: indirectPts,
          backgroundColor: '#f44336',
          borderColor: '#b71c1c',
          pointRadius: 7,
          pointHoverRadius: 10,
          order: 1
        },
        alloyLine('GaAs', 'AlAs', 'GaAs - AlAs alloy', '#757575'),
        alloyLine('InAs', 'GaAs', 'InAs - GaAs alloy', '#ff9800')
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          type: 'linear',
          min: 5.3,
          max: 6.6,
          title: { display: true, text: 'Lattice constant a (Å)' },
          grid: { color: '#e0e0e0' }
        },
        y: {
          min: 0,
          max: 2.7,
          title: { display: true, text: 'Bandgap Eg (eV)' },
          grid: { color: '#e0e0e0' }
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const d = ctx.raw;
              if (d.label) return d.label + ': a = ' + d.x.toFixed(3) + ' Å, Eg = ' + d.y.toFixed(2) + ' eV';
              return ctx.dataset.label + ': (' + ctx.parsed.x.toFixed(3) + ', ' + ctx.parsed.y.toFixed(2) + ')';
            }
          }
        },
        verticalLines: { lines: [] }
      },
      onClick: function (evt, items) {
        if (!items.length) return;
        const it = items[0];
        const ds = chart.data.datasets[it.datasetIndex];
        const d = ds.data[it.index];
        if (!d.meta) return;
        const m = d.meta;
        const info = document.getElementById('info');
        info.innerHTML =
          '<b>' + d.label + '</b> &mdash; lattice constant ' + m.a.toFixed(3) + ' Å, ' +
          'bandgap ' + m.eg.toFixed(2) + ' eV (' +
          '<span style="color:' + (m.type === 'direct' ? '#2e7d32' : '#b71c1c') + '">' +
          m.type + '</span>)<br/>' +
          '<b>Applications:</b> ' + m.apps;
      }
    },
    plugins: [verticalLinePlugin, pointLabelPlugin]
  };

  const chart = new Chart(document.getElementById('chart'), cfg);

  function updateLines() {
    const lines = [];
    if (document.getElementById('cb-si').checked) {
      lines.push({ x: 5.431, color: '#1976d2', label: 'Si', show: true });
    }
    if (document.getElementById('cb-inp').checked) {
      lines.push({ x: 5.869, color: '#7b1fa2', label: 'InP', show: true });
    }
    chart.options.plugins.verticalLines.lines = lines;
    chart.update();
  }

  document.getElementById('cb-si').addEventListener('change', updateLines);
  document.getElementById('cb-inp').addEventListener('change', updateLines);
  updateLines();
});
