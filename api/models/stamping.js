var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Information concerning a Stamping
// We have here some info about the agent (who stamps the file), the fileName and the hash of the file (hashFile)
// The userId is meant to be used as desired by the agent (referring to the user id in its own system)

var StampingSchema   = new Schema({
    agentId: { type: Schema.Types.ObjectId , ref: 'Agent' },
    userId: String,
    fileName: String,
    hashFile: String
});

module.exports =  mongoose.model('Stamping', StampingSchema);