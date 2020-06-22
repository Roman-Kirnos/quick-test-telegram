const Markup = require('telegraf/markup');

const bot = require('../../telegram/bot');
const {checkCode} = require('../client');
const i18n = require('../../config/i18n.config.js');

async function deleteLastMessage(chatId, messageId) {
  console.log(
    `deleteLastMessage: { chatId: ${chatId}, messageId: ${messageId} }`,
  );

  try {
    await bot.telegram
      .deleteMessage(Number(chatId), Number(messageId))
      .catch(err => {
        throw new Error(`Error with delete message: ${err}`);
      });
  } catch (err) {
    throw new Error(`With delete lastMessage: ${err}`);
  }
}

async function sendToServerForConnectedToGroup(ctx, code = ctx.message.text) {
  try {
    const res = await checkCode(
      code,
      ctx.message.from.id,
      ctx.message.from.first_name,
      ctx.from.last_name,
    );

    if (res) {
      await ctx.reply(
        i18n.t(i18n.currentLocale, 'connected_to_test', {data: res.data}),
      );
    }
  } catch (err) {
    throw new Error(`Error with get res: ${err}`);
  }
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

module.exports = {
  deleteLastMessage,
  sendToServerForConnectedToGroup,
  getArrayRandomButtons,
};
