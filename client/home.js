import { createUser } from '../server/user-info.js';
Template.home.onCreated(function homeOnCreated() {
  this.amKilling = new ReactiveVar(false);
  this.getUId = () => Meteor.user();

  this.autorun(() => {
    Meteor.subscribe('thisUser', this.getUId);
  });
  console.log(this.getUId);
});

Template.home.helpers({
    killing() {
        return Template.instance().amKilling.get();
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
        console.log("oh boy here I go killing again");
        instance.amKilling.set(true);
    },
    'submit .kill-form': function(e, t) {
        e.preventDefault();
        var tokill = $('#kill-form').val()
        console.log("kill ", toKill); 
    }
});
