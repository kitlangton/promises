const redis = require("redis");
const shortid = require("shortid");

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

function getMessagesForRoom(room) {
  return getMessageKeysForRoom(room).then(getMessages);
}

function getMessageKeysForRoom(room) {
  return new Promise(resolve => {
    redisClient.lrange(`rooms:${room}`, 0, -1, (err, messageKeys) => {
      resolve(messageKeys);
    });
  });
}

function getMessage(key) {
  return new Promise(resolve => {
    redisClient.hgetall(`messages:${key}`, (err, message) => {
      resolve(message);
    });
  });
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
