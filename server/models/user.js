'use strict'

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const { ObjectID } = mongoose.Schema.Types;

const JWT_SECRET = process.env.JWT_SECRET || 'openseseme';

const LocSchema = new mongoose.Schema({
  loc: {
    type: String,
    coordinates: [Number]
  },
  name: { $type: String }
}, { typeKey: '$type', _id: false });

const ProfileSchema = new mongoose.Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  avatar: {
    type: String
  }
}, { _id: false });

const TokenSchema = new mongoose.Schema({
  access: {
    type: String
  },
  token: {
    type: String
  }
}, { _id: false });

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
    minlength: 3
  },
  profile: {
    type: ProfileSchema
  },
  messages: {
    type: Array
  },
  // username: {
  //   type: String,
  //   trim: true,
  //   minlength: 1,
  //   unique: true
  // },
  tokens: [TokenSchema]
});

// middleware hooks | pre & post
UserSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.hashPassword(user.password).then(user => {
      return next();
      // return Promise.resolve(user);
    }).catch(e => next(e));
  } else if (user.isModified('email.address') && user.email.verified) {
    user.email.verified = false;
    return next();
    // return Promise.resolve(user);
  } else next();
});
UserSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});


// members on the Model
UserSchema.statics = {
  create({ email, password }, options) {
    const User = this;
    const user = new User({
      email: { address: email, verified: false }, password, tokens: []
    });
    const token = jwt.sign({ _id: user._id, access: 'auth' }, JWT_SECRET);

    user.tokens.push({ access: 'auth', token },{
      access: 'verify', token: jwt.sign({ email, access: 'verify' }, JWT_SECRET)
    }); // sendVerificationEmail.
    console.log('creating user: ', email, password, user);

    return user.save().then(user => {
      console.log('created user: ', user);
      return Promise.resolve({ user, token });
    }).catch(error => Promise.reject(error));
  },
  findByEmail(email) {
    return this.findOne({ 'email.address': email.toLowerCase() });
  },
  findByUsername(username) {
    return this.findOne({ username: username.toLowerCase() });
  },
  findByToken (token) {
    return this.validateToken('auth', token);
  },
  sendVerificationEmail(email) {},
  verifyEmail(token) {
    return this.validateToken('verify', token).next(user => {
      user.email.verified = true;
      return user.save();
    }).catch(error => error);
  },
  validateToken(access, token) {
    var decoded;
    try { decoded = jwt.verify(token, JWT_SECRET); } catch (e) { return Promise.reject(e); }

    return this.findOne({
      ...decoded, 'tokens.token': token, 'tokens.access': access
    });
  },
  loginUser ({ email, username }, password) {
    const User = this, use = email ? User.findByEmail(email) : username ? User.findByUsername(username) : null;
    console.log('logging in: ', email, password);
    return use ? use.then(user => {
      return user.checkPassword(password, user.password).then(verdict => {
        return verdict ? Promise.resolve(user) : Promise.reject(new Error('incorrect password.'));
      },error => Promise.reject(error));
    }, error => Promise.reject(error)) : Promise.reject(new Error('credentials required.'));
  }
};

// members on the documents.
UserSchema.methods = {
  changePassword(pass, word) {
    const user = this;
    user.checkPassword(pass).then(verdict => {
      if (!verdict) return Promise.reject(new Error('password does not match.'));
      user.password = word;
      return user.save();
    }).catch(error => error);
  },
  checkPassword(password) {
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
    console.log('hashing password: ', password, user);
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (error, salt) => {
        if (error) return reject(error);
        bcrypt.hash(password, salt, (error, hash) => {
          if (error) return reject(error);
          user.password = hash;
          return resolve(user);
        });
      });
    });
  },
  generateToken(access, o = {}) {
    const token = jwt.sign({ ...o, access }, JWT_SECRET);
    console.log('generating token: ', token);
    this.tokens.push({ access, token });
    return this.save().then(() => token);
  },
  generateAuthToken() {
    return this.generateToken('auth', { _id: this._id.toHexString() });
  },
  generateVerificationToken() {
    // send email with every new token
    return this.generateToken('verify', { email: this.email.address });
  },
  uploadAvatar(img) {
    const user = this;
  },
  toJSON() {
    const user = this;
    const body = _.pick(user.toObject(), '_id', 'email', 'profile', 'avatar');
    return body;
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
