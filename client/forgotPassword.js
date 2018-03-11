
Template.forgotPassword.events({
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault();

    var trimInput = function(val) {
        return val.replace(/^\s*|\s*$/g, "");
    }

    var isEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    var forgotPasswordForm = $(e.currentTarget),
        email = trimInput(forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase());

    if (email !== "" && isEmail(email)) {

      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            Bert.alert('This email does not exist.', "warning");
          } else {
            Bert.alert('We are sorry but something went wrong.', "error");
          }
        } else {
          Bert.alert('Email Sent. Check your mailbox.', "success");
        }
      });

    }
    return false;
  },
});
