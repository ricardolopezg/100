export const SOCKET_MESSAGE = 'SOCKET_MESSAGE';
export const SOCKET_EMIT = 'SOCKET_EMIT';

function actionDefine (type, key) {
  switch (key) {
    case 'message' :
      return function message (message, data) {
        return { type, message, data }
      }
    case 'emit' :
      return function emit (message, data) {
        return { type, message, data }
      }
    default:
      return function noop () { return undefined }
  }
}

export default ([
  SOCKET_MESSAGE,
  SOCKET_EMIT
]).reduce((a,b) => {
  const c = `${b}`, key = c.replace(/SOCKET_/,'').toLowerCase()
  return { ...a, [key]: actionDefine(b, key) }
}, {})
