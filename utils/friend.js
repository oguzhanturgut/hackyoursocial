const socketClients = [];

const addSocketClient = ({ id, senderName, senderId, receiverName, receiverId }) => {
  // Store user
  const socketClient = { id, senderName, senderId, receiverName, receiverId };

  socketClients.push(socketClient);
  return { socketClient };
};

const removeSocketClient = id => {
  for (let i = 0; i < socketClients.length; i++) {
    if (socketClients[i].id === id) {
      socketClients.splice(i, 1);
      i--;
    }
  }
  const onlineUsers = new Set();
  socketClients.forEach(client => {
    onlineUsers.add(client.senderId);
  });
  return Array.from(onlineUsers);
};

const getSocketClient = id => socketClients.find(socket => socket.id === id);

const getSocketClients = () => {
  return socketClients.map(socket => {
    return socket;
  });
};

const getReceiverSocketId = receiverId => {
  try {
    const obj = socketClients.find(socket => {
      return socket.senderId === receiverId;
    });
    return { socketClientId: obj.id };
  } catch (err) {
    return { error: 'Not Online' };
  }
};

module.exports = {
  addSocketClient,
  removeSocketClient,
  getSocketClient,
  getReceiverSocketId,
  getSocketClients,
};
