'use strict'

export default store => next => action => {
  const state = () => store.getState().toJS(), dispatch = store.dispatch, { type, data } = action;

  return /^message$/.test(type) && data ? (function () {
    
  }()) : next(action);
}
