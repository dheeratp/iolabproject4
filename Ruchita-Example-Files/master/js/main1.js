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

var country = 'united states';
var country_names=["UNITED STATES", "UNITED KINGDOM", "INDIA", "BRAZIL", "AUSTRALIA"];
var TOPTRACKS = [];
//deferred object: Indicates that all TOPTRACKS are processed
var getDataDone = $.Deferred();



/*---Page Load------*/
$(window).load(function () {
    getData();
    $.when(getDataDone).then(function(){
        console.log("Tracks processing complete ");
        console.log("Integration Point - RenderData Fn here");
        //TODO - Invoke renderData here
    })
});


function getData(){
    $.ajax({
        success:handleDatavar
 })
}

var handleDatavar=function handleData() {
    for (var i = 0; i < country_names.length; i = i + 1 ) {
      getTopTracks(country_names[i]);
    }
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
            if (TOPTRACKS.length==country_names.length){
                getDataDone.resolve(); 
            }
        },
        error: function(data) {
            console.log("getTopTracks: " + data.error + " " + data.message);
        }
    });
}

 var DISPLAYTOPTRACKS = function renderTopTracks(){
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

/*function getTopTracks(country){
    lastfm.geo.getTopTracks({
        country:country,
        limit: 1
    },
    {
        success: function(data) {
            //console.log("top artists");
            console.log(data);
            $('#top_tracks').html(
                $('#lastfmTemplateTracks').render(data.toptracks.track)
            );
            // do something
        },
        error: function(data) {
            console.log("getTopArtists: " + data.error + " " + data.message);
        }
    });
    }*/