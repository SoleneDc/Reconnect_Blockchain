var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var AgentSchema   = new Schema({
    fullName: String,
    shortName: String,
    pwdHash: String,
    email: String,
    apiKey: String
});

module.exports = mongoose.model('Agent', AgentSchema);