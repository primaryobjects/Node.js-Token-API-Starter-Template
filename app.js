var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  api = require('./routes/api'),
  error = require('./routes/error');

require('dotenv').config();

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.post('/api/token', api.token);

// Apply token verify middleware to all routes below this line.
app.use(api.auth);

// Authenticated api methods.
app.get('/api', api.index);

// 404 handler
app.all('*', error.error404);

app.listen(port);
console.log('Running at http://localhost:' + port);
