var mongoose = require('mongoose');
var Pole = require('../models/Pole');

var ProjectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    pole: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pole'}]
    },
    photo: {
        type: String
    }
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);

module.exports.createProject = function(newProject, callback){
    newProject.save(callback);
}