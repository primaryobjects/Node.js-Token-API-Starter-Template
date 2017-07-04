var config = {};

config.path404 = '/../../public/404/index.html';

config.user = {};
config.user.username = process.env.USER; // username for built-in login
config.user.password = process.env.PASS; // password for built-in login

config.token = {};
config.token.secret = process.env.SECRET; // password to encrypt tokens
config.token.expiration = 1200; // seconds
config.token.header = 'x-access-token'; // HTTP header containing a token to authenticate

module.exports = config;
