const redis = require('redis');

const {URL_REDIS} = require('../../config');

const client = redis.createClient(URL_REDIS);

client.on('error', error => {
  console.error(`Redis has broken: ${error}`);
  process.exit(1);
});

module.exports = client;
