var express = require('express');
var router = express.Router();

var passport = require('../utilities/passport');

var User = require('../models/User');

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401);
    }
}

//Register : GET
router.get('/register', function(req, res) {
	res.sendStatus(200);
});
//Register : POST
router.post('/register', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors) {
		res.sendStatus(400);
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});
		User.createUser(newUser, function(err, user) {
			if(err) throw err;
		});
		res.redirect('login');
	}
});

//Login : POST
router.post('/login',
	passport.authenticate('local', {successRedirect:'/', failureRedirect: 'login'}),
	function(req, res) {
		res.sendStatus(200);
	}
);

//Logout : GET
router.get('/logout', ensureAuthenticated,
	function(req, res) {
    	console.log(req.user.username + " is now disconnected");
    	req.logout();
    	req.session.destroy();
	    res.redirect('login');
	}
);

module.exports = router;
