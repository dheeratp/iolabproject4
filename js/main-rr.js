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

    //use these for displaying legend
    var ALLTOPTRACKS = [];
    var obj={};
    var objtoptracks={};
    var toptrackslegend=[];
    var colors=["#eb7f30","#76cc31","#2cb2f1","#f6e742","#E03A37","#E75CB1","#BF2EBD","#6B3F95","#498ebc","#0600BD","#9CD8E0","#6B008F","#863f3a","#FF8FC7","#0E0907","#6C3337","#FF7C0A","#D5BDFF","#936CA3","#CAFA19","#F5FF85"];
    var latlngFile = 'json/metros_latlng.json';
    var citymap = {};

    //deferred object: Indicates that all TOPTRACKS are processed
    var getDataDone = $.Deferred();
    //deferred object: Indicates that all Metros are processed
    var getMetroDataDone = $.Deferred();




/*---Page Load------*/
$(window).load(function () {
    $('#ytapiplayer').show();
    console.log("doc load");
    //TODO - Need to pass the artist and track on the click event in modal
    loadPlayer("Lorde", "Royals");

    //start: added by dheera

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

    //end: added by dheera

    getMetroData();

    //Deferred call to getData and getChartData
    $.when(getMetroDataDone).then(function(){
        console.log("Got Metro Data ");
        //getData();
        getChartData()

    })

    $.when(getDataDone).then(function(){
        console.log("Tracks processing complete ");
        console.log("Integration Point - RenderData Fn here");
        //TODO - Invoke renderData here
    })
    

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

      
          //code for getting unique tracks for displaying the legend

            
              var hash = {}, result = [];
              for ( var i = 0, l = toptrackslegend.length; i < l; ++i ) {
          
                if ( !hash.hasOwnProperty(toptrackslegend[i]) ) { //it works with objects! in FF, at least
              
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
            //console.log("getmetros");
            $.extend(METROS, data );
            //console.log(METROS);
            getMetroDataDone.resolve(); 
            
        },
        error: function(data) {
            console.log("getMetros: " + data.error + " " + data.message);
        }
    });

}

/*Assembles the Data for top tracks */
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
console.log(url);
$.getJSON(url,function(data) {
  var index=0;
    $.each(data, function(key, value) {
     
    
        if(index==237)
        {
          console.log("reached 237");
        }
      else{
            //var jsonData = JSON.parse(JSON.stringify(data.toptracks.track));
            //console.log("city="+city+ " country="+country+" top track="+data.toptracks.track[0]["name"]);
            
            objtoptracks["city"]=city;
            objtoptracks["data"]=data;
            //TOPTRACKS[index].toptracks['@attr']['metro'] =city;
           TOPTRACKS.push(objtoptracks);

            obj["city"]=city;
            obj["country"]=country;
            obj["toptrack"]=data.toptracks.track[0]["name"];
            

            
            ALLTOPTRACKS.push(obj);

            obj = {};
            objtoptracks = {};
          }

    });
    if(ALLTOPTRACKS.length==237&&TOPTRACKS.length==237){
        console.log("array length "+ALLTOPTRACKS.length);
       getDataDone.resolve(); 

      }


  });
//dheera end

}
/* End of code for getting top tracks for each metro */

/*
function getTopTracks(country, metro){
    lastfm.geo.getTopTracks
    ({
        country:country,
        location:metro
    },
    {
        success: function(data) {
            TOPTRACKS.push(data);
            console.log(TOPTRACKS); 

          //start: added by dheera
            obj["city"]=metro;
            obj["country"]=country;
            obj["toptrack"]=data.toptracks.track[0]["name"];
            
            ALLTOPTRACKS.push(obj);

            obj = {};

        if(ALLTOPTRACKS.length==237){
          console.log("array length "+ALLTOPTRACKS.length);
           getDataDone.resolve(); 

          }

        //end: added by dheera

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

           //$('#top_tracks').html( $('#lastfmTemplateTracks').render(data.track[i]));
            // do something
        },
        error: function() 
        {
            console.log("getTopArtists: ");
        }
    });
}
*/

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
            //console.log("top charts"); 
            //console.log(TOPCHARTS);
            
        },
        error: function(data) {
            console.log("getTopCharts: " + data.error + " " + data.message);
        }
    });
}


function loadPlayer(artist, track) {
    var options = {
      orderby: "relevance",
      q: artist + " " + track,
      "start-index": 1,
      "max-results": 1,
      v: 2,
      alt: "json"
    };


    $.ajax({
      url: 'http://gdata.youtube.com/feeds/api/videos',
      method: 'get',
      data: options,
      dataType: 'json',
      success: function(data) {

        var player = document.getElementById('myytplayer');
        var id = data.feed.entry[0].id["$t"];
        var mId = id.split(':')[3];
        // console.log(mId)

        if (!player) {
            var params = { allowScriptAccess: "always" };
            var atts = { id: "myytplayer" };
            swfobject.embedSWF("http://www.youtube.com/v/" + mId + "?enablejsapi=1&playerapiid=ytplayer&version=3&autoplay=1&autohide=0",
                           "ytapiplayer", "300", "200", "8", null, null, params, atts);
            // if we decide to show the video the height, which is currently "40," can be increased like "200"
        } else {
         
          player.loadVideoById(mId, 0, "large");
        }


    
        $('#ytapiplayer').show();


      },
      error : function() {
        console.log("error");
      }
      });
}