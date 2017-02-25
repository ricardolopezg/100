'use strict';

export default function tokens (state = {
  local: {
    login: null
  },
  jwt: null
}, action) {
  const { type, key, value, set } = action;

  switch (type) {
    default: return state;
    case '@@redux/INIT': return state;
    case '@@tokens/KEYS': {
      set.forEach(([key, value]) => state.local[key] = value);
      return {...state};
    }
    case '@@tokens/SET': return {...state, local: { ...state.local, [key]: value } };
    case '@@tokens/REMOVE': {
      delete state.local[key];
      return {...state};
    }
    case '@@tokens/CLEAR': {
      return {...state, local: {}};
    }
  }
}
