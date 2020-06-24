const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const {PORT} = require('./config');
const router = require('./router');
const {
  telegram: {webhook},
  checkAuthToken,
} = require('./services');
const log = require('./logger')(__filename);

const app = express();

webhook(app);

app.use(helmet());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/quicktest', checkAuthToken, router);

app.get('', async (req, res) => {
  res.status(200).send('Server is working now.');
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  log.error({error}, 'Server error');

  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});

module.exports = {
  launch: () =>
    app.listen(PORT, () => {
      log.info(`Server is listening on port: ${PORT}!`);
    }),
};
