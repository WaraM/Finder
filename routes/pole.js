var express = require('express');
var router = express.Router();

var Pole = require('../models/Pole');

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401);
    }
}

router.get('/', ensureAuthenticated, function(req, res){
    return Pole.find({},
        function(err, poles){
            if (err) throw err;
            return res.json(poles);
        }
    );
});

router.get('/:id', ensureAuthenticated, function(req, res){
    return Pole.findOne({_id: req.params.id},
        function(err, pole){
            if (err) throw err;
            if (pole == null) return res.sendStatus(404);

            return res.json(pole);
        }
    );
});

router.delete('/:id', ensureAuthenticated, function(req, res){
    Pole.findOne({_id: req.params.id},
        function(err, pole){
            if (err) throw err;
            if (pole == null) return res.sendStatus(204);

            if (req.user.isSuperAdmin) {
                Pole.remove(pole, function(err, pole) {
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
    var desc = req.body.description;
    var photo = req.body.photo;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('photo', 'Photo is required').notEmpty();

    var errors = req.validationErrors();
    if (errors){
        res.sendStatus(400);
    } else {
        var newPole = new Pole({
            name: name,
            description: desc,
            photo: photo
        });
        Pole.createPole(newPole, function(err, pole){
            if (err) throw err;
        });
        res.status(201).send({pole: newPole._id});
    }
});

module.exports = router;
