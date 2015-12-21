import User from './user';

const mongoose = require('mongoose');

const model = mongoose.model('Article', {
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  photos: [String]
});

export default model;
