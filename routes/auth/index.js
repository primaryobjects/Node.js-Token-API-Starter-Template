var config = require('../../config/config'),
  userManager = require('../../managers/userManager'),
  authManager = require('../../managers/authManager');

var getToken = function(req) {
  // Check the header or url parameters or post parameters for a token.
  return req.body.token || req.query.token || req.headers[config.token.header];
};

exports.index = function(req, res) {
  // Try to load the user from an existing token.
  AuthManager.authenticate(getToken(req), function(token, err) {
    var user = null;

    if (!err) {
      // Use the user object from the token.
      user = token;

      // Remove token-specific values, keeping just the user.
      delete user.iat;
      delete user.exp;

      console.log(JSON.stringify(token));
    }

    // Load the user from the token or the database. User is null if not found. Replace this with your own method for validating a user!
    user = user || UserManager.load(req.body.username, req.body.password);

    // Generate a new token.
    AuthManager.generate(user, function(result, err) {
      if (err) {
        return res.status(401).send({ success: false, message: err });
      } else {
        return res.send({
          success: true,
          token: result.token,
          expiration: result.expiration
        });
      }
    });
  });
};

exports.token = function(req, res, next) {
  // Authenticate the token for this request.
  AuthManager.authenticate(getToken(req), function(result, err) {
    if (err) {
      var output = { success: false };
      var status = 401;

      switch (err.name) {
        case 'MissingToken':
          output.message = 'Missing token.';
          status = 403;
          break;
        case 'TokenExpiredError':
          output.message = 'Token expired.';
          break;
        default:
          output.message = 'Invalid token.';
          break;
      }

      return res.status(status).send(output);
    } else {
      // Valid token. Save the decoded information in the request for other routes to use.
      req.auth = result;
      next();
    }
  });
};
