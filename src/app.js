const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const config = require('./config');
const routers = require('./routers');

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/quicktest', routers);

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});

module.exports = {
  launch: () =>
    app.listen(config.PORT, () => {
      console.log(`Example app listening on port ${config.PORT}!`);
    }),
};
