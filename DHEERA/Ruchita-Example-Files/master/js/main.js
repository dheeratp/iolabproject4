$(document).ready(function() {
	init();

	// TODO:  handle error15  expired token
});

// define api keys
var apiKey = 'ef52d33ae515465c74fe383a71089f43';
var apiSecret = '2ac7e97f4fff53f76ecd2f5f376e71a3';
var username = '';

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
	   	$("#connect-div").addClass("display-none");
	   	$(".content").removeClass("display-none");
	
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
		$("#connect-div").removeClass("display-none");
		$(".content").addClass("display-none");
	}

	$("#connect").on("click", function() {
		getAuthToken();
	});
}

function main(data_sess) {

	// fill in all username elements with name from session element
	$("loggedin").removeClass("display-none");  
	$("#loggedin").html("<p>Connected as "+data_sess.session.name+"</p>");

	//Hide the alert div on page load
	$( "alerts" ).addClass( "display-none" );
	$("loggedin").addClass( "display-none" );

	console.log("session data:");
	console.log(data_sess);

	username = data_sess['name'];

	// get weekly artist chart by tag 'trance'
    //getWeeklyArtistChart('trance');

    // public, no auth needed
    getTopArtists(data_sess.session.name);

    // public, no auth needed
    getLovedTracks(data_sess.session.name);

    // auth needed
    getRecommendedArtists(data_sess);

    getPlaylists(data_sess.session.name);


    /* Setup Drop down menu */
	// add "Loved Tracks" to user's choices
	$('#lists').append($('<option></option>').val("0").html("Loved Tracks"));
	
    $('#lists').change(function() {
    	fetchPlaylist(data_sess.session.name, this.value);
    });
}

function getAuthToken() {
	var cb = 'http://people.ischool.berkeley.edu/~ruchitarathi/iolab-p4/index.html';
	//Callback var
	//var cb = 'http://people.ischool.berkeley.edu/~ruchitarathi/iolab-p2/index.html';
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
  			//console.log("top artists");
    		//console.log(data);
    		$('#top_artists').html(
            	$('#lastfmTemplateArtists').render(data.topartists.artist)
    		);
        	// do something
    	},
    	error: function(data) {
        	console.log("getTopArtists: " + data.error + " " + data.message);
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
    		//console.log("loved data:");
    		//console.log(data);    		

    		$('#current_tracks').html(
            	$('#lastfmTemplateTracks').render(data.lovedtracks.track)
    		);

    		// set header based on name of current list
    		$('#current_title').html("Loved Tracks");

    		$.each(data.lovedtracks.track, function (key, val) {
    			
    			getTrackTags(val.artist.name, val.name, username, val.mbid);

    		});
			//getTrackTags("The White Stripes");

    	},
    	error: function(data) {
        	console.log("getLovedTracks: " + data.error + " " + data.message);
    	}
    });
}

function getTrackTags(artist, track_name, username, mbid) {
	lastfm.track.getTags({
		artist: artist,
		track: track_name,
		user: username
	},
	{
		success: function(data) {
			console.log("getTrackTags:")
			console.log(data);

    		// create user-defined array of tags
    		tags = Array();
    		if (data.tags.tag.length && (data.tags.tag.length > 1)) {
	    		$.each(data.tags.tag, function (key, val) {
	    			val['class'] = 'user';
	    			tags.push(val);
	    		});
    		} else {
    			data.tags.tag['class'] = 'user';
    			tags.push(data.tags.tag);
    		}

	   		getRecommendedTags(artist, track_name, mbid, tags);

		},
		error: function(data) {
			console.log("getTrackTags: " + data.error + " " + data.message);
		}
	});
}

function getRecommendedTags(artist, track_name, mbid, tags) {
	lastfm.track.getTopTags({
		artist: artist,
		track: track_name
	},
	{
		success: function(data) {

			tmpArray = [];
			for (i=0; i<10; i++) {
				data.toptags.tag[i]['class'] = 'recommended';
				tmpArray.push(data.toptags.tag[i]);
			}

			$.merge(tags, tmpArray);

			$.each(tags, function (key, val) {
				for (i=(key+1); i<tags.length; i++) {
					if (val.name == tags[i].name) {
						tags.splice(i, 1);
					}
				}
			});

	    	$('#'+mbid).find('ul').html(
            	$('#lastfmTemplateTrackTags').render(tags)
    		);

    		// When a recommended tag is clicked, save it as a user chosen tag
			$('.recommended').on('click', function() {
				console.log('rec clicked');
				console.log(this);

				saveTrackTag(artist, track, tags, sk);
					// if success, remove recommended class, add user class
			});
		},
		error: function(data) {
			console.log("getTopTags: " + data.error + " " + data.message);
		}
	});
}

function saveTrackTags(artist, track, tags, sk) {
	lastfm.track.addTags({
		artist: artist,
		track: track,
		tags: tags,
		sk: sk
	},
	{
		success: function(data) {
			console.log("ADD TAGS");
			console.log(data);

		},
		error: function (data) {
			console.log("trackAddTags: " + data.error + " " + data.message);
		}
	});

}

function getPlaylists(username) {
	lastfm.user.getPlaylists({
		user: username
	},
	{
		success: function(data) {
			//console.log("playlist data:");
			//console.log(data);

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

function fetchPlaylist (username, playlist_id) {
	if (playlist_id == "0") {
		getLovedTracks(username);
	} else {
		//	lastfm://playlist/<playlist_id>
		lastfm.playlist.fetch({
			playlistURL: "lastfm://playlist/"+playlist_id
		},
		{
			success: function(data) {
				//console.log("playlist fetch: ");
				//console.log(data);

				// add tracklist to the main container
				
				$('#current_tracks').html(
	            	$('#lastfmTemplatePlaylist').render(data.playlist.trackList.track)
	    		); 

				// set header based on name of current list
    			$('#current_title').html(data.playlist.title);
    			
    			tracks = data.playlist.trackList.track;
    			console.log("TRACKS");
    			console.log(tracks);
    			console.log(username);
    			for (i=0; i < tracks.length; i++) {
    				getTrackTags(tracks[i].creator, tracks[i].title, username, 0);
    			}

			},
			error: function(data) {
				console.log("fetchPlaylist: " + data.error + " " + data.message);
			}
		});
	}
}

function saveTrackTag (artist, track, tag, sk) {
	//
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
