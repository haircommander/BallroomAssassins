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
    Meteor.call('kills.addKill', 
        {assFullName: user.fullName, assId: user._id, targetFullName: target.fullName, targetId: target._id}
    );
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
const changeKillCode = {
  name: 'users.changeKillCode',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      killCode: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ killCode }) {
    Meteor.users.update(this.userId, {
        $set: {killCode: killCode}
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

const undoKill = {
  name: 'users.undoKill',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      assId: {type: String},
      targetId: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ assId, targetId }) {
    let target = Meteor.users.findOne({_id: targetId});
    let ass = Meteor.users.findOne({_id: assId});
    console.log("TARGET: ", target, "\nUSER: ", ass);
    if (target && ass) {
        Meteor.users.update(targetId, {
            $set: {alive: true, targetId: ass.targetId, targetName: ass.targetName, status: "", killedby: ""}
        });
        target = Meteor.users.findOne({_id: targetId});
        Meteor.users.update(assId, {
            $set: {targetId: target._id,
                kills: ass.kills - 1,
                targetName: target.fullName
                }
        });
        ass = Meteor.users.findOne({_id: assId});
 
        let text = "Hello Agent " + target.agentName + "\n\n";
        text += "Your friendly neighborhood Game Director here, letting you know you know a dispute ended in your favor and you are back in the game!\n";
        text += "Your target is " + target.targetName + " and you have " + target.kills + " kill";
        if (target.kills !== 1) {text += 's';}
        text += ".\n\nUse your good fortune wisely, and play safe out there!\n";
        text += "Visit ballroom-assassins.herokuapp.com for more information.\nGood luck!\n\n--Assassins Game Director";
        Meteor.call('sendEmail',
            target.emails[0].address,
            'Ballroom Assassins Game Director',
            "[Ballroom Assassins] Dispute Result",
            text
        );            
    
        text = "Hello Agent " + ass.agentName + "\n\n";
        text += "Your friendly neighborhood Game Director here, letting you know a dispute ended against your favor and your old target is back in the game.\n";
        text += "Your target is " + ass.targetName + " and you have " + ass.kills + " kill";
        if (ass.kills !== 1) {text += 's';}
        text += ".\n\nHopefully you get them next time!\n"
        text += "Visit ballroom-assassins.herokuapp.com for more information.\nGood luck!\n\n--Assassins Game Director";
        Meteor.call('sendEmail',
            ass.emails[0].address,
            'Ballroom Assassins Game Director',
            "[Ballroom Assassins] Dispute Result",
            text
        );            
    } else {
        throw new Meteor.Error("problem in users.undoKill");
    }
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
  [changeKillCode.name]: function (args) {
    changeKillCode.validate.call(this, args);
    changeKillCode.run.call(this, args);
  },
  [undoKill.name]: function (args) {
    undoKill.validate.call(this, args);
    undoKill.run.call(this, args);
  },
  [finishObituary.name]: function (args) {
    finishObituary.run.call(this, args);
  }
});

