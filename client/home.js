Template.home.onCreated(function homeOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.agentName');
    Meteor.subscribe('Meteor.users.alive');
  });
});

Template.home.events({
     'click .resend-verification-link' ( event, template ) {
       Meteor.call( 'sendVerificationLink', ( error, response ) => {
         if ( error ) {
            Bert.alert("Error sending link", "warning");
         } else {
            Bert.alert("email sent success!", "success");
         }
       });
     },
    'click #logout-button': function(e, t) {
        e.preventDefault();
        Meteor.logout(function(error) {
            if (error) {
                Bert.alert("Sorry, there was an error logging out!", "warning");
                return false;
            } else {
                FlowRouter.go('/login');
            }
        });
        return false;
    }
});
