module.exports = async function authorization(ctx, next) {
  if (ctx.message.from.is_bot) throw new Error('It is bot!');
  return next();
};
