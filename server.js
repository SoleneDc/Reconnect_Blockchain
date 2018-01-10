// ==================================================
// BASE CONFIG
// ==================================================

// Custom config
const config = require('./config.js');
var port = config.PORT || 8080;        // set our port

// Express
var express    = require('express');        // call express
var app        = express();                 // define our app using express

// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose
var mongoose   = require('mongoose');
mongoose.connect(config.db_uri, { useMongoClient: true })

// ==================================================
// ROUTER CONFIG
// ==================================================

// Imports
var bears = require('./api/routes/bears')
var bears = require('./api/routes/stampings')
// Routes
app.use('/api/bears', bears);

// ==================================================
// START THE SERVER
// ==================================================

app.listen(port);
console.log('Magic happens on port ' + port);