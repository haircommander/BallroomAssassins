Template.register.events({
    'click #register-button': function(e, t) {
        e.preventDefault();
        // Retrieve the input field values
        var email = $('#email').val(),
            fullName = $('#full-name').val(),
            agentName = $('#agent-name').val(),
            password = $('#password').val(),
            passwordAgain = $('#password-again').val();

        // Trim Helper
        var trimInput = function(val) {
            return val.replace(/^\s*|\s*$/g, "");
        }
        var email = trimInput(email);

        // Check password is at least 6 chars long
        var isValidPassword = function(pwd, pwd2) {
            if (pwd === pwd2) {
                if (pwd.length < 6) {
                    console.log("too short");
                    Bert.alert("Password must be at least 6 characters", "warning"); 
                    return false;
                }
                return true;
            } else {
                Bert.alert("Passwords don't match!", "warning");
            }
        }

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        if (isValidPassword(password, passwordAgain)) { 
            Accounts.createUser({
                email: email,
                fullName: fullName,
                agentName: agentName,
                password: password
            }, function(error) {
                if (error) {
                    Bert.alert(error.reason, "danger");
                } else {
                    Meteor.call( 'sendVerificationLink', ( error, response ) => {
                      if ( error ) {
                        Bert.alert(error.reason, "danger");
                      } else {
                        console.log("verification link sent!");
                        FlowRouter.go('/');
                      }
                    });
                }
            });
        }
    /*
        Meteor.call(
          'sendEmail',
          'Peter <peterjh@umich.edu>',
          'umdbtassassins.gmail.com',
          'Hello from Meteor!',
          'This is a test of Email.send.'
        );   */ 

        return false;
    }
});
