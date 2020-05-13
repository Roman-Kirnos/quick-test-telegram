const router = require('express').Router();

const {telegram} = require('./services');

router.post('/launchtest', async (req, res) => {
  try {
    await telegram.startTest(req.body.participants_id, 5); // req.body.timeForAnswerQuestion = 20
  } catch (err) {
    throw new Error(`Error with startTest: ${err}`);
  }

  res.send();
});

router.post('/question', async (req, res) => {
  try {
    await telegram.sendQuestionToUsers(
      req.body.participants_id,
      req.body.question,
    );
  } catch (err) {
    throw new Error(`Error with send questions to users ${err}`);
  }

  res.send();
});

router.post('/question/result', async (req, res) => {
  try {
    await telegram.sendAnswersToUsers(req.body);
  } catch (err) {
    throw new Error(`Error with send results to users ${err}`);
  }

  res.send();
});

router.post('/question/noresult', async (req, res) => {
  try {
    await telegram.sendWhoNoAnswered(req.body);
  } catch (err) {
    throw new Error(`Error with send who no result to users ${err}`);
  }

  res.send();
});

router.post('/question/end', async (req, res) => {
  try {
    await telegram.endTest(req.body);
  } catch (err) {
    throw new Error(`Error with send about end of the test to users ${err}`);
  }

  res.send();
});

module.exports = router;
