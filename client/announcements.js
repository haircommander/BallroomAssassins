const Announcements = new Mongo.Collection('announcements');

Template.announcements.onCreated(function announcementsOnCreated() {
  Tracker.autorun(() => {
    Meteor.subscribe('announcements.all');
  });
});

Template.announcements.helpers({
    announcements() {
        announcements =  Announcements.find({}, {sort: {createdAt: -1}}).fetch();
        console.log(announcements)
        return announcements;
    }
});

/*
Template.register.events({
    /*
        Meteor.call(
          'sendEmail',
          'Peter <peterjh@umich.edu>',
          'umdbtassassins.gmail.com',
          'Hello from Meteor!',
          'This is a test of Email.send.'
        );   

});
*/
