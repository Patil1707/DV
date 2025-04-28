// main.js – Entry point for EV Dashboard with metrics

(async function initializeDashboard() {
    try {
      const data = await d3.csv("data/ev_population_data.csv", d => ({
        county: d.County,
        city: d.City,
        state: d.State,
        postalCode: +d["Postal Code"],
        modelYear: +d["Model Year"],
        make: d.Make,
        model: d.Model,
        vehicleType: d["Electric Vehicle Type"],
        cafvEligibility: d["Clean Alternative Fuel Vehicle (CAFV) Eligibility"],
        electricRange: +d["Electric Range"],
        baseMsrp: +d["Base MSRP"],
        district: +d["Legislative District"],
        location: d["Vehicle Location"],
        utility: d["Electric Utility"],
        censusTract: d["2020 Census Tract"]
      }));
  
      // Render charts
      renderLineChart(data);
      renderBarChart(data);
      renderMapChart(data);
      renderPieChart(data);
      renderScatterPlot(data);
      renderChargingSupportChart(data);
      renderCorrelationHeatmap(data);
      renderTreemapChart(data);
  
      // Calculate & update summary metrics
      const totalEVs = data.length;
      const avgRange = Math.round(
        d3.mean(data.filter(d => d.electricRange > 0), d => d.electricRange)
      );
  
      document.getElementById("totalEVs").textContent = totalEVs.toLocaleString();
      document.getElementById("avgRange").textContent = avgRange;
  
    } catch (error) {
      console.error("Failed to load or parse EV data:", error);
    }
  })();
  
  
  