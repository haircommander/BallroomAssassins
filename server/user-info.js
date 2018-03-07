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
