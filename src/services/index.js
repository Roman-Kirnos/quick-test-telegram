const redis = require('./redis');
const client = require('./client');
const telegram = require('./telegramFunctions/telegram');
const handler = require('./telegramFunctions/handler');
const webhook = require('./telegramFunctions/webhook');

module.exports = {
  redis,
  client,
  telegram,
  handler,
  webhook,
};
