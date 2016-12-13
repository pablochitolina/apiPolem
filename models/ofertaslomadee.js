// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var OfertasLomadeeSchema = new mongoose.Schema({
  link: String,
  nome: String
});

// Export the Mongoose model
module.exports = mongoose.model('OfertasLomadee', OfertasLomadeeSchema);