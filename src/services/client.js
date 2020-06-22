const axios = require('axios');

const config = require('../config');
const bot = require('../telegram/bot');
const handler = require('./telegram/handler');
const i18n = require('../config/i18n.config.js');

const globalOptions = {
  baseURL: config.MAIN_SERVER_CONNECT,
  headers: {'X-Auth-Token': config.X_Auth_Token},
};

async function checkCode(code, id, firstName = ' ', lastName = ' ') {
  const options = globalOptions;

  options.method = 'post';
  options.url = '/api/quicktest/bot/student';
  options.data = {
    code,
    participant_id: id,
    first_name: firstName || ' ',
    last_name: lastName || ' ',
  };

  try {
    const response = await axios(options);

    if (!response.data.message) {
      return response;
    }

    try {
      await bot.telegram.sendMessage(
        response.data.participant_id,
        i18n.t(i18n.currentLocale, 'already_connected', {
          data: response.data,
        }),
      );
      return 0;
    } catch (err) {
      throw new Error(`Send Message to user in the end of checkCode: ${err}`);
    }
  } catch (err) {
    console.log('Axios error with checkCode:\n');
    console.log(options);

    try {
      await bot.telegram.sendMessage(
        id,
        i18n.t(i18n.currentLocale, 'code_is_invalid'),
      );
      await handler(Number(id));
    } catch (error) {
      throw new Error(`Handler is undefined: ${error}`);
    }

    return 0;
  }
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

    throw new Error(`The answer was sent incorrectly!\n${err.message}`);
  }
}

module.exports = {
  checkCode,
  sendAnswerFromUser,
};
