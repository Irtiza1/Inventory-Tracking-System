const redis = require('redis');
const { REDIS_URL } = require('../db/database');

const client = redis.createClient({
  url: REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.connect();

module.exports = client;