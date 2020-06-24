const redis = require('redis');

const {URL_REDIS} = require('../../config');
const log = require('../../logger')(__filename);

const client = redis.createClient(URL_REDIS);

client.on('error', error => {
  log.fatal({error}, 'Redis has broken!');
  process.exit(1);
});

module.exports = client;
