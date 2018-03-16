var express = require('express');
var router = express.Router();

var Agency = require('../models/Agency');
var User = require('../models/User');

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        return res.sendStatus(401);
    }
}

router.get('/', ensureAuthenticated, function(req, res){
    return Agency.find({},
        function(err, agencies){
            if (err) throw err;
            return res.json(agencies);
        }
    );
});

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

router.put('/:id/assign/:user', ensureAuthenticated, function(req, res) {
    if (req.user.isSuperAdmin) {
        Agency.findOne({_id : req.params.id},
            function(err, agency) {
                if (err) throw err;
                if (agency == null) return res.sendStatus(404);
                User.findOne({_id : req.params.user},
                    function(err, user) {
                        if (err) throw err;
                        if (user == null) return res.sendStatus(404);
                        Agency.addAdministrator(agency, user);
                    }
                );
            }
        );
        res.sendStatus(204);
    } else {
        res.sendStatus(403);
    }
});

router.post('/create', ensureAuthenticated, function(req, res){
    if (!req.user.isSuperAdmin) res.sendStatus(403);

    var name = req.body.name;
	var fonction = req.body.fonction;
    var intitule = req.body.intitule;
    var lat = req.body.latitude;
    var lng = req.body.longitude;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('fonction', 'Fonction is required').notEmpty();
    req.checkBody('intitule', 'Intitule is required').notEmpty();
    req.checkBody('latitude', 'Latitude is required').notEmpty();
    req.checkBody('longitude', 'Longitude is required').notEmpty();

    var errors = req.validationErrors();
    if (errors){
        res.sendStatus(400);
    } else {
        var newAgency = new Agency({
            name: name,
            fonction: fonction,
            intitule: intitule,
            photo: "test",
            panorama: "test",
            latitude: lat,
            longitude: lng
        });
        Agency.createAgency(newAgency, function(err, agency){
           if (err) throw err;
        });
        res.status(201).send({agency: newAgency._id});
    }
});

module.exports = router;
