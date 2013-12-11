//-----RR---------
/*---Variables------*/
    // define api keys
    var apiKey = 'ef52d33ae515465c74fe383a71089f43';
    var apiSecret = '2ac7e97f4fff53f76ecd2f5f376e71a3';
      // create a Cache object
    //var cache = new LastFMCache();

    // create a LastFM object
    var lastfm = new LastFM({
        apiKey    : apiKey,
        apiSecret : apiSecret,
       // cache     : cache
    });


    //Global vars
    var TOPTRACKS = [];
    var TOPCHARTS =[];
    var METROS={};

    //use these for displaying legend
    var ALLTOPTRACKS = [];
    var obj={};
    var toptrackslegend=[];
    var colors=["#BF2EBD","#8460A6","#017DD0","#0600BD","#57EBFF","#6B008F","#FF1100","#FF8FC7","#0E0907","#AD9600","#6C3337","#FF7C0A","#D5BDFF","#936CA3","#CAFA19","#F5FF85","#9AA76C"];


    //deferred object: Indicates that all TOPTRACKS are processed
    var getDataDone = $.Deferred();
    //deferred object: Indicates that all Metros are processed
    var getMetroDataDone = $.Deferred();

//----RR-----


var latlngFile = 'json/metros_latlng.json';
var citymap = {};

$(document).ready(function() {
//display map by gettin all metros for last.fm from metros.json file which is a cached JSON file with information about metros that last.fm operates in  
  $.getJSON(latlngFile, function (datainner) {
   // console.log("Inside latlng json read");
    $.each(datainner.metros.metro,function(key,valueinner){
      //console.log("City "+valueinner.name+" Latitude "+valueinner.Latitude+" Longitude "+valueinner.Longitude);
      citymap[valueinner.name]={center:new google.maps.LatLng(valueinner.Latitude, valueinner.Longitude),population:100,Country: valueinner.Country};

    });
    initialize();
  }).fail(function() {
    console.log("FIRST fail");
  });

  

});



function initialize() {

  //display slider

  var totalMonths = 58;
  var firstMonth = new Date(2009, 0, 1);
    $("#slider").slider({
    min: 0,
    max: totalMonths - 1,
    step: 1,
    value: totalMonths - 1,
    slide: function(event, ui) {
      var selectedMonth = new Date(firstMonth.getTime());
      selectedMonth.setMonth(selectedMonth.getMonth() + ui.value);
      $('#sliderVal').text( selectedMonth.getFullYear() + '-' + zeroPad(selectedMonth.getMonth() + 1,2) );
      //clearSVG('instant');
      //getData();
    }
    });


    var selectedMonth = new Date(firstMonth.getTime());
    selectedMonth.setMonth(selectedMonth.getMonth() + (totalMonths-1));
    $('#sliderVal').text( selectedMonth.getFullYear() + '-' + zeroPad(selectedMonth.getMonth() + 1,2) );


  
  // Create the map.
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(37.09024, -95.712891),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
  mapOptions);

  //get top track for each metro: {cityname:track}
  
  getData();

  $.when(getDataDone).then(function(){
          console.log("Tracks processing complete ALLTOPTRACKS.length="+ALLTOPTRACKS.length);
          console.log("Integration Point - RenderData Fn here");
          //TODO - Invoke renderData here
            for(var i=0;i<ALLTOPTRACKS.length;i++)
            {
                toptrackslegend[i]=ALLTOPTRACKS[i]["toptrack"];
            }
          //sort the legend array
          toptrackslegend=toptrackslegend.sort();
          console.log("toptrackslegend = "+toptrackslegend);

          console.log("===============");
          //code for getting unique tracks for displaying the legend

            
              var hash = {}, result = [];
              for ( var i = 0, l = toptrackslegend.length; i < l; ++i ) {
            console.log(" !!!! ");
                if ( !hash.hasOwnProperty(toptrackslegend[i]) ) { //it works with objects! in FF, at least
                  console.log(" ** ");
                  hash[ toptrackslegend[i] ] = true;
                  result.push(toptrackslegend[i]);
                }
              }
            console.log(" RESULT ="+ result)

          //

          //pick random colors from array to display as legend
          var randcolor = result[Math.floor(Math.random() * result.length)];
          for(var index=0;index<result.length;index++)
          {
            $("#legendlist").append('<li class="legendItem"><span class="trackLegendColor" style="background:'+colors[index]+';"></span><p class="trackLegendName">'+result[index]+'</p></li>');
          
          }

      // Construct the circle for each value in citymap.
      // Note: We scale the population by a factor of 20.
        var metrocolor,trackindex;
          for (var city in citymap) {

            for (var iterate=0;iterate<ALLTOPTRACKS.length;iterate++)
            {
                if(ALLTOPTRACKS[iterate]["city"]==city)
                {
                  trackindex=result.indexOf(ALLTOPTRACKS[iterate]["toptrack"]);
                  metrocolor=colors[trackindex];
                  console.log("COLOR for metro"+city+" is"+metrocolor);
                }
                else{
                 // console.log("city = "+city+ " ALLTOPTRACKS[iterate][city] = "+ALLTOPTRACKS[iterate]["city"]);
                }
            }

             var newCityCircle = {
              path: 'M 100 100 L 300 100 L 200 300 z',
              strokeColor: metrocolor,
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
          google.maps.event.addListener(marker, 'click', function() {

          window.alert("this div");
          });

          }




      });

 



}


/* start of code for getting top track for each metro */
function getData(){ 
   console.log("citymap.length="+citymap.length);
    for (var city in citymap) {
      //console.log("getting top track for the country "+citymap[city].Country+" corresponding to the metro "+ city);
        
        getTopTracks(citymap[city].Country, city);
    }
    console.log("HELLO ALLTOPTRACKS.length=" +ALLTOPTRACKS.length);
}



function getTopTracks(country,city){
//dheera start
var url="http://ws.audioscrobbler.com/2.0/?method=geo.getTopTracks&api_key="+apiKey+"&country="+country+"&city="+city+"&format=json";
$.getJSON(url,function(data) {
  var index=0;
    $.each(data, function(key, value) {
     
     index=index+1;
        if(index==237)
        {
          console.log("reached 237");
        }
      else{
            //var jsonData = JSON.parse(JSON.stringify(data.toptracks.track));
            //console.log("city="+city+ " country="+country+" top track="+data.toptracks.track[0]["name"]);

            obj["city"]=city;
            obj["country"]=country;
            obj["toptrack"]=data.toptracks.track[0]["name"];
            
            ALLTOPTRACKS.push(obj);

            //datasetArray[k]=obj;
            obj = {};

            //ALLTOPTRACKS.push(data.toptracks.track[0]["name"]);
          }

    });
    if(ALLTOPTRACKS.length==237){
      console.log("array length "+ALLTOPTRACKS.length);
       getDataDone.resolve(); 

      }


  });
//dheera end



   

}
/* End of code for getting top tracks for each metro */



// lastfm api expects date and month to be two digits. this function zero pads
function zeroPad(num, width) {
  var n = Math.abs(num);
  var zeros = Math.max(0, width - Math.floor(n).toString().length );
  var zeroString = Math.pow(10,zeros).toString().substr(1);
  if( num < 0 ) {
    zeroString = '-' + zeroString;
  }

  return zeroString+n;
}

