Template.home.onCreated(function homeOnCreated() {
  this.amKilling = new ReactiveVar(false);
  this.amDying = new ReactiveVar(false);
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
          _id: Meteor.user().profile.targetId
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
        var id = Meteor.user().profile.targetId;
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
