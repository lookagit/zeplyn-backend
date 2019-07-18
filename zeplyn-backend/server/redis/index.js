const redis = require('redis').createClient();

redis.on('connect', () => {
  require('bluebird').promisifyAll(redis); // eslint-disable-line
});

export default redis;

