module.exports = async function authorization(ctx) {
  if (ctx.message.from.is_bot) throw new Error('It is bot!');
};
