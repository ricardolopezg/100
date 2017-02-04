'use strict'

const { model, Schema } = require('mongoose');
const validator = require('validator');

const { ObjectID } = Schema.Types;

const UserSchema = new Schema({
  email: {
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email.'
      }
    },
    validated: {
      type: Boolean,
      
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  usertag: {
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
}, {
  collection: 'users',
  minimize: true,
  retainKeyOrder: true
});

UserSchema.virtual('fullName').get(function () {
  return this.name.first + ' ' + this.name.last;
});

UserSchema.set('toObject', {
  virtuals: true,
  transform(user, ret, options) {
    return ret;
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = { User }
