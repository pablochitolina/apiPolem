// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var TesteSchema = new mongoose.Schema({
  nomeTeste: { type: String, unique: true },
  pergunta: String,
  resumo: String,
  respostas: [{
    desc1: String,
    desc2: String,
    desc3: String,
    desc4: String
  }]

});

// Export the Mongoose model
module.exports = mongoose.model('Teste', TesteSchema);