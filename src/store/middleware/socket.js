'use strict'

export default store => next => action => {
  const state = () => store.getState(), dispatch = store.dispatch, { type, data } = action;

  return /^message$/.test(type) && data ? (function socketio () {
    switch (type) {
      
    }
  }()) : next(action);
}
