Template.admin.events({
    
    'click #leggo-button': function(e, t) {
        e.preventDefault();
        console.log("coming soon to a theater near you.");
        Meteor.call('admin.shuffleTargets',
          {}
        , (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success!
          }
        });
        console.log("shuffled!");
        //return false;
    }
});
