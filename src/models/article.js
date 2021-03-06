import mongoose from 'mongoose';

const model = mongoose.model('Article', {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  photos: [String]
});

export default model;
