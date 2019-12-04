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

io.on('connection', socket => {
  console.log('New WebSocket connection', socket.id);

  socket.on('sendAuth', senderId => {
    addSocketClient({ id: socket.id, senderId });
  });

  socket.on('friendRequest', ({ senderName, senderId, receiverName, receiverId }) => {
    const socketClient = getSocketClient(socket.id);
    socketClient.senderName = senderName;
    socketClient.senderId = senderId;
    socketClient.receiverName = receiverName;
    socketClient.receiverId = receiverId;

    const { socketClientId, error } = getReceiverSocketId(socketClient.receiverId);
    console.log('status', socketClient, error);

    if (!error) {
      io.to(socketClientId).emit('newFriendRequest', {
        socketClientId,
        senderId,
        senderName,
        receiverId,
        receiverName,
      });
    }
  });

  socket.on('disconnect', function() {
    removeSocketClient(socket.id);
    console.log('user disconnected');
  });
});

module.exports = server;
