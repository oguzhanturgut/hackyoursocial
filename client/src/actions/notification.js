import axios from 'axios';
import { setAlert } from './alert';
import { GET_NOTIFICATIONS, NOTIFICATIONS_ERROR, DELETE_NOTIFICATION } from './types';

// Get Notifications
export const getNotifications = () => async dispatch => {
  try {
    const res = await axios.get('api/notification');

    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATIONS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete notification
export const deleteNotification = id => async dispatch => {
  try {
    await axios.delete(`/api/notification/${id}`);

    dispatch({
      type: DELETE_NOTIFICATION,
      payload: id,
    });

    dispatch(setAlert('Notification removed', 'success'));
  } catch (err) {
    dispatch({
      type: NOTIFICATIONS_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
