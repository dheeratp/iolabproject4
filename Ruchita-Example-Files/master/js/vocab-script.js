$(document).ready(function() 
{
	//Hide the alert box on page load
	$('#alerts').hide();
	init();
});

// define api keys
var apiKey = '3ac99d70ec72ea538b093d1bb008faab';
var apiSecret = 'b5071d81a4fde75a3555a3cb6eccf36f';

// create a Cache object
var cache = new LastFMCache();

// create a LastFM object
var lastfm = new LastFM({
    apiKey    : apiKey,
    apiSecret : apiSecret,
    cache     : cache
});


function init() {

	// try to get token from URL
	var token = $.url().param('token');
	console.log(token);
	// If we still don't have token, send the user to get one
	if (token) {
	   	// we have a token now.  

	   	//Make sure the connect button isn't shown
	   	$("#connect").addClass("display-none");
	   	$(".span9").removeClass("display-none");
	
		// use the token to initiate a session
		// tokens may expire after 60 mins?
		lastfm.auth.getSession({
    		token: token
		},
		{
		    success: function(data_sess) {
		        // save session info
		        // data_sess = ["key":'', "name":'', "subscriber":'']
		        main(data_sess);
		    },
		    error: function(data_sess_error) {
		        console.log("init: error"+data_sess_error);
		        // error

		        // the token might be expired, go get another one...
		        //getAuthToken();
		    }
		});
	} else {
		// no token.  Show the connect button
		$("#connect").removeClass("display-none");
		$(".span9").addClass("display-none");
	}

	$("#connect").on("click", function() {
		getAuthToken();
	});
}

function main(data_sess) {
	// call our algorithms here

	// fill in all username elements with name from session element
	$(".page-header").html("<p>Connected as "+data_sess.session.name+"</p><br/>");

	console.log("session data:");
	console.log(data_sess);

	// get weekly artist chart by tag 'trance'
    //getWeeklyArtistChart('trance');

    // public, no auth needed
    getTopArtists(data_sess.session.name);

    // public, no auth needed
    getLovedTracks(data_sess.session.name);

    // auth needed
    getRecommendedArtists(data_sess);

    getPlaylists(data_sess.session.name);
}

function getAuthToken() 
	{
	var cb = 'http://people.ischool.berkeley.edu/~ruchitarathi/iolab-p2/index.html';
	window.location = 'http://www.last.fm/api/auth/?api_key=' + apiKey + '&cb=' + cb;
	}

function getRecommendedArtists(data_sess) {
	lastfm.user.getRecommendedArtists({
	    user: data_sess.session.name,
	    limit: 10
	},
	    data_sess.session,
	{
	    success: function(data_recs) {
	    	//console.log(data_recs);
	        $('#recommended_artists').html(
            	$('#lastfmTemplateArtists').render(data_recs.recommendations.artist)
    		);
	    },
	    error: function(data_recs_error) {
	        // error msg
	        console.log("getRecommendedArtists: error"+data_recs_error);
	    }
	});
}

function getTopArtists(username) {
	lastfm.user.getTopArtists({
    	user: username,
    	limit: 10
	},
	{
    	success: function(data) {
  			console.log("top artists");
    		console.log(data);
    		$('#top_artists').html(
            	$('#lastfmTemplateArtists').render(data.topartists.artist)
    		);
        	// do something
    	},
    	error: function(data) {
        	alert("getTopArtists: " + data.error + " " + data.message);
    	}
    });
}

function getWeeklyArtistChart(tag) {

    var topArtistName = '';
    
    lastfm.tag.getWeeklyArtistChart({tag: tag, limit: 6}, {success: function(data){

    	//console.log(data);

        // render top weekly artist using 'lastfmTemplateArtists' template
        $('#top_artists').html(
            $('#lastfmTemplateArtists').render(data.weeklyartistchart.artist)
        );

        // define top artist name
        topArtistName = data.weeklyartistchart.artist[0].name;

        // load details of the artist
        lastfm.artist.getInfo({artist: topArtistName}, {success: function(data){

            // render the single artist info using 'lastfmTemplateArtistInfo' template
            $('#top_artist').html(
                $('#lastfmTemplateArtistInfo').render(data.artist)
            );

            // load the artis's top tracks
            lastfm.artist.getTopTracks({artist: topArtistName, limit: 9}, {success: function(data){

                // render the tracks using 'lastfmTemplateTracks' template
                $('#top_tracks').html(
                    $('#lastfmTemplateTracks').render(data.toptracks.track)
                );
            }});

        }, error: function(code, message){
            alert('getWeeklyArtistChart: Error #'+code+': '+message);
        }});
    }});
};

function getLovedTracks(username) {
	lastfm.user.getLovedTracks({
    	user: username,
    	limit: 10
	},
	{
    	success: function(data) {
    		console.log("loved data:");
    		console.log(data);    		

    		$('#loved_tracks').html(
            	$('#lastfmTemplateTracks').render(data.lovedtracks.track)
    		);
    		$("#lovedlists ul").append($("#GetLovedTracksAsList").render(data.lovedtracks.track));
        

    		
        	
    	},
    	error: function(data) {
        	console.log("getLovedTracks: " + data.error + " " + data.message);
    	}
    });
}

function getPlaylists(username) {
	lastfm.user.getPlaylists({
		user: username
	},
	{
		success: function(data) {
			console.log("playlist data:");
			console.log(data);

			// add lists to user's choices
			$.each(data.playlists.playlist, function (key,val) {
				$('#lists').append($('<option></option>').val(val.id).html(val.title));
			});
			
		},
		error: function(data) {
			console.log("getplaylists: " + data.error + " " + data.message);
		}
	});
}

function getTopTracks(){
	lastfm.artist.getTopTracks({artist: 'Donna Summer'}, {
		success: function(data)
		{
		//check data 
		alert(data.toptracks.track[0].name);
		}, 
		error: function(code, message)
		{
		alert(message);

		}
	});
}

function getTopTags(){
	/* Load some artist info. */
lastfm.track.getSimilar(
	{
		artist: 'Paul Van Dyk',
		track : 'For an Angel' 
	},{
		success: function(data){
			console.log("Success");
		}, 
		error: function(code, message){
			console.log("Error");
		}
	});
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
