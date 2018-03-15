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

router.get('/:id', ensureAuthenticated, function(req, res){
    return Agency.findOne({_id: req.params.id},
        function(err, agency){
            if (err) {
                errHandler(err);
                res.sendStatus(404);
            }
            return res.json(agency);
        }
     );
});

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
        var newAgency = new Agency({
            name: name,
            fonction: fonction,
            intitule: intitule,
            photo: "test",
            panorama: "test"
        });
        Agency.createAgency(newAgency, function(err, agency){
           if (err) throw err;
        });
        res.location('/agency/' + newAgency._id);
        res.sendStatus(201);
    }
});

module.exports = router;