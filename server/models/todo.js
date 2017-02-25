'use strict';

const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const _ = require('underscore');

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

TodoSchema.statics = {
  fetch(query, callback) {
    return this.find(query || {}).then(todos => {
      callback({ data: todos || [] });
    }, error => callback({ error }));
  },
  create({ text }, callback) {
    const Todo = this, todo = new Todo({ text });

    todo.save().then(todo => callback({ data: todo }), error => callback({ error }));
  },
  edit({ id, text, completed }, callback) {
    const Todo = this, completedAt = completed ? Date.now() : null, body = {
      text, completed, completedAt
    };

    if (ObjectID.isValid(id)) {
      return Todo.findByIdAndUpdate(id, {
        $set: body
      }, {new: true}).then(todo => {
        if (todo) return callback({ data: todo });
        callback({ error: 'not found.' })
      }, error => callback({ error }));
    }
    callback({ error: 'invalid id.' });
  },
  delete({ id }, callback) {
    const Todo = this;
    if (ObjectID.isValid(id)) {
      return Todo.findByIdAndRemove(id).then(todo => {
        if (todo) return callback({ data: { ...todo._doc, deleted: true } });
        callback({ error: 'not found.' });
      }, error => callback({ error }));
    }
    callback({ error: 'invalid id.' });
  }
};

TodoSchema.methods = {
  updateText(text) {
    const todo = this;
  },
  updateStatus(completed) {
    // toggle if arg is undefined.
    const todo = this;
  }
};

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
