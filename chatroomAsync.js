const bluebird = require("bluebird");
const redis = require("redis");
const shortid = require("shortid");
bluebird.promisifyAll(redis.RedisClient.prototype);

const redisClient = redis.createClient();

function addMessage(message, user, room) {
  const id = shortid.generate();
  redisClient.hmset(`messages:${id}`, { message, user, room });
  redisClient.lpush(`rooms:${room}`, id);
}

function seedRedisStore() {
  redisClient.flushall();

  addMessage("How's it going?", "Mimir", "Main Room");
  addMessage("Really Well!", "Odin", "Main Room");
  addMessage("Cool!", "Mimir", "Main Room");

  addMessage("Promises are hard!", "Mimir", "JavaScript");
  addMessage("Try using async/await", "Odin", "JavaScript");
}

async function getMessagesForRoom(room) {
  let messageKeys = await getMessageKeysForRoom(room);
  return getMessages(messageKeys);
}

function getMessageKeysForRoom(room) {
  return redisClient.lrangeAsync(`rooms:${room}`, 0, -1);
}

function getMessage(key) {
  return redisClient.hgetallAsync(`messages:${key}`);
}

function getMessages(keys) {
  return Promise.all(keys.map(getMessage));
}

getMessagesForRoom("Main Room").then(val => {
  console.log("Main Room MESSAGES");
  console.log(val);
  console.log();
});

getMessagesForRoom("JavaScript").then(val => {
  console.log("JavaScript MESSAGES");
  console.log(val);
  console.log();
});
