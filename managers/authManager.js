var jwt = require('jsonwebtoken'),
  config = require('../config/config');

AuthManager = {
  generate: function(req, callback) {
    if (
      req.body.username === config.user.username &&
      req.body.password === config.user.password
    ) {
      var user = { username: req.body.username };
      var token = jwt.sign(user, config.token.secret, {
        expiresIn: config.token.expiration
      });

      var expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + config.token.expiration);

      if (callback) {
        callback({ token: token, expiration: expiration });
      }
    } else {
      if (callback) {
        callback(null, 'Authentication failed.');
      }
    }
  },

  authenticate: function(req, callback) {
    // Check the header or url parameters or post parameters for a token.
    var token =
      req.body.token || req.query.token || req.headers[config.token.header];

    // Decode the token.
    if (token) {
      // Verify the secret and check the expiration time.
      jwt.verify(token, config.token.secret, function(err, payload) {
        var result = null;

        if (err) {
          if (callback) {
            callback(null, err);
          }
        } else {
          // Valid token.
          if (callback) {
            callback(payload);
          }
        }
      });
    } else {
      // If no token is provided, return an error.
      if (callback) {
        callback(null, { name: 'MissingToken', message: 'Missing token.' });
      }
    }
  }
};
