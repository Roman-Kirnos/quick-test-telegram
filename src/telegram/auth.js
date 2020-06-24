const log = require('../logger')(__filename);

module.exports = async function authorization(ctx, next) {
  if (ctx.message.from.is_bot) log.error('It is bot!');
  return next();
};
