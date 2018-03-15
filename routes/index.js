var express = require('express');
var router = express.Router();

var utilities = require('../utilities/utils');

var Agency = require('../models/Agency');

var errHandler = utilities.errHandler;

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

//Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
    console.log(req.user.username + " accessing root page");
    
    return Agency.find({}, 
        function(err, agencies){
            if (err) errHandler(err);
            console.log("returning agencies: " + agencies);
            return res.json(agencies);
        }
    );    
});

module.exports = router;
