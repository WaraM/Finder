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

module.exports = router;
