Template.login.events({
    'click #login-button': function(e, t) {
        e.preventDefault();
        var email = $('#login-email').val(),
            password = $('#login-password').val();

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                Bert.alert("Incorrect email or password, try again!", "danger");
            } else {
                FlowRouter.go('/');
            }
        });
        return false;
    }
});
