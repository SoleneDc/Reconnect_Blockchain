var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Information concerning a stamping
// We have here some info about the agent who stamps the file

var StampingSchema   = new Schema({
    agentId: { type: Schema.Types.ObjectId , ref: 'Agent' },
    userId: String,
    fileName: String,
    hashFile: String
});

module.exports =  mongoose.model('Stamping', StampingSchema);