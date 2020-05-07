const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const bot = require('./telegram/bot');
const {PORT, BOT_WEBHOOK_CONNECT, SECRET_PATH} = require('./config');
const routers = require('./router');

const app = express();

app.use(bot.webhookCallback(SECRET_PATH));
bot.telegram.setWebhook(BOT_WEBHOOK_CONNECT + SECRET_PATH);

app.use(helmet());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/quicktest', routers);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log(`Error with server: ${error}`);

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
      console.log(`Example app listening on port ${PORT}!`);
    }),
};
