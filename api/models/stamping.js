var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var StampingSchema   = new Schema({
    agentId: { type: Schema.Types.ObjectId , ref: 'Agent' },
    userId: String,
    fileName: String,
    HashFile: String
});

module.exports =  mongoose.model('Stamping', StampingSchema);