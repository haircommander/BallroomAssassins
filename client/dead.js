Template.dead.onCreated(function deadOnCreated() {
  this.amKilling = new ReactiveVar(false);
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.status');
    Meteor.subscribe('Meteor.users.agentName');
    Meteor.subscribe('Meteor.users.targetId');
    Meteor.subscribe('Meteor.users.targetName');
  });
});
Template.dead.helpers({
    obituary() {
        return Meteor.user().status === "no-obituary";  
    },
    ghost() {
        return Meteor.user().status === "ghost";
    },
    killing() {
        return Template.instance().amKilling.get();
    },
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
    },
    'click #false-alarm-kill': function(e, instance) {
        e.preventDefault();
        instance.amKilling.set(false);
    },
    'click #kill-button': function(e, instance) {
        e.preventDefault();
        instance.amKilling.set(true);
    },
    'click #finish-them': function(e, t) {
        e.preventDefault();
        var user = Meteor.user();
        var killCode = $('#kill-code').val();
        var id = user.targetId;
        if (user.targetName !== "" ) {
            Bert.alert("Kill submitted, wait a moment to see how it went.", "default");
            t.$(':input[type="submit"]').prop('disabled', true);
            Meteor.call('users.attemptKill',
              { id: id,
              killCode: killCode,
              ghost: true }
            , (err, res) => {
              if (err) {
                t.$(':input[type="submit"]').prop('disabled', false);
                Bert.alert(err.reason, "warning");
              } else {
                t.amKilling.set(false);
                t.$(':input[type="submit"]').prop('disabled', false);
                Bert.alert("Well done ghost, your next assignment will be sent when targets are reassigned.", "success");
              }
            });

            //t.$('button[type="submit"]').attr('disabled','enabled');
        }
        else {
            Bert.alert("You do not have a target yet! Please wait for the game to start", "warning");
        }
    },
});
