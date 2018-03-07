Template.home.onCreated(function homeOnCreated() {
  this.amKilling = new ReactiveVar(false);
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
    'click #finish-them': function(e, t) {
        e.preventDefault();
        var tokill = $('#kill-code').val();
        console.log("kill ", tokill); 
    }
});
