var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Agent        = require('./agent');


var StampingSchema   = new Schema({
    agent: Agent,
    user_id: Number,
    doc_name: String,
    ots_file: String
});

module.exports = mongoose.model('Stamping', StampingSchema);