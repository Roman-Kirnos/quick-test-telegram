const Telegraf = require('telegraf');
const config = require('../config');

const bot = new Telegraf(config.TELEGRAM_TOKEN);

module.exports = bot;
