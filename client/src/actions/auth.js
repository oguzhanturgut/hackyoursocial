import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  CONFIRM_EMAIL
} from "./types";
import setAuthToken from "../utils/setAuthToken";
import { socketEmit, socketActions } from "../utils/socketClient";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
    socketEmit(res);
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS
    });

    dispatch(setAlert(res.data.msg, "success"));

    dispatch(loadUser());

    return true;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
    return false;
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Confirm email
export const confirmEmail = token => async dispatch => {
  try {
    const res = await axios.put(`/api/users/confirm/${token}`);
    if (res.data.msg) dispatch(setAlert(res.data.msg, "success"));
    dispatch({ type: CONFIRM_EMAIL, payload: res.data });
    dispatch(loadUser());
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({ type: LOGIN_FAIL });
    return errors && errors[0].msg;
  }
};

// Resend email
export const resendEmail = email => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email });
  try {
    const res = await axios.post("/api/users/resend", body, config);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Friend Request
// Send Friend Request api/profile/friend/:id(receiver user id)
export const sendFriendRequest = id => async dispatch => {
  try {
    const res = await axios.post(`/api/profile/friend/${id}`);

    socketActions(res, "sendFriendRequest");
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));
  }
};
// Accept Friend Request api/profile/friend/:senderId
export const acceptFriendRequest = id => async dispatch => {
  try {
    const res = await axios.put(`/api/profile/friend/${id}`);
    socketActions(res, "acceptFriendRequest");
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));
  }
};
// Cancel Friend Request api/profile/friend/:senderId
export const cancelFriendRequest = id => async dispatch => {
  try {
    const res = await axios.patch(`/api/profile/friend/${id}`);
    socketActions(res, "cancelFriendRequest");
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));
  }
};
// Remove Friend api/profile/friend/:senderId
export const removeFriend = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/friend/${id}`);
    socketActions(res, "removeFriend");
    dispatch(loadUser());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));
  }
};
