// Updated pie chart with legends, percent labels, animation, and tooltips
function renderPieChart(data) {
    const typeCounts = d3.rollup(
      data,
      v => v.length,
      d => d.vehicleType
    );
  
    const pieData = Array.from(typeCounts, ([type, count]) => ({ type, count }));
    const total = d3.sum(pieData, d => d.count);
  
    const width = 800,
          height = 500,
          margin = 50,
          radius = Math.min(width, height) / 2 - margin;
  
    const svg = d3.select("#pie-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2 - 100}, ${height / 2})`);
  
    const color = d3.scaleOrdinal()
      .domain(pieData.map(d => d.type))
      .range(["#2a5298", "#52AB80", "#e8aa63", "#6f42c1"]);
  
    const pie = d3.pie()
      .sort(null)
      .value(d => d.count);
  
    const arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);
  
    const arcs = pie(pieData);
  
    // Tooltip div
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
  
    svg.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('fill', d => color(d.data.type))
      .attr('stroke', '#fff')
      .style('stroke-width', '2px')
      .style('opacity', 0.9)
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });
  
    svg.selectAll('path')
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1);
        tooltip.transition().duration(200).style("opacity", 0.95);
        tooltip.html(
          `<strong>${d.data.type}</strong><br>Count: ${d.data.count}<br>Percent: ${((d.data.count / total) * 100).toFixed(1)}%`
        )
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.9);
        tooltip.transition().duration(300).style("opacity", 0);
      });
  
    svg.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .text(d => `${((d.data.count / total) * 100).toFixed(1)}%`)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#fff");
  
    const legend = d3.select("#pie-chart svg")
      .append("g")
      .attr("transform", `translate(${width - 180}, ${height / 2 - pieData.length * 15})`);
  
    pieData.forEach((d, i) => {
      const yOffset = i * 25;
      legend.append("rect")
        .attr("x", 0)
        .attr("y", yOffset)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", color(d.type));
  
      legend.append("text")
        .attr("x", 24)
        .attr("y", yOffset + 12)
        .text(`${d.type} (${d.count})`)
        .attr("fill", "#333")
        .style("font-size", "13px");
    });
  }
  