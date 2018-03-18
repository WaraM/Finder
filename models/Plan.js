var mongoose = require('mongoose');

var PlanSchema = new mongoose.Schema({
    name: {
        type: String
    },
    photo: {
        type: String
    }
});

var Plan = module.exports = mongoose.model('Plan', PlanSchema);

module.exports.createPlan = function(newPlan, callback){
    newPlan.save(callback);
}