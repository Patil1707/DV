// mapChart.js – EV Distribution Map with Leaflet

function renderMapChart(data) {
    const mapDiv = document.getElementById("map-chart");
    mapDiv.innerHTML = ""; // Clear previous map if rerendered
  
    const map = L.map("map-chart").setView([47.5, -120.5], 7); // Center on WA
  
    // Tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Parse valid location points from 'POINT (lon lat)'
    const points = data
      .map(d => {
        const match = d.location.match(/POINT \((-?\d+\.\d+) (-?\d+\.\d+)\)/);
        if (match) {
          return {
            lat: parseFloat(match[2]),
            lng: parseFloat(match[1]),
            make: d.make,
            model: d.model,
            year: d.modelYear,
            type: d.vehicleType
          };
        }
        return null;
      })
      .filter(Boolean);
  
    // Limit to first 500 for performance (can be paginated or clustered)
    points.slice(0, 500).forEach(d => {
      const marker = L.circleMarker([d.lat, d.lng], {
        radius: 6,
        fillColor: "#2a5298",
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
  
      marker.bindPopup(
        `<strong>${d.make} ${d.model}</strong><br>Year: ${d.year}<br>Type: ${d.type}`
      );
    });
  }
  