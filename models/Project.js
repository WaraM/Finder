var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    photo: {
        type: String
    }
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);

module.exports.createProject = function(newProject, callback){
    newProject.save(callback);
}