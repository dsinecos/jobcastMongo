var passport = require("passport");
var passportJWT = require("passport-jwt");
var user = require('./userSchema.js');

var ExtractJWT = passportJWT.ExtractJwt;
var jwtStrategy = passportJWT.Strategy;

var jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJWT.fromHeader('x-access-token') || ExtractJWT.fromBodyField('token') || ExtractJWT.fromUrlQueryParameter('token');

// jwtOptions.jwtFromRequest = ExtractJWT.fromUrlQueryParameter('token');
jwtOptions.secretOrKey = 'tasmanianDevil';

module.exports = new jwtStrategy(jwtOptions, function (jwt_payload, done) {

    // console.log("Payload received " + JSON.stringify(jwt_payload, null, "  "));

    user.findById(jwt_payload.userID, function (err, user) {
        
        if (err) {
            // console.log("Error while trying to authenticate user");

            return done(err, false);
        }
        if (user) {
            
            // console.log("User initialized");
            console.log(user);

            return done(null, user);
        } else {
            // console.log("User not found");

            return done(null, false);
        }

    })

})

