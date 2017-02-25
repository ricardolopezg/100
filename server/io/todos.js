'use strict';

const Todo = require('./../models/todo');

module.exports = function Todos (io) {
  const todos = io.of('/todos');

  const methods = {
    fetch(query, callback) {
      return Todo.fetch(query, callback);
    },
    create({ text }, callback) {
      return text ? Todo.create({ text }, callback) : callback({ error: 'text is required.' });
    },
    edit({ id, text, completed }, callback) {
      return id ? Todo.edit({ id, text, completed }, callback) : callback({ error: 'id is required.' });
    },
    delete({ id }, callback) {
      return id ? Todo.delete({ id }, callback) : callback({ error: 'id is required.' });
    }
  };

  todos.on('connection', socket => {
    const id = socket.id;
    console.log(`connection id: ${id}; connected to todos.`);

    socket.on('message', function (message, callback = () => undefined) {
      const { type, name, data } = JSON.parse(message);
      console.log(`connection id: ${id}; message:`, message);
      switch (type) {
        default : return callback();
        case 'method' : {
          console.log('todo method, name: ',name);
          switch (name) {
            default : return callback();
            case 'fetch' : return methods.fetch(data, callback);
            case 'create' : return methods.create(data, callback);
            case 'edit' : return methods.edit(data, callback);
            case 'delete' : return methods.delete(data, callback);
          }
        }
      }
    });

    socket.on('disconnect', function () {
      console.log(`connection id: ${id} has disconnected from todos.`);
    });
  });

  return todos;
};
