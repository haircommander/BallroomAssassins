function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}

const shuffleTargets = {
  name: 'admin.shuffleTargets',
  // Factor out validation so that it can be run independently (1)
  validate() {
   if (!Roles.userIsInRole(Meteor.user(), [ 'admin' ])) {
    throw new Meteor.Error("admin.wrong", "You're not allowed to do this");
   };
  },
  // Factor out Method body so that it can be called independently (3)
  run({}) {
    let users = Meteor.users.find({alive: true}).fetch();
    shuffle(users);
    let target = users[users.length - 1];
    users.forEach(user => {
        Meteor.users.update({_id: user._id}, {
            $set: { targetId: target._id,
                    targetName: target.fullName}
        });
        target = user;
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
const assignGhosts = {
  name: 'admin.assignGhosts',
  // Factor out validation so that it can be run independently (1)
  validate() {
   if (!Roles.userIsInRole(Meteor.user(), [ 'admin' ])) {
    throw new Meteor.Error("admin.wrong", "You're not allowed to do this");
   };
  },
  // Factor out Method body so that it can be called independently (3)
  run({}) {
    let users = Meteor.users.find({alive: true, kills: 0}).fetch();
    let ghosts = Meteor.users.find({alive: false, status: {$ne: "no-obituary"}, kills: {$ne: -1}}).fetch();
    if (ghosts) {
      shuffle(users);
      let i = 0;
      ghosts.forEach(ghost => {
        let ghostKills = (ghost.ghostKills) ? ghost.ghostKills : 0;
        Meteor.users.update({_id: ghost._id}, {
          $set: { 
            targetId: users[i % users.length]._id,
            targetName: users[i % users.length].fullName,
            ghostKills: ghostKills,
            status: "ghost"
          }
        });
        let text = "Hello Agent " + ghost.agentName + ",\n\nYou have been assigned a target as a ghost! "
        text += "Your current target is " + users[i % users.length].fullName;
        text += ".\nRemember, making a kill as a ghost does not increase your total kill count, but ghost kills will be tracked, which means you can win in ghost kills.";
        Meteor.call('sendEmail',
            ghost.emails[0].address,
            'Ballroom Assassins Admin',
            "[Ballroom Assassins] Ghost Assignment",
            text
        );
        i += 1;
      });
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
// Actually register the method with Meteor's DDP system
Meteor.methods({
  [shuffleTargets.name]: function (args) {
    shuffleTargets.validate.call(this, args);
    shuffleTargets.run.call(this, args);
  },
  [assignGhosts.name]: function (args) {
    assignGhosts.validate.call(this, args);
    assignGhosts.run.call(this, args);
  }
});

