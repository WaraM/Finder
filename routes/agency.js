var express = require('express');
var router = express.Router();

var utilities = require('../utilities/utils');
var passport = require('../utilities/passport');

var Agency = require('../models/Agency');

var errHandler = utilities.errHandler;

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

router.post('/create', ensureAuthenticated, function(req, res){
    var name = req.body.name;
	var fonction = req.body.fonction;
    var intitule = req.body.intitule;
    
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('fonction', 'Fonction is required').notEmpty();
    req.checkBody('intitule', 'Intitule is required').notEmpty();
    
    var errors = req.validationErrors();
    if (errors){
        res.sendStatus(400);
    } else {        
        console.log(req.user.username + " creating agency");
        res.sendStatus(201);
        res.redirect('/');
    }    
});

module.exports = router;