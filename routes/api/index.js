var config = require('../../config/config'),
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
  // Generate a new token.
  AuthManager.generate(req, function(result, err) {
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
  // Authenticate the token for this request.
  AuthManager.authenticate(req, function(result, err) {
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
