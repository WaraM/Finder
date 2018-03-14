var mongoose = require('mongoose');
var extend = require('mongoose-extend-schema');

var User = require('/models/Users/User');
var Agence = require('/models/Agency');

/**
 *     AdminUser
 * agency
 */

var AdminUserSchema = extend(User.schema(), {
    agency: {
        type: Agence,
        required: true
    }
});

var AdminUser = module.exports = mongoose.model('AdminUser', AdminUserSchema);
module.exports.schema = function () { return AdminUserSchema; }

module.export.createAdminUser = function(newUser, callback){
    newUser.save(callback);
}