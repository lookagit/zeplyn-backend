import client from '../redis';
import Message from '../models/messages.model';
import Room from '../models/rooms.model';

function createSocket(server) {
  const io = require('socket.io').listen(server); // eslint-disable-line

  io.sockets.on('connection', (socket) => {
    socket.on('send-message', (data) => {
      const dateForMessage = new Date().valueOf();
      const dataForMessage = {
        ...data,
        text: data.text,
        date: dateForMessage
      };
      io.sockets.in(data.roomIdRedis).emit('message', dataForMessage);
      client.hset(`MESSAGE_FOR_REAL_${data.roomId}`, `${data.userId}:${new Date().valueOf()}`, data.text);
    });

    socket.on('get-messages', (data, cb) => {
      client.hgetallAsync(`MESSAGE_FOR_REAL_${data.roomId}`)
      .then((messagesResult) => {
        if (messagesResult) {
          const messagesArr = [];
          Object.keys(messagesResult).forEach((key) => {
            const [userId, date] = key.split(':');
            messagesArr.push({
              userId,
              date,
              text: messagesResult[key],
            });
          });
          cb(messagesArr);
        } else {
          Message.find({ roomId: data.roomId })
          .then((messagesFinded) => {
            cb(messagesFinded);
          });
        }
      });
    });
    socket.on('join', (data) => {
      client.smembersAsync(data.roomIdRedis)
      .then((resultRoom) => {
        if (resultRoom.length) {
          client.sadd(data.roomIdRedis, data.userId);
          socket.join(data.roomIdRedis);
          return;
        }
        Room.findById(data.roomId).exec()
        .then((roomFinded) => {
          if (roomFinded) {
            client.sadd(data.roomIdRedis, data.userId);
            socket.join(data.roomIdRedis);
          }
        });
      });
    });
  });
}

export default createSocket;
