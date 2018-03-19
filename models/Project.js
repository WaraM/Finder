var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    photo: {
        type: String
    },
	administeredBy: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
	collaborators: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);

module.exports.createProject = function(newProject, callback){
    newProject.save(callback);
}

module.exports.isUserAllowToAdministrate = function(project, user){
    return (project.administeredBy.indexOf(user._id) != -1 || user.isSuperAdmin);
}

module.exports.addAdministrator = function(project, user) {
	project.administeredBy.push(user);
    project.save();
}

module.exports.addCollaborator = function(project, user) {
	project.collaborators.push(user);
	project.save();
}
