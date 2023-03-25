var amqp = require("amqplib/callback_api");

const rabbitMQHandler = (callback) => {
  amqp.connect("amqp://35.209.178.149:5672", (error, conection) => {
    if (error) {
      throw new Error(error);
    }

    callback(conection);
  });
};

module.exports = {
  rabbitMQHandler,
};
