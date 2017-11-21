var mongoose = require('mongoose');

// Setting up Schema for jobProfile
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    jobProfiles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'JobProfile'
        }
    ]
    // jobProfiles: [Schema.Types.ObjectId]
}, { timestamp: true });

var user = mongoose.model('User', userSchema);

module.exports = user;
