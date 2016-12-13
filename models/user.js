// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  lastName: String,
  idUserFB: String,
  gender: String,
  birthday: String,
  testes: [{nomeTeste: String, idResposta: String}]
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);