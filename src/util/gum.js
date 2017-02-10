'use strict';

export function GUM (constraints) {
  const navigator = window.navigator;
  if (navigator.mediaDevices === undefined) navigator.mediaDevices = {};
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
  else return navigator.mediaDevices.getUserMedia(constraints);
}

export function MediaRecorder (stream, opts = {}) {
  return 'MediaRecorder' in window ? (
    stream ? (new Promise((resolve, reject) => {
      const { mimeType, audioBitsPerSecond, videoBitsPerSecond, bitsPerSecond } = opts, options = {};

      if (mimeType && typeof mimeType === 'string' && 'isTypeSupported' in MediaRecorder && MediaRecorder.isTypeSupported(mimeType)) {
        options.mimeType = mimeType;
      } else if (mimeType instanceof Array) {
        for (let type of mimeType) {
          if (MediaRecorder.isTypeSupported(type)) {
            options.mimeType = type; break;
          }
        }
      }

      resolve(new MediaRecorder(stream, { ...opts, ...options }));
    })) : Promise.reject(new Error('Please pass in a media stream'))
  ) : Promise.reject(new Error('MediaRecorder not supported.'));
}
