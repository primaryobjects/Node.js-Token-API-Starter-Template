var jwt = require('jsonwebtoken'),
  config = require('../config/config');

AuthManager = {
  generate: function(user, callback) {
    if (user) {
      var token = jwt.sign(user, config.token.secret, {
        expiresIn: config.token.expiration
      });

      var expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + config.token.expiration);

      if (callback) {
        callback(null, { token: token, expiration: expiration });
      }
    } else {
      if (callback) {
        callback('Authentication failed.');
      }
    }
  },

  authenticate: function(token, callback) {
    // Decode the token.
    if (token) {
      // Verify the secret and check the expiration time.
      jwt.verify(token, config.token.secret, function(err, payload) {
        var result = null;

        if (err) {
          if (callback) {
            callback({ name: 'InvalidToken', message: 'Invalid token.' });
          }
        } else {
          // Valid token.
          if (callback) {
            callback(null, payload);
          }
        }
      });
    } else {
      // If no token is provided, return an error.
      if (callback) {
        callback({ name: 'MissingToken', message: 'Missing token.' });
      }
    }
  }
};
