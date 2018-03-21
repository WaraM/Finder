var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        return res.sendStatus(401);
    }
}

router.get('/', ensureAuthenticated, function(req, res){
    return Label.find({},
        function(err, labels){
            if (err) throw err;
            return res.json(labels);
        }
    );
});

router.get('/:id', ensureAuthenticated, function(req, res){
    return Label.findOne({_id: req.params.id},
        function(err, label){
            if (err) throw err;
            if (label == null) return res.sendStatus(404);

            return res.json(label);
        }
     );
});

router.delete('/:id', ensureAuthenticated, function(req, res){
    Label.findOne({_id: req.params.id},
        function(err, label){
            if (err) throw err;
            if (label == null) return res.sendStatus(204);

            if (req.user.isSuperAdmin) {
                Label.remove(label, function(err, label) {
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
    Label.findOne({_id: req.params.id},
        function(err, label){
            if (err) throw err;
            if (label == null) return res.sendStatus(404);

            if (req.user.isSuperAdmin) {

                var name = req.body.name;
                var type = req.body.type;
                var object = req.body.object;
                var posX = req.body.posX;
                var posY = req.body.posY;

                req.checkBody('name', 'Name is required').notEmpty();
                req.checkBody('type', 'Type is required').notEmpty();
                req.checkBody('object', 'Object is required').notEmpty();
                req.checkBody('posX', 'PosX is required').notEmpty();
                req.checkBody('posY', 'PosY is required').notEmpty();
                var errors = req.validationErrors();
                if (errors){
                    return res.sendStatus(400);
                } else {
                    label.name = name;
                    label.type = type;
                    label.object = object;
                    label.posX = posX;
                    label.posY = posY;
                    agency.save(function(err){
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

router.post('/create', ensureAuthenticated, function(req, res){
    if (!req.user.isSuperAdmin) res.sendStatus(403);

    var name = req.body.name;
    var type = req.body.type;
    var object = req.body.object;
    var posX = req.body.posX;
    var posY = req.body.posY;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('type', 'Type is required').notEmpty();
    req.checkBody('object', 'Object is required').notEmpty();
    req.checkBody('posX', 'PosX is required').notEmpty();
    req.checkBody('posY', 'PosY is required').notEmpty();

    var errors = req.validationErrors();
    if (errors){
        res.sendStatus(400);
    } else {
        var newLabel = new Agency({
            name: name,
            type: type,
            object: object,
            posX: posX,
            posY: posY,
        });
        Label.createLabel(newLabel, function(err, label){
           if (err) throw err;
        });
        res.status(201).send({label: newAgency._id});
    }
});
