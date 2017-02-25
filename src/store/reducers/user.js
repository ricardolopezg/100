'use strict';

const CONSTANTS = [
  '@@user/LOGIN',
  '@@user/LOGOUT'
], [
  LOGIN,
  LOGOUT
] =CONSTANTS;

export default function User (state = {
  token: null,
  id: null,
  email: '',
  password: '',
  loggedIn: false
}, action) {
  const { type, user, token } = action;
  switch (type) {
    default: return state;
    case LOGIN: return { ...state, token, id: user._id, email: user.email, loggedIn: true };
    case LOGOUT: return { ...state, token: null, id: null, email: '', loggedIn: false };
  }
}
