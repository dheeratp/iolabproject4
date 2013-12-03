var latlngFile = 'json/metros_latlng.json';
var ajaxConnections = 1;
var citymap = {};
var cityCircle;

$(document).ready(function() {
  $.getJSON(latlngFile, function (datainner) {
    console.log("Inside latlng json read");
    $.each(datainner.metros.metro,function(key,valueinner){
      console.log("City "+valueinner.name+" Latitude "+valueinner.Latitude+" Longitude "+valueinner.Longitude);
      citymap[valueinner.name]={center:new google.maps.LatLng(valueinner.Latitude, valueinner.Longitude),population:100};
    });
    initialize();
  }).fail(function() {
    console.log("FIRST fail");
  });
});

function initialize() {
  
  // Create the map.
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(37.09024, -95.712891),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
  mapOptions);
  // Construct the circle for each value in citymap.
  // Note: We scale the population by a factor of 20.
  for (var city in citymap) {
    var populationOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: citymap[city].center,
      radius: citymap[city].population*5000 / 20
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Circle(populationOptions);
  }

}

