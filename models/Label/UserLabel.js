var mongoose = require('mongoose');
var extend = require('mongoose-extend-schema');

var Label = require('Label');
var User = require('../User.js')

/**
 *    UserLabel
 * user
 */

//UserLabel Schema
var UserLabelSchema = extend(Label.schema(), {
    user: {
        type: User,
        required: true
    }
});

var UserLabel = module.exports = mongoose.model('UserLabel', UserLabelSchema);
module.exports.schema = function () { return UserLabelSchema; }

module.export.createLabel = function(newLabel, callback){
    newLabel.save(callback);
}