// Load required packages
var mongoose = require('mongoose');


// Define our user schema
var PolemSchema = new mongoose.Schema({
  numPolem: {type: Number, default: 0},
  data: String
});

// Export the Mongoose model
module.exports = mongoose.model('Polem', PolemSchema);