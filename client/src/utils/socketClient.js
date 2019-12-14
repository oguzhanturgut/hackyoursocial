import io from 'socket.io-client';
import store from './../store';
import { setAlert } from './../actions/alert';
import { loadUser } from './../actions/auth';

// if (process.env.NODE_ENV === "production") {
//   process.env.HOSTNAME = "https://whispering-inlet-00905.herokuapp.com/";
// } else if (process.env.NODE_ENV === "development") {
//   process.env.HOSTNAME = "localhost:5000";
// }

export const socket = io();

export const socketClient = () => {
  socket.on('sendFriendRequest', data => {
    store.dispatch(loadUser());
    store.dispatch(setAlert(data.notification, 'info'));
  });
  socket.on('cancelFriendRequest', data => {
    store.dispatch(loadUser());
    store.dispatch(setAlert(data.notification, 'info'));
  });
  socket.on('acceptFriendRequest', data => {
    store.dispatch(loadUser());
    store.dispatch(setAlert(data.notification, 'success'));
  });
  socket.on('removeFriend', data => {
    store.dispatch(loadUser());
    store.dispatch(setAlert(data.notification, 'danger'));
  });
};

export const socketActions = (res, eventType) => {
  socket.emit('sendFriendAction', {
    senderId: res.data.senderId,
    senderName: res.data.senderName,
    receiverId: res.data.receiverId,
    receiverName: res.data.receiverName,
    eventType: eventType,
    notification: res.data.notification,
  });
};

export const socketEmit = res => {
  socket.emit('sendAuth', res.data._id);
};

// export const socketActions = (res) => {
//   socket.emit('sendFriendAction', {
//     senderId: res.data.senderId,
//     senderName: res.data.senderName,
//     receiverId: res.data.receiverId,
//     receiverName: res.data.receiverName,
//     eventType: 'sendFriendRequest',
//     notification: res.data.notification,
//   });
// }
