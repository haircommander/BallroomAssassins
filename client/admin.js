const Kills = new Mongo.Collection('kills');

Template.admin.onCreated(function adminOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('kills.get');
  });
});

Template.admin.helpers({
    kills() {
        return Kills.find({});
    }
});

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
        Meteor.call( 'addAnnouncement', {text: text, agentName: "Admin"}, ( error, response ) => {
          if ( error ) {
             Bert.alert(error.reason + "Error adding announcement!", "warning");
          } else {
             Bert.alert("Annoucement Sent!", "success");
             $('#announcement').val("");
          }
        });
    },
    'click #undo': function(e, t) {
        e.preventDefault();
        Meteor.call("kills.undoKill", {id: e.target.parentNode.id}, (error, response) => {
          if ( error) {
            Bert.alert(error.reason + "Error removing kill", "warning");
          } else {
            Bert.alert("Kill undone!", "success"); 
          }
        });
    }

});
