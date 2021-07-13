/* require("dotenv").config();

const { promisify } = require("util");
const redis = require("redis");

const client = redis.createClient({
  port: process.env.REDPORT,
});

module.exports = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client),
};
 */