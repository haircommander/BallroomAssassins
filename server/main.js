Meteor.startup(() => {
    try {
        var id;
        id = Accounts.createUser({
            email: "fomeysurvant@gmail.com", 
            password: "defnotadmin",
            profile: { fullName: "Super Admin",
                       agentName: "Super Admin" }
        });
        Roles.addUsersToRoles(id, ['admin']);
    }
    catch(err) {console.log(err);}
});

