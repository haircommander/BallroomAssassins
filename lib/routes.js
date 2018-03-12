var exposed = FlowRouter.group({});
exposed.route('/login', {
    name: 'login',
    action: function() {
        BlazeLayout.render("mainLayout", {
            content: "login"
        });
    }
});

exposed.route('/register', {
    name: 'register',
    action: function() {
        BlazeLayout.render("mainLayout", {
            content: "register"
        });
    }
});


loggedIn = FlowRouter.group({
 triggersEnter: [function(context, redirect) {
   if (!Meteor.loggingIn() && !Meteor.userId()) {
     route = FlowRouter.current();
     if (!route.route.name == 'login') {
       Session.set ('redirectAfterLogin', route.path);
     }
     FlowRouter.go('login');
   }
 }]
});

admin = loggedIn.group({
 triggersEnter: [function(context, redirect) {
   if (!Roles.userIsInRole(Meteor.user(), [ 'admin' ])) {
     FlowRouter.go(FlowRouter.path('/'));
   }
 }]
});

gamedirector = loggedIn.group({
 triggersEnter: [function(context, redirect) {
   if (!Roles.userIsInRole(Meteor.user(), [ 'gamedirector' ])) {
     FlowRouter.go(FlowRouter.path('/'));
   }
 }]
});

// handling /admin route
admin.route('/admin', {
  name: 'admin',
  action: function(context, redirect) {
    BlazeLayout.render('mainLayout', {content: 'admin'});
  }
});

gamedirector.route('/gamedirector', {
  name: 'gamedirector',
  action: function(context, redirect) {
    BlazeLayout.render('mainLayout', {content: 'gamedirector'});
  }
});
gamedirector.route('/gamemanager', {
  name: 'gamemanager',
  action: function(context, redirect) {
    BlazeLayout.render('mainLayout', {content: 'gamedirector'});
  }
});

loggedIn.route('/', {
    name: 'home',
    action: function(context, redirect) {
        BlazeLayout.render("mainLayout", {
            content: "home"
        });
    }
});
FlowRouter.route('/rules', {
    name: 'home',
    action: function(context, redirect) {
        BlazeLayout.render("mainLayout", {
            content: "rules"
        });
    }
});


loggedIn.route('/logout', { 
  name: 'logout',
  action: [function(context, redirect) {
     Meteor.logout(function() { 
        FlowRouter.go(FlowRouter.path('login'));
     });
  }]
});
FlowRouter.route('/forgot-password', {
name: 'forgotpassword',
  action: function(context, redirect) {
      BlazeLayout.render("mainLayout", {
          content: "forgotPassword"
      });
  }

});

FlowRouter.route('/reset-password/:token', {
name: 'resetpassword',
  action: function(context, redirect) {
      BlazeLayout.render("mainLayout", {
          content: "resetPassword"
      });
  }
});


FlowRouter.notFound = {
 action: [function(context,redirect) { 
   BlazeLayout.render('notFound');
 }]
};
FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        Bert.alert('Error resending link, try again!', 'warning');
        return false;
      } else {
        FlowRouter.go( '/' );
        Bert.alert( 'Email verified! Thanks!', 'success' );
      }
    });
  }
});
