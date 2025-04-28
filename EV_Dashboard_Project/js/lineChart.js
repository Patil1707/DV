// js/lineChart.js

function renderLineChart(data) {
  const yearlyCounts = d3.rollup(
    data,
    v => v.length,
    d => d.modelYear
  );

  const parsedData = Array.from(yearlyCounts, ([year, count]) => ({ year, count }))
    .sort((a, b) => d3.ascending(a.year, b.year));

  const margin = { top: 40, right: 30, bottom: 50, left: 60 },
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain(d3.extent(parsedData, d => d.year))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(parsedData, d => d.count)]).nice()
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .call(d3.axisLeft(y));

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.count));

  const path = svg.append("path")
    .datum(parsedData)
    .attr("fill", "none")
    .attr("stroke", "#2a5298")
    .attr("stroke-width", 2.5)
    .attr("d", line);

  const totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

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

  svg.selectAll(".dot")
    .data(parsedData)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.count))
    .attr("r", 4)
    .attr("fill", "#52AB80")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip.html(`<strong>Year:</strong> ${d.year}<br><strong>Count:</strong> ${d.count}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));
}
