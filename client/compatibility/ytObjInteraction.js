var ytplayer;
var progContainer;
var progBar;
var playerStarted = false;
/*function onYouTubeIframeAPIReady() {
  console.log('inside the jquery load event!');
      player = new YT.Player('sharePlayer',{
        events: {
            'onReady': function(e){ e.target.playVideo(); }
        }
    });
  console.log(player);
}*/

function setupPlayerAndCommentsPriorToLoading()
{
  $(function() {
    //console.log('JQUERY says page is ready!!!!');
      //Youtube iFrame API inclusion
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.type = "text/javascript";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    //console.log('FINISHEd script insertion!!!!');

    /*    
    tag = document.createElement('link');
    tag.src = "http://pingendo.github.io/pingendo-bootstrap/themes/default/bootstrap.css";
    tag.type = "text/css";
    firstScriptTag = document.getElementsByTagName('link')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    tag = document.createElement('script');
    tag.src = "http://netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js";
    tag.type = "text/javascript";
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);*/

    //MUUT JS inclusion
    /*tag = document.createElement('script');
    tag.src = "//cdn.muut.com/1/moot.min.js";
    tag.type = "text/javascript";
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    //MUUT CSS inclusion
    tag = document.createElement('link');
    tag.src = "//cdn.muut.com/1/moot.css";
    tag.type = "text/css";
    firstScriptTag = document.getElementsByTagName('link')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);*/

    window.onYouTubePlayerAPIReady = function() {
      playerLoaded();
    };

  });
}

function playerLoaded()
{
  //console.log('INSIDE THE PLAYER Loaded method!!!!!');
  if(!_.isUndefined(YT))
  {
    while(_.isUndefined(ytplayer))
    {
      try {
        ytplayer = new YT.Player('player', {
          playerVars: { 
            'autoplay': 0, 
            'controls': 0,
            'autohide': 1,
            'wmode':'opaque', 
            'enablejsapi': 1, 
            'showinfo': 0, 
            'color': 'white',
            'iv_load_policy': 3,
            'fs': 0
          }
        });
      }
      catch(err) {
          console.log('encountered error while trying to initialize ytplayer: ' + err);
          ytplayer = undefined;
      }
    }
    console.log('ytplayer loaded, not undefined now!');
  }
  else
  {
    //console.log('YT NOT VALID ->> RELOADING PAGE!!!');
    location.reload();
  }
  ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onReady", "onPlayerReady"); 
	ytplayer.addEventListener("onError", "onPlayerError"); 
	setInterval(updatePlayerInfo, 250);
	progContainer = document.getElementById('progContainer');
	progBar = document.getElementById('progBar');
  
	progContainer.addEventListener('click', function(e) {
	  //console.log("clickedinside prog container at X"+e.offsetX);
	  //console.log("clickedinside prog container at Y "+e.offsetY);
	  progBar.style.width = e.offsetX + "px";

	  var selectedPosition = (e.offsetX / progContainer.scrollWidth);

	  var selectedTime = selectedPosition * ytplayer.getDuration();

	  ytplayer.seekTo(selectedTime, true)
    //analytics.track("seeked thru song");
    amplitude.logEvent("seeked thru song");
    ga('send', {
      hitType: 'event',
      eventCategory: 'songboard',
      eventAction: 'seeked thru song'
    });
    
	}, false);
  
  ////console.log(ytplayer);
}

function onPlayerReady() {
    //console.log('inside on player ready method!!!');
    Session.set('playerLoaded', true);
    Session.set('playerStarted', false);
    //ytplayer.playVideo();
}

function onPlayerStateChange(event) {
  //console.log('this is the current player state:' + event.data);
  var loader = $('img#songLoader');
  if(event.data === 0) {  //video finished playing, so move to next video      
      //console.log("VID DONE!");
      //var nextBtn = $('.glyphicon-step-forward');
      //var nextBtn = $('.fa-step-forward');
      var nextBtn = $('.step.forward.icon');
      //analytics.track("reached end of song");
      amplitude.logEvent("reached end of song");
      ga('send', {
        hitType: 'event',
        eventCategory: 'songboard',
        eventAction: 'reached end of song',
        nonInteraction: true
      });

      if(Session.get('srep'))
      {
        ytplayer.seekTo(0, true);
        //console.log('repeating this song now');
        amplitude.logEvent("repeating this song");
        ga('send', {
          hitType: 'event',
          eventCategory: 'songboard',
          eventAction: 'repeating this song',
          nonInteraction: true
        });
      }
      else
      {
        nextBtn.click();
      }
	}
  else if(event.data === -1 || event.data === 3) { //if buffering show loader 
    ////console.log(loader);
    loader.css("visibility","visible");
  }
  else if(event.data === 1) { //if playing hide loader
    loader.css("visibility","hidden");
  }
}

