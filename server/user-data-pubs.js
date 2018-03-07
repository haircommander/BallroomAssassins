Meteor.publish('userData', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "profile": 1
          }
        });
    } else {
        return this.ready();
    }
});
