'use strict';

var APP_BASE = process.cwd();
var logger = require(APP_BASE + '/utils/logger')(module.filename);
logger.debug('Initializing model.sequence');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sequenceSchema = new Schema({
    _id: String,
    seq: {type: Number, default: 1}
});

var Sequence = mongoose.model('Sequence', sequenceSchema);

/*
CounterSchema.statics.increment = function (counter, callback) {
    return this.findByIdAndUpdate(counter, { $inc: { next: 1 } }, {new: true, upsert: true, select: {next: 1}}, callback);
};

Cat.findByIdAndUpdate(id, update, function (err, cat) {
    if (err) {}
    render('cat', cat);
});

Counter.getNextSequence = function(model_name, callback) {
    var ret = db.counters.findAndModify(
        {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
        }
    );
    return ret.seq;
}
*/

Sequence.next_seq = function(modelName, callback) {
    return this.findByIdAndUpdate(
        modelName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true, select: {seq: 1}},
        callback
    );
}

module.exports = Sequence;
