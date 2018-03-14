var mongoose = require('mongoose');
var extend = require('mongoose-extend-schema');

var User = require('/models/Users/User');
var Project = require('/models/Project');
var Role = require('/models/Role');

/**
 *     ProjectUser
 * project
 * role
 */

var ProjectUserSchema = extend(User.schema(), {
   project: {
       type: Project,
       required: true
   },
   role: {
       type: Role,
       required: true
   }
});

var ProjectUser = module.exports = mongoose.model('ProjectUser', ProjectUserSchema);
module.exports.schema = function () { return ProjectUserSchema; }

module.export.createProjectUser = function(newUser, callback){
    newUser.save(callback);
}