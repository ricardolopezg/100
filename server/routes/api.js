'use strict'

const fs = require('fs');
const _ = require('underscore');
const express = require('express');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./../db/mongoose');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const api = express.Router();

// User routes.
api.route('/user')
.get((req, res) => {
  User.find().then((users) => {
    res.send({
      users
    });
  }, (e) => {
    res.status(400).send(e);
  });
})
.post((req, res) => {
  let body = _.pick(req.body, 'email', 'password');

  let user = User.createUser(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then(token => {
    res.header('x-auth', token).send(user);
  }).catch(e => {
    console.log('catch error: ', e);
    res.status(400).send(e);
  });
});

api.get('/user/me', (req, res) => {
  const token = req.header('x-auth');

  User.findByToken(token).then(user => {
    if (!user) return Promise.reject(new Error({ msg: 'user not found', token }));
    res.send(user);
  }).catch(e => {
    res.status(401).send();
  });
});

api.get('/user/avatar', (req, res) => {
  let token = req.header('x-auth');

  User.findByToken(token).then(user => {
    if (!user) return res.status(404).send();
    const path = { _id: user.avatar };
    mongoose.gfs.findOne(path, function (error, file) {
      if (error) return res.status(500).send();
      res.header({
        'Content-Type': file.content_type,
        'Content-Length': file.length
      });
      mongoose.gfs.createReadStream(path).pipe(res);
    });
  }).catch(e => res.status(401).send());
});

api.get('/user/avatar/:id', (req, res) => {
  let _id = req.param('id');

  mongoose.gfs.findOne({ _id }, function (error, file) {
    if (error) return res.status(500).send();
    res.header({
      'Content-Type': file.content_type,
      'Content-Length': file.length
    });
    mongoose.gfs.createReadStream(path).pipe(res);
  });
});

api.post('/user/avatar', (req, res, next) => {
  req.is('image/*') ? next() : res.status(400).send();
}, (req, res) => {
  let token = req.header('x-auth');

  User.findByToken(token).then(user => {
    if (!user) return res.status(404).send();

    let content_type = req.header('Content-Type');
    let filename = `avatar_${user._id}.jpeg`;

    const writestream = mongoose.gfs.createWriteStream({ filename, content_type });

    writestream.on('close', file => {
      user.avatar = file._id;

      user.save().then(() => {
        res.header({
          'Content-Type': content_type,
          'Content-Length': file.length
        });

        mongoose.gfs.createReadStream({
          _id: user.avatar,
          filename: `avatar_${user._id}.jpeg`
        }).pipe(res);
      }).catch(e => res.status(400).send());
    });

    writestream.on('error', e => res.status(500).end());

    req.pipe(writestream);
  }).catch(e => {
    res.status(401).send();
  });
});

api.get('/users', (req, res) => { //testing or for simple
  User.find({}).then(users => res.send(users)).catch(e => res.status(500).send(e));
});

// Todo routes.
api.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

api.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

api.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (ObjectID.isValid(id)) {
    return Todo.findById(id).then(todo => {
      if (todo) return res.status(200).send({ todo });
      res.status(404).send();
    }).catch(e => res.status(400).send());
  }
  res.status(404).send();
});

api.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (id && ObjectID.isValid(id)) {
    let { text, completed, completedAt } = req.body,
    body = { text, completed, completedAt };

    if (body.completed) body.completedAt = new Date().getTime();
    else body.completedAt = null;

    for (var key in body) {
      if (body[key] === undefined) delete body[key];
    }

    return Todo.findByIdAndUpdate(id, {
      $set: body
    }, {new: true}).then(todo => {
      if (todo) return res.status(200).send({ todo });
      res.status(404).send();
    }).catch(e => res.status(400).send());
  }
  res.status(404).send();
});

api.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (id && ObjectID.isValid(id)) {
    return Todo.findByIdAndRemove(id).then(todo => {
      if (todo) return res.status(200).send({
        todo, deleted: true
      });
      res.status(404).send();
    }).catch(e => res.status(400).send());
  }
  res.status(404).send();
});

module.exports = api;
