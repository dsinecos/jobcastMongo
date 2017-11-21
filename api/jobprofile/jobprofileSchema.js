var mongoose = require('mongoose');

// Setting up Schema for jobProfile
var Schema = mongoose.Schema;

var jobProfileSchema = new Schema({
    jobTitle: {
        type: String
    },
    jobDescription: {
        type: String
    },
    companyName: {
        type: String
    },
    companyDescription: {
        type: String
    },
    createdBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

var jobProfile = mongoose.model('JobProfile', jobProfileSchema);

module.exports = jobProfile;
