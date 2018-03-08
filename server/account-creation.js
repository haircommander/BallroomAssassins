Accounts.onCreateUser(function(options, user) {
    // Use provided profile in options, or create an empty profile object
    user.profile = options.profile || {};
    /*
    user._id = Random.id();
    createUser.call({
        id: user._id,
        fullName: options.fullName,
        agentName: options.agentName 
    });
    */
    // Assigns the first and last names to the newly created user object
    user.fullName = options.fullName;
    user.agentName = options.agentName;
    user.kills = 0;
    user.killCode = Random.id(8);
    user.targetId = "";
    user.targetName = "";
    user.alive = true;

    //Basic Role Set Up
    user.roles = ["User"];

    // Returns the user object
    return user;
});
