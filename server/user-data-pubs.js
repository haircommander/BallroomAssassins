Meteor.publish('Meteor.users.fullName', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "fullName": 1,
          }
        });
    } else {
        return this.ready();
    }
});

Meteor.publish('Meteor.users.status', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "status": 1,
            "killedby": 1
          }
        });
    } else {
        return this.ready();
    }
});

Meteor.publish('Meteor.users.agentName', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "agentName": 1,
          }
        });
    } else {
        return this.ready();
    }
});
Meteor.publish('Meteor.users.kills', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "kills": 1,
          }
        });
    } else {
        return this.ready();
    }
});
Meteor.publish('Meteor.users.killCode', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "killCode": 1,
          }
        });
    } else {
        return this.ready();
    }
});
Meteor.publish('Meteor.users.targetId', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "targetId": 1,
          }
        });
    } else {
        return this.ready();
    }
});

Meteor.publish('Meteor.users.targetName', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "targetName": 1,
          }
        });
    } else {
        return this.ready();
    }
});
Meteor.publish('Meteor.users.alive', function() {
    var currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
          _id: currentUser
        }, {
          fields: {
            "alive": 1,
          }
        });
    } else {
        return this.ready();
    }
});


Meteor.publish('Meteor.users.leaderboard', function() {
    if (this.userId) {
      return Meteor.users.find({roles: {$size: 1}}, {sort: {kills: -1, fullName: 1}, fields: {agentName: 1, kills: 1, alive: 1}});
    } else {
        return this.ready();
    }
});
