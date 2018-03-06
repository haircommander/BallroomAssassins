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
     //if (!route.route.name == 'login') {
     //  Session.set ('redirectAfterLogin', route.path);
     //}
     FlowRouter.go('login');
   }
 }]
});

admin = loggedIn.group({
 prefix: "/admin",
 triggersEnter: [function(context, redirect) {
   if (!Roles.userIsInRole(Meteor.user()), [ 'admin' ]) {
     FlowRouter.go(FlowRouter.path('/'));
   }
 }]
});

loggedIn.route('/', {
    name: 'home',
    action: function(context, redirect) {
        BlazeLayout.render("mainLayout", {
            content: "home"
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
FlowRouter.notFound = {
 action: [function(context,redirect) { 
   BlazeLayout.render('notFound');
 }]
};
