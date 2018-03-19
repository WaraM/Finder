var express = require('express');
var router = express.Router();

var Agency = require('../models/Agency');
var User = require('../models/User');
var Pole = require('../models/Pole');
var Plan = require('../models/Plan');

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

            if (Agency.isUserAllowToAdministrate(agency, req.user)) {
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

router.put('/:id', ensureAuthenticated, function(req, res) {
    Agency.findOne({_id: req.params.id},
        function(err, agency){
            if (err) throw err;
            if (agency == null) return res.sendStatus(404);

            if (Agency.isUserAllowToAdministrate(agency, req.user)) {

                var name = req.body.name;
                var fonction = req.body.fonction;
                var intitule = req.body.intitule;
                var lat = req.body.latitude;
                var lng = req.body.longitude;
                var country = req.body.country;
                var city = req.body.city;

                req.checkBody('name', 'Name is required').notEmpty();
                req.checkBody('fonction', 'Fonction is required').notEmpty();
                req.checkBody('intitule', 'Intitule is required').notEmpty();
                req.checkBody('latitude', 'Latitude is required').notEmpty();
                req.checkBody('longitude', 'Longitude is required').notEmpty();
                req.checkBody('country', 'Country is required').notEmpty();
                req.checkBody('city', 'City is required').notEmpty();

                var errors = req.validationErrors();
                if (errors){
                    return res.sendStatus(400);
                } else {
                    agency.name = name;
                    agency.fonction = fonction;
                    agency.intitule = intitule;
                    agency.photo = "test";
                    agency.panorama = "test";
                    agency.latitude = lat;
                    agency.longitude = lng;
                    agency.country = country;
                    agency.city = city;

                    agency.save(function(err){
                        if (err) throw err;
                    });
                    return res.sendStatus(204);
                }
            } else {
                return res.sendStatus(401);
            }
        }
    );
});

//Add a user as agency administrator
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
                    });
            });
        res.sendStatus(204);
    } else {
        res.sendStatus(403);
    }
});

//Add a pole to an agency
router.put('/:id/addpole/:pole', ensureAuthenticated, function(req, res) {
	Agency.findOne({_id : req.params.id},
		function(err, agency) {
			if (err) throw err;
			if (agency == null) return res.sendStatus(404);
			if (agency.administeredBy.contains(req.user)) {
				Pole.findOne({_id : req.params.pole},
					function(err,pole) {
						if (err) throw err;
                        if (pole == null) return res.sendStatus(404);
                        Agency.addPole(agency, pole);
                    });
                res.sendStatus(204);
			} else {
                res.sendStatus(403);
            }
        });
});

//Add a plan to an agency
router.put('/:id/addplan/:plan', ensureAuthenticated, function(req, res) {
	Agency.findOne({_id : req.params.id},
		function(err, agency) {
			if (err) throw err;
			if (agency == null) return res.sendStatus(404);
			if (agency.administeredBy.contains(req.user)) {
				Plan.findOne({_id : req.params.plan},
					function(err,plan) {
						if (err) throw err;
                        if (plan == null) return res.sendStatus(404);
                        Agency.addPlan(agency, plan);
                    });
                res.sendStatus(204);
			} else {
                res.sendStatus(403);
            }
        });
});

router.post('/create', ensureAuthenticated, function(req, res){
    if (!req.user.isSuperAdmin) res.sendStatus(403);

    var name = req.body.name;
	var fonction = req.body.fonction;
    var intitule = req.body.intitule;
    var lat = req.body.latitude;
    var lng = req.body.longitude;
    var country = req.body.country;
    var city = req.body.city;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('fonction', 'Fonction is required').notEmpty();
    req.checkBody('intitule', 'Intitule is required').notEmpty();
    req.checkBody('latitude', 'Latitude is required').notEmpty();
    req.checkBody('longitude', 'Longitude is required').notEmpty();
    req.checkBody('country', 'Country is required').notEmpty();
    req.checkBody('city', 'City is required').notEmpty();

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
            longitude: lng,
            country: country,
            city: city
        });
        Agency.createAgency(newAgency, function(err, agency){
           if (err) throw err;
        });
        res.status(201).send({agency: newAgency._id});
    }
});

module.exports = router;
