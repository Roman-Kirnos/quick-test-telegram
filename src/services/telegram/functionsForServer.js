const Markup = require('telegraf/markup');

const redis = require('../redis');
const handler = require('./handler');
const bot = require('../../telegram/bot');
const {deleteLastMessage, getArrayRandomButtons} = require('./otherFunctions');

async function startTest(usersId, timeAfterStart = 5) {
  usersId.forEach(async id => {
    try {
      await bot.telegram.sendMessage(
        id,
        `Тест почався. Запитання прийдуть через ${timeAfterStart} секунд.`,
      );
    } catch (err) {
      console.log(`Error with startTest: { usersId: ${usersId} }`);

      throw new Error(
        `Error with startTest\nCannot send message to user ${err}`,
      );
    }
  });

  setTimeout(() => {
    console.log(`Start after ${timeAfterStart} sec.`);
  }, timeAfterStart * 1000);
}

async function sendQuestionToUsers(usersId, question) {
  usersId.forEach(async id => {
    try {
      const markupButtons = await getArrayRandomButtons(question);

      const message = await bot.telegram.sendMessage(
        id,
        `Запитання №${question.actualQuestion} з ${question.allQuestions}:\n${question.title}:\n ${question.subtitle}?\nВ тебе є ${question.timeout} секунд.`,
        Markup.inlineKeyboard(markupButtons)
          .resize()
          .oneTime()
          .extra(),
      );

      await redis.addUserMessageId(id, message.message_id);
    } catch (err) {
      console.log(
        `Error with sendQuestionToUsers: { usersId: ${usersId}, question: ${question} }`,
      );

      throw new Error(`Error in addFunctions/sendQuestionToUsers: ${err}`);
    }
  });
}

async function sendAnswersToUsers(body) {
  body.results.forEach(async result => {
    let message = '';

    message += result.answer ? 'Правильна' : 'Не правильна';

    try {
      await bot.telegram.sendMessage(
        result.participants,
        `Відповідь на запитання "${body.title}":\n<i>${message}</i>${
          result.phrase ? `\n${result.phrase}` : ''
        }`,
        {parse_mode: 'HTML'},
      );
    } catch (err) {
      console.log(body);

      throw new Error(`Error in sendAnswersToUsers: ${err}`);
    }
  });
}

async function sendWhoNoAnswered(body) {
  body.participants.forEach(async id => {
    try {
      const messageId = await redis.getUserMessageId(id);

      await redis.deleteUserMessageId(id);
      await deleteLastMessage(id, messageId);

      await bot.telegram.sendMessage(
        id,
        `Ви не відповіли на запитання: ${body.questionTitle}, в тесті: ${body.testTitle}.`,
      );
    } catch (err) {
      console.log(body);

      throw new Error(`Error in sendWhoNoAnswered: ${err}`);
    }
  });
}

async function endTest(body) {
  body.statistics.forEach(async user => {
    try {
      await bot.telegram.sendMessage(
        Number(user.participantId),
        `Тест закінчився! Вітаю ти пройшов до кінця!\n  Правильних відповідей: ${user.true}\n  Всього запитань: ${user.all}\n  Співвідношення правильних до неправильних: ${user.percent}%`,
      );

      await handler(Number(user.participantId));
    } catch (err) {
      console.log(body);
      throw new Error(`Error in endTest: ${err}`);
    }
  });
}

module.exports = {
  startTest,
  sendQuestionToUsers,
  sendAnswersToUsers,
  sendWhoNoAnswered,
  endTest,
};