function onPlayerError(errorCode) {
  //analytics.track("auto error");
  amplitude.logEvent("auto error");
  ga('send', {
    hitType: 'event',
    eventCategory: 'songboard',
    eventAction: 'auto error',
    nonInteraction: true
  });
  Session.set('SongErroneous', true);
  Session.set('YTErrorCode', errorCode.target.e);
  //console.log('ERROR CODE IS: ');
  //console.log(errorCode.target.e); 

  /*
  console.log('!!!!ERRONEOUS SHARE is: '+ss.getCurrentID());
  console.log('aeCount is: '+ss.getCS().aeCount);

  if(ss.getLastAction() == "next") // continue in the next direction if bad video found
  {
    var nextBtn = angular.element(document.querySelector('.glyphicon-step-forward'));
    nextBtn.click();
  }
  else if(ss.getLastAction() == "previous") // continue in the previous direction if bad video found
  {
    if(ss.getCurrentHistoryIndex() > 0) // if erroneous video at the beginning of the history then move forward
    {
      var prevBtn = angular.element(document.querySelector('.glyphicon-step-backward'));
      prevBtn.click();
    }
    else
    {
      console.log('erroneous video was the FIRST VIDEO!!!!');
	  var nextBtn = angular.element(document.querySelector('.glyphicon-step-forward'));
      nextBtn.click();      
    }      
  }
  ss = null;*/
}

function stopVideo() {
  ytplayer.stopVideo();
}

// Display information about the current state of the player
function updatePlayerInfo() {
  // Also check that at least one function exists since when IE unloads the
  // page, it will destroy the SWF before clearing the interval.
	//var progressBar = document.getElementById("progressBar");
  //console.log('updating player noww!!!');
	//var inside = document.getElementById('progInside');
	var progBar = document.getElementById('progBar');
	if(ytplayer)
	{
		try
		{
			if(ytplayer.getPlayerState() == 1)
			{
				var currentProgress = (ytplayer.getCurrentTime() / ytplayer.getDuration()) * 100;
				//progressBar.setAttribute("style","width:"+currentProgress + "%");
				//inside.style.width = currentProgress + "%";
        //console.log('this is the current progress: '+ currentProgress);
				progBar.style.width = currentProgress + "%";
				//progressBar.width == currentProgress + "%";

				//console.log("ABSOLUTE VALUE OF CURRENT PROGRESS IS: "+abs(currentProgress));
				if(currentProgress == 100)
				{
					clearInterval(this);
				}
				else if(currentProgress < 1)
				{

          //animateListToCurrentlyPlayingSong(null);
          /*var listName = '';
          if(Session.get('activeTab') === 'me')
          {
            listName = '#mygroovsList';
          }
          else if(Session.get('activeTab') === 'friends')
          {
            listName = '#tastemakersList';
          } 
					var currentScrollOffset = $(listName).scrollTop();//$("#personalVidList").scrollTop();
					$(listName).animate({ scrollTop: $(".thumbnail.shareBrowserItem.selected").offset().top - 140 + currentScrollOffset}, 500);*/
				}

        //to automatically keep player control in sync with youtube player state
        var playpauseButton = $('.play.icon.playInControls');
        if(playpauseButton.length > 0)
        {
          //console.log('PLAYER HAS BEEN played!!!!!!');
          playpauseButton.toggleClass('play pause');
        } 

			}

      //to automatically keep player control in sync with youtube player state
      if(ytplayer.getPlayerState() == 2){
        var playpauseButton = $('.play.icon.playInControls');
        if(playpauseButton.length == 0 || playpauseButton == [] || playpauseButton == undefined || playpauseButton == null)
        {
          playpauseButton = $('.pause.icon');
          playpauseButton.toggleClass('pause play');
        } 
      }
		}
		catch(err)
		{
			if(err == "TypeError: Object #<HTMLObjectElement> has no method 'getPlayerState'")
			{
				//do nothing
			}
		}
	}
}

