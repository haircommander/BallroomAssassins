const Announcements = new Mongo.Collection('announcements');

Template.announcements.onCreated(function announcementsOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('announcements.all');
  });
});

Template.announcements.helpers({
    announcements() {
        announcements =  Announcements.find({}, {sort: {date: -1}}).fetch();
        
        announcements.forEach( an => an["date"] = moment(an["date"]).fromNow() );
        return announcements;
    }
});

