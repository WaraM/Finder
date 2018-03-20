var express = require('express');
var router = express.Router();

var User = require('../models/User');

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401);
    }
}

router.get('/', ensureAuthenticated, function(req, res){
    return User.find({},
        function(err, users){
            if (err) throw err;
            return res.json(users);
        }
    );
});

router.get('/:id', ensureAuthenticated, function(req, res){
    return User.findOne({_id: req.params.id},
        function(err, user){
            if (err) throw err;
            if (user == null) return res.sendStatus(404);

            return res.json(user);
        }
    );
});

router.get('/:id/projects', ensureAuthenticated, function(req, res){
    return User.findOne({_id: req.params.id},
        function(err, user){
            if (err) throw err;
            if (user == null) return res.sendStatus(404);
            return res.json(user);
        }
    );
});

router.get('/:id/poles', ensureAuthenticated, function(req, res){
    return User.findOne({_id: req.params.id},
        function(err, user){
            if (err) throw err;
            if (user == null) return res.sendStatus(404);

            return res.json(user);
        }
    );
});

router.put('/:id', ensureAuthenticated, function(req, res) {
    User.findOne({_id: req.params.id},
        function(err, user){
            if (err) throw err;
            if (user == null) return res.sendStatus(404);

            if (user == req.user || req.user.isSuperAdmin) {
                var newPass = req.body.password;
                var name = req.body.name;
                var email = req.body.email;
                var errors = req.validationErrors();
                if (errors){
                    return res.sendStatus(400);
                } else {
                    user.password = newPass;
                    user.name = name;
                    user.email = email;

                    user.save(function(err){
                        if (err) throw err;
                    });
                    return res.sendStatus(204);
                }
            } else {
                return res.sendStatus(403);
            }
        }
    );
});

router.delete('/:id', ensureAuthenticated, function(req, res){
    User.findOne({_id: req.params.id},
        function(err, user){
            if (err) throw err;
            if (user == null) return res.sendStatus(204);

            if (req.user.isSuperAdmin) {
                User.remove(user, function(err, user) {
                    if (err) throw err;
                });
                return res.sendStatus(204);
            } else {
                return res.sendStatus(401);
            }
        }
    );
});

module.exports = router;
