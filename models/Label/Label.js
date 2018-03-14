var mongoose = require('mongoose');

/**
 *     Label
 * id
 * posX
 * posY
 */

//Label Schema
var LabelSchema = mongoose.Schema({
    code: {
        type: String,
        index: true
    },
    positionX: {
        type: Number
    },
    positionY: {
        type: Number
    }
});

var Label = module.exports = mongoose.model('Label', LabelSchema);
module.exports.schema = function () { return LabelSchema; }

module.exports.createLabel = function(newLabel, callback){
    newLabel.save(callback);
}