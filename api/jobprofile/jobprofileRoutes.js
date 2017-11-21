var express = require('express');
var Router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

module.exports = Router;

var jobProfile = require('./jobprofileSchema.js');
var user = require('../user/userSchema.js');

// Setting up routes for jobProfile

Router.post('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    var userID = req.user._id;

    jobProfile.create({
        jobTitle: req.body.jobTitle,
        jobDescription: req.body.jobDescription,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        createdBy: userID
    }, function (err, jobProfile) {

        if (err) {
            console.log(err);
            next(err);
        }

        console.log("Job Profile created");
        console.log(jobProfile);

        user.findByIdAndUpdate(userID, { $push: { jobProfiles: jobProfile._id } }, function (err, user) {
            if (err) {
                console.log(err);
                next(err);
            }

            console.log(user);
            res.status(200).json({
                jobProfile: jobProfile,
                user: user
            });

        })


    });
});

// How to get one, get all, edit and delete jobProfiles for the respective user?

Router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var jobProfileID = req.params.id;
    var userID = req.user._id;

    userAuthorizedForJobProfile(jobProfileID, userID)
        .then(function (jobProfile) {
            if (jobProfile.status) {
                res.status(200).json(jobProfile.jobProfile);
            } else {
                res.status(401).json({
                    message: 'Unauthorized access'
                })
            }
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        })


})

function userAuthorizedForJobProfile(jobProfileID, userID) {

    return new Promise(function (resolve, reject) {

        jobProfile.findById(jobProfileID, function (err, jobProfile) {
            if (err) {
                console.log(err);
                next(err);
            }

            // console.log("CreatedBy information :: " + jobProfile.createdBy + " " + (typeof jobProfile.createdBy));
            // console.log("UserID " + userID + "  " + (typeof userID));
            // console.log("Comparison info :: " + (jobProfile.createdBy === userID));    

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

Router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var userID = req.user._id;

    user.findById(userID).populate('jobProfiles').exec(function (err, user) {
        // console.log(user.username);
        res.status(200).json({
            message: 'User Data retrieved',
            jobProfile: user.jobProfiles
        })
    });

})

Router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var jobProfileID = req.params.id;
    var userID = req.user._id;

    userAuthorizedForJobProfile(jobProfileID, userID)
        .then(function (jobProfile) {
            if (jobProfile.status) {
                updateJobProfile();
            } else {
                res.status(401).json({
                    message: 'Unauthorized access'
                })
            }
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        })

    function updateJobProfile() {

        jobProfile.findByIdAndUpdate(jobProfileID, {
            jobTitle: req.body.jobTitle,
            jobDescription: req.body.jobDescription,
            companyName: req.body.companyName,
            companyDescription: req.body.companyDescription,
            createdBy: userID
        }, function (err, jobProfile) {
            if (err) {
                console.log(err);
                next(err);
            }

            console.log(jobProfile);
            res.status(200).json(jobProfile);
        })

    }
})

Router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var jobProfileID = req.params.id;
    var userID = req.user._id;

    userAuthorizedForJobProfile(jobProfileID, userID)
        .then(function (jobProfile) {
            if (jobProfile.status) {
                deleteJobProfile();
            } else {
                res.status(401).json({
                    message: 'Unauthorized access'
                })
            }
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        })

    function deleteJobProfile() {

        jobProfile.findByIdAndRemove(jobProfileID, function (err, jobProfile) {
            if (err) {
                console.log(err);
                next(err);
            }

            res.status(200).send("Job Profile successfully deleted");
        })

    }

})