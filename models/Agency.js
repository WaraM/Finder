var mongoose = require('mongoose');

//Agency Schema
var AgencySchema = new mongoose.Schema({
    name: {
        type: String
    },
    fonction: {
        type: String
    },
    intitule: {
        type: String
    },
    photo: {
        type: String
    },
    panorama: {
        type: String
    }
});

var Agency = module.exports = mongoose.model('Agency', AgencySchema);

module.exports.createAgency = function(newAgency, callback){
    newAgency.save(callback);
}
