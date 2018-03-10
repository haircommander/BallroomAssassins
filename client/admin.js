
Template.admin.events({
    'click #broadcast': function(e, t) {
        e.preventDefault();
        Meteor.call('sendAnnouncement',
          {}
        , (err, res) => {
          if (err) {
            Bert.alert(err.reason, "danger");
          } else {
            Bert.alert("Broadcast sent!", "success");
          }
        });
        console.log("shuffled!");
        //return false;
    },
    
    'click #leggo-button': function(e, t) {
        e.preventDefault();
        Meteor.call('admin.shuffleTargets',
          {}
        , (err, res) => {
          if (err) {
            Bert.alert(err.reason, "danger");
          } else {
            Bert.alert("We're going boys", "success");
          }
        });
        console.log("shuffled!");
        //return false;
    },
    'click #logout-button': function(e, t) {
        e.preventDefault();
        Meteor.logout(function(error) {
            if (error) {
                Bert.alert("there was an error!", "warning");
            } else {
                FlowRouter.go('/login');
            }
        });
        return false;
    },
    'click #announce': function(e, t) {
        e.preventDefault();
        let text = $('#announcement').val();
        console.log(text);
        Meteor.call( 'addAnnouncement', {text: text, agentName: "Admin"}, ( error, response ) => {
          if ( error ) {
             Bert.alert(error.reason + "Error adding announcement!", "warning");
          } else {
             Bert.alert("Annoucement Sent!", "success");
             $('#announcement').val("");
          }
        });
    }

});
