// isUserAuthorizedForJobProfile
// updateJobProfile
// isUserAuthorizedForJobProfile
// deleteJobProfile
// isUserAuthorizedForJobProfile
// getJobProfile

// Combine the three - isUserAuthorizedForJobProfile
// Can function currying be used to combine getJobProfile, updateJobProfile, deleteJobProfile
// How to handle onSuccess and onError operations in the above three operations? Create a higher order function

// Setup an API Endpoint and test the entire Functional Programming approach of setting up Routes

var onSuccessHigherOrder = function () {

    // Declare a general onSuccess function here
    // Return a more concrete version of onSuccess function

}

var onErrorHigherOrder = function () {

    // Declare a general onError function here
    // Return a more concrete version of onError function

}

var getJobProfile = function (jobProfileID) {

    // Get jobProfile
    // onSuccess
    // onError

}

var updateJobProfile = function (jobProfileID, jobProfileData) {

    // Update jobProfile
    // onSuccess
    // onError

}

var deleteJobProfile = function (jobProfileID) {

    // Delete jobProfile
    // onSuccess
    // onError

}

var postJobProfile = function (jobProfileData) {

    // Post jobProfile
    // onSuccess
    // onError

}

var actionOnJobProfile = function (action, onSuccess, onError) {

    var actionSet = {
        'get': getJobProfile,
        'post': postJobProfile,
        'update': updateJobProfile,
        'delete': deleteJobProfile
    }

    return actionSet[action];
}

var isUserAuthorizedForJobProfile = function (jobProfileID, userID) {

    return new Promise(function (resolve, reject) {

        jobProfile.findById(jobProfileID, function (err, jobProfile) {
            if (err) {
                console.log(err);
                // next(err);
            }    

            if (String(jobProfile.createdBy) === String(userID)) {
                resolve({
                    status: true,
                    jobProfile: jobProfile

                });
            } else {
                resolve({
                    status: false,
                    jobProfile: null
                });
            }
        });

    })

}

app.get('/:id', function (req, res, next) {
    var userID = req.user._id;
    var jobProfileID = req.params.id;

    var onSuccess = onSuccessHigherOrder(res, next, data);
    var onError = onErrorHigherOrder(res, next, data);

    // Can req, res and next be accessed by onSuccess and onError if they are declared here and passed around. It seems that we will have to pass around req, res and next

    var getJobProfile = actionOnJobProfile('get', onSuccess, onError);

    if (isUserAuthorizedForJobProfile(jobProfileID, userID)) {
        getJobProfile(jobProfileID);
    }

})