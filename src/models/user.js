import 'babel-core/polyfill';

import mongoose from 'mongoose';
import hasher from '../util/hasher';
import Buffer from 'buffer';

// define user schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  role: {
    type: String
  }
});


userSchema.methods.verifyPassword = function (password) {
  const salt = new Buffer(this.salt, 'hex');

  new Promise((resolve, reject) => {
    hasher({
      password: password,
      salt: salt
    }, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(this.password === result.key.toString('hex'))
    });
  });
};


userSchema.pre('save', function (callback) {
  if (!this.isModified('password')) {
    return callback();
  }

  const opts = {
    password: this.password
  };

  if (this.salt) {
    opts.salt = this.salt;
  }

  return hasher(opts, (err, result) => {
    if (err) {
      return callback(err);
    }

    this.salt = result.salt;
    this.password = result.key;

    return callback();
  });
});

const model = mongoose.model('User', userSchema);

export default model;
