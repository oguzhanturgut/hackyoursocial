import { USERLIST_ADD, USERNAME_ADD, MESSAGE_ADD } from './../actions/types';

const initialState = {
  messages: [],
  userlist: [],
  username: null,
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case MESSAGE_ADD: {
      return {
        ...state,
        messages: Array.from(new Set([...state.messages, payload])),
      };
    }
    case USERLIST_ADD: {
      return {
        ...state,
        userlist: payload,
      };
    }
    case USERNAME_ADD: {
      return {
        ...state,
        username: payload,
      };
    }
    default:
      return state;
  }
}
