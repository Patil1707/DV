// Enhanced treemap chart with top 25 EV models and interactivity
function renderTreemapChart(evData) {
  const container = d3.select("#treemap-chart");
  container.selectAll("*").remove();

  const modelCounts = d3.rollups(
    evData,
    v => v.length,
    d => d.make,
    d => d.model
  );

  const flattened = [];
  modelCounts.forEach(([make, models]) => {
    models.forEach(([model, count]) => {
      flattened.push({ make, model, count });
    });
  });

  const top25 = flattened
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);

  const root = {
    name: "EV Models",
    children: top25.map(d => ({
      name: `${d.make} > ${d.model}`,
      make: d.make,
      model: d.model,
      value: d.count
    }))
  };

  const width = 1000, height = 600;

  const svg = container.append("svg")
    .attr("width", width)
    .attr("height", height);

  const hierarchy = d3.hierarchy(root).sum(d => d.value);
  const treemap = d3.treemap().size([width, height]).padding(4);
  treemap(hierarchy);

  const color = d3.scaleOrdinal(d3.schemeSet3);

  const tooltip = container.append("div")
    .attr("class", "treemap-tooltip")
    .style("position", "absolute")
    .style("padding", "8px 12px")
    .style("background", "#1e1e1e")
    .style("color", "#fff")
    .style("border-radius", "6px")
    .style("font-size", "13px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  const leaf = svg.selectAll("g")
    .data(hierarchy.leaves())
    .enter().append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf.append("rect")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => color(d.data.make))
    .style("cursor", "pointer")
    .style("transition", "transform 0.2s, stroke 0.2s")
    .on("mouseover", function (event, d) {
      d3.select(this)
        .style("stroke", "#fff")
        .style("stroke-width", "2px")
        .transition().duration(200).attr("transform", "scale(1.03)");

      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip.html(`<strong>${d.data.name}</strong><br>EVs: ${d.value}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", function () {
      d3.select(this)
        .style("stroke", null)
        .transition().duration(200).attr("transform", "scale(1)");
      tooltip.transition().duration(200).style("opacity", 0);
    });

  leaf.append("text")
    .attr("x", 5)
    .attr("y", 18)
    .text(d => {
      const width = d.x1 - d.x0;
      return width > 80 ? d.data.model.slice(0, 20) : "";
    })
    .style("font-size", "12px")
    .style("fill", "#fff")
    .style("pointer-events", "none");
}
