const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');

const {
  telegram: {
    otherFunctions: {deleteLastMessage, sendToServerForConnectedToGroup},
  },
} = require('../../services');
const {REG_EXP_CHECK_CODE} = require('../../config');
const i18n = require('../../config/i18n.config.js');
const log = require('../../logger')(__filename);

const name = 'connectionToGroup';

const scene = new WizardScene(
  name,
  async ctx => {
    try {
      await deleteLastMessage(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
      );
    } catch (error) {
      log({error}, 'connectionToGroup: deleteLastMessage');
    }

    await ctx.reply(i18n.t(i18n.currentLocale, 'enter_code'));

    return ctx.wizard.next();
  },
  async ctx => {
    if (
      REG_EXP_CHECK_CODE.test(
        ctx.message.text === undefined ? ' ' : ctx.message.text,
      )
    ) {
      try {
        await sendToServerForConnectedToGroup(ctx);
      } catch (error) {
        log.error(
          {error},
          'connectionToGroup: sendToServerForConnectedToGroup',
        );
      }

      return ctx.scene.leave();
    }

    try {
      await ctx.reply(
        i18n.t(i18n.currentLocale, 'choice_action_if_code_incorrect'),
        Markup.inlineKeyboard([
          Markup.callbackButton(i18n.t(i18n.currentLocale, 'try_again'), name),
          Markup.callbackButton(
            i18n.t(i18n.currentLocale, 'go_to_menu'),
            'mainMenu',
          ),
        ])
          .oneTime()
          .extra(),
      );
    } catch (error) {
      log.error({error}, 'connectionToGroup: choice_action_if_code_incorrect');
    }

    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
