const http = require('http');
const socketio = require('socket.io');
const app = require('./server');
const server = http.createServer(app);
const io = socketio(server);
const {
  addSocketClient,
  removeSocketClient,
  getSocketClient,
  getReceiverSocketId,
} = require('./utils/friend');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

io.on('connection', socket => {
  console.log('New WebSocket connection', socket.id);
  // Friend Request
  socket.on('sendAuth', senderId => {
    addSocketClient({ id: socket.id, senderId });
  });

  socket.on(
    'sendFriendAction',
    ({ senderName, senderId, receiverName, receiverId, eventType, notification }) => {
      const socketClient = getSocketClient(socket.id);
      socketClient.senderName = senderName;
      socketClient.senderId = senderId;
      socketClient.receiverName = receiverName;
      socketClient.receiverId = receiverId;
      socketClient.eventType = eventType;
      const { socketClientId, error } = getReceiverSocketId(socketClient.receiverId);
      const event = socketClient.eventType;
      if (!error) {
        io.to(socketClientId).emit(event, {
          socketClientId,
          senderId,
          senderName,
          receiverId,
          receiverName,
          eventType,
          notification,
        });
      }
    },
  );

  // Live Chat
  socket.on('chat join', (msg, callback) => {
    const { error, user } = addUser({ id: socket.id, ...msg });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('chat join', {
      username: 'Admin',
      message: `${user.username}, welcome to group chat!`,
      userAvatar: '//www.gravatar.com/avatar/503865d0bf3e8c4613589ea9a60910a7?s=200&r=pg&d=mm',
    });
    socket.broadcast.to(user.room).emit('chat join', {
      username: 'Hey',
      message: user.username + ' has joined!',
      userAvatar: '//www.gravatar.com/avatar/503865d0bf3e8c4613589ea9a60910a7?s=200&r=pg&d=mm',
    });
    io.to(user.room).emit('chat users', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on('chat message', msg => {
    const user = getUser(socket.id);
    io.to(user.room).emit('chat message', msg);
  });

  socket.on('chat leave', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('chat leave', {
        username: 'Hey',
        message: user.username + ', has left!',
        userAvatar: '//www.gravatar.com/avatar/503865d0bf3e8c4613589ea9a60910a7?s=200&r=pg&d=mm',
      });
      io.to(user.room).emit('chat users', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  // for friend request
  socket.on('disconnect', function() {
    const onlineUsers = removeSocketClient(socket.id);
    // If you want to send onlineUsers to front-end
    // io.emit('onlineUsers', { onlineUsers });
    console.log('user disconnected');
  });
});

module.exports = server;
