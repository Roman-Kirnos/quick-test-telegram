const router = require('express').Router();

const {telegram} = require('../services/index');

router.post('/launchtest', async (req, res) => {
  try {
    await telegram.startTest(req.body.participants_id, 5);
  } catch (err) {
    console.log(`Error with startTest: ${err}`);
  }

  res.send();
});

router.post('/question', async (req, res) => {
  res.send();

  try {
    await telegram.sendQuestionToUsers(
      req.body.participants_id,
      req.body.question,
    );
  } catch (err) {
    console.log(`Error with send questions to users ${err}`);
  }
});

router.post('/question/result', async (req, res) => {
  res.send();

  try {
    await telegram.sendAnswersToUsers(req.body);
  } catch (err) {
    console.log(`Error with send results to users ${err}`);
  }
});

router.post('/question/noresult', async (req, res) => {
  res.send();

  try {
    await telegram.sendWhoNoAnswered(req.body);
  } catch (err) {
    console.log(`Error with send who no result to users ${err}`);
  }
});

router.post('/question/end', async (req, res) => {
  res.send();

  try {
    await telegram.endTest(req.body);
  } catch (err) {
    console.log(`Error with send about end of the test to users ${err}`);
  }
});

module.exports = router;
