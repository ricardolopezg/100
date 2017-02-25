'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const { ObjectID } = Schema.Types;

const MessageSchema = new Schema({
  by: { type: String, required: true },
  message: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  thread: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  edited: [{ type: Number }]
});

MessageSchema.statics = {
  findMessage(id) {
    return this.findById(id);
  },
  findByThread(thread) {
    return this.find({ thread });
  },
  create(by, message, thread) {
    const Msg = this;
    const msg = new Msg({ by, message, thread });
    return msg.save();
  },
  edit(_id, message) {
    return this.findMessage(_id).then(msg => msg.edit(message), error => Promise.reject(error));
  },
  delete(id) {
    return this.findByIdAndRemove(id).then(doc => {
      return doc;
    }, error => {
      console.log(error);
      return error;
    });
  }
};

MessageSchema.methods = {
  edit(message) {
    const msg = this;
    msg.edited ? undefined : msg.edited = true;
    msg.updatedAt = Date.now();
    message ? msg.message = message : undefined;
    return msg.save();
  }
};

// MessageSchema.pre('save', function(next) {
//   const msg = this;
//   if (msg.isModified('password')) {
//     //msg.hashPassword(user.password).then(next).catch(e => next(e));
//   } else next();
// });

MessageSchema.virtual('createdAt').get(function () {
  return this._id.getTimestamp();
});

MessageSchema.set('toJSON', { getters: false, virtuals: true });

const Message = mongoose.model('Message', MessageSchema);

module.exports = { Message };
