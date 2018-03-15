// ==================================================
// BASE CONFIG
// ==================================================

// Custom config
const config   = require('./config.js');
var port = config.mongodb.PORT || 8080;     // set our port

// Express
var express    = require('express');        // call express
var app        = express();                 // define our app using express

// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Helmet
var helmet     = require('helmet');
app.use(helmet());

// ==================================================
// ROUTER CONFIG
// ==================================================

// Imports
var auth            = require('./api/routes/auth')
var stampings       = require('./api/routes/stampings')
var my_stampings    = require('./api/routes/my_stampings')
var agents          = require('./api/routes/agents')

// Routes
app.use('/api/auth', auth)
app.use('/api/stampings', stampings)
app.use('/api/my_stampings', my_stampings)
app.use('/api/agents', agents)

// ==================================================
// CONNECT DB AND START THE SERVER
// ==================================================

// Mongoose
var mongoose   = require('mongoose');
mongoose.connect(config.mongodb.db_uri, { useMongoClient: true })
var db = mongoose.connection;

// Start server
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
	app.listen(port);
	console.log('Magic happens on port ' + port);
});