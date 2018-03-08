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
    let users = Meteor.users.find({}).fetch();
    shuffle(users);
    console.log(users);
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
// Actually register the method with Meteor's DDP system
Meteor.methods({
  [shuffleTargets.name]: function (args) {
    shuffleTargets.validate.call(this, args);
    shuffleTargets.run.call(this, args);
  }
});


shuffleTargets
