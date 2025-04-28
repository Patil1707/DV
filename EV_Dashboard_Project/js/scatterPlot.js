// Enhanced scatter plot with tooltip and animation
function renderScatterPlot(data) {
    const filtered = data.filter(d => d.baseMsrp > 0 && d.electricRange > 0);
  
    const margin = { top: 40, right: 30, bottom: 60, left: 70 },
          width = 1000 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
  
    const svg = d3.select("#scatter-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleLinear()
      .domain([0, d3.max(filtered, d => d.baseMsrp)]).nice()
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(filtered, d => d.electricRange)]).nice()
      .range([height, 0]);
  
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d => `$${d / 1000}k`));
  
    svg.append("g")
      .call(d3.axisLeft(y).ticks(10));
  
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Base MSRP");
  
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Electric Range (mi)");
  
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
  
    svg.selectAll("circle")
      .data(filtered)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.baseMsrp))
      .attr("cy", d => y(d.electricRange))
      .attr("r", 0)
      .attr("fill", "#52AB80")
      .attr("opacity", 0.7)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.95);
        tooltip.html(
          `<strong>${d.make} ${d.model}</strong><br>Range: ${d.electricRange} mi<br>MSRP: $${d.baseMsrp}`
        )
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0))
      .transition()
      .duration(800)
      .attr("r", 5);
  }
  