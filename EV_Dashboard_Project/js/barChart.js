// Updated bar chart with tooltips, animation, and persistent hover color
function renderBarChart(data) {
  const makeCounts = d3.rollup(data, v => v.length, d => d.make);
  const topMakes = Array.from(makeCounts, ([make, count]) => ({ make, count }))
    .sort((a, b) => d3.descending(a.count, b.count))
    .slice(0, 10);

  const margin = { top: 30, right: 30, bottom: 50, left: 100 },
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("class", "chart-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
    .domain(topMakes.map(d => d.make))
    .range([0, height])
    .padding(0.2);

  const x = d3.scaleLinear()
    .domain([0, d3.max(topMakes, d => d.count)])
    .range([0, width]);

  svg.append("g").call(d3.axisLeft(y));
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "8px")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px")
    .style("box-shadow", "0 2px 6px rgba(0,0,0,0.1)")
    .style("pointer-events", "none")
    .style("opacity", 0);

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  svg.selectAll("rect")
    .data(topMakes)
    .enter().append("rect")
    .attr("y", d => y(d.make))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", 0)
    .attr("fill", (d, i) => colorScale(d.make))
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", d3.color(colorScale(d.make)).darker(1));
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip.html(`<strong>${d.make}</strong><br>EVs: ${d.count}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function(event, d) {
      d3.select(this).attr("fill", colorScale(d.make));
      tooltip.transition().duration(300).style("opacity", 0);
    })
    .transition()
    .duration(1000)
    .attr("width", d => x(d.count));

  svg.selectAll(".label")
    .data(topMakes)
    .enter().append("text")
    .attr("x", d => x(d.count) + 5)
    .attr("y", d => y(d.make) + y.bandwidth() / 2 + 5)
    .text(d => d.count)
    .attr("fill", "#444")
    .style("font-size", "12px");
}