var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Information concerning each Agent we have in our database (like the SAMU Social). 
// When he registers, he provides a fullName, a shortName, a password and an email.
// We then store the hash of the password (pwdHash)
// and we create for him an account (associated with an apiKey that we keep) on Datatrust.


var AgentSchema   = new Schema({
    fullName: String,
    shortName: String,
    pwdHash: String, 
    email: String,
    apiKey: String
});

module.exports = mongoose.model('Agent', AgentSchema);