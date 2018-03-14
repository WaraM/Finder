var mongoose = require('mongoose');

/**
 *    Right
 * name
 */

//Right Schema
var RightSchema = mongoose.Schema({
   name: {
       type: String,
       index: true,
       unique: true
   }
});

var Right = module.exports = mongoose.model('Right', RightSchema);

module.exports.createRight = function(newRight, callback){
    newRight.save(callback);
}