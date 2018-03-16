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

//Register : POST
router.post('/register',
    function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info){
            if (err) res.status(err).send(info);
            if (!user) res.status(400).send(info);
            else {
                req.login(user, function(err){
                    if (err) throw err;
                    else res.status(200).send(info);
                });
            }
        })(req, res, next);
    }
);

//Login : POST
router.post('/login',
    function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info){
            if (err) res.status(err).send(info);
            if (!user) res.status(400).send(info);
            else {
                req.login(user, function(err){
                    if (err) throw err;
                    else res.status(200).send(info);
                });
            }
        })(req, res, next);
    }
);

//Logout : GET
router.get('/logout', ensureAuthenticated,
    function(req, res) {
        console.log(req.user.username + " is now disconnected");
        req.logout();
        req.session.destroy();
        res.sendStatus(200);
    }
);

module.exports = router;
