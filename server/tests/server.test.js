'use strict'

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const fixtures = require('./fixtures');
let count;

beforeEach((done) => {
  Todo.count({}).then(c => {
    count = c;
    done();
  });
  //Todo.remove({}).then(() => Todo.insertMany(fixtures.todos)).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((todos) => {
          //expect(todos.length).toBe(count);
          //expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(count);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(count);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo by id', (done) => {
    var id = '589363ba38d5283849e0ac1b';
    request(app)
      .get('/todos/'+ id)
      .expect(200)
      .expect(res => {
        expect(res.body.todo).toInclude({
          _id: id,
          text: 'first todo item.'
        });
      })
      .end(done);
  });

  it('should get no todo and return a 404', (done) => {
    request(app)
      .get('/todos/589356121d23b435deaf98')
      .expect(404)
      .end(done);
  });

  it('should get invalid todo request and return a 404', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete todo by id', (done) => {
    var id = '589363ba38d5283849e0ac1b';
    request(app)
      .delete('/todos/'+ id)
      .expect(200)
      .expect(res => {
        expect(res.body.todo).toInclude({
          _id: id,
          text: 'first todo item.'
        });
      })
      .end(done);
  });

  it('should return a 404 if no todo was found', (done) => {
    request(app)
      .delete('/todos/589356121d23b435deaf98')
      .expect(404)
      .end(done);
  });

  it('should return a 404 for an invalid id', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});
