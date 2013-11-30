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
var i=0;



// on page load
 $(window).load(function() {


    var getAllTracks = main();
    $.when(getAllTracks).then(
        function(){
            console.log("printing getAllTracks");
            console.log(getAllTracks);

        });

    
    /*$.when(getAllTracks)
      .pipe(renderTopTracks(TOPTRACKS));*/
      var topArtistName = '';
    



});

 function main(){

    for (i = 0; i < country_names.length; i = i + 1 ) {
      getTopTracks(country_names[ i ], i);

  }
  


 }

 function getTopTracks(country, i){
    lastfm.geo.getTopTracks({
        country:country,
        limit: 1
    },
    {
        success: function(data) {

            /*var obj = {
                "mbid": data.toptracks.track.mbid,
                "url": data.toptracks.track.url,
                "name": data.toptracks.track.name,
                "country": country,
                "artist": {
                    mbid:data.toptracks.track.artist.mbid,
                    name:data.toptracks.track.artist.name,
                    url:data.toptracks.track.artist.url
                },
                "image":data.toptracks.track.image[0],
                "listeners":data.toptracks.track.listeners


            };*/
            //console.log(obj); 
            TOPTRACKS.push(data);
            console.log(TOPTRACKS);
            
                //$.extend(TOPTRACKS, data);
            

             
            //console.log("TOPTRACKS");
            //console.log(TOPTRACKS);

            
        },
        error: function(data) {
            console.log("getTopTracks: " + data.error + " " + data.message);
        }
    });
    }

 function renderTopTracks(data){
    console.log("Inside render tracks");
    console.log(TOPTRACKS);
    lastfm.geo.getTopTracks({
        country:country,
        limit: 1
    },
    {
        success: function(data) {
            //console.log("top artists");
            console.log(data);
            $.each( TOPTRACKS, function( key, value ) {
            console.log( TOPTRACKS );
            });
           $('#top_tracks').html( $('#lastfmTemplateTracks').render(data.artist));
            // do something
        },
        error: function(data) {
            console.log("getTopArtists: " + data.error + " " + data.message);
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