Template.admin.events({
    
    'click #leggo-button': function(e, t) {
        e.preventDefault();
        console.log("coming soon to a theater near you.");
/*
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
  */
        //return false;
    }
});
