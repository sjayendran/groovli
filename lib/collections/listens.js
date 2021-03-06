Listens = new Mongo.Collection('listens');

Listens.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  }
});

Meteor.methods({
	insertSongListen: function(sid, type){
		//console.log('INSIDE THE UPDATE LISTEN couNT METHOD FOR SONG SERVER CONTROLLER');
		//console.log('going to update the listen count for: '+ sid);
		if(!_.isNull(Meteor.user()))
		{
			var userID = Meteor.user()._id;
			var searchString = '';
			if (type == 'yt')
			{
				searchString = 'https://www.youtube.com/watch?v=' + sid;
			}

			Listens.insert({ 'sl': searchString, 'uid': userID, 'timestamp': new Date()}, function(error) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
				return error;
		      }
		      else{
		      	console.log('################ song listen succesfully INSERTED for: ' + searchString);
				//return "listen incremented successfully: "+ searchString; 
		      }
			});
		}
	},
	insertMobileSongListen: function(sid, userObj){
		//console.log('INSIDE THE UPDATE LISTEN couNT METHOD FOR SONG SERVER CONTROLLER');
		//console.log('going to update the listen count for: '+ sid);
		if(!_.isNull(userObj))
		{
			var userID = userObj._id;
			var searchString = '';
			searchString = 'https://www.youtube.com/watch?v=' + sid;

			Listens.insert({ 'sl': searchString, 'uid': userID, 'timestamp': new Date()}, function(error) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
				return error;
		      }
		      else{
		      	console.log('################ song listen succesfully INSERTED for: ' + searchString);
				//return "listen incremented successfully: "+ searchString; 
		      }
			});
		}
	},
	getTotalListenCountForSong: function(linkSID, linktype){
		///var userID = Meteor.user().services.facebook.id;
		var searchString = '';
		if (linktype == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + linkSID;
		}
		//get personal rating for song

		var totalListenCount = Listens.find({'sl': searchString}).count();
		//console.log('THIS IS THE TOTAL LISTEN COUNT FOR THIS SONG: ' + totalListenCount);
		return totalListenCount;
	},
	getListenHistoryForUser: function(uid){
		//changed listen history from 250 to 100
		var lh = Listens.find({'uid': uid}, {sort: {timestamp: -1}, limit:30}).fetch();
		//console.log('THIS IS THE LISTEN HISTORY FOR THIS USR: ');
		//console.log(lh);
		var cleanedLH = [];
		var cleanedCounter = 0;
		_.each(lh, function(x) {
			lid = x.sl.substring(x.sl.indexOf('v=')+2);
			//console.log(lid);
			if(!_.isEmpty(lid) && cleanedCounter < 20) //changed from 100 to 50 to only get last 50 recent listens
			{
				//console.log('GOING TO PUSH each listen history item: ');
				//console.log(x);
				var foundObj = Songs.findOne({'sl': x.sl, $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]});
				if(!_.isUndefined(foundObj))
				{
					//console.log('THIS IS ONE IS NOT AN INVALID SONG: ');
					//console.log(x);
					cleanedLH.push(x);
				}
				cleanedCounter++;
			}
		});

		//return cleanedLH;
		var mappedlh = _.map(cleanedLH, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});
		//console.log('GOT history BACK and modified it to be this: ' );
		//console.log(lh);
		return [cleanedLH, mappedlh];
	},

	getTotalListenHistoryCountForUser: function(uid){
		var lh = Listens.find({'uid': uid}, {sort: {timestamp: -1}}).fetch();
		//console.log('THIS IS THE LISTEN count FOR THIS USR: ');
		//console.log(lh.length);
		var cleanedLH = [];
		_.each(lh, function(x) {
			lid = x.sl.substring(x.sl.indexOf('v=')+2);
			//console.log(lid);
			if(!_.isEmpty(lid))
			{
				cleanedLH.push(x);
			}
		});
		//return lh;
		return cleanedLH.length;
		//var x = Songs.findOne({'sl': lh[0].sl});
		//console.log('THIS IS THE SONG OBJECT FOR THE FIRST LINK: ');
		//console.log(x);
	},

	getMutualListenHistory: function(lh, uid){
		//console.log('this is the listen history got: ');
		//console.log(lh);
		//console.log('Mutual Listen History: and this is the UID: ');
		//console.log(uid);
		var mlh = [];
		var lid = "";
		_.each(lh, function(x) {
			lid = x.sl.substring(x.sl.indexOf('v=')+2);
			//console.log(lid);
			if(!_.isEmpty(lid))
			{
				var results = Listens.find({'sl': x.sl, 'uid': {'$ne': uid}}, {sort: {timestamp: -1}}).fetch();
				if(!_.isEmpty(results))
					mlh.push(results);
			}
		});
		//console.log('Finished EACH METHOD: ');
		//console.log(mlh);
		var socialLinks = [];

		_.each(mlh, function(y) {
			_.each(y, function(z){
				var a = Meteor.users.findOne(z.uid);
				if(!_.isUndefined(a))
					socialLinks.push({timestamp: z.timestamp, sl: z.sl, _id: z.uid, soc_id: a.services.facebook.id, soc_name: a.profile.name});
			});
		});

		//console.log('FINISHED MAP FUNCTION: ');
		//console.log(socialLinks);
		return socialLinks;
	}
});