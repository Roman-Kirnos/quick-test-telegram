const Markup = require('telegraf/markup');

const bot = require('../../telegram/bot');
const i18n = require('../../config/i18n.config.js');

async function handler(ctx) {
  const id = typeof ctx === 'number' ? ctx : ctx.from.id;

  await bot.telegram.sendMessage(
    id,
    i18n.t(i18n.currentLocale, 'select_button'),
    Markup.inlineKeyboard([
      Markup.callbackButton(
        i18n.t(i18n.currentLocale, 'connection_to_group'),
        'connectionToGroup',
      ),
    ])
      .oneTime()
      .resize()
      .extra(),
  );
}

module.exports = handler;
