var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var AgentSchema   = new Schema({
    name: String,
    namespace: String
});

module.exports = mongoose.model('Agent', AgentSchema);