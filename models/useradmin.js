// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserAdminSchema = new mongoose.Schema({
  id: String,
  email: String

});

// Export the Mongoose model
module.exports = mongoose.model('UserAdmin', UserAdminSchema);