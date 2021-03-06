var mongoose = require('mongoose');
var passport = require('passport');

var jobProfile = require('./jobprofileSchema.js');
var user = require('../user/userSchema.js');

var onSuccessAbstract = require('./onSuccessAbstract.js');
var onErrorAbstract = require('./onErrorAbstract.js');

module.exports = getAllJobProfiles;

function getAllJobProfiles(req, res, next) {

    var userID = req.user._id;

    var onSuccess = onSuccessAbstract(res);
    var onError = onErrorAbstract(next);
    var getAllJobProfiles = getAllJobProfilesAbstract(onSuccess, onError);

    console.log("Inside getAllJobProfiles");

    getAllJobProfiles(userID);

}

function getAllJobProfilesAbstract(onSuccess, onError) {
    return function (userID) {

        user.findById(userID).populate('jobProfiles').exec(function (err, user) {
            // console.log(user.username);
            if (err) {
                onError(err);
            }
            onSuccess(200, "User Data retrieved using FP", user.jobProfiles);
        });
    }
}
