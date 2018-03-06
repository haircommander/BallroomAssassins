import { Meteor } from 'meteor/meteor';

//export const Name = new Mongo.Collection('colors');

export const addName = {
  name: 'name.addName',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
       name: {type: String},
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ name }) {
    Meteor.User().update({_id: this.userId}, {
        $set: { name: name }
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
  [addName.name]: function (args) {
    addName.validate.call(this, args);
    addName.run.call(this, args);
  }
});

