const app = require('./app');
const telegram = require('./telegram');

function start() {
  app.launch();
  telegram.launch();
}

start();
