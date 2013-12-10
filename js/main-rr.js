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
    

});

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
        console.log()
    getTopTracks(object.country, object.name);
    });
}

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
            /*if (TOPTRACKS.length==METROS.metros.metro.length){
                getDataDone.resolve(); 
            }*/
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