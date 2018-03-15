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
    },
    administeredBy: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }
});

var Agency = module.exports = mongoose.model('Agency', AgencySchema);

module.exports.createAgency = function(newAgency, callback){
    newAgency.save(callback);
}

module.exports.isUserAllowToAdministrate = function(agency, user){
    return agency.administeredBy.indexOf(user._id) != -1;
}

module.exports.addAdministrator = function(agency, user) {
	agency.administeredBy.push(user);
    agency.save();
}
