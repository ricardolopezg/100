'use strict';

const { Schema, model } = require('mongoose');

const { ObjectID } = Schema.Types;

const CommentsSchema = new Schema({
  postId: { type: ObjectID },
  userId: { type: ObjectID },
  body: { type: String } // text
});
const MediaSchema = new Schema({
  id: { type: ObjectID },
  label: { type: String }
});
const TagsSchema = new Schema({
  type: { type: String },
  name: { type: String },
  info: { type: String }
});
const FlagsSchema = new Schema({
  by: { type: String },
  when: { type: Date },
  why: { type: String }
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
  media: [MediaSchema],
//  tags: [TagsSchema],
  flags: [FlagsSchema],
  private: {
    type: Boolean
  }
});

PostSchema.statics = {
  createPost(uid, _post) {
    const post = new Post({
      uid, ..._post
    });

    return post.save();
  }
};

const Post = model('Post', PostSchema);

module.exports = { Post };
