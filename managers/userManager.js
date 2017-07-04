var config = require('../config/config');

UserManager = {
  load: function(username, password) {
    var user = null;

    // Just a simple static check for demo purposes. Validate a user against the database, etc.
    if (
      username === config.user.username &&
      password === config.user.password
    ) {
      user = { username: username };
    }

    return user;
  }
};
