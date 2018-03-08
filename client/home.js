Template.home.onCreated(function homeOnCreated() {
  this.amKilling = new ReactiveVar(false);
  this.amDying = new ReactiveVar(false);
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.agentName');
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
    dying() {
        return Template.instance().amDying.get();
    },
    target() {
        return Meteor.users.findOne({
          _id: Meteor.user().targetId
        }, {
          fields: {fullName: 1 }
        });
    }
         
});

Template.home.events({
    'click #logout-button': function(e, t) {
        e.preventDefault();
        Meteor.logout(function(error) {
            if (error) {
                return swal({
                    title: "There was an error",
                    text: "Sorry! There was an error logging out, try again!",
                    timer: 1700,
                    showConfirmButton: false,
                    type: "error"
                });
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
   'click #finish-them': function(e, t) {
        e.preventDefault();
        var killCode = $('#kill-code').val();
        var id = Meteor.user().targetId;
        Meteor.call('users.attemptKill',
          { id: id,
          killCode: killCode }
        , (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success!
          }
        });

        
    }
});
