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

router.get('', async (req, res) => {
  res.status(200).send('Server is working now.');
});

router.post('/launchtest', async (req, res) => {
  try {
    await startTest(req.body.participants_id, 5);
  } catch (err) {
    res.status(500).send(`Error with '/launchtest', can't start test: ${err}`);

    throw new Error(`Error with startTest, in 'Router': ${err}`);
  }

  res.status(200).send('OK');
});

router.post('/question', async (req, res) => {
  try {
    await sendQuestionToUsers(req.body.participants_id, req.body.question);
  } catch (err) {
    res
      .status(500)
      .send(`Error with '/question', can't send question to users: ${err}`);

    throw new Error(`Error with send questions to users, in 'Router': ${err}`);
  }

  res.status(200).send('OK');
});

router.post('/question/result', async (req, res) => {
  try {
    await sendAnswersToUsers(req.body);
  } catch (err) {
    res
      .status(500)
      .send(
        `Error with '/question/result', can't send answer to users: ${err}`,
      );

    throw new Error(`Error with send results to users, in 'Router': ${err}`);
  }

  res.status(200).send('OK');
});

router.post('/question/noresult', async (req, res) => {
  try {
    await sendWhoNoAnswered(req.body);
  } catch (err) {
    res
      .status(500)
      .send(
        `Error with '/question/noresult', can't send to users who no answered: ${err}`,
      );

    throw new Error(
      `Error with send who no result to users, in 'Router': ${err}`,
    );
  }

  res.status(200).send('OK');
});

router.post('/question/end', async (req, res) => {
  try {
    await endTest(req.body);
  } catch (err) {
    res
      .status(500)
      .send(
        `Error with '/question/end', can't send to users about end test: ${err}`,
      );

    throw new Error(
      `Error with send about end of the test to users, in 'Router': ${err}`,
    );
  }

  res.status(200).send('OK');
});

module.exports = router;
