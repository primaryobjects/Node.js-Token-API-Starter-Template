var jwt = require('jsonwebtoken');
var config = require('../../config/config');

exports.index = function(req, res) {
  res.json({ message: 'Hello, ' + req.decoded.username + '!' });
};

exports.token = function(req, res) {
  if (
    req.body.username === process.env.USER &&
    req.body.password === process.env.PASS
  ) {
    var user = { username: req.body.username };
    var token = jwt.sign(user, process.env.SECRET, {
      expiresIn: config.tokenExpirationSeconds
    });

    var expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + config.tokenExpirationSeconds
    );

    res.json({
      success: true,
      message: 'Authentication success.',
      expiration: expiration,
      token: token
    });
  } else {
    res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
};

exports.auth = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({
      success: false,
      message: 'Missing token.'
    });
  }
};
