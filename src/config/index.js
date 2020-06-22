require('dotenv').config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  PORT: process.env.PORT,
  MAIN_SERVER_CONNECT: process.env.MAIN_SERVER_CONNECT,
  X_Auth_Token: process.env.X_Auth_Token,
  URL_REDIS: process.env.URL_REDIS,
  BOT_WEBHOOK_CONNECT: process.env.BOT_WEBHOOK_CONNECT,
  SECRET_PATH: process.env.SECRET_PATH,
  REG_EXP_CHECK_CODE: /^[a-zA-Z0-9]{6}$/,
  IN_START_REG_EXP_CHECK_CODE: /^\/start [a-zA-Z0-9]{6}$/,
};
