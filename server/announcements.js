const Announcements = new Mongo.Collection('announcements');

const addAnnouncement = {
  name: 'addAnnouncement',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      text: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ text }) {
    Announcements.insert({
        text: text,
        time: new Date() 
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
Meteor.publish('announcements.all', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Announcements.find({});
    } else {
        return this.ready();
    }
});

// Actually register the method with Meteor's DDP system
Meteor.methods({
  [addAnnouncement.name]: function (args) {
    addAnnouncement.validate.call(this, args);
    addAnnouncement.run.call(this, args);
  }
});

