const Kills = new Mongo.Collection('kills');

Meteor.publish('kills.get', function() {
    if (!Roles.userIsInRole(Meteor.user(), [ 'gamemanager' ])) {
     throw new Meteor.Error("gamemanager.wrong", "You're not allowed to do this");
    };
    return Kills.find({});
});
const addKill = {
  name: 'kills.addKill',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      assFullName: {type: String},
      assId: {type: String},
      targetFullName: {type: String},
      targetId: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ assFullName, assId, targetFullName, targetId }) {
    Kills.insert({assFullName: assFullName, assId: assId, targetFullName: targetFullName, targetId: targetId, createdAt: moment().format()});
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

const undoKill = {
  name: 'kills.undoKill',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      id: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ id }) {
    //Kills.remove({_id: id});
    let kill = Kills.findOne(id);
    console.log(kill);
    console.log(kill.assId, kill.targetId);
    Meteor.call("users.undoKill", {assId: kill.assId, targetId: kill.targetId}, (error, response) => {
        if (error) {
            console.log(error, "undo Kill error");
        } else {
            Kills.remove(id);
        }
    });
    /*
    Meteor.users.update(this.userId, {
        $set: {targetId: target.targetId,
            kills: user.kills + 1,
            targetName: target.targetName
            }
    });
    Meteor.users.update({_id: id}, {
        $set: {alive: false, targetId: "", targetName: "", status: "no-obituary", killedby: user.agentName}
    });
    */
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

    
Meteor.methods({
  [addKill.name]: function (args) {
    addKill.validate.call(this, args);
    addKill.run.call(this, args);
  },
  [undoKill.name]: function (args) {
    undoKill.validate.call(this, args);
    undoKill.run.call(this, args);
  }
});

