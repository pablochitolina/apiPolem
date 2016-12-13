// Load required packages
var express = require('express');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/contpolem');

var bodyParser = require('body-parser');
var polemController = require('./controllers/polem');
var app = express();
var router = express.Router();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, data");
  next();
});

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({
  extended: true
}));

router.route('/previsaomodelo/:data')
  .get(polemController.getPrevModelo);

router.route('/previsaomodelo')
  .post(polemController.postPrevModelo);

// Register all our routes with /api
app.use('/api', router);

app.listen(80, function () {
  console.log("Node server listening on port 80")
});