'use strict'

var express = require('express');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./../db/mongoose');
var { Todo } = require('./../models/todo');
var { User } = require('./../models/user');

var api = express.Router();

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
