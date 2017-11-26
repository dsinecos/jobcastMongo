var mongoose = require('mongoose');
var passport = require('passport');

var jobProfile = require('./jobprofileSchema.js');
var user = require('../user/userSchema.js');

module.exports = postJobProfile;

function postJobProfile(req, res, next) {

    var userID = req.user._id;
    var jobProfileData = {
        jobTitle: req.body.jobTitle,
        jobDescription: req.body.jobDescription,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        createdBy: userID
    };

    var onSuccess = onSuccessAbstract(res);
    var onError = onErrorAbstract(next);
    var postJobProfile = postJobProfileAbstract(onSuccess, onError);

    postJobProfile(userID, jobProfileData)
}

function postJobProfileAbstract(onSuccess, onError) {
    return function (userID, jobProfileData) {

        jobProfile.create({
            jobTitle: jobProfileData.jobTitle,
            jobDescription: jobProfileData.jobDescription,
            companyName: jobProfileData.companyName,
            companyDescription: jobProfileData.companyDescription,
            createdBy: userID
        }, function (err, jobProfile) {

            if (err) {
                onError(err);
            }

            updateUserWithJobProfileID(jobProfile);
        });

        function updateUserWithJobProfileID(jobProfile) {

            user.findByIdAndUpdate(userID, { $push: { jobProfiles: jobProfile._id } }, function (err, user) {
                if (err) {
                    onError(err);
                }

                var data = {
                    jobProfile: jobProfile,
                    user: user
                }

                onSuccess(200, "Job Profile posted and User profile updated with Job Profile ID", data)
            })
        }
    }
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
