Template.alive.onCreated(function aliveOnCreated() {
  this.amKilling = new ReactiveVar(false);
  this.amDying = new ReactiveVar(false);
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.agentName');
    Meteor.subscribe('Meteor.users.targetId');
    Meteor.subscribe('Meteor.users.kills');
    Meteor.subscribe('Meteor.users.targetName');
    Meteor.subscribe('Meteor.users.killCode');
  });
});

Template.alive.helpers({
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

Template.alive.events({
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
              killCode: killCode }
            , (err, res) => {
              if (err) {
                t.$(':input[type="submit"]').prop('disabled', false);
                Bert.alert(err.reason, "warning");
              } else {
                t.amKilling.set(false);
                t.$(':input[type="submit"]').prop('disabled', false);
                Bert.alert("Well done assassin, you now have your next assignment", "success");
              }
            });

            //t.$('button[type="submit"]').attr('disabled','enabled');
        }
        else {
            Bert.alert("You do not have a target yet! Please wait for the game to start", "warning");
        }
    },
    'click #change-kill-code': function(e, t) {
        e.preventDefault();
        var user = Meteor.user();
        var killCode = $('#kill-code-input').val();
        t.$(':input[type="submit"]').prop('disabled', true);
        Meteor.call('users.changeKillCode',
          {killCode: killCode }
        , (err, res) => {
          if (err) {
            Bert.alert(err.reason, "warning");
            t.$(':input[type="submit"]').prop('disabled', false);
          } else {
            Bert.alert("Kill code successfully changed!", "success");
            t.$(':input[type="submit"]').prop('disabled', false);
          }
        });
    }
});
