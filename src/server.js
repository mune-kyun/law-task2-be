const express = require("express");
var bodyParser = require("body-parser");
const { rabbitMQHandler } = require("./utils.js");
const cors = require("cors");
const app = express();
app.use(express.json());
const router = express.Router();
const server = require("http").createServer(app);
const socketIO = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const amqp = require("amqplib/callback_api");
const recvSocket = socketIO.of("/recv_back");

const port = 3010;
const rabbitMQAddress = "amqp://35.209.178.149:5672";

app.use(cors());

app.use("/api", router);

// receive
router.route("/msg/init").post((req, res) => {
  const exchange = "test2";

  amqp.connect("amqp://35.209.178.149:5672", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            q.queue
          );
          channel.bindQueue(q.queue, exchange, "");

          channel.consume(
            q.queue,
            function (msg) {
              if (msg.content) {
                const data = JSON.parse(msg.content.toString());
                console.log("(receiv) message is: " + data.msg);
                // sockv
                recvSocket.emit("recv_back", JSON.stringify(data));
              }
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });

  res.status(200).send();
});

// emit
router.route("/msg/emit").post((req, res) => {
  const exchange = "test2";

  amqp.connect("amqp://35.209.178.149:5672", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });
      channel.publish(exchange, "", Buffer.from(JSON.stringify(req.body)));
      console.log(" [x] Sent %s", req.body.msg);
    });

    setTimeout(function () {
      connection.close();
      res.status(200).send();
    }, 500);
  });
});

app.get("/test", (req, res) => {
  res.status(200).send({ data: "connect then" });
});

app.get("/", (req, res) => {
  res.send("UsagiMQ, 2006597701");
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
