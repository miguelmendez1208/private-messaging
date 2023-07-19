/* abstract */ class MessageStore {
  saveMessage(message) {}
  saveFenMessage(fenMessage) {}
  findMessagesForUser(userID) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = [];
    this.fenMessages = [];
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  saveFenMessage(fenMessage) {
    this.fenMessages.push(fenMessage);
  }

  findMessagesForUser(userID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

const CONVERSATION_TTL = 24 * 60 * 60;

class RedisMessageStore extends MessageStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  saveMessage(message) {
    const value = JSON.stringify(message);
    this.redisClient
      .multi()
      .rpush(`messages:${message.from}`, value)
      .rpush(`messages:${message.to}`, value)
      .expire(`messages:${message.from}`, CONVERSATION_TTL)
      .expire(`messages:${message.to}`, CONVERSATION_TTL)
      .exec();
  }

  saveFenMessage(fenMessage){
    const value = JSON.stringify(fenMessage);
    this.redisClient
      .multi()
      .rpush(`messages:${fenMessage.from}`, value)
      .rpush(`messages:${fenMessage.to}`, value)
      .expire(`messages:${fenMessage.from}`, CONVERSATION_TTL)
      .expire(`messages:${fenMessage.to}`, CONVERSATION_TTL)
      .exec();
  }



  findMessagesForUser(userID) {
    return this.redisClient
      .lrange(`messages:${userID}`, 0, -1)
      .then((results) => {
        return results.map((result) => JSON.parse(result));
      });
  }

  findFenMessagesforUser(userID) {
    return this.redisClient
      .lrange(`fenMessages:${userID}`, 0, -1)
      .then((results) => {
        return results.map((result) => JSON.parse(result));
      });
  }
}

module.exports = {
  InMemoryMessageStore,
  RedisMessageStore,
};
