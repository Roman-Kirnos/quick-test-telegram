const {promisify} = require('util');

const redis = require('./redis');
const log = require('../../logger')(__filename);

async function addUserMessageId(id, value) {
  try {
    await redis.set(id, value);
  } catch (error) {
    log.fatal({error}, 'redis: addUserMessageId');
  }
}

async function getUserMessageId(id) {
  try {
    const getAsync = promisify(redis.get).bind(redis);

    const value = await getAsync(id);
    return value;
  } catch (error) {
    log.fatal({error}, 'redis: getUserMessageId');
    throw new Error(error);
  }
}

async function deleteUserMessageId(id) {
  try {
    await redis.del(id);
  } catch (error) {
    log.fatal({error}, 'redis: deleteUserMessageId');
  }
}

module.exports = {
  addUserMessageId,
  getUserMessageId,
  deleteUserMessageId,
};
