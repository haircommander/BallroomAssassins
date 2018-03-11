Template.resetPassword.onCreated(function() {
  //if (Accounts._resetPasswordToken) {
    var resetPassword = FlowRouter.getParam('token');
    Session.set('resetPassword', resetPassword);
    console.log('ResetPasswordtemplate : ' + resetPassword);
  //}
});

Template.resetPassword.helpers({
 resetToken: function(){
  return Session.get('resetPassword');
 }
});

Template.resetPassword.events({
  'submit #resetPasswordForm': function(e, t) {
    e.preventDefault();
    
    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();

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
    if (password !== "" && isValidPassword(password, passwordConfirm)) {
      Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
        if (err) {
          Bert.alert('We are sorry but something went wrong.', "error");
        } else {
          Bert.alert('Your password has been changed. Welcome back!', "success");
          Session.set('resetPassword', null);
          FlowRouter.go( '/' );
        }
      });
    }
    return false;
  }
});
