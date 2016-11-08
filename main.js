// var HOST = "http://localhost:5000";
var HOST = "https://errorgeopy.herokuapp.com";

function httpGet(theUrl, callback) {
  document.getElementById('loader').style.display = "block";
  $('#warning-box').hide();
  $('#note-box').hide();
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.addEventListener("error", transferFailed);
  xmlHttp.open("GET", theUrl, true); // false for synchronous request
  xmlHttp.onreadystatechange = function (evt) {
    if (xmlHttp.readyState === 4) {
      document.getElementById('loader').style.display = "none";
      if (xmlHttp.status === 200) {
        return callback(JSON.parse(xmlHttp.responseText));
      } else {
        $('#warning-box').show();
        console.log('error', xmlHttp.statusText)
        return
      }
    }
  };
  xmlHttp.send(null);
}

function transferFailed(evt) {
  $('#warning-box').show();
  document.getElementById('loader').style.display = "none";
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    addr = document.getElementById("address").value;
    httpGet(HOST + "/forward/cluster?address=" + encodeURIComponent(addr), resultToMap)
    return false; // Return false to prevent the default form behavior
}

var map = L.map('map').setView([-40.9, 174.89], 5);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom: 21,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>, ' +
    'Geocoding with <a href="https://github.com/alpha-beta-soup/errorgeopy">Errorgeopy',
	id: 'mapbox.streets'
}).addTo(map);

var form = document.getElementById('geocode-form');
if (form.attachEvent) {
    form.attachEvent("submit", processForm);
} else {
    form.addEventListener("submit", processForm);
}

var resultToMap = function(geojson) {

  map.eachLayer(function (layer){
    if (layer.feature) {
      map.removeLayer(layer);
    }
  });

  if (geojson.features.length === 0) {
    console.log('note-box');
    $('#note-box').show();
    return
  }

  // console.log(geojson.features)
  var multipoints = geojson.features.filter(function(feat){return feat.properties.label == "multipoint";});
  var nfeatures = multipoints.map(function(feat){return feat.geometry.coordinates.length});
  var largestCluster = geojson.features[geojson.features.indexOf(multipoints[nfeatures.indexOf(Math.max(...nfeatures))])]

  var gj = L.geoJSON(geojson, {
    onEachFeature: function(feature, layer) {
      if (feature == largestCluster) {
        layer.bindPopup("Most geocoders reckon it's here");
      }
    },
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 4,
        fillColor: '#282C34',
        weight: 2,
        fillOpacity: 1,
        opacity: 1,
      })
    }
  })
  gj.setStyle({
    fillColor: 'red',
    dashArray: '1, 5',
    weight: 1,
    color: '#282C34'
  })
  gj.addTo(map);
  try {
    map.fitBounds(gj.getBounds());
  } catch (err) {
    console.log(err);
  }
}

$('#warning-box').hide();
$('#note-box').hide();
