let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array
  // Give each feature a popup that describes the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
    <p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[0]} km</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers
  let street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object
  let baseMaps = {
    "Policital Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control
  // Pass it our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // // Create a legend
  let legend = L.control({ position: "bottomright" });

  // legend.onAdd = function() {
  //   let div = L.DomUtil.create("div", "legend");
  //   let depths = [0, 10, 30, 50, 70, 90];
  //   let colors = ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d", "#023858"];

  //   for (let i = 0; i < depths.length; i++) {
  //     div.innerHTML += `<div class="legend-item">
  //       <span class="legend-color" style="background-color: ${colors[i]}"></span>
  //       ${depths[i]} km ${depths[i + 1] ? "&ndash;" + depths[i + 1] + " km" : "+"}
  //     </div>`;
  //   }

  //   return div;
  // };

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    let depths = [0, 10, 30, 50, 70, 90];
    let colors = ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d", "#023858"];
  
    for (let i = 0; i < depths.length; i++) {
      let legendItem = document.createElement("div");
      legendItem.classList.add("legend-item");
  
      let legendColor = document.createElement("span");
      legendColor.classList.add("legend-color");
      legendColor.style.backgroundColor = colors[i];
      legendColor.style.display = "inline-block";
      legendColor.style.width = "20px";
      legendColor.style.height = "20px";
  
      let legendText = document.createElement("span");
      legendText.innerText = `${depths[i]} km ${depths[i + 1] ? "-" + depths[i + 1] + " km" : "+"}`;
  
      legendItem.appendChild(legendColor);
      legendItem.appendChild(legendText);
      div.appendChild(legendItem);
    }
  
    return div;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);
}

// Function to determine the color based on earthquake depth
function getColor(depth) {
  if (depth < 10) {
    return "#f1eef6";
  } else if (depth < 30) {
    return "#bdc9e1";
  } else if (depth < 50) {
    return "#74a9cf";
  } else if (depth < 70) {
    return "#2b8cbe";
  } else if (depth < 90) {
    return "#045a8d";
  } else {
    return "#023858";
  }
}
