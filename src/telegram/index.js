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

bot.use(session());
bot.use(stage.middleware());
bot.use(i18n.middleware());

stagesArray.forEach(scene =>
  bot.action(scene.name, ctx => ctx.scene.enter(scene.name)),
);

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(auth, async ctx => {
  if (
    IN_START_REG_EXP_CHECK_CODE.test(
      ctx.message.text === undefined ? ' ' : ctx.message.text,
    )
  ) {
    const code = ctx.message.text.split(/ /, 2)[1];

    console.log(ctx.message.text);
    try {
      await sendToServerForConnectedToGroup(ctx, code);
    } catch (err) {
      throw new Error(`With check code in "/start code": ${err}`);
    }
  } else {
    try {
      await ctx.reply(ctx.i18n.t('start_menu'));

      await handler(Number(ctx.from.id));
    } catch (err) {
      throw new Error(`With handler or send message in "/start": ${err}`);
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
      } catch (err) {
        console.log(`With delete message in 'mainMenu': ${err}`);
        console.log(
          `Chat_id: ${ctx.update.callback_query.message.chat.id}, message_id: ${ctx.update.callback_query.message.message_id}`,
        );
      }
      await next(ctx);
    } catch (err) {
      throw new Error(`With action 'mainMenu': ${err}`);
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
    } catch (err) {
      throw new Error(
        `With delete message in 'callback_query': ${err}.\n  Chat_id: ${ctx.from.id}, message_id: ${ctx.update.callback_query.message.message_id}`,
      );
    }

    await sendAnswerFromUser({
      testId: data.testId,
      participantId: ctx.from.id,
      questionId: data.questionId,
      answer: data.answerId,
    });

    await ctx.reply(ctx.i18n.t('got_answer'));
  } catch (err) {
    throw new Error(
      `With parse or get, or send answer to server, 'callback_query': ${err}`,
    );
  }
});

module.exports = {
  launch: () => bot.launch(),
};
