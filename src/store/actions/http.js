export const HTTP_REQUEST = 'HTTP_REQUEST';
export const HTTP_GET = 'HTTP_GET';
export const HTTP_POST = 'HTTP_POST';
export const HTTP_PUT = 'HTTP_PUT';
export const HTTP_DEL = 'HTTP_DEL';

function actionDefine (type, key) {
  switch (key) {
    case 'request' :
      return function request (url) {
        return function (dispatch, getState, { fetch }) {
          return new Promise((resolve, reject) => {
            return fetch.request(url).then(response => {
              console.log(response); return resolve(response)
            }).catch(error => {
              console.log(error); return reject(error)
            })
          })
        }
      }
    case 'get' :
      return function get (url) {
        return function (dispatch, getState, { fetch }) {
          fetch.get(url).then(response => console.log(response)).catch(error => console.log(error))
        }
      }
    case 'post' :
      return function post (url) {
        return function (dispatch, getState, { fetch }) {
          fetch.post(url).then(response => console.log(response)).catch(error => console.log(error))
        }
      }
    case 'put' :
      return function put (url) {
        return function (dispatch, getState, { fetch }) {
          fetch.put(url).then(response => console.log(response)).catch(error => console.log(error))
        }
      }
    case 'del' :
      return function del (url) {
        return function (dispatch, getState, { fetch }) {
          fetch.delete(url).then(response => console.log(response)).catch(error => console.log(error))
        }
      }
    default:
      return function noop () { return undefined }
  }
}

export default ([
  HTTP_REQUEST,
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DEL
]).reduce((a,b) => {
  const c = `${b}`, key = c.replace(/HTTP_/,'').toLowerCase()
  return { ...a, [key]: actionDefine(b, key) }
}, {})
