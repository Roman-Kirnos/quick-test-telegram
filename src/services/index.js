const redis = require('./redis');
const client = require('./client');
const telegram = require('./telegram/otherFunctions');
const handler = require('./telegram/handler');
const webhook = require('./telegram/webhook');
const {checkAuthToken} = require('./server');

module.exports = {
  redis,
  client,
  telegram,
  handler,
  webhook,
  checkAuthToken,
};
