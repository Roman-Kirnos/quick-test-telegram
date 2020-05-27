const redis = require('./redis');
const client = require('./client');
const functionsForServer = require('./telegram/functionsForServer');
const otherFunctions = require('./telegram/otherFunctions');
const handler = require('./telegram/handler');
const webhook = require('./telegram/webhook');
const {checkAuthToken} = require('./server');

module.exports = {
  redis,
  client,
  telegram: {handler, functionsForServer, otherFunctions, webhook},
  checkAuthToken,
};
