const session = require('telegraf/session');

const bot = require('./bot');
const auth = require('./auth');
const {stage, stagesArray} = require('./scenes');
const {
  redis,
  client: {sendAnswerFromUser},
  telegram: {deleteLastMessage, sendToServerForConnectedToGroup},
  handler,
} = require('../services');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach(scene =>
  bot.action(scene.name, ctx => ctx.scene.enter(scene.name)),
);

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(auth, async ctx => {
  if (
    /^\/start [a-zA-Z0-9]{6}$/.test(
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
      await ctx.reply('Привіт! Тебе вітає чат-бота для швидкого тесту.');

      await handler(ctx.from.id);
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

      await deleteLastMessage(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
      );

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

    await redis.deleteUserMessageId(ctx.from.id);
    await deleteLastMessage(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
    );

    await sendAnswerFromUser({
      testId: data.testId,
      participantId: ctx.from.id,
      questionId: data.questionId,
      answer: [data.answerId],
    });

    await ctx.reply('Відповідь прийнята, будь ласка зачекайте');
  } catch (err) {
    throw new Error(
      `With parse or get, or send answer to server, 'callback_query': ${err}`,
    );
  }
});

module.exports = {
  launch: () => bot.launch(),
};
