var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/User');

//Passport
passport.use(new localStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
		if(err) throw err;
		if(!user) {
            console.log(username + " doesn't exist");
			return done(null, false, {message: 'Unknown User'});
		}
	    User.comparePassword(password, user.password, function(err, isMatch) {
		    if(err) throw err;
		    if(isMatch) {                
                console.log(username + " is now connected");
		    	return done(null, user);
		    } else {
                console.log(username + " wrong password");
		    	return done(null, false, {message: 'Invalid Password'});
		    }
	    });
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

module.exports = passport;