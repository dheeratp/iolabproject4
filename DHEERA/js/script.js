$(document).ready(function() {
	var lastFmGetTopArtists = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=fe2d6cbf21ec4e41cda16517fbb8391e&format=json&limit=100";
	$.getJSON( lastFmGetTopArtists, function( data ) {
		var artist_dict = {}
		$.each( data.artists.artist, function () {
			$("#artists").append('<option value="'+ this.name + '">' + this.name + '</option>')
		});
	});

	//console.log($("#artists option:selected").val());
	$("#artists").change( function() {

		selected_artist = $(this).val()
		var lastFmGetTopFans = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopfans&artist=" + selected_artist + "&api_key=fe2d6cbf21ec4e41cda16517fbb8391e&format=json"
		$.getJSON( lastFmGetTopFans, function( data ) {
			var fans = []
			$.each( data.topfans.user, function() {
			//fans.push(data.topfans.user.name)
			fans.push(this.name)
			});
			
			var country_data = {}
			for (i=0; i<fans.length; i++) {
				user = fans[i];
				var lastFmGetUserInfo = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=" + user + "&api_key=fe2d6cbf21ec4e41cda16517fbb8391e&format=json"
				$.getJSON( lastFmGetUserInfo, function( data ) {
					if (data.user.country in country_data) {
						country_data[data.user.country] += 1
					}
					else {
						country_data[data.user.country] = 1
					}
					console.log(country_data)
					// stuck on how to get this data outside of the function..
				});
			}

		});
	});


});