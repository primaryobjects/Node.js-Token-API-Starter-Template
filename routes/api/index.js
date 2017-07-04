var config = require('../../config/config'),
  userManager = require('../../managers/userManager'),
  authManager = require('../../managers/authManager');

exports.index = function(req, res) {
  res.json({ message: 'Hello, ' + req.auth.username + '!' });
};

exports.method1 = function(req, res) {
  res.json({ message: 'This is API method 1. Do something interesting here.' });
};

exports.method2 = function(req, res) {
  res.json({ message: 'This is API method 2. Do something interesting here.' });
};

exports.token = function(req, res) {
  // Load the user from the database or return null if invalid. Replace this with your own method.
  var user = UserManager.load(req.body.username, req.body.password);

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
};

exports.auth = function(req, res, next) {
  // Check the header or url parameters or post parameters for a token.
  var token =
    req.body.token || req.query.token || req.headers[config.token.header];

  // Authenticate the token for this request.
  AuthManager.authenticate(token, function(result, err) {
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
