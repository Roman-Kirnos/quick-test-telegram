const session = require('telegraf/session');

const bot = require('./bot');
const auth = require('./auth');
const {stage, stagesArray} = require('./scenes');
const {
  redis,
  client: {sendAnswerFromUser},
  telegram: {
    handler,
    otherFunctions: {deleteLastMessage, sendToServerForConnectedToGroup},
  },
} = require('../services');
const {IN_START_REG_EXP_CHECK_CODE} = require('../config');
const i18n = require('../config/i18n.config.js');
const log = require('../logger')(__filename);

bot.use(session());
bot.use(stage.middleware());
bot.use(i18n.middleware());

stagesArray.forEach(scene =>
  bot.action(scene.name, ctx => ctx.scene.enter(scene.name)),
);

bot.catch((error, ctx) => {
  log.error({error, ctx}, 'Something bot error!');
});

bot.start(auth, async ctx => {
  if (
    IN_START_REG_EXP_CHECK_CODE.test(
      ctx.message.text === undefined ? ' ' : ctx.message.text,
    )
  ) {
    const code = ctx.message.text.split(/ /, 2)[1];

    try {
      await sendToServerForConnectedToGroup(ctx, code);
    } catch (error) {
      log.error({error}, '/start: sendToServerForConnectedToGroup');
    }
  } else {
    try {
      await ctx.reply(ctx.i18n.t('start_menu'));

      await handler(Number(ctx.from.id));
    } catch (error) {
      log.error({error}, '/start');
    }
  }
});

bot.action(
  'mainMenu',
  async (ctx, next) => {
    try {
      await ctx.answerCbQuery();
      try {
        await deleteLastMessage(
          ctx.update.callback_query.message.chat.id,
          ctx.update.callback_query.message.message_id,
        );
      } catch (error) {
        log.error({error}, 'mainMenu: deleteLastMessage');
      }
      await next(ctx);
    } catch (error) {
      log.error({error}, 'mainMenu');
    }
  },
  handler,
);

bot.on('callback_query', async ctx => {
  try {
    const data = JSON.parse(ctx.callbackQuery.data);

    await ctx.answerCbQuery();

    try {
      await redis.deleteUserMessageId(ctx.from.id);

      await deleteLastMessage(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
      );
    } catch (error) {
      log.error(
        {
          error,
          id: ctx.from.id,
          message_id: ctx.update.callback_query.message.message_id,
        },
        'callback_query: deleteLastMessage',
      );
    }

    await sendAnswerFromUser({
      testId: data.testId,
      participantId: ctx.from.id,
      questionId: data.questionId,
      answer: data.answerId,
    });

    await ctx.reply(ctx.i18n.t('got_answer'));
  } catch (error) {
    log.error({error}, 'callback_query');
  }
});

module.exports = {
  launch: () => bot.launch(),
};
