// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var ContactSchema = new mongoose.Schema({
  email: String,
  name: String
});

// Export the Mongoose model
module.exports = mongoose.model('Contact', ContactSchema);