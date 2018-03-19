var mongoose = require('mongoose');

/**
 *     Label
 * id
 * posX
 * posY
 */

//Label Schema
var LabelSchema = mongoose.Schema({
    name: {
		type : String
	},
	type: {
        type: Number
    },
	object: {
		type: String
	},
    posX: {
        type: Number
    },
    posY: {
        type: Number
    }
});

var Label = module.exports = mongoose.model('Label', LabelSchema);
module.exports.schema = function () { return LabelSchema; }

module.exports.createLabel = function(newLabel, callback){
    newLabel.save(callback);
}
