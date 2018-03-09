Template.dead.onCreated(function deadOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.status');
    Meteor.subscribe('Meteor.users.agentName');
  });
});

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
            Bert.alert("Error adding annoucement", "warning");
          } else {
            Meteor.call('users.finishObituary', {}, (err, res) => {if (err) {console.log(err);}}); 
            Bert.alert("Thanks for your obituary", "success");
          }
        });
    }
});
