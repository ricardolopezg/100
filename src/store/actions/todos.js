export const CREATE_TODO = 'CREATE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const CHANGE_TEXT = 'CHANGE_TEXT';

function actionDefine (type, key) {
  switch (key) {
    case 'create' :
      return function create () {
        return { type }
      }
    case 'delete' :
      return function del (index) {
        return { type, payload: { index } }
      }
    case 'change' :
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
  CHANGE_TEXT
]).reduce((a,b) => {
  const c = `${b}`, key = c.replace(/_TODO|_TEXT/,'').toLowerCase()
  return { ...a, [key]: actionDefine(b, key) }
}, {})
