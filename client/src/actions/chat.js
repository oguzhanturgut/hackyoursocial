import { USERLIST_ADD, USERNAME_ADD, MESSAGE_ADD } from './types';

export const receiveUsername = data => {
  return {
    type: USERNAME_ADD,
    payload: data,
  };
};

export const receiveUsers = data => {
  return {
    type: USERLIST_ADD,
    payload: data,
  };
};

export const receiveMessage = data => {
  return {
    type: MESSAGE_ADD,
    payload: data,
  };
};
