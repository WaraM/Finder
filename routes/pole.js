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

module.exports = router;
