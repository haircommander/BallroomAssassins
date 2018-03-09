Template.home.onCreated(function homeOnCreated() {
  this.amKilling = new ReactiveVar(false);
  this.amDying = new ReactiveVar(false);
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.agentName');
    Meteor.subscribe('Meteor.users.status');
    Meteor.subscribe('Meteor.users.alive');
    Meteor.subscribe('Meteor.users.kills');
    Meteor.subscribe('Meteor.users.targetName');
    Meteor.subscribe('Meteor.users.targetId');
    Meteor.subscribe('Meteor.users.killCode');
  });
});

Template.home.helpers({
    killing() {
        return Template.instance().amKilling.get();
    },
    pluralkill() {
        return Meteor.user().kills !== 1;
    },
    dying() {
        return Template.instance().amDying.get();
    }
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
    },
    'click #kill-button': function(e, instance) {
        e.preventDefault();
        instance.amKilling.set(true);
    },
    'click #die-button': function(e, instance) {
        e.preventDefault();
        instance.amDying.set(true);
    },
    'click #false-alarm-kill': function(e, instance) {
        e.preventDefault();
        instance.amKilling.set(false);
    },
    'click #false-alarm-die': function(e, instance) {
        e.preventDefault();
        instance.amDying.set(false);
    },

    'click #submit-obituary': function(e, t) {
        e.preventDefault();
        var user = Meteor.user();
        var obituary = $('#obituary').val();
        var id = user.targetId;
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
    },
    'click #finish-them': function(e, t) {
        e.preventDefault();
        var user = Meteor.user();
        var killCode = $('#kill-code').val();
        var id = user.targetId;
        if (user.targetName !== "" ) {
            Meteor.call('users.attemptKill',
              { id: id,
              killCode: killCode }
            , (err, res) => {
              if (err) {
                Bert.alert("You may have the wrong kill code!", "warning");
              } else {
                t.amKilling.set(false);
                Bert.alert("Well done assassin, you now have your next assignment", "success");
              }
            });
        }
        else {
            Bert.alert("You do not have a target yet! Please wait for the game to start", "warning");
            return err;
        }
    }
});