function playpauseVideo() {
  //var playpauseButton = $('.glyphicon-play');
  //var playpauseButton = $('.fa-play');
  var playpauseButton = $('.play.icon.playInControls');
  //ytplayer = document.getElementById("sharePlayer");
  if(playpauseButton.length == 0 || playpauseButton == [] || playpauseButton == undefined || playpauseButton == null)
  {
    //console.log('GOING TO PAUSE now!!!');
    //analytics.track("pause song");
    amplitude.logEvent("pause song");
    ga('send', {
      hitType: 'event',
      eventCategory: 'songboard',
      eventAction: 'pause song'
    });
    //playpauseButton = $('.glyphicon-pause');
    //playpauseButton = $('.fa-pause');
    playpauseButton = $('.pause.icon');
    if (ytplayer) {
      ytplayer.pauseVideo();
    }
    //playpauseButton.toggleClass('glyphicon-pause glyphicon-play');
    //playpauseButton.toggleClass('fa-pause fa-play');
    playpauseButton.toggleClass('pause play');
  }
  else
  { 
    //console.log('GOING TO PLAY now!!!');
    //analytics.track("play song");
    amplitude.logEvent("play song");
    ga('send', {
      hitType: 'event',
      eventCategory: 'songboard',
      eventAction: 'play song'
    });
    if (ytplayer) {
      ytplayer.playVideo();
    }
    //playpauseButton.toggleClass('glyphicon-play glyphicon-pause');
    //playpauseButton.toggleClass('fa-play fa-pause');
    playpauseButton.toggleClass('play pause');
  }  
}

function pauseSongOnlyIfSongBoardIsPlaying(){
  var playpauseButton = $('.play.icon.playInControls');
  //ONLY if SONG is PLAYING pause it - otherwise do nothing
  if(playpauseButton.length == 0 || playpauseButton == [] || playpauseButton == undefined || playpauseButton == null)
  {
    //console.log('GOING TO PAUSE now!!!');
    //analytics.track("pause song");
    amplitude.logEvent("pause song");
    ga('send', {
      hitType: 'event',
      eventCategory: 'songboard',
      eventAction: 'pause song'
    });
    //playpauseButton = $('.glyphicon-pause');
    //playpauseButton = $('.fa-pause');
    playpauseButton = $('.pause.icon');
    if (ytplayer) {
      ytplayer.pauseVideo();
    }
    //playpauseButton.toggleClass('glyphicon-pause glyphicon-play');
    //playpauseButton.toggleClass('fa-pause fa-play');
    playpauseButton.toggleClass('pause play');
  } 
}

function playPauseVideoWhenVimeoClosesOpens(){
  if (ytplayer) {
    if(ytplayer.getPlayerState() == 1 && Session.get('vimOpen'))
    {
      playpauseVideo();
    }
    else if(ytplayer.getPlayerState() == 2 && !Session.get('vimOpen'))
    {
      playpauseVideo();
    }
  }
}


//this is required in order to push a listen only once the user has listened thru 40% of the song, or the listen does not qualify
function setupListenIncrementMethod(){
  listenThreshold = 0.40 * ytplayer.getDuration() * 1000;
  //console.log('DURATION OF song is: ' + ytplayer.getDuration());
  //console.log('40% of song duration is: ' + listenThreshold);
  //console.log('this is the current track time: ' + ytplayer.getCurrentTime());
  var y = setTimeout(incrementListenCount, listenThreshold);
  Session.set('currentListenIncrementID', y);
  //alert('THIS IS THE CURRENT SONG: ' + Session.get('CS').st + ' - and this is the timeout value: ' + Session.get('currentListenIncrementID'));
  //incrementListenCount();
}

function toggleMute(){
  if(!ytplayer.isMuted())
    ytplayer.mute();
  else
    ytplayer.unMute();
}

function setPlayerVol(volNum){
  if(volNum >= 0 && volNum <= 100)
    ytplayer.setVolume(volNum);
}

function getPlayerVol(){
  if(ytplayer) {
    return ytplayer.getVolume();
  }
}

function loadVideoById(soundID){ //WAS USING currentSong previously but not anymore//, currentSong) {
  //var playpauseButton = $('.glyphicon-play');
  //playpauseButton.toggleClass('glyphicon-play glyphicon-pause');
  //var playpauseButton = $('.fa-play');
  var playpauseButton = $('.play.icon.playInControls');
  //playpauseButton.toggleClass('fa-play fa-pause');
  playpauseButton.toggleClass('play pause');
  //console.log('inside the video loader!!!');
	if(ytplayer) {
	  ytplayer.loadVideoById(soundID,0,"large")
	}

  clearTimeout(Session.get('listenSetupID'));
  clearTimeout(Session.get('currentListenIncrementID'));
  Session.set('listenSetupID', 0);
  Session.set('currentListenIncrementID', 0);
  var x = setTimeout(setupListenIncrementMethod, 5000);
  Session.set('listenSetupID', x);
  //console.log('CURRENT TIMEOUT VALUE ID: ' + x);
  //console.log('DURATION OF song is: ' + ytplayer.getDuration());
  //console.log('40% of song duration is: ' + 0.40 * ytplayer.getDuration());
  //analytics.track("load new YT song");
  amplitude.logEvent("load new YT song");
  ga('send', {
    hitType: 'event',
    eventCategory: 'songboard',
    eventAction: 'load new YT song',
    nonInteraction: true
  });
  //makeMuutCommentRelatedUpdates(soundID, currentSong);
}