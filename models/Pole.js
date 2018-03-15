var mongoose = require('mongoose');
var Agency = require('../models/Agency');

var PoleSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    agency: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Agency'}]
    },
    photo: {
        type: String
    }
});

var Pole = module.exports = mongoose.model('Pole', PoleSchema);

module.exports.createPole = function(newPole, callback){
    newAgency.save(callback);
}