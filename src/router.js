const router = require('express').Router();

const {
  telegram: {
    functionsForServer: {
      startTest,
      sendQuestionToUsers,
      sendAnswersToUsers,
      sendWhoNoAnswered,
      endTest,
    },
  },
} = require('./services');
const log = require('./logger')(__filename);

router.get('', async (req, res) => {
  res.status(200).send('Server is working now.');
});

router.post('/launchtest', async (req, res) => {
  try {
    await startTest(req.body.participants_id, 5);
  } catch (error) {
    res
      .status(400)
      .send(`Error with '/launchtest', can't start test: ${error}`);

    log.error({error}, '/launchtest');
  }

  res.status(200).send('OK');
});

router.post('/question', async (req, res) => {
  try {
    await sendQuestionToUsers(req.body.participants_id, req.body.question);
  } catch (error) {
    res
      .status(400)
      .send(`Error with '/question', can't send question to users: ${error}`);

    log.error({error}, '/question');
  }

  res.status(200).send('OK');
});

router.post('/question/result', async (req, res) => {
  try {
    await sendAnswersToUsers(req.body);
  } catch (error) {
    res
      .status(400)
      .send(
        `Error with '/question/result', can't send answer to users: ${error}`,
      );

    log.error({error}, '/question/result');
  }

  res.status(200).send('OK');
});

router.post('/question/noresult', async (req, res) => {
  try {
    await sendWhoNoAnswered(req.body);
  } catch (error) {
    res
      .status(400)
      .send(
        `Error with '/question/noresult', can't send to users who no answered: ${error}`,
      );

    log.error({error}, '/question/noresult');
  }

  res.status(200).send('OK');
});

router.post('/question/end', async (req, res) => {
  try {
    await endTest(req.body);
  } catch (error) {
    res
      .status(400)
      .send(
        `Error with '/question/end', can't send to users about end test: ${error}`,
      );

    log.error({error}, '/question/end');
  }

  res.status(200).send('OK');
});

module.exports = router;
