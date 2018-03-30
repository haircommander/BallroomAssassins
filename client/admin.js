Template.admin.events({
    'click #broadcast': function(e, t) {
        e.preventDefault();
        t.$(':input[type="submit"]').prop('disabled', true);
        Meteor.call('sendAnnouncement',
          {}
        , (err, res) => {
          if (err) {
            Bert.alert(err.reason, "danger");
            t.$(':input[type="submit"]').prop('disabled', false);
          } else {
            Bert.alert("Broadcast sent!", "success");
            t.$(':input[type="submit"]').prop('disabled', false);
          }
        });
        //return false;
    },
    
    'click #leggo-button': function(e, t) {
        e.preventDefault();
        t.$(':input[type="submit"]').prop('disabled', true);
        Meteor.call('admin.shuffleTargets',
          {}
        , (err, res) => {
          if (err) {
            Bert.alert(err.reason, "danger");
            t.$(':input[type="submit"]').prop('disabled', false);
          } else {
            Bert.alert("We're going boys", "success");
            t.$(':input[type="submit"]').prop('disabled', false);
          }
        });
        //return false;
    },
    'click #ghost-button': function(e, t) {
        e.preventDefault();
        t.$(':input[type="submit"]').prop('disabled', true);
        Meteor.call('admin.assignGhosts',
          {}
        , (err, res) => {
          if (err) {
            Bert.alert(err.reason, "danger");
            t.$(':input[type="submit"]').prop('disabled', false);
          } else {
            Bert.alert("ghosts assigned", "success");
            t.$(':input[type="submit"]').prop('disabled', false);
          }
        });
    },
    'click #logout-button': function(e, t) {
        e.preventDefault();
        Meteor.logout(function(error) {
            if (error) {
                Bert.alert("there was an error!", "warning");
            } else {
                FlowRouter.go('/login');
            }
        });
        return false;
    },
    'click #announce': function(e, t) {
        e.preventDefault();
        let text = $('#announcement').val();
        t.$(':input[type="submit"]').prop('disabled', true);
        Meteor.call( 'addAnnouncement', {text: text, agentName: "Admin"}, ( error, response ) => {
          if ( error ) {
             Bert.alert(error.reason + "Error adding announcement!", "warning");
             t.$(':input[type="submit"]').prop('disabled', false);
          } else {
             Bert.alert("Annoucement Sent!", "success");
             $('#announcement').val("");
             t.$(':input[type="submit"]').prop('disabled', false);
          }
        });
    }
});
