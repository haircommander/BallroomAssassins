const attemptKill = {
  name: 'users.attemptKill',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      id: {type: String},
      killCode: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ id, killCode }) {
    let target = Meteor.users.findOne({_id: id});
    let current = Meteor.user(); 
    if (killCode !== target.profile.killCode) {
        throw new Meteor.Error('users.kills.wrongcode', "The user tried to kill with the incorrect code");
    }
    target.profile.alive = false
    Meteor.users.update({_id: id}, {
        $set: { profile: target.profile}
    });
    current.profile.targetId = target.profile.targetId;
    current.profile.kills += 1;
    current.profile.targetName = target.profile.targetName;
    Meteor.users.update(this.userId, {
        $set: { profile: current.profile}
    });
                
  },
  // Call Method by referencing the JS object (4)
  // Also, this lets us specify Meteor.apply options once in
  // the Method implementation, rather than requiring the caller
  // to specify it at the call site.
  call(args, callback) {
    const options = {
      returnStubValue: true,     // (5)
      throwStubExceptions: true  // (6)
    }
    Meteor.apply(this.name, [args], options, callback);
  }
};
// Actually register the method with Meteor's DDP system
Meteor.methods({
  [attemptKill.name]: function (args) {
    attemptKill.validate.call(this, args);
    attemptKill.run.call(this, args);
  }
});

