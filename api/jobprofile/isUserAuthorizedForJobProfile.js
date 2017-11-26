var mongoose = require('mongoose');
var jobProfile = require('./jobprofileSchema.js');

module.exports = isUserAuthorizedForJobProfile;

function isUserAuthorizedForJobProfile(jobProfileID, userID, onValidatingUserAuthorization) {
    
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
