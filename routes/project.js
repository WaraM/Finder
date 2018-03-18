var express = require('express');
var router = express.Router();

var Project = require('../models/Project');

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401);
    }
}

router.get('/', ensureAuthenticated, function(req, res){
    return Project.find({},
        function(err, projects){
            if (err) throw err;
            return res.json(projects);
        }
    );
});

router.get('/:id', ensureAuthenticated, function(req, res){
    return Project.findOne({_id: req.params.id},
        function(err, project){
            if (err) throw err;
            if (project == null) return res.sendStatus(404);

            return res.json(project);
        }
    );
});

router.delete('/:id', ensureAuthenticated, function(req, res){
    Project.findOne({_id: req.params.id},
        function(err, project){
            if (err) throw err;
            if (project == null) return res.sendStatus(204);

            if (req.user.isSuperAdmin) {
                Project.remove(project, function(err, project) {
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
        var newProject = new Project({
            name: name,
            photo: photo
        });
        Project.createProject(newProject, function(err, project){
            if (err) throw err;
        });
        res.status(201).send({project: newProject._id});
    }
});

module.exports = router;
