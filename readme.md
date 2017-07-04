Node.js Token API Starter Template
==================================

A quick and easy node.js template project for creating an API with token-based authentication.

## Usage

- Clone repository.
- Open a command prompt, navigate to the folder, and enter: `npm install`
- Next, run the app by entering: `node app`
- Browse to http://localhost:8080
- Obtain a token.
  
  ```
  POST /api/token
  { username: user, password: pass }
  ```

- Call API methods by including your token in the HTTP header or url.

  ```
  x-access-token=abc123
  ```

  ```
  /api/method1?token=abc123
  /api/method2?token=abc123
  /api/method3?token=abc123
  ```

## Generating a Token

The url `/api/token` allows the client (i.e., your javascript application) to generate an authentication token which can be used to access API methods.

To generate a token, call `POST /api/token`. Include a username and password or existing valid token as a JSON object within the form data. The format is shown below.

```
{ username: 'user', password: 'pass' }
```

or

```
{ token: 'abc123' }
```


The username and password can be validated against your database or other means. If successful, a [JSON web token](https://www.npmjs.com/package/json-web-token) is returned in the response. The token contains an expiration time as configured in [config.js](config/config.js).

The client code (i.e., your javascript application) can store the token for subsequent calls to the API. Each API call should contain the token within the url or HTTP header.

## Validating a Username and Password

The demo code includes a simple [method](managers/userManager.js) for validating the username and password before generating a token. The template project simply checks the username and password against the one configured in [config.js](config/config.js). You'll probably want to change this to check against your database or other method for validating a user. Just edit the code in the [token](routes/index.js) method to call your own method for validating the user.

## Keeping Track of Expiration Time

Since tokens have an expiration time, the client code should keep track of when the current token expires. Before expiring, the client can request a new token by making a `POST` request to `/api/token`, including the existing token in the JSON object (instead of a username/password). Otherwise, if the token expires, the client will need to login with a username/password to obtain a new token.

You can only request a new token if your existing token is due to expire within the next 5 minutes. This value is configurable in [config.js](config/config.js).

## Adding API Methods

API methods can be added as routes within [app.js](app.js). The code for each API method can be added within the route handler code [index.js](routes/api/index.js). Several example API stub methods are provided.

### /api/method1

Example API method 1. This method requires a valid token.

### /api/method2

Example API method 2. This method requires a valid token.

### /api/method3

Example API method 3. This method requires a valid token.

## License

MIT

## Author

Kory Becker

http://www.primaryobjects.com/kory-becker