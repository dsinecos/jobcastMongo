var mongoose = require('mongoose');
var passport = require('passport');

var jobProfile = require('./jobprofileSchema.js');
var user = require('../user/userSchema.js');

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

function isUserAuthorizedForJobProfile(jobProfileID, userID, onValidatingUserAuthorization) {
    // Database call
    // Synchronize the database call using a promise
    // 1. Wrap in a function(resolve, reject)
    // 2. Complete the then/ catch loop

    function isUserAuthorizedForJobProfilePromise(resolve, reject) {
        console.log("Inside parent resolve/ reject");

        jobProfile.findById(jobProfileID, function (err, jobProfile) {

            if (err) {
                console.log("Inside reject side of findByID");
                reject(err);
            }
            if (String(jobProfile.createdBy) === String(userID)) {
                console.log("Inside resolve side of findByID");
                resolve(true);
            } else {
                console.log("Inside resolve side of findByID");
                resolve(false);
            }

        });
    }

    new Promise(isUserAuthorizedForJobProfilePromise)
        .then(function (isUserAuthorizedForJobProfile) {
            console.log("Inside step to callback from within isUserAuthorizedForJobProfile");
            onValidatingUserAuthorization(null, isUserAuthorizedForJobProfile);
        })
        .catch(function (err) {
            onValidatingUserAuthorization(err, null);
        })
}

function onSuccessAbstract(res) {

    return function (status, message, data) {

        console.log(message);
        console.log(data);

        res.status(status).json({
            'message': message,
            'data': data,
            'howzzat': 'Testing the onSuccessAbstract function'
        });
    }
}

function onErrorAbstract(next) {

    return function (err) {
        console.log(err);
        next(err);
    }
}
