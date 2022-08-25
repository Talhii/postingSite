var mongoose = require('mongoose');
//schema
var userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});
// Export Bio Model
var User = module.exports = mongoose.model('user', userSchema);

// module.exports.get = function (callback, limit) {
//    User.find(callback).limit(limit); 
// }