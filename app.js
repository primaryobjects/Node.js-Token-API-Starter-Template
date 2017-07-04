require('dotenv').config();

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  auth = require('./routes/auth'),
  api = require('./routes/api'),
  error = require('./routes/error');

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// Public route to authenticate a user and generate a token.
app.post('/auth', auth.index);

// Authenticated api methods.
app.use('/api', auth.token);
app.get('/api/method1', api.method1);
app.get('/api/method2', api.method2);

// 404 handler
app.all('*', error.error404);

app.listen(port);
console.log('Running at http://localhost:' + port);
