const Kills = new Mongo.Collection('kills');

Template.gamedirector.onCreated(function gamedirectorOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('kills.get');
  });
});

Template.gamedirector.helpers({
    kills() {
        return Kills.find({}, {sort: {createdAt: -1}});
    }
});


Template.gamedirector.events({
    'click #the-logout-button': function(e, t) {
        e.preventDefault();
        console.log("clicked!");
        Meteor.logout(function(error) {
            if (error) {
                Bert.alert("there was an error!", "warning");
            } else {
                FlowRouter.go('/login');
            }
        });
        return false;
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

