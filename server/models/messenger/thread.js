'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const { Message } = require('./message');

// Serves as a context for messages, a place to bind messages persistently like a key, which is the _id.
const PartySchema = new Schema({
  id: { type: String },
  present: { type: Boolean },
  time: { type: Number }
}, { _id: false });

const LoggingSchema = new Schema({
  action: { type: String },
  meta: { type: Object },
  time: { type: Number }
}, { _id: false });

const ThreadSchema = new Schema({
  title: {
    type: String,
    minlength: 1,
    trim: true
  },
  by: { type: String },
  stream: { type: Object },
  party: [PartySchema],
  logs: [LoggingSchema]
});

ThreadSchema.statics = {
  fetch() { return this.find({}); },
  findParties(by) { return this.find({ $or: [{by},{'party.id': by}] }); },
  fetchThreads(by) {
    return this.findParties(by).then(threads => {
      return Message.find({
        thread: threads.map(t => t._id)
      }).then(messages => {
        return Promise.resolve({ threads, messages });
      }, error => Promise.reject(error));

    },error => Promise.reject(error));
  },
  createParty(by, party = [], title) {
    const Thread = this;
    return (new Thread({ title, by, party: [
      ...party.map(id => typeof id === 'string' ? { id, present: false } : id),
      {id:by,present:true,time:Date.now()}
    ] })).log('created',{user:by});
  },
  joinParty(_id, userId) {
    return _id ? this.findOne({ _id }).then(thread => {
      if (thread) {
        thread.party = thread.party.reduce((a,b,i) =>  {
          return b.id == userId ? a.slice(1).concat(a[0]) : [b, ...a];
        },[{ id:userId, present:true, time:Date.now() }]).sort((a, b) => a.time > b.time ? 1 : -1);
        return thread.log('joined',{user:userId});
      } else return Promise.reject(new Error('Thread does not exist.'));
    }, error => Promise.reject(error)) : this.createParty(userId, []);
  },
  updateParty(_id, userId, party, title) {
    return this.findOne({ _id }).then(thread => {
      if (thread) {
        return thread.log('updated', {user:userId});
      } else return Promise.reject(new Error('Thread does not exist.'));
    }, error => Promise.reject(error));
  },
  leaveParty(_id, userId) {
    return this.findOne({ _id }).then(thread => {
      if (thread) {
        let session, time = session = Date.now();
        thread.party = thread.party.reduce((a,b,i) =>  {
          const match = b.id == userId;
          const next = match ? a.slice(1).concat([{...b, ...a[0]}]) : a.concat(b);
          match ? session -= b.time : undefined;
          return next;
        },[{ id:''+userId, present:false, time }]).sort((a, b) => a.time === b.time ? 0 : a.time > b.time ? 1 : -1);
        return thread.log('left',{user:userId, session});
      } else return Promise.reject(new Error('Thread does not exist.'));
    }, error => Promise.reject(error));
  },
  disbandParty(_id, userId) {
    return this.findOne({ _id }).then(thread => {
      if (thread) {
        if (userId === thread.by) thread.remove();
        else {
          thread.party.filter(member => member.id !== userId);
          return thread.log('removed',{user:userId});
        }
        return Promise.resolve(thread);
      } else return Promise.reject(new Error('Thread does not exist.'));
    }, error => Promise.reject(error));
  }
};

ThreadSchema.methods = {
  log(action, meta) {
    this.logs.push({ action, meta, time: Date.now() });
    return this.save();
  }
};

ThreadSchema.virtual('createdAt').get(function () {
  return this._id.getTimestamp();
});
ThreadSchema.virtual('vacant').get(function () {
  return !this.party.filter(member => member.present).length;
});

// ThreadSchema.virtual('messages').get(function () {
//   return Message.findByThread(this._id).then(messages => {
//     Promise.resolve({ thread: this.toObject(), messages: messages || [] });
//   }, error => Promise.reject(error));
// });

ThreadSchema.set('toJSON', { getters: false, virtuals: true });

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = { Thread, Message };
