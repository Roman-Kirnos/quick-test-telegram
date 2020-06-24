const bot = require('../../telegram/bot');
const {BOT_WEBHOOK_CONNECT, SECRET_PATH} = require('../../config');
const log = require('../../logger')(__filename);

async function webhook(app) {
  try {
    app.use(bot.webhookCallback(SECRET_PATH));
    bot.telegram.setWebhook(BOT_WEBHOOK_CONNECT + SECRET_PATH);
  } catch (error) {
    log.fatal({error}, 'webhook');
  }
}

module.exports = webhook;
