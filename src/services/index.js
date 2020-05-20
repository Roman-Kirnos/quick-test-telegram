const redis = require('./redis');
const client = require('./client');
const telegram = require('./telegramFunctions/telegram');
const handler = require('./telegramFunctions/handler');

module.exports = {
  redis,
  client,
  telegram,
  handler,
};
