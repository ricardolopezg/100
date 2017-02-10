'use strict'

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const { ObjectID } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
  email: {
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      lowercase: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email.'
      }
    },
    verified: {
      type: Boolean
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // usertag: {
  //   type: String,
  //   trim: true,
  //   minlength: 1,
  //   unique: true
  // },
  avatar: {
    type: String
  },
  tokens: [{
    access: {
      type: String
    },
    token: {
      type: String
    }
  }]
});

// middleware hooks | pre & post
UserSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.hashPassword(user.password).then(next).catch(e => next());
  } else next();
});
UserSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});


// members on the Model
UserSchema.statics = {
  createUser ({ email, password }, options) {
    const User = this;
    return new User({
      email: { address: email, verified: false },
      password: password
    });
  },
  findByToken (token) {
    const User = this;
    var decoded;

    try {
      decoded = jwt.verify(token, 'openseseme');
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }

    return User.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  },
  loginUser (email, password) {}
};

// members on the documents.
UserSchema.methods = {
  toJSON () {
    const user = this;
    const body = _.pick(user.toObject(), '_id', 'email', 'avatar');
    return body;
  },
  checkPassword(password, hash) {
    const user = this;
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, verdict) => {
        if (error) return reject(error);
        resolve(verdict);
      });
    });
  },
  hashPassword(password, options) {
    const user = this;
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (error, salt) => {
        if (error) return reject(error);
        bcrypt.hash(password, salt, (error, hash) => {
          if (error) return reject(error);
          user.password = hash;
          return resolve(user.save());
        });
      });
    });
  },
  generateAuthToken (type, cb) {
    const user = this;
    const secret = 'openseseme';
    const access = type || 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, secret);

    user.tokens.push({ access, token });

    return user.save().then(() => token);
  },
  uploadAvatar (img) {
    const user = this;
  },
  getPosts (cb) {
    const user = this;
    // this._id
  }
};

// virtual field names and their value.
// UserSchema.virtual('fullName').get(function () {
//   return this.name.first + ' ' + this.name.last;
// });
UserSchema.virtual('createdAt').get(function () {
  return this._id.getTimestamp();
});

UserSchema.set('toObject', {
  virtuals: true,
  transform(user, ret, options) {
    return ret;
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
