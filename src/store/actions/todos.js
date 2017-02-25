'use strict';

export const CREATE_TODO = 'CREATE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const FETCH_TODOS = 'FETCH_TODOS';

function actionDefine (type, key) {
  switch (key) {
    case 'create' :
      return function create (text) {
        return { type, text }
      }
    case 'delete' :
      return function del (index) {
        return { type, payload: { index } }
      }
    case 'update' :
      return function change (todo) {
        return { type, payload: {...todo} }
      }
    default:
      return function noop () { return undefined }
  }
}

export default ([
  CREATE_TODO,
  DELETE_TODO,
  UPDATE_TODO,
  FETCH_TODOS
]).reduce((a,b) => {
  const c = `${b}`, key = c.replace(/_TODO?S/,'').toLowerCase()
  return { ...a, [key]: actionDefine(b, key) }
}, {})
