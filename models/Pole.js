var mongoose = require('mongoose');

var Project = require('../models/Project');

var PoleSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    photo: {
        type: String
    },
    projects: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]
    },
	administeredBy: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }
});

var Pole = module.exports = mongoose.model('Pole', PoleSchema);

module.exports.createPole = function(newPole, callback){
    newPole.save(callback);
}

module.exports.isUserAllowToAdministrate = function(agency, user){
    return (agency.administeredBy.indexOf(user._id) != -1 || user.isSuperAdmin);
}

module.exports.addAdministrator = function(pole, user) {
	pole.administeredBy.push(user);
    pole.save();
}

module.exports.addProject = function(pole, project) {
	pole.projects.push(project);
	pole.save();
}
