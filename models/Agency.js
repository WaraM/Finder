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
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    administeredBy: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
    poles: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pole'}]
    },
    plans: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Plan'}]
    }
});

var Agency = module.exports = mongoose.model('Agency', AgencySchema);

module.exports.createAgency = function(newAgency, callback){
    newAgency.save(callback);
}

module.exports.isUserAllowToAdministrate = function(agency, user){
    return (agency.administeredBy.indexOf(user._id) != -1 || user.isSuperAdmin);
}

module.exports.addAdministrator = function(agency, user) {
	agency.administeredBy.push(user);
    agency.save();
}

module.exports.addPole = function(agency, pole) {
	agency.poles.push(pole);
	agency.save();
}

module.exports.addPlan = function(agency, plan) {
    agency.plans.push(plan);
    agency.save();
}
