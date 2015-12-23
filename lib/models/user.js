const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

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
  }
});


userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


userSchema.pre('save', function(callback) {
  if (!this.isModified('password')) {
    return callback();
  }

  bcrypt.genSalt(5, (err, salt) => {
    if (err) {
      return callback(err);
    }

    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) {
        return callback(err);
      }

      this.password = hash;
      callback();
    })
  });
});

const model = mongoose.model('User', userSchema);

export default model;
