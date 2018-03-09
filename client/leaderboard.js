Template.leaderboard.onCreated(function leaderboardOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.leaderboard');
  });
});

Template.leaderboard.helpers({
    users() {
        return Meteor.users.find({roles: {$size: 1}}).fetch();
    }
});