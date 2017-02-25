'use strict'

export default function localStorage (key, value) {
  const storage = window.localStorage || false, _key = storage.key, _clear = storage.clear
  return storage ? (
    key ? (
      value ? storage.setItem(`${key}`,value) : value === null ? storage.removeItem(key) : storage.getItem(key)
    ) : false
  ) : false
}
