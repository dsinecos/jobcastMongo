var mongoose = require('mongoose');
var passport = require('passport');

var jobProfile = require('./jobprofileSchema.js');
var user = require('../user/userSchema.js');

var onSuccessAbstract = require('./onSuccessAbstract.js');
var onErrorAbstract = require('./onErrorAbstract.js');
var isUserAuthorizedForJobProfile = require('./isUserAuthorizedForJobProfile.js');

module.exports = deleteJobProfileByID;

function deleteJobProfileByID(req, res, next) {

    var jobProfileID = req.params.id;
    var userID = req.user._id;

    var onSuccess = onSuccessAbstract(res);
    var onError = onErrorAbstract(next);
    var deleteJobProfile = deleteJobProfileAbstract(onSuccess, onError);
    var onValidatingUserAuthorization = function (err, isUserAuthorizedForJobProfile) {

        if (err) {
            onError(err);
        }

        if (isUserAuthorizedForJobProfile) {
            deleteJobProfile(jobProfileID, userID);
        } else {
            onSuccess(401, "Unauthorized access", null);
        }
    }

    isUserAuthorizedForJobProfile(jobProfileID, userID, onValidatingUserAuthorization);
}

function deleteJobProfileAbstract(onSuccess, onError) {
    return function (jobProfileID, userID) {

        jobProfile.findByIdAndRemove(jobProfileID, function (err, jobProfile) {
            if (err) {
                onError(err);
            }

            removeJobProfileIDFromUser(jobProfileID, userID);
        })

        function removeJobProfileIDFromUser(jobProfileID, userID) {

            user.findByIdAndUpdate(userID, { $pull: { jobProfiles: jobProfile._id } }, function (err, user) {
                if (err) {
                    onError(err);
                }
                onSuccess(200, "Job Profile successfully deleted using FP", user);
            })
        }
    }
}