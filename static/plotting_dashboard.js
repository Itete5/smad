/**
 * Plotting Dashboard (Plotly)
 * Energy vs generation, bond length distribution, RDF, XRD, coordination stats.
 * Updates dynamically during optimization.
 */
(function (global) {
  'use strict';

  const Plotly = global.Plotly;
  if (!Plotly) throw new Error('Plotly required');

  const layout = {
    paper_bgcolor: 'rgba(10,12,20,0.95)',
    plot_bgcolor: 'rgba(16,19,31,0.95)',
    font: { color: '#c0c8e0', family: 'system-ui', size: 11 },
    margin: { t: 28, r: 24, b: 32, l: 48 },
    xaxis: { gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.12)' },
    yaxis: { gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.12)' },
    showlegend: true,
    legend: { bgcolor: 'rgba(0,0,0,0.2)', font: { color: '#a0b0d0' } }
  };

  function plotEnergyVsGeneration(containerId, history) {
    if (!history || !history.length) return;
    const x = history.map(h => h.generation);
    const y = history.map(h => h.bestEnergy);
    Plotly.react(containerId, [{
      x, y, type: 'scatter', mode: 'lines+markers',
      line: { color: '#5a8cff', width: 2 },
      marker: { size: 6, color: '#5a8cff' },
      name: 'Best energy'
    }], { ...layout, title: 'Energy vs generation', xaxis: { ...layout.xaxis, title: 'Generation' }, yaxis: { ...layout.yaxis, title: 'Energy' } }, { responsive: true });
  }

  function plotBondLengthDistribution(containerId, bonds) {
    if (!bonds || !bonds.length) {
      Plotly.purge(containerId);
      return;
    }
    const lengths = bonds.map(b => b.len);
    const hist = {};
    lengths.forEach(l => {
      const b = Math.round(l * 20) / 20;
      hist[b] = (hist[b] || 0) + 1;
    });
    const x = Object.keys(hist).map(Number).sort((a, b) => a - b);
    const y = x.map(b => hist[b]);
    Plotly.react(containerId, [{
      x, y, type: 'bar',
      marker: { color: '#40aa88' },
      name: 'Bond length (Å)'
    }], { ...layout, title: 'Bond length distribution', xaxis: { ...layout.xaxis, title: 'Length (Å)' }, yaxis: { ...layout.yaxis, title: 'Count' } }, { responsive: true });
  }

  function plotRDF(containerId, r, g) {
    if (!r || !r.length) {
      Plotly.purge(containerId);
      return;
    }
    Plotly.react(containerId, [{
      x: r, y: g, type: 'scatter', mode: 'lines',
      line: { color: '#cc8844', width: 2 },
      name: 'g(r)'
    }], { ...layout, title: 'Radial distribution function', xaxis: { ...layout.xaxis, title: 'r (Å)' }, yaxis: { ...layout.yaxis, title: 'g(r)' } }, { responsive: true });
  }

  function plotXRD(containerId, peaks) {
    if (!peaks || !peaks.length) {
      Plotly.purge(containerId);
      return;
    }
    const twoTheta = peaks.map(p => p.twoTheta);
    const intensity = peaks.map(p => p.intensity);
    const maxI = Math.max(...intensity);
    Plotly.react(containerId, [{
      x: twoTheta, y: intensity.map(i => i / maxI),
      type: 'scatter', mode: 'lines',
      line: { color: '#aa66cc', width: 1.5 },
      name: 'Intensity'
    }], { ...layout, title: 'Simulated XRD', xaxis: { ...layout.xaxis, title: '2θ (deg)' }, yaxis: { ...layout.yaxis, title: 'Intensity', range: [0, 1.05] } }, { responsive: true });
  }

  function plotCoordinationStats(containerId, cnList) {
    if (!cnList || !cnList.length) {
      Plotly.purge(containerId);
      return;
    }
    const hist = {};
    cnList.forEach(c => { hist[c] = (hist[c] || 0) + 1; });
    const x = Object.keys(hist).map(Number).sort((a, b) => a - b);
    const y = x.map(c => hist[c]);
    Plotly.react(containerId, [{
      x, y, type: 'bar',
      marker: { color: '#6688cc' },
      name: 'Coordination number'
    }], { ...layout, title: 'Coordination statistics', xaxis: { ...layout.xaxis, title: 'CN' }, yaxis: { ...layout.yaxis, title: 'Count' } }, { responsive: true });
  }

  function createDashboard(containerElement) {
    const ids = {
      energy: 'plot-energy',
      bonds: 'plot-bonds',
      rdf: 'plot-rdf',
      xrd: 'plot-xrd',
      cn: 'plot-cn'
    };
    const html = `
      <div class="plot-row"><div id="${ids.energy}" class="plot-cell"></div><div id="${ids.bonds}" class="plot-cell"></div></div>
      <div class="plot-row"><div id="${ids.rdf}" class="plot-cell"></div><div id="${ids.xrd}" class="plot-cell"></div></div>
      <div class="plot-row"><div id="${ids.cn}" class="plot-cell"></div></div>
    `;
    containerElement.innerHTML = html;
    return {
      updateEnergy(history) { plotEnergyVsGeneration(ids.energy, history); },
      updateBondDistribution(bonds) { plotBondLengthDistribution(ids.bonds, bonds); },
      updateRDF(r, g) { plotRDF(ids.rdf, r, g); },
      updateXRD(peaks) { plotXRD(ids.xrd, peaks); },
      updateCoordination(cnList) { plotCoordinationStats(ids.cn, cnList); },
      ids
    };
  }

  const PlottingDashboard = {
    plotEnergyVsGeneration,
    plotBondLengthDistribution,
    plotRDF,
    plotXRD,
    plotCoordinationStats,
    createDashboard,
    layout
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PlottingDashboard;
  else global.PlottingDashboard = PlottingDashboard;
})(typeof self !== 'undefined' ? self : this);
