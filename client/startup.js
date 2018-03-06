FlowRouter.wait();
Tracker.autorun(function() { 
  //if the roles subscription is ready, start routing
  //there are specific cases that this reruns, so we also check
  //that FlowRouter hasn't initalized already
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
     FlowRouter.initialize();
  }
  if (!Meteor.userId()) {
    if Session.get(‘loggedIn’) {
      //get and save the current route
      route = FlowRouter.current()
      Session.set('redirectAfterLogin', route.path);
      FlowRouter.go(FlowRouter.path('login'));
    }
  }
}

