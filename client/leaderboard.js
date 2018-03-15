Template.leaderboard.onCreated(function leaderboardOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.leaderboard');
  });
});

Template.leaderboard.helpers({
    numUsers() {
        return Meteor.users.find({alive: true}).count();
    },
    users() {
        return Meteor.users.find({}, {sort: {kills: -1, alive: -1, agentName: 1}}).fetch();
    }
});
