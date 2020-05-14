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
    try {
      await deleteLastMessage(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
      );

      await ctx.reply('Введіть код для підключення до тесту:');
    } catch (err) {
      throw new Error(`Error with delete message in connectionToGroup: ${err}`);
    }
    return ctx.wizard.next();
  },
  async ctx => {
    if (
      /^[a-zA-Z0-9]{6}$/.test(
        ctx.message.text === undefined ? ' ' : ctx.message.text,
      )
    ) {
      try {
        const res = await checkCode(
          ctx.message.text,
          ctx.message.from.id,
          ctx.message.from.first_name,
          ctx.from.last_name,
        );

        await ctx.reply(
          `Вас підключено до тесту "${res.data.testTitle}". Кількість запитань: ${res.data.count}. Чекайте початку тесту.`,
        );
      } catch (err) {
        throw new Error(`Error with get res, scene connectionToGroup: ${err}`);
      }

      return ctx.scene.leave();
    }

    try {
      await ctx.reply(
        'Неправильно введено код! Виберіть дію:',
        Markup.inlineKeyboard([
          Markup.callbackButton('Спробувати ще', name),
          Markup.callbackButton('До меню', 'mainMenu'),
        ])
          .oneTime()
          .extra(),
      );
    } catch (err) {
      throw new Error(`Error with send buttons in scene: ${err}`);
    }

    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
