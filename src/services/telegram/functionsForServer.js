const Markup = require('telegraf/markup');

const redis = require('../redis');
const handler = require('./handler');
const bot = require('../../telegram/bot');
const {deleteLastMessage, getArrayRandomButtons} = require('./otherFunctions');
const i18n = require('../../config/i18n.config.js');

async function startTest(usersId, timeAfterStart = 5) {
  usersId.forEach(async id => {
    try {
      await bot.telegram.sendMessage(
        id,
        i18n.t(i18n.currentLocale, 'start_test', {time: timeAfterStart}),
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
        i18n.t(i18n.currentLocale, 'question', {
          actualQuestion: question.actualQuestion,
          allQuestions: question.allQuestions,
          title: question.title,
          subtitle: question.subtitle,
          timeout: question.timeout,
        }),
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
    try {
      await bot.telegram.sendMessage(
        result.participants,
        i18n.t(i18n.currentLocale, 'answer', {
          resultAnswer: result.answer
            ? i18n.t(i18n.currentLocale, 'right_answer')
            : i18n.t(i18n.currentLocale, 'wrong_answer'),
          bodyTitle: body.title,
          resultPhrase: result.phrase ? `\n${result.phrase}` : '',
        }),
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
        i18n.t(i18n.currentLocale, 'no_answered', {body}),
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
        i18n.t(i18n.currentLocale, 'end_test', {user}),
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
