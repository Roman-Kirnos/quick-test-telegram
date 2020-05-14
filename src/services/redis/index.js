const {promisify} = require('util');

const redis = require('./redis');

async function addUserMessageId(id, value) {
  try {
    await redis.set(`${id}telegram`, value);
    return true;
  } catch (err) {
    throw new Error(`Error with add to redis: ${err}`);
  }
}

async function getUserMessageId(id) {
  try {
    const getAsync = promisify(redis.get).bind(redis);

    const value = await getAsync(`${id}telegram`);
    return value;
  } catch (err) {
    throw new Error(`Error with get messageId from redis: ${err}`);
  }
}

async function deleteUserMessageId(id) {
  try {
    await redis.del(`${id}telegram`);
    return true;
  } catch (err) {
    throw new Error(`Error with delete messageId from redis: ${err}`);
  }
}

module.exports = {
  addUserMessageId,
  getUserMessageId,
  deleteUserMessageId,
};
