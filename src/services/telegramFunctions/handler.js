const Markup = require('telegraf/markup');

const bot = require('../../telegram/bot');

async function handler(ctx) {
  const id = typeof ctx === 'number' ? ctx : ctx.from.id;

  await bot.telegram.sendMessage(
    id,
    'Обери кнопку:',
    Markup.inlineKeyboard([
      Markup.callbackButton("Під'єднатися до тесту", 'connectionToGroup'),
    ])
      .oneTime()
      .resize()
      .extra(),
  );
}

module.exports = handler;
