// ==================================================
// BASE CONFIG
// ==================================================

// Custom config
const config = require('./config.js').mongodb;
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
var stampings = require('./api/routes/stampings')
var agents = require('./api/routes/agents')

// Routes
app.use('/api/stampings', stampings);
app.use('/api/agents', agents);


// ==================================================
// START THE SERVER
// ==================================================

app.listen(port);
console.log('Magic happens on port ' + port);