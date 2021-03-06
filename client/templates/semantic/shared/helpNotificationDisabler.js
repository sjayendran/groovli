//var notificationsEnabled = new ReactiveVar(false);

Template.helpNotificationDisabler.helpers({
	getNotifEnabledStatusForThisUser: function() {
		if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()))
		{
			if(!_.isUndefined(Meteor.user().notifsEnabled))
			{
				if(Meteor.user().notifsEnabled)
				{
					$('.helpNotificationDisabler.checkbox').checkbox('set checked');
					notificationsEnabled.set(true);
				}
				else
				{
					$('.helpNotificationDisabler.checkbox').checkbox('set unchecked');
					notificationsEnabled.set(false);
				}
			}
			else
			{
				//NOT YET set that means new user so notifications are not yet DISABLED so set it to checked
				$('.helpNotificationDisabler.checkbox').checkbox('check');
				notificationsEnabled.set(true);
			}
		}
	},

	activatePopups: function() {
		Meteor.setTimeout(activatePopups, 800);
	},

	notifsEnabled: function() {
		//return notificationsEnabled.get();
		return Session.get('uhne'); //user help notifications enabled
	},
	setupHelpNotificationToggle: function() {
		if(Session.get('uhne'))
		{
			$('.helpNotificationDisabler.checkbox').checkbox('set checked');
		}
		else if(!Session.get('uhne'))
		{
			$('.helpNotificationDisabler.checkbox').checkbox('set unchecked');
		}
	}
});

function activatePopups(){
	$('.helpNotificationDisabler').popup();
	
	$('.helpNotificationDisabler.checkbox')
	  .checkbox({
	    // check all children
	    onChecked: function() {
	      /*var
	        $childCheckbox  = $(this).closest('.checkbox').siblings('.list').find('.checkbox')
	      ;
	      $childCheckbox.checkbox('check');*/
	      //console.log('this is the checked METHOD!!!!');
	      Meteor.call('toggleHelpNotifications', Meteor.user()._id, true);
	      /*Meteor.call('toggleHelpNotifications', Meteor.user()._id, true, function(error,result){
			    if(error){
			        console.log(error.reason);
			    }
			    else{
			        console.log("SUCCESSFULLY switched on help notifications");
			    }
			});*/
	      return false;
	    },
	    // uncheck all children
	    onUnchecked: function() {
	      /*var
	        $childCheckbox  = $(this).closest('.checkbox').siblings('.list').find('.checkbox')
	      ;
	      $childCheckbox.checkbox('uncheck');*/
	      //console.log('this is the UNchecked METHOD!!!!');
	      Meteor.call('toggleHelpNotifications', Meteor.user()._id, false);
	      /*Meteor.call('toggleHelpNotifications', Meteor.user()._id, false, function(error,result){
			    if(error){
			        console.log(error.reason);
			    }
			    else{
			        console.log("SUCCESSFULLY switched OFF help notifications");
			    }
			});*/
	      return false;
	    }
	  })
	;
}
