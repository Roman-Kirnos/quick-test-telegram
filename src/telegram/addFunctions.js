const Markup = require('telegraf/markup');

const bot = require('./bot');

async function startTest(usersId, time = 5) {
  usersId.forEach(async id => {
    try {
      await bot.telegram.sendMessage(
        id,
        `Тест почався. Запитання прийдуть через ${time} секунд.`,
      );
    } catch (err) {
      console.log(`addFunctions/startTest\nCannot send message to user ${err}`);
    }
  });

  setTimeout(() => {
    console.log(`Start after ${time} sec.`);
  }, time * 1000);
}

async function sendQuestionToUsers(usersId, question) {
  const markupButtons = [];

  await question.answers.forEach(answer => {
    markupButtons.push(
      Markup.callbackButton(
        answer.title,
        JSON.stringify({
          answerId: answer.id,
          questionId: question.id,
          testId: question.testId,
        }),
      ),
    );
  });

  usersId.forEach(async id => {
    try {
      await bot.telegram.sendMessage(id, 'Запитання:');
      await bot.telegram.sendMessage(
        id,
        `${question.title}:\n ${question.subtitle}?`,
        Markup.inlineKeyboard(markupButtons)
          .resize()
          .oneTime()
          .extra(),
      );
    } catch (err) {
      console.log(`Error in addFunctions/sendQuestionToUsers: ${err}`);
    }
  });
}

async function sendAnswersToUsers(body) {
  try {
    body.results.forEach(async result => {
      let message = '';

      result.answers.forEach(answer => {
        message += answer ? 'Правильно' : 'Не правильно';
      });

      await bot.telegram.sendMessage(
        result.participants,
        `Відповіді на тест ${body.title}:\n${message}`,
      );
    });
  } catch (err) {
    console.log(`Error in sendAnswersToUsers: ${err}`);
  }
}

async function sendWhoNoAnswered(body) {
  try {
    body.participants.forEach(async id => {
      await bot.telegram.sendMessage(
        id,
        `Ви не відповіли на запитання ${body.questionId} в тесті ${body.testId}.`,
      );
    });
  } catch (err) {
    console.log(`Error in sendWhoNoAnswered: ${err}`);
  }
}

async function endTest(body) {
  try {
    body.participants.forEach(async id => {
      await bot.telegram.sendMessage(
        id,
        `Тест закінчився! Ти пройшов до кінця!`,
      );
    });
  } catch (err) {
    console.log(`Error in endTest: ${err}`);
  }
}

module.exports = {
  startTest,
  sendQuestionToUsers,
  sendAnswersToUsers,
  sendWhoNoAnswered,
  endTest,
};
