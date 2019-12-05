import axios from 'axios';
import { setAlert } from './alert';
import { GET_NOTIFICATIONS, NOTIFICATIONS_ERROR } from './types';

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
