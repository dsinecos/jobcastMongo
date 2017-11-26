var mongoose = require('mongoose');
var passport = require('passport');

var jobProfile = require('./jobprofileSchema.js');
var user = require('../user/userSchema.js');

var onSuccessAbstract = require('./onSuccessAbstract.js');
var onErrorAbstract = require('./onErrorAbstract.js');
var isUserAuthorizedForJobProfile = require('./isUserAuthorizedForJobProfile.js');

module.exports = getJobProfileByID;

function getJobProfileByID(req, res, next) {

    var jobProfileID = req.params.id;
    var userID = req.user._id;

    var onError = onErrorAbstract(next);
    var onSuccess = onSuccessAbstract(res);
    var getJobProfile = getJobProfileAbstract(onSuccess, onError);

    var onValidatingUserAuthorization = function (err, isUserAuthorizedForJobProfile) {

        if (err) {
            onError(err);
        }

        if (isUserAuthorizedForJobProfile) {
            getJobProfile(jobProfileID);
        } else {
            onSuccess(401, "Unauthorized access", null);
        }
    }

    isUserAuthorizedForJobProfile(jobProfileID, userID, onValidatingUserAuthorization);
}

function getJobProfileAbstract(onSuccess, onError) {

    return function (jobProfileID) {

        jobProfile.findById(jobProfileID, function (err, jobProfile) {

            if (err) {
                onError(err);
            } else {
                onSuccess(200, "Job Profile retrieved from database", jobProfile);
            }
        });
    }
}