import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  SOCIAL_SUCCESS,
  SOCIAL_USER_LOADED,
  CONFIRM_EMAIL,
} from './types';
import setAuthToken from '../utils/setAuthToken';
import firebase from 'firebase/app';
import { socketEmit, socketActions } from '../utils/socketClient';

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
    socketEmit(res);
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Load Social User
export const loadSocialUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  console.log(localStorage.token);
  try {
    const res = await axios.get('/api/auth/facebook');
    console.log(res.data);
    dispatch({
      type: SOCIAL_USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Load Social User
export const loadSocialUserGoogle = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  console.log(localStorage.token);
  try {
    const res = await axios.get('/api/auth/google');
    console.log(res.data);
    dispatch({
      type: SOCIAL_USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
    });

    dispatch(setAlert(res.data.msg, 'success'));

    dispatch(loadUser());

    return true;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
    return false;
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, //token
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Any Social Login User

export const handleSocialLogin = (email, password) => async dispatch => {
  await firebase.auth().signInWithEmailAndPassword(email, password);

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    console.log(res);
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Facebook Register User
export const handleLoginFacebook = () => async dispatch => {
  const provider = new firebase.auth.FacebookAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  console.log(result);
  // const _id = result.user.uid;
  let name = result.user.displayName;
  const avatar = result.user.providerData[0].photoURL;
  // const date = result.user.metadata.creationTime;
  const email = result.user.email;
  const password = result.user.uid;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log('pass' + password);
  const body = JSON.stringify({ name, email, avatar, password });

  try {
    const res = await axios.post('/api/users/facebook', body, config);
    dispatch({
      type: SOCIAL_SUCCESS,
      payload: res.data,
    });
    dispatch(loadSocialUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Google Register User
export const handleLoginGoogle = () => async dispatch => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  console.log(result);
  // const _id = result.user.uid;
  let name = result.user.displayName;
  const avatar = result.user.providerData[0].photoURL;
  // const date = result.user.metadata.creationTime;
  const email = result.user.email;
  const password = result.user.uid;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, avatar, password });

  try {
    const res = await axios.post('/api/users/google', body, config);
    dispatch({
      type: SOCIAL_SUCCESS,
      payload: res.data,
    });
    dispatch(loadSocialUserGoogle());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Confirm email
export const confirmEmail = token => async dispatch => {
  try {
    const res = await axios.put(`/api/users/confirm/${token}`);
    if (res.data.msg) dispatch(setAlert(res.data.msg, 'success'));
    dispatch({ type: CONFIRM_EMAIL, payload: res.data });
    dispatch(loadUser());
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({ type: LOGIN_FAIL });
    return errors && errors[0].msg;
  }
};

// Resend email
export const resendEmail = email => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email });
  try {
    const res = await axios.post('/api/users/resend', body, config);
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Logout / Clear profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Friend Request
// Send Friend Request api/profile/friend/:id(receiver user id)
export const sendFriendRequest = id => async dispatch => {
  try {
    const res = await axios.post(`/api/profile/friend/${id}`);

    socketActions(res, 'sendFriendRequest');
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};
// Accept Friend Request api/profile/friend/:senderId
export const acceptFriendRequest = id => async dispatch => {
  try {
    const res = await axios.put(`/api/profile/friend/${id}`);
    socketActions(res, 'acceptFriendRequest');
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};
// Cancel Friend Request api/profile/friend/:senderId
export const cancelFriendRequest = id => async dispatch => {
  try {
    const res = await axios.patch(`/api/profile/friend/${id}`);
    socketActions(res, 'cancelFriendRequest');
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};
// Remove Friend api/profile/friend/:senderId
export const removeFriend = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/friend/${id}`);
    socketActions(res, 'removeFriend');
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};
