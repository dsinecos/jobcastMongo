var express = require('express');
var Router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var passport = require('passport');

module.exports = Router;

var user = require('./userSchema.js');

// Setting up routes for User

Router.post('/signup', function (req, res, next) {

    user.create({
        username: req.body.username,
        password: req.body.password
    }, function (err, user) {
        if (err) {
            console.log(err);
            next(err);
        }

        console.log(user);
        res.status(200).json(user);
    })
});

Router.post('/login', function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    user.find({ username: username }, function (err, user) {
        
        if (err) {
            console.log("Could not Login");
            console.log(err);
            next(err);
        }

        if (user) {
            console.log("User logged in")
            console.log(user);
            console.log("-----------------------------------------");

            // Create and send JSON Web Token            

            const payload = {
                userID: user[0]._id
            }
            const secretKey = process.env.JWTSecretKey || 'tasmanianDevil';

            console.log("The payload sent to the user is " + JSON.stringify(payload, null, "  "));

            var token = jwt.sign(payload, secretKey, {
                expiresIn: 86400 // 24 hours
            });
            var response = {
                user: user,
                token: token
            }

            res.status(200).json(response);

        } else {

            console.log("No user found for the supplied credentials");
            res.status(401).send("User not found. Please try again");

        }
    })

});

Router.get('/checkAuthentication', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    console.log("Following is the output from req.user");
    console.log(req.user);
    // console.log(req);
    res.status(200).json({
        message: 'Authentication via JWT successfully tested'
    });
});

// Router.get('/checkAuthentication', function(req, res, next) {
//     res.status(200).json({
//         message: 'Authentication via JWT successfully tested'
//     });
// }

/*
Router.get('/:id', function (req, res, next) {

    var userID = req.params.id;

    // user.findById(userID, function (err, user) {
    //     if (err) {
    //         console.log(err);
    //         next(err);
    //     }

    //     console.log(user);
    //     res.status(200).json(user);
    // })

    user.findById(userID).populate('jobProfiles').exec(function (err, user) {
        if (err) {
            console.log(err);
            next(err);
        }

        console.log(user);
        res.status(200).json(user);
    })
});

Router.get('/', function (req, res, next) {
    user.find(function (err, user) {
        if (err) {
            console.log(err);
            next(err);
        }

        console.log(user);
        res.json(JSON.stringify(user, null, "  "));

    })
})

Router.put('/:id', function (req, res, next) {

    user.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        password: req.body.password
    }, function (err, user) {
        if (err) {
            console.log(err);
            next(err);
        }

        console.log(user);
        res.status(200).json(user);
    })
})

Router.delete('/:id', function (req, res, next) {
    user.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            next(err);
        }

        console.log(user);
        res.status(200).send("User successfully deleted");
    })
});

*/