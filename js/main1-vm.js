//-----RR---------
/*---Variables------*/
    // define api keys
    var apiKey = 'ef52d33ae515465c74fe383a71089f43';
    var apiSecret = '2ac7e97f4fff53f76ecd2f5f376e71a3';

    // create a Cache object
    var cache = new LastFMCache();

    // create a LastFM object
    var lastfm = new LastFM({
        apiKey    : apiKey,
        apiSecret : apiSecret,
        cache     : cache
    });


    //Global vars
    var TOPTRACKS = [];
    var TOPCHARTS =[];
    var METROS={};
    var MAPDATA=[];

    //deferred object: Indicates that all TOPTRACKS are processed
    var getDataDone = $.Deferred();
    //deferred object: Indicates that all Metros are processed
    var getMetroDataDone = $.Deferred();

//----RR-----

var latlngFile = 'json/metros_latlng.json';
var ajaxConnections = 1;
var citymap = {};
var cityCircle;
var geocoder;
var map;
var infowindow = new google.maps.InfoWindow();
var marker;

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
  //------RR---------
   getMetroData();

    //Deferred call to getData and getChartData
    $.when(getMetroDataDone).then(function(){
        console.log("Got Metro Data ");
        getData();
        getChartData()

    })

    $.when(getDataDone).then(function(){
        console.log("Tracks processing complete ");
        console.log("Integration Point - RenderData Fn here");
        //TODO - Invoke renderData here
    })
  //------RR---------

});

//-------VM----------

function initialize() {
  
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(37.7002, -122.406);
  var mapOptions = {
    zoom: 3,
    center: latlng
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // For each city make a new Circle. Can set color once the track data is available  
  for (var city in citymap) {
    var newCityCircle = {
        path: 'M 100 100 L 300 100 L 200 300 z',
        strokeColor:'Green',
        strokeWeight:6,
        scale:.01
    }

    var populationOptions = {
      icon: newCityCircle,
      map: map,
      position: new google.maps.LatLng(citymap[city]['center']['nb'],citymap[city]['center']['ob'] ),
    };

    marker = new google.maps.Marker(populationOptions); //{

    // On click
    google.maps.event.addListener(marker, 'click', function(event) {
        
         window.alert("this div");
         console.log("latlng");
         console.log(latlng);
         codeLatLng(latlng);
        

    });
  }

}

function codeLatLng(latlng) {
    console.log("codelatlng");
    console.log("latlng in code fn");
    console.log(latlng);
    var input = latlng;
    var lat = parseFloat(latlng.nb);
    var lng = parseFloat(latlng.ob);
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          map.setZoom(5);
          marker = new google.maps.Marker({
              position: latlng,
              map: map
          });
          MAPDATA.push(results[1].formatted_address.split(',')[0]);
          infowindow.setContent(results[1].formatted_address);
          infowindow.open(map, marker);
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

//------VM--------



//-----RR---------
/*----getMetroData-----*/
function getMetroData(){
      $.ajax({
        success:handleMetroDatavar
 })

}
var handleMetroDatavar=function getMetros(){
    lastfm.geo.getMetros
    ({
        api_key:apiKey
    },
    {
        success: function(data) {
            console.log("getmetros");
            $.extend(METROS, data );
            console.log(METROS);
            getMetroDataDone.resolve(); 
            
        },
        error: function(data) {
            console.log("getMetros: " + data.error + " " + data.message);
        }
    });

}

/*Assembles the Data for top tracks */
function getData(){
    $.ajax({
        success:handleDatavar
 })
}

var handleDatavar=function handleData() {
    var metro=METROS.metros.metro;
    $.each(metro, function(i, object) {
    getTopTracks(object.country);
    });
}

function getTopTracks(country){
    lastfm.geo.getTopTracks
    ({
        country:country
    },
    {
        success: function(data) {
            TOPTRACKS.push(data);
            console.log(TOPTRACKS); 
            if (TOPTRACKS.length==METROS.metros.metro.length){
                getDataDone.resolve(); 
            }
        },
        error: function(data) {
            console.log("getTopTracks: " + data.error + " " + data.message);
        }
    });
}

var renderTopTracksVar = function renderTopTracks(){
    console.log("Inside render tracks");
    console.log(TOPTRACKS);
    lastfm.geo.getTopTracks({
        country:country,
        limit: 1
    },
    {
        success: function() 
        {
            //console.log("top artists");
            $.each( TOPTRACKS, function( key, value ) 
            {

            console.log( TOPTRACKS );


            }
            );

           /*$('#top_tracks').html( $('#lastfmTemplateTracks').render(data.track[i]));
            // do something*/
        },
        error: function() 
        {
            console.log("getTopArtists: ");
        }
    });
}

/*Assembles the Data for top charts */
function getChartData(){
    console.log("inside metro track chart function");
    $.ajax({
        success:handleMetroTrackChartVar
 })
}

var handleMetroTrackChartVar=function handleMetroTrackChartData() {
    var metro=METROS.metros.metro;
    $.each(metro, function(i, object) {
    getMetroTrackCharts(object.country,object.name);
    });
}


function getMetroTrackCharts(country, city){
    lastfm.geo.getMetroTrackChart
    ({
        
        metro:city,
        country:country,
        api_key:apiKey
    },
    {
        success: function(data) {
            TOPCHARTS.push(data);
            console.log("top charts"); 
            console.log(TOPCHARTS);
            
        },
        error: function(data) {
            console.log("getTopCharts: " + data.error + " " + data.message);
        }
    });
}
//-----RR-----
