const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const schema = mongoose.Schema({
  email: String,
  password: String,
  lastname: String,
  firstname: String
});

schema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const model = mongoose.model('User', schema);

export default model;
