const UserInfo = new Mongo.Collection('user-info');


Meteor.publish('thisUser', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return UserInfo.find({
          _id: currentUser
        }, {
          fields: {
            "agentName": 1,
            "kills": 1,
            "target": 1  
          }
        });
    } else {
        return this.ready();
    }
});

export const createUser = {
  name: 'user-info.createUser',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      fullName: {type: String},
      agentName: {type: String},
      id: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ id, fullName, agentName}) {
    UserInfo.insert({
        _id: id,
        fullName: fullName, 
        agentName: agentName, 
        kills: 0,
        killCode: Random.id(8),
        target: "" 
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
  [createUser.name]: function (args) {
    createUser.validate.call(this, args);
    createUser.run.call(this, args);
  }
});

