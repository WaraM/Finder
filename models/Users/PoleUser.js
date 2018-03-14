var mongoose = require('mongoose');
var extend = require('mongoose-extend-schema');

var User = require('/models/Users/User');
var Pole = require('/models/Pole');

/**
 *     PoleUser
 * pole
 */

var PoleUserSchema = extend(User.schema(), {
    pole: {
        type: Pole,
        required: true
    }
});

var PoleUser = module.exports = mongoose.model('PoleUser', PoleUserSchema);
module.exports.schema = function () { return PoleUserSchema; }

module.export.createPoleUser= function(newUser, callback){
    newUser.save(callback);
}