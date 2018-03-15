var express = require('express');
var router = express.Router();

var Agency = require('../models/Agency');

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect(401,'/login');
    }
}

router.get('/:id', ensureAuthenticated, function(req, res){
    return Agency.findOne({_id: req.params.id},
        function(err, agency){
            if (err) throw err;
            if (agency == null) return res.sendStatus(404);

            return res.json(agency);
        }
     );
});

router.delete('/:id', ensureAuthenticated, function(req, res){
    Agency.findOne({_id: req.params.id},
        function(err, agency){
            if (err) throw err;
            if (agency == null) return res.sendStatus(204);

            if (Agency.isUserAllowToAdministrate(agency, req.user) || req.user.isSuperAdmin) {
                Agency.remove(agency, function(err, agency) {
                    if (err) throw err;
                });
                return res.sendStatus(204);
            } else {
                return res.sendStatus(401);
            }
        }
    );
});

router.post('/create', ensureAuthenticated, function(req, res){
    if (!req.user.isSuperAdmin) res.sendStatus(401);

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
