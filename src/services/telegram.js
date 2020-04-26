const addFunctions = require('../telegram/addFunctions');

module.exports = {
  async startTest(usersId, time) {
    await addFunctions.startTest(usersId, time);
  },

  async sendQuestionToUsers(usersId, question) {
    await addFunctions.sendQuestionToUsers(usersId, question);
  },

  async sendAnswersToUsers(body) {
    await addFunctions.sendAnswersToUsers(body);
  },

  async sendWhoNoAnswered(body) {
    await addFunctions.sendWhoNoAnswered(body);
  },

  async endTest(body) {
    await addFunctions.endTest(body);
  },
};
