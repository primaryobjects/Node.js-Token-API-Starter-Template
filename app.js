var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  api = require("./routes/api");

require("dotenv").config();

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan("dev"));

app.get("/", function(req, res) {
  res.send("Hello! The API is at http://localhost:" + port + "/api");
});

app.post("/api/login", api.login);

// Apply token verify middleware to all routes below this line.
app.use(api.auth);

app.get("/api", api.index);
app.get("/api/test", api.test);

app.listen(port);
console.log("Running at http://localhost:" + port);
