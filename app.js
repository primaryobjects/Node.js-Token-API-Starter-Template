var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  jwt = require("jsonwebtoken");

require("dotenv").config();

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan("dev"));

app.get("/", function(req, res) {
  res.send("Hello! The API is at http://localhost:" + port + "/api");
});

var apiRoutes = express.Router();

apiRoutes.post("/token", function(req, res) {
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
});

// Verify auth token to /api requests. All /api routes below this middleware will be checked for a token!
apiRoutes.use(function(req, res, next) {
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
});

apiRoutes.get("/", function(req, res) {
  res.json({ message: "Welcome to the coolest API on earth!" });
});

apiRoutes.get("/hi", function(req, res) {
  res.json({ message: "Hello World!" });
});

// apply the routes to our application with the prefix /api
app.use("/api", apiRoutes);

app.listen(port);
console.log("Running at http://localhost:" + port);
