const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');

const {
  client: {checkCode},
  telegram: {deleteLastMessage},
} = require('../../services');

const name = 'connectionToGroup';

const scene = new WizardScene(
  name,
  async ctx => {
    await deleteLastMessage(
      ctx.update.callback_query.message.chat.id,
      ctx.update.callback_query.message.message_id,
    );

    await ctx.reply('Введіть код для підключення до тесту:');
    return ctx.wizard.next();
  },
  async ctx => {
    if (
      /^[a-zA-Z0-9]{6}$/.test(
        ctx.message.text === undefined ? ' ' : ctx.message.text,
      )
    ) {
      const res = await checkCode(
        ctx.message.text,
        ctx.message.from.id,
        ctx.message.from.first_name,
        ctx.from.last_name,
      );

      await ctx.reply(
        `Вас підключено до тесту "${res.data.testTitle}". Кількість запитань: ${res.data.count}. Чекайте початку тесту.`,
      );

      return ctx.scene.leave();
    }

    await ctx.reply(
      'Неправильно введено код! Виберіть дію:',
      Markup.inlineKeyboard([
        Markup.callbackButton('Спробувати ще', name),
        Markup.callbackButton('До меню', 'mainMenu'),
      ])
        .oneTime()
        .extra(),
    );

    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
