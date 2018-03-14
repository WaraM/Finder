var mongoose = require('mongoose');
var Right = require('Right');

/**
 *     Role
 * roleID
 * rightID
 * nom
 */

//Role Schema
var RoleSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    rights: {
        type: [Right]
    }
});

var Role = module.exports = mongoose.model('Role', RoleSchema);

module.exports.createRole = function(newRole, callback){
    newRole.save(callback);
}