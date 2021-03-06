Meteor.methods({
	updateSongRating: function(sid, type, userRating){
		//console.log('INSIDE THE UPDATE RATING METHOD FOR SONG SERVER CONTROLLER');
		var userID = Meteor.user().services.facebook.id;
		//console.log('going to update the rating for: '+ sid + '--- for this user ID: ' + userID + ' WITH THIS rating: ' + userRating);
		var searchString = '';
		if (type == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + sid;
		}

		Ratings.upsert({ 'sl': searchString, 'uid': userID}, {$set: { rating: userRating }}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      //else{
	      	//console.log('################ song rating succesfully updated for: ' + searchString);
	      //}
		});
	},/*
	getPersonalRatingForSong: function(linkSID, linktype){
		var userID = Meteor.user().services.facebook.id;
		var searchString = '';
		if (linktype == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + linkSID;
		}
		//get personal rating for song
		var personalRating = Ratings.find({ 'sl': searchString, 'uid': userID}).fetch();

		if(personalRating.length > 0)
		{
			//console.log('Will be returning personalRating because it is not empty:');
			//console.log(personalRating);
			return personalRating;
		}
	},
	getAverageRatingForSong: function(linkSID, linktype){
		var searchString = '';
		if (linktype == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + linkSID;
		}
		var listOfRatings = Ratings.find({ 'sl': searchString}).fetch();

		//console.log('GOT THIS LIST OF RATINGS for linK: ' + searchString);
		//console.log(listOfRatings);
		if(listOfRatings.length > 0)
		{
			//console.log('Will be returning average Ratings because it is not empty:');
			//console.log(listOfRatings);
			return listOfRatings;
		}
	},
	getRatingCountForUser: function(uid) {
		console.log('REACHED THE GET RATING METHOD: ' + uid);
		var ratingsForUser = Ratings.find({'uid': uid}).fetch();
		return ratingsForUser.length;
	}*/
});