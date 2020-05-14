const Markup = require('telegraf/markup');

const bot = require('../telegram/bot');
const redis = require('./redis');

async function handler(ctx) {
  const id = typeof ctx === 'number' ? ctx : ctx.from.id;

  await bot.telegram.sendMessage(
    id,
    'Обери кнопку:',
    Markup.inlineKeyboard([
      Markup.callbackButton("Під'єднатися до тесту", 'connectionToGroup'),
    ])
      .oneTime()
      .resize()
      .extra(),
  );
}

async function deleteLastMessage(chatId, messageId) {
  console.log(
    `deleteLastMessage: { chatId: ${chatId}, messageId: ${messageId} }`,
  );

  await bot.telegram
    .deleteMessage(Number(chatId), Number(messageId))
    .catch(err => {
      throw new Error(`Error with delete message: ${err}`);
    });
}

function generateArrayRandomNumber(min, max) {
  let totalNumbers = max - min + 1;
  const arrayTotalNumbers = [];
  const arrayRandomNumbers = [];
  let tempRandomNumber;

  while (totalNumbers) {
    totalNumbers -= 1;
    arrayTotalNumbers.push(totalNumbers + min);
  }

  while (arrayTotalNumbers.length) {
    tempRandomNumber = Math.round(
      Math.random() * (arrayTotalNumbers.length - 1),
    );

    arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);

    arrayTotalNumbers.splice(tempRandomNumber, 1);
  }

  return arrayRandomNumbers;
}

function getArrayRandomButtons(question) {
  const markupButtons = [];

  generateArrayRandomNumber(0, question.answers.length - 1).forEach(number => {
    markupButtons.push([
      Markup.callbackButton(
        question.answers[number].title,
        JSON.stringify({
          answerId: question.answers[number].id,
          questionId: question.id,
          testId: question.testId,
        }),
      ),
    ]);
  });

  return markupButtons;
}

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
    try {
      let message = '';

      result.answers.forEach(answer => {
        message += answer ? 'Правильна' : 'Не правильна';
      });

      await bot.telegram.sendMessage(
        result.participants,
        `Відповідь на запитання "${body.title}":\n<i>${message}</i>`,
        {parse_mode: 'HTML'},
      );
    } catch (err) {
      console.log('Error with sendAnswersToUsers');
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
      console.log('Error with sendWhoNoAnswered');
      console.log(body);

      throw new Error(`Error in sendWhoNoAnswered: ${err}`);
    }
  });
}

async function endTest(body) {
  setTimeout(async () => {
    body.statistics.forEach(async user => {
      try {
        await bot.telegram.sendMessage(
          user.participantId,
          `Тест закінчився! Вітаю ти пройшов до кінця!\n  Правильних відповідей: ${user.true}\n  Всього запитань: ${user.all}\n  Співвідношення правильних до неправильних: ${user.percent}%`,
        );

        await handler(user.participantId);
      } catch (err) {
        console.log('Error with endTest');
        console.log(body);
        throw new Error(`Error in endTest: ${err}`);
      }
    });
  }, 3 * 1000); // 3 sec
}

module.exports = {
  startTest,
  sendQuestionToUsers,
  sendAnswersToUsers,
  sendWhoNoAnswered,
  endTest,
  deleteLastMessage,
  handler,
};
