const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');

const {
  telegram: {
    otherFunctions: {deleteLastMessage, sendToServerForConnectedToGroup},
  },
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
        await sendToServerForConnectedToGroup(ctx);
      } catch (err) {
        throw new Error(`In scene with check code: ${err}`);
      }

      return ctx.scene.leave();
    }

    try {
      await ctx.reply(
        'Не правильно введено код! Виберіть дію:',
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
