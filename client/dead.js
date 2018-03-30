Template.dead.onCreated(function deadOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.status');
    Meteor.subscribe('Meteor.users.agentName');
  });
});
Template.dead.helpers({
    obituary() {
        return Meteor.user().status === "no-obituary";  
    },
    ghost() {
        return Meteor.user().status === "ghost";
    }
)};

Template.dead.events({
    'click #submit-obituary': function(e, t) {
        e.preventDefault();
        var user = Meteor.user();
        var obituary = $('#obituary').val();
        Meteor.call('addAnnouncement',
          { text: obituary,
          agentName: user.agentName }
        , (err, res) => {
          if (err) {
            Bert.alert(err.reason, "warning");
          } else {
            Meteor.call('users.finishObituary', {}, (err, res) => {
                if (err) {
                    Bert.alert(err.reason, "failure");    
                } else {
                    Bert.alert("Thanks for your obituary", "success");
                }
            }); 
          }
        });
    }
});
