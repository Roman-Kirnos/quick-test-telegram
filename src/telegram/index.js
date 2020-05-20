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

bot.start(async ctx => {
  await auth(ctx);

  if (
    /^\/start [a-zA-Z0-9]{6}$/.test(
      ctx.message.text === undefined ? ' ' : ctx.message.text,
    )
  ) {
    const code = ctx.message.text.split(/ /, 2)[1];

    console.log(code);

    sendToServerForConnectedToGroup(ctx, code);
  } else {
    await ctx.reply('Привіт! Тебе вітає чат-бота для швидкого тесту.');

    await handler(ctx.from.id);
  }
});

bot.action(
  'mainMenu',
  async (ctx, next) => {
    await ctx.answerCbQuery();

    await deleteLastMessage(
      ctx.update.callback_query.message.chat.id,
      ctx.update.callback_query.message.message_id,
    );

    await next(ctx);
  },
  handler,
);

bot.on('callback_query', async ctx => {
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
});

module.exports = {
  launch: () => bot.launch(),
};
