import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import notification from './notification';
import chat from './chat';

export default combineReducers({
  alert,
  auth,
  profile,
  post,
  notification,
  chat,
});
