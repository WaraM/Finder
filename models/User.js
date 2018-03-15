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
    adminForAgency: {
	    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Agency'}]
    },
    assignedToPole: {
	    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pole'}]
    },
    assignedToProject: {
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