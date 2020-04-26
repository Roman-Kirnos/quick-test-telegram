const session = require('telegraf/session');
const Markup = require('telegraf/markup');

const client = require('../client');
const bot = require('./bot');
const auth = require('./auth');
const {stage, stagesArray} = require('./scenes');

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

  await ctx.reply(
    'Привіт! Ти приєднався до чат-бота для швидкого тесту.',
    Markup.inlineKeyboard([
      Markup.callbackButton('Запуск бота', 'choiceButtons'),
    ])
      .oneTime()
      .resize()
      .extra(),
  );
});

bot.action('choiceButtons', async ctx => {
  await ctx.reply(
    'Тепер вибери кнопку:',
    Markup.inlineKeyboard([
      Markup.callbackButton('Під`єднатися до тесту', 'connectionToGroup'),
    ])
      .oneTime()
      .resize()
      .extra(),
  );
});

bot.on('callback_query', async ctx => {
  const data = JSON.parse(ctx.callbackQuery.data);
  await client.sendAnswerFromUser({
    testId: data.testId,
    participantId: ctx.from.id,
    questionId: data.questionId,
    answer: [data.answerId],
  });
  ctx.answerCbQuery();
  ctx.reply('Відповідь прийнята, будь ласка зачекайте');
});

module.exports = {
  launch: () => bot.launch(),
};
