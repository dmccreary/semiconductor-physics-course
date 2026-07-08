// Intrinsic Carrier Concentration vs Temperature
// CANVAS_HEIGHT: 540

document.addEventListener('DOMContentLoaded', function () {
  const KB_EV = 8.617e-5;

  const materials = {
    "Si":   { eg: 1.12, NC300: 2.8e19, NV300: 1.04e19, color: '#1976d2' },
    "Ge":   { eg: 0.66, NC300: 1.04e19, NV300: 6.0e18, color: '#388e3c' },
    "GaAs": { eg: 1.42, NC300: 4.7e17, NV300: 9.0e18, color: '#f57c00' },
    "GaN":  { eg: 3.40, NC300: 2.3e18, NV300: 4.6e19, color: '#c62828' }
  };

  function ni(T, mat) {
    const kT = KB_EV * T;
    const scale = Math.pow(T / 300, 1.5);
    const NC = mat.NC300 * scale;
    const NV = mat.NV300 * scale;
    return Math.sqrt(NC * NV) * Math.exp(-mat.eg / (2 * kT));
  }

  const Tmin = 200, Tmax = 700, dT = 10;
  const datasets = [];
  for (const [name, m] of Object.entries(materials)) {
    const pts = [];
    for (let T = Tmin; T <= Tmax; T += dT) {
      const v = ni(T, m);
      // chart.js log scale needs > 0
      const y = Math.max(v, 1e-30);
      pts.push({ x: T, y: y });
    }
    datasets.push({
      label: name,
      data: pts,
      borderColor: m.color,
      backgroundColor: m.color,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 2.5,
      tension: 0.1,
      meta: { eg: m.eg, name: name }
    });
  }

  // Draw a reference-line label on an opaque chip so dashed lines and
  // data curves cannot strike through the text.
  function drawRefLabel(ctx, txt, xPos, yPos, color) {
    ctx.font = '11px Arial';
    ctx.textBaseline = 'bottom';
    const w = ctx.measureText(txt).width;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(xPos - 2, yPos - 14, w + 4, 14);
    ctx.fillStyle = color;
    ctx.fillText(txt, xPos, yPos);
  }

  const refLinesPlugin = {
    id: 'refLines',
    afterDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1;

      // horizontal dashed line at 1e15
      const y15 = y.getPixelForValue(1e15);
      ctx.strokeStyle = '#9c27b0';
      ctx.beginPath();
      ctx.moveTo(x.left, y15);
      ctx.lineTo(x.right, y15);
      ctx.stroke();
      drawRefLabel(ctx, 'nᵢ = 10¹⁵ (typical light doping)', x.left + 6, y15 - 3, '#9c27b0');

      // horizontal dashed line at 1e10
      const y10 = y.getPixelForValue(1e10);
      ctx.strokeStyle = '#607d8b';
      ctx.beginPath();
      ctx.moveTo(x.left, y10);
      ctx.lineTo(x.right, y10);
      ctx.stroke();
      drawRefLabel(ctx, 'nᵢ = 10¹⁰ (Si at 300 K)', x.left + 6, y10 - 3, '#607d8b');

      // vertical dashed at T=300 K
      const x300 = x.getPixelForValue(300);
      ctx.strokeStyle = '#607d8b';
      ctx.beginPath();
      ctx.moveTo(x300, y.top);
      ctx.lineTo(x300, y.bottom);
      ctx.stroke();
      drawRefLabel(ctx, 'T = 300 K', x300 + 4, y.top + 24, '#607d8b');

      ctx.restore();
    }
  };

  const cfg = {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      parsing: false,
      scales: {
        x: {
          type: 'linear',
          min: Tmin, max: Tmax,
          title: { display: true, text: 'Temperature T (K)' }
        },
        y: {
          type: 'logarithmic',
          min: 1e-10, max: 1e20,
          title: { display: true, text: 'nᵢ (cm⁻³)' },
          ticks: {
            // label only even decades as 10ⁿ; hide Chart.js's
            // default "1.0000000000E20"-style labels
            callback: function (value) {
              const exp = Math.round(Math.log10(value));
              if (Math.abs(value - Math.pow(10, exp)) > value * 1e-6) return null;
              if (exp % 2 !== 0) return null;
              return '10' + toSuperscript(exp);
            }
          }
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const T = ctx.parsed.x;
              const v = ctx.parsed.y;
              const matName = ctx.dataset.label;
              const ndVal = parseFloat(document.getElementById('nd').value);
              const intrinsic = (v > ndVal / 10);
              return matName + ' @ ' + T + ' K: nᵢ = ' + formatSci(v) +
                ' cm⁻³ ' + (intrinsic ? '(intrinsic regime!)' : '(extrinsic)');
            }
          }
        }
      },
      onClick: function (evt, items) {
        if (!items.length) return;
        const it = items[0];
        const ds = chart.data.datasets[it.datasetIndex];
        const matName = ds.label;
        const ndVal = parseFloat(document.getElementById('nd').value);
        // find T where n_i = N_D / 10
        const m = materials[matName];
        let Tcrit = null;
        for (let T = Tmin; T <= 1500; T += 1) {
          if (ni(T, m) >= ndVal / 10) { Tcrit = T; break; }
        }
        const info = document.getElementById('info');
        info.innerHTML =
          '<b>' + matName + '</b> &mdash; E<sub>g</sub> = ' + m.eg.toFixed(2) + ' eV<br/>' +
          'Maximum safe operating T (for N<sub>D</sub> = ' + formatSci(ndVal) + ' cm⁻³): ' +
          (Tcrit ? '<b>~ ' + Tcrit + ' K</b>' : '> 1500 K (no intrinsic crossover in range)') +
          '<br/><small>Crossover defined as n<sub>i</sub> &ge; N<sub>D</sub> / 10.</small>';
      }
    },
    plugins: [refLinesPlugin]
  };

  function toSuperscript(n) {
    const sup = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return String(n).split('').map(c => sup[c] || c).join('');
  }

  function formatSci(x) {
    if (x < 1e-20) return '0';
    const exp = Math.floor(Math.log10(x));
    const m = x / Math.pow(10, exp);
    return m.toFixed(2) + '×10' + toSuperscript(exp);
  }

  const chart = new Chart(document.getElementById('chart'), cfg);

  document.getElementById('nd').addEventListener('change', function () {
    chart.update();
  });
});
