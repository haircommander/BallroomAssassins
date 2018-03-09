Meteor.startup(() => {
    try {
        process.env.MAIL_URL='smtps://umbdtassassins:Quackstep1516@smtp.gmail.com:465'
        var id;
        id = Accounts.createUser({
            email: "fomeysurvant@gmail.com", 
            password: "defnotadmin",
            fullName: "Super Admin",
            agentName: "Super Admin"
        });
        Meteor.users.update(id, {
            $set: {alive: false}
        });
        Roles.addUsersToRoles(id, ['admin']);
    }
    catch(err) {console.log(err);}
    SyncedCron.start();
});

