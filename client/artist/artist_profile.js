Template.artistProfile.helpers({
  getArtist: function() {
    getArtistForRouting();
  },
  getSongsForArtist: function() {
    getSongsForSpecificArtist();
  },
  artistObject: function() {
    return Session.get(Router.current().params._name+'_artObj');
  },

  songsForArtist: function() {
    if(!_.isUndefined(Session.get(Router.current().params._name+'as')) && !_.isEmpty(Session.get(Router.current().params._name+'_as')))
      return Session.get(Router.current().params._name+'_as');
  },
  artistImage: function() {
    if(!_.isUndefined(this.largeImage['#text']) && !_.isEmpty(this.largeImage['#text']))
      return '<img src="'+this.largeImage['#text']+'" style="float:left;width:100%;height:100%;">';
    else
      return '<h4>NO ARTIST IMAGE AVAILABLE</h4>';
  },
  cleanedSimilarURL: function() {
    var cleaned = this.replace(',', ' ');
    cleaned = cleaned.replace('.', ' ');
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    doesArtistHavePage(cleaned);
    if(Session.get(cleaned+'_hasPage'))
      return '<a href="/artist/'+cleaned+'"><span class="btn btn-info btn-xs" data-toggle="tooltip" data-placement="top" title="'+this+' page""><b>'+this+'</b></span></a>';
    else
      return '<span class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="No music of this artist has been brought into Groovli yet!">'+this+'</span>';
  },
  hasSimilar: function() {
    if(!_.isUndefined(this.similar) && !_.isEmpty(this.similar))
      return true;
    else
      return false;
  },
  hasGenres: function() {
    if(!_.isUndefined(this.genres) && !_.isEmpty(this.genres))
      return true;
    else
      return false;
  },
  cleanedBio: function() {
    this.bio = this.bio.replace(/(\r\n|\n|\r)/gm,"");//remove extra line breaks
    this.bio = this.bio.replace(/\s{2,}/g, ' '); //remove extra whitespace
    var textToRemove = '<a href=\"http:\/\/www.last.fm\/music\/###ARTIST_NAME###\">Read more about ###ARTIST_NAME### on Last.fm<\/a>.\n    \n    \nUser-contributed text is available under the Creative Commons By-SA License and may also be available under the GNU FDL.';
    textToRemove = textToRemove.replace(/(\r\n|\n|\r)/gm,"");//remove extra line breaks
    textToRemove = textToRemove.replace(/\s{2,}/g, ' '); //remove extra whitespace
    var urlArtistText = Router.current().params._name;
    while(urlArtistText.indexOf(' ') >= 0)
    {
      urlArtistText = urlArtistText.replace(' ', '+');
    }
    textToRemove = textToRemove.replace('###ARTIST_NAME###', urlArtistText);
    textToRemove = textToRemove.replace('###ARTIST_NAME###', Router.current().params._name);
    //console.log('this is the bio:');
    //console.log(this.bio);
    //console.log('this is the bio text to remove: ');
    //console.log(textToRemove);
    //console.log('this is the urlArtistText: ');
    //console.log(urlArtistText);
    return this.bio.replace(textToRemove, '');
  },
  artistHasPage: function() {
    return Session.get('artistHasPage');
  },
  songCount: function()
  {
    //console.log('CHECKING SONG COUNT!!!');
    if(Session.get(Router.current().params._name+'_as_count') > 1 || Session.get(Router.current().params._name+'_as_count') === 0)
      return '<h2><strong>'+Session.get(Router.current().params._name+'_as_count')+'</strong></h2><p><small>songs on Groovli</small></p>';
    else if(Session.get(Router.current().params._name+'_as_count') === 1)
      return '<h2><strong>'+Session.get(Router.current().params._name+'_as_count')+'</strong></h2><p><small>song on Groovli</small></p>';
  },
  albumCount: function() 
  {
    if(!_.isUndefined(Session.get(Router.current().params._name+'_as')) && !_.isEmpty(Session.get(Router.current().params._name+'_as')))
    {
      var albumList = _.uniq(Session.get(Router.current().params._name+'_as'), function(x){
        return x.songObj.album;
      });

      if(albumList.length > 1 || albumList.length === 0)
        return '<h2><strong>'+albumList.length+'</strong></h2><p><small>albums</small></p>';
      else if(albumList.length === 1)
        return '<h2><strong>'+albumList.length+'</strong></h2><p><small>album</small></p>';
    }
  }
});

function getArtistForRouting()
{
  //console.log('GETTING artist for routing now: ' + Router.current().params._name);
  Meteor.call('findArtistForRouting', Router.current().params._name, function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
        Session.set(Router.current().params._name+'_artObj', result);
      }
  });
}

function doesArtistHavePage(artName) {
  Meteor.call('doesArtistHavePage', artName, function(error,result){
        if(error){
          console.log('Encountered error while trying to check if artist has page: ' + error)
        }
        else{
            // do something with result
          //console.log('received artist page result: ' + result);
          Session.set(artName+'_hasPage', result);
        };
    });
}