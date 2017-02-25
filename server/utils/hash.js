const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = function Hasher (config) {
  const { saltLength = 13 } = config || {};
  return {
    hash(string, length) {
      return bcrypt.genSalt(length || saltLength).then(salt => {
        return bcrypt.hash(string, salt);
      }).catch(error => Promise.reject(error));
      // return new Promise((resolve, reject) => {
      //   bcrypt.genSalt(saltLength, (error, salt) => {
      //     if (error) return reject({ error });
      //     bcrypt.hash(password, salt, (error, hash) => {
      //       if (error) return reject({ error });
      //       resolve({ hash });
      //     });
      //   });
      // });
    },
    checkHash(password, hash) { // returns promise.
      return bcrypt.compare(password, hash);
    },
    generateJWT(obj, secret) {
      return jwt.sign(obj, secret);
    },
    verifyJWT(token, secret) {
      return new Promise((resolve, reject) => {
        let decoded;
        try {
          decoded = jwt.verify(token, secret);
          resolve(decoded);
        } catch (error) {
          reject(error);
        }
      });
    }
  };
};
