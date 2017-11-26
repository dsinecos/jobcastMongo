var mongoose = require('mongoose');
var passport = require('passport');

var jobProfile = require('./jobprofileSchema.js');
var user = require('../user/userSchema.js');

var onSuccessAbstract = require('./onSuccessAbstract.js');
var onErrorAbstract = require('./onErrorAbstract.js');
var isUserAuthorizedForJobProfile = require('./isUserAuthorizedForJobProfile.js');

module.exports = putJobProfileByID;

function putJobProfileByID(req, res, next) {

    var jobProfileID = req.params.id;
    var userID = req.user._id;
    var jobProfile = {
        jobTitle: req.body.jobTitle,
        jobDescription: req.body.jobDescription,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        createdBy: userID
    };

    var onSuccess = onSuccessAbstract(res);
    var onError = onErrorAbstract(next);
    var updateJobProfile = updateJobProfileAbstract(onSuccess, onError);
    var onValidatingUserAuthorization = function (err, isUserAuthorizedForJobProfile) {

        if (err) {
            onError(err);
        }

        if (isUserAuthorizedForJobProfile) {
            updateJobProfile(jobProfileID, userID, jobProfile);
        } else {
            onSuccess(401, "Unauthorized access", null);
        }
    }

    isUserAuthorizedForJobProfile(jobProfileID, userID, onValidatingUserAuthorization);
}

function updateJobProfileAbstract(onSuccess, onError) {
    return function (jobProfileID, userID, jobProfileData) {

        jobProfile.findByIdAndUpdate(jobProfileID, {
            jobTitle: jobProfileData.jobTitle,
            jobDescription: jobProfileData.jobDescription,
            companyName: jobProfileData.companyName,
            companyDescription: jobProfileData.companyDescription,
            createdBy: userID
        }, function (err, jobProfile) {
            if (err) {
                onError(err)
            }

            onSuccess(200, "Job Profile updated", jobProfile);
        })
    }
}
