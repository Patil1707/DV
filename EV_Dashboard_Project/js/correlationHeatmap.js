function renderCorrelationHeatmap(evData) {
  const cleaned = evData.filter(d =>
    d.modelYear && d.electricRange && d.baseMsrp
  );

  const matrixData = {
    'Model Year': cleaned.map(d => d.modelYear),
    'Electric Range': cleaned.map(d => d.electricRange),
    'Base MSRP': cleaned.map(d => d.baseMsrp)
  };

  const keys = Object.keys(matrixData);
  const matrix = keys.map(k1 =>
    keys.map(k2 => pearson(matrixData[k1], matrixData[k2]))
  );

  Plotly.newPlot('correlation-heatmap', [{
    z: matrix,
    x: keys,
    y: keys,
    type: 'heatmap',
    colorscale: 'YlGnBu',
    zmin: -1,
    zmax: 1
  }], {
    title: 'Correlation Matrix',
    margin: { t: 50 }
  });

  function pearson(x, y) {
    const n = x.length;
    const avgX = d3.mean(x);
    const avgY = d3.mean(y);
    const numerator = d3.sum(x.map((xi, i) => (xi - avgX) * (y[i] - avgY)));
    const denomX = Math.sqrt(d3.sum(x.map(xi => (xi - avgX) ** 2)));
    const denomY = Math.sqrt(d3.sum(y.map(yi => (yi - avgY) ** 2)));
    return numerator / (denomX * denomY);
  }
}
