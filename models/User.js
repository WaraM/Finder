var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Agency = require('../models/Agency');
var Pole = require('../models/Pole');
var Project = require('../models/Project');

/**
 *     User
 * username
 * password
 * nom
 * prénom
 * mail
 * photo
 */

//User Schema
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
    isSuperAdmin: {
	    type: Boolean,
        default: false
    },
    poles: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pole'}]
    },
    projects: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}]
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.addPole = function(user, pole) {
	user.poles.push(pole);
	user.save();
}

module.exports.addProject = function(user, project) {
	user.projects.push(project);
	user.save();
}
