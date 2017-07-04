exports.method1 = function(req, res) {
  res.json({
    message: 'This is API method 1. Hello, ' + req.auth.username + '!'
  });
};

exports.method2 = function(req, res) {
  res.json({ message: 'This is API method 2. Do something interesting here.' });
};
