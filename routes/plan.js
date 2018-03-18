var express = require('express');
var router = express.Router();

var Plan = require('../models/Plan');

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401);
    }
}

router.get('/', ensureAuthenticated, function(req, res){
    return Plan.find({},
        function(err, plans){
            if (err) throw err;
            return res.json(plans);
        }
    );
});

router.get('/:id', ensureAuthenticated, function(req, res){
    return Plan.findOne({_id: req.params.id},
        function(err, plan){
            if (err) throw err;
            if (plan == null) return res.sendStatus(404);

            return res.json(plan);
        }
    );
});

router.delete('/:id', ensureAuthenticated, function(req, res){
    Plan.findOne({_id: req.params.id},
        function(err, plan){
            if (plan) throw err;
            if (plan == null) return res.sendStatus(204);

            if (req.user.isSuperAdmin) {
                Plan.remove(plan, function(err, plan) {
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
    if (!req.user.isSuperAdmin) res.sendStatus(403);

    var name = req.body.name;
    var photo = req.body.photo;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('photo', 'Photo is required').notEmpty();

    var errors = req.validationErrors();
    if (errors){
        res.sendStatus(400);
    } else {
        var newPlan = new Plan({
            name: name,
            photo: photo
        });
        Plan.createPlan(newPlan, function(err, plan){
            if (err) throw err;
        });
        res.status(201).send({plan: newPlan._id});
    }
});

module.exports = router;
