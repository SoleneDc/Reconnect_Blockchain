var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Information concerning each agent we have in our database (like the SAMU Social). 
// When he registers, he provides the fullName, shortName, password (pwdHash) and email, and we create for him an Id and an api_Key


var AgentSchema   = new Schema({
    fullName: String,
    shortName: String,
    pwdHash: String, 
    email: String,
    apiKey: String
});

module.exports = mongoose.model('Agent', AgentSchema);