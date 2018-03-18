var mongoose = require('mongoose');
var Agency = require('../models/Agency');

var PlanSchema = new mongoose.Schema({
    name: {
        type: String
    },
    agency: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Agency'}]
    },
    photo: {
        type: String
    }
});

var Plan = module.exports = mongoose.model('Plan', PlanSchema);

module.exports.createPole = function(newPole, callback){
    newPole.save(callback);
}