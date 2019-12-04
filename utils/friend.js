const socketClients = [];

const addSocketClient = ({ id, senderName, senderId, receiverName, receiverId }) => {
  // Store user
  const socketClient = { id, senderName, senderId, receiverName, receiverId };

  socketClients.push(socketClient);
  return { socketClient };
};

const removeSocketClient = id => {
  const index = socketClients.findIndex(socket => socket.id === id);

  if (index !== -1) {
    return socketClients.splice(index, 1)[0];
  }
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
