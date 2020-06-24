const axios = require('axios');

const config = require('../config');
const bot = require('../telegram/bot');
const handler = require('./telegram/handler');
const i18n = require('../config/i18n.config.js');
const log = require('../logger')(__filename);

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

    await bot.telegram.sendMessage(
      response.data.participant_id,
      i18n.t(i18n.currentLocale, 'already_connected', {
        data: response.data,
      }),
    );
  } catch (error) {
    log.error({error, options}, 'checkCode');

    try {
      await bot.telegram.sendMessage(
        id,
        i18n.t(i18n.currentLocale, 'code_is_invalid'),
      );
      await handler(Number(id));
    } catch (err) {
      log.error({error: err, id}, 'checkCode: code_is_invalid');
    }
  }
  return 0;
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
  } catch (error) {
    log.error({error, options}, 'checsendAnswerFromUserkCode');
  }
}

module.exports = {
  checkCode,
  sendAnswerFromUser,
};
