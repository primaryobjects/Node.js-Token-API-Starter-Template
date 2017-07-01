var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  jwt = require("jsonwebtoken");

require("dotenv").config();

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan("dev"));

app.get("/", function(req, res) {
  res.send("Hello! The API is at http://localhost:" + port + "/api");
});

app.listen(port);
console.log("Running at http://localhost:" + port);
