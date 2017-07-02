var jwt = require("jsonwebtoken");

exports.index = function(req, res) {
  res.json({ message: "Welcome to the coolest API on earth!" });
};

exports.test = function(req, res) {
  res.json({ message: "Hello World!" });
};

exports.login = function(req, res) {
  if (
    req.body.username === process.env.USER &&
    req.body.password === process.env.PASS
  ) {
    var user = { username: req.body.username };
    var token = jwt.sign(user, process.env.SECRET, { expiresIn: 60 });

    res.json({
      success: true,
      message: "Authentication success.",
      token: token
    });
  } else {
    res.status(401).json({ success: false, message: "Authentication failed." });
  }
};

exports.auth = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token." });
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
      message: "Missing token."
    });
  }
};
