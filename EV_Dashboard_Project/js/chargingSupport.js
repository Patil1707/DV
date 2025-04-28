function renderChargingSupportChart(evData) {
  const container = d3.select("#charging-support-chart");
  container.selectAll("*").remove();

  // Preprocess utility names
  evData.forEach(d => {
    if (d.utility) {
      d.utility = d.utility
        .replace(/BONNEVILLE POWER ADMINISTRATION\|/gi, '')
        .replace(/\|/g, ' + ')
        .trim();
    }
  });

  // Define range buckets
  const getRange = (r) => {
    const val = +r;
    if (val <= 100) return "0–100";
    if (val <= 200) return "101–200";
    if (val <= 300) return "201–300";
    if (val <= 400) return "301–400";
    return "400+";
  };

  // Group EV counts by utility and range
  const utilityRangeCounts = d3.rollup(
    evData,
    v => v.length,
    d => d.utility,
    d => getRange(d.electricRange)
  );

  // Select top 10 utilities by total EV count
  const topUtilities = Array.from(utilityRangeCounts.entries())
    .map(([utility, rangeMap]) => ({
      utility,
      total: d3.sum(Array.from(rangeMap.values()))
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(d => d.utility);

  const rangeBuckets = ["0–100", "101–200", "201–300", "301–400", "400+"];

  // Prepare data in flat format for grouped bar chart
  const chartData = [];
  topUtilities.forEach(util => {
    const rangeMap = utilityRangeCounts.get(util);
    rangeBuckets.forEach(range => {
      chartData.push({
        utility: util,
        range: range,
        count: rangeMap?.get(range) || 0
      });
    });
  });

  // Set dimensions
  const margin = { top: 50, right: 20, bottom: 120, left: 80 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  const svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("font-family", "Segoe UI, sans-serif")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x0 = d3.scaleBand()
    .domain(topUtilities)
    .range([0, width])
    .paddingInner(0.2);

  const x1 = d3.scaleBand()
    .domain(rangeBuckets)
    .range([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.count)])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(rangeBuckets)
    .range(d3.schemeSet2);

  // Axes
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .style("text-anchor", "end");

  // Bars
  svg.selectAll("g.bar-group")
    .data(chartData)
    .join("g")
    .attr("transform", d => `translate(${x0(d.utility)}, 0)`)
    .append("rect")
    .attr("x", d => x1(d.range))
    .attr("y", d => y(d.count))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y(d.count))
    .attr("fill", d => color(d.range))
    .append("title")
    .text(d => `${d.utility} (${d.range}): ${d.count}`);

  // Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 120}, 0)`);

  rangeBuckets.forEach((range, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    row.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(range));
    row.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(range)
      .style("font-size", "12px");
  });
}
