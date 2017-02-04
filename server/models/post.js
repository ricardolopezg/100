'use strict'

const { Schema, model } = require('mongoose');

const { ObjectID } = Schema.Types;

const CommentsSchema = new Schema({
  postId: ObjectID,
  userId: ObjectID,
  body: String // text
});

const PostSchema = new Schema({
  uid: {
    type: ObjectID
  },
  caption: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  media: [{
    type: String,
    id: ObjectID
  }],
  tags: [{
    type: String
  }],
  comments: [CommentsSchema]
});

const Post = model('Post', PostSchema);

module.exports = { Post };
