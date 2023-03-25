// // receive
// router.route("/msg/init").post((req, res) => {
//   const { exchange } = req.body;

//   amqp.connect("amqp://35.209.178.149:5672", function (error0, connection) {
//     if (error0) {
//       throw error0;
//     }
//     connection.createChannel(function (error1, channel) {
//       if (error1) {
//         throw error1;
//       }

//       channel.assertExchange(exchange, "fanout", {
//         durable: false,
//       });

//       channel.assertQueue(
//         "",
//         {
//           exclusive: true,
//         },
//         function (error2, q) {
//           if (error2) {
//             throw error2;
//           }
//           console.log(
//             " [*] Waiting for messages in %s. To exit press CTRL+C",
//             q.queue
//           );
//           channel.bindQueue(q.queue, exchange, "");

//           channel.consume(
//             q.queue,
//             function (msg) {
//               if (msg.content) {
//                 console.log(" [x] %s", msg.content.toString());
//               }
//             },
//             {
//               noAck: true,
//             }
//           );
//         }
//       );
//     });
//   });

//   // res.status(200).send();
// });
