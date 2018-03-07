Meteor.publish('userData', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "fullName": 1,
            "agentName": 1,
            "kills": 1
          }
        });
    } else {
        return this.ready();
    }
});
