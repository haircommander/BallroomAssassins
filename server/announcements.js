const Announcements = new Mongo.Collection('announcements');

const addAnnouncement = {
  name: 'addAnnouncement',
  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      text: {type: String},
      agentName: {type: String}
    }).validate(args)
  },
  // Factor out Method body so that it can be called independently (3)
  run({ text, agentName }) {
    Announcements.insert({
        text: text,
        date: moment().format(),
        agentName: agentName
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


SyncedCron.add({
  name: "Send today's annoucements.",
  schedule: function(parser) {
    // parser is a later.parse object
    // return parser.text('every 5 seconds');
    //return parser.text('every 1 minutes');
    return parser.text('at 12:30 am');
  },
  job: function(intendedAt) {
    var today = moment().format();
    var yesterday = moment().subtract(1, 'days').format();
     
    var todaysAnnouncements = Announcements.find({date: {$lt: today, $gt: yesterday} }, {sort: {date: 1}}).fetch()
    var users = Meteor.users.find({"emails.verified": true}).fetch();
    if (todaysAnnouncements.length !== 0) {
        let announcements = "";
        todaysAnnouncements.forEach(an => {
            if (an.agentName === 'Admin') {
                announcements += "The Game Director sent the following message:\n" + an.text + "\n";
            } else {
            announcements += "Agent " + an.agentName + " passed today. Here are their dying words:\n" + an.text + "\n";
            }
        });
        users.forEach(user => {
            let text = "Hello Agent " + user.agentName + ",\nAnother day has concluded. Here are some things that are happening:\n" + announcements;
            if (!user.alive) {
                text += "\nAs always: don't reveal the identity of any assassins, but help trap any target you wish.";
            } else if (user.targetName.length !== 0) {
                text += "\nAs always: stay alert, travel in groups, and be armed at all times.";
                text += "Your current target is " + user.targetName + " and you have " + user.kills;
                if (user.kills === 1) {text += " kill\n";}
                else {text += " kills\n";}
                text += "Good luck!"
            } else {
                text += "\nStay tuned for more information on your target.";
            }
            text += "\n--Ballroom Assassins Game Director";
            Meteor.call('sendEmail',
                user.emails[0].address,
                'Ballroom Assassins Admin',
                "[Ballroom Assassins] Daily Debrief",
                text
            );            
        });
    }
    
  }
});
    /*
        Meteor.call(
          'sendEmail',
          'Peter <peterjh@umich.edu>',
          'umdbtassassins.gmail.com',
          'Hello from Meteor!',
          'This is a test of Email.send.'
        );   */ 
