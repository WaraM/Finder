var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({passReqToCallback: true},
    function(req, username, password, done){
        process.nextTick(function(){
            User.findOne({username: username}, function(err, user){
                if (err) return done(err);
                if (user) return done(null, false, {message: "Username already exist"});

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
                    return done(null, false, {message: "Parameters invalid"});
                } else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    });
                    User.createUser(newUser, function(err, user) {
                        if(err) done(err);
                    });
                    console.log(username + " is now created and connected");
                    return done(null, newUser, {message: "User is now created"});
                }
            })
        })
    })
);

//Passport
passport.use('local-login',new LocalStrategy({passReqToCallback: true},
    function(req, username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) return done(err);
            if (!user) {
                console.log(username + " doesn't exist");
                return done(null, false, {message: "Username doesn't exist"});
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if(err) throw err;
                if(isMatch) {
                    console.log(username + " is now connected");
                    return done(null, user, {message: "User connected"});
                } else {
                    console.log(username + " wrong password");
                    return done(null, false, {message: "Password mismatch"});
                }
            });
        });
    }
));

module.exports = passport;