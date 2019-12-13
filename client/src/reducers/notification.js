import {
  GET_NOTIFICATIONS,
  NOTIFICATIONS_ERROR,
  DELETE_NOTIFICATION,
  UPDATE_NOTIFICATION,
} from '../actions/types';

const initialState = {
  notifications: [],
  notification: null,
  loading: true,
  error: {},
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
        loading: false,
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification._id !== payload),
        loading: false,
      };
    case UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification._id !== payload),
        loading: false,
      };
    case NOTIFICATIONS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
