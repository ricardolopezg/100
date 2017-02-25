'use strict';

export default function tokens (state = {
  _supported: false,
  local: {
    login: null
  },
  jwt: null
}, action) {
  const { type, key, value, set } = action;

  switch (type) {
    default: return state;
    case '@@redux/INIT': {
      if (localStorage) {
        state._supported = true;
        for (var i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i), value = localStorage.getItem(key);
          state.local[key] = value;
        }
        return { ...state };
      } else return state;
    }
    case '@@tokens/SET': {
      if (state._supported) {
        localStorage.setItem(key, value);
        state.local[key] = value;
      }
      return {...state};
    }
    case '@@tokens/REMOVE': {
      if (state._supported) {
        localStorage.removeItem(key, value);
        delete state.local[key];
      }
      return {...state};
    }
    case '@@tokens/CLEAR': {
      localStorage.clear();
      return {...state, local: {}};
    }
  }
}
