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
    let user = Meteor.users.findOne({_id: this.userId});
    if (killCode !== target.killCode) {
        throw new Meteor.Error('users.kills.wrongcode', "The user tried to kill with the incorrect code");
    }
    Meteor.users.update(this.userId, {
        $set: {targetId: target.targetId,
            kills: user.kills + 1,
            targetName: target.targetName
            }
    });
    Meteor.users.update({_id: id}, {
        $set: {alive: false, targetId: "", targetName: "", status: "no-obituary", killedby: user.agentName}
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

const finishObituary = {
  name: 'users.finishObituary',
  // Factor out validation so that it can be run independently (1)
  // Factor out Method body so that it can be called independently (3)
  run({}) {
    let user = Meteor.users.findOne({_id: this.userId});
    Meteor.users.update(this.userId, {
        $set: {status: ""}
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
  },
  [finishObituary.name]: function (args) {
    finishObituary.run.call(this, args);
  }
});

