const axios = require('axios');

const config = require('../config');
const bot = require('../telegram/bot');
const handler = require('./telegram/handler');

const globalOptions = {
  baseURL: config.MAIN_SERVER_CONNECT,
  headers: {'X-Auth-Token': config.X_Auth_Token},
};

async function checkCode(code, id, firstName = ' ', lastName = ' ') {
  const options = globalOptions;
  let response;

  options.method = 'post';
  options.url = '/api/quicktest/bot/student';
  options.data = {
    code,
    participant_id: id,
    first_name: firstName || ' ',
    last_name: lastName || ' ',
  };

  try {
    response = await axios(options);
  } catch (err) {
    console.log('Axios error with checkCode:\n');
    console.log(options);

    try {
      await bot.telegram.sendMessage(id, 'Нажаль твій код не дійсний.');
      await handler(id);
    } catch (error) {
      throw new Error(`Handler is undefined: ${error}`);
    }

    throw new Error(
      `Такого коду не існує!\n${err} - ${err.response.statusText}`,
    );
  }

  if (response.body.message) {
    try {
      await bot.telegram.sendMessage(
        response.body.participant_id,
        `Вас уже підключено до тесту "${response.body.testTitle}", кількість запитань: ${response.body.count}.`,
      );
    } catch (err) {
      throw new Error(`Send Message to user in the end of checkCode: ${err}`);
    }
  }

  return response;
}

async function sendAnswerFromUser({testId, participantId, questionId, answer}) {
  const options = globalOptions;

  options.method = 'post';
  options.url = '/api/quicktest/bot/question';
  options.data = {
    test_id: testId,
    participant_id: participantId,
    question_id: questionId,
    answer,
  };

  try {
    await axios(options);
  } catch (err) {
    console.log('Axios error with sendAnswerFromUser:\n');
    console.log(options);

    throw new Error(`Не правильно відправлена відповідь!\n${err.message}`);
  }
}

module.exports = {
  checkCode,
  sendAnswerFromUser,
};
