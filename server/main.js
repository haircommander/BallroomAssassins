Meteor.startup(() => {
    process.env.MAIL_URL='smtps://umbdtassassins:Quackstep1516@smtp.gmail.com:465'
    try {
        var id;
        id = Accounts.createUser({
            email: "saharsh@umich.edu", 
            password: "Quackstep1516",
            fullName: "Game Director",
            agentName: "GD"
        });
        Meteor.users.update(id, {
            $set: {alive: false, kills: -1}
        });
        Roles.addUsersToRoles(id, ['gamedirector']);
    } catch (err){}
    try {
        var id;
        id = Accounts.createUser({
            email: "fomeysurvant@gmail.com", 
            password: "defnotadmin",
            fullName: "Super Admin",
            agentName: "Super Admin"
        });
        Meteor.users.update(id, {
            $set: {alive: false, kills: -1}
        });
        Roles.addUsersToRoles(id, ['admin']);
    }
    catch(err) {}
});

