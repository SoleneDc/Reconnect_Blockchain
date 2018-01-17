var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var StampingSchema   = new Schema({
    agent: { type: Schema.Types.ObjectId , ref: 'Agent' },
    user_id: String,
    doc_name: String,
    ots_file: String
});

module.exports =  mongoose.model('Stamping', StampingSchema);