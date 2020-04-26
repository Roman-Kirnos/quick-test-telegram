const axios = require('axios');
const config = require('../config');

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
    throw new Error(
      `Такого коду не існує!\n${err} - ${err.response.statusText}`,
    );
  }

  if (
    response.data.participant_id === id &&
    typeof response.data.testTitle === 'string' &&
    typeof response.data.count === 'number'
  )
    return response;
  console.log(response);
  throw new Error('Отриман не вірний результат!');
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
    throw new Error(
      `Не правильно відправлена відповідь!\n${err} - ${err.response.statusText}`,
    );
  }
}

module.exports = {
  checkCode,
  sendAnswerFromUser,
};
