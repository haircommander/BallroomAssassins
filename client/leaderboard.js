Template.leaderboard.onCreated(function leaderboardOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('Meteor.users.leaderboard');
  });
});

Template.leaderboard.helpers({
    users() {
        return Meteor.users.find({}, {sort: {kills: -1, fullName: 1}}).fetch();
    }
});
