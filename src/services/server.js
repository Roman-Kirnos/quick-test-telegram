const {X_Auth_Token: authToken} = require('../config');
const log = require('../logger')(__filename);

async function checkAuthToken(req, res, next) {
  if (req.headers['x-auth-token'] !== authToken) {
    log.error({error: 'It is not valid'}, 'checkAuthToken');
  }
  next();
}

module.exports = {checkAuthToken};
