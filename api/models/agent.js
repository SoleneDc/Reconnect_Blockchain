var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var AgentSchema   = new Schema({
    fullName: String,
    shortName: String,
    email: String,
    accountId: String,
    apiKey: String
});

module.exports = mongoose.model('Agent', AgentSchema);