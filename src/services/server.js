const {X_Auth_Token: authToken} = require('../config');

async function checkAuthToken(req, res, next) {
  if (req.headers['x-auth-token'] !== authToken) {
    throw new Error('It is not valid');
  }
  next();
}

module.exports = {checkAuthToken};
