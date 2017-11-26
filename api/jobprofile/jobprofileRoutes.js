var express = require('express');
var Router = express.Router();
var passport = require('passport');

module.exports = Router;

// Setting up routes for jobProfile

var postJobProfile = require('./postJobProfile');
var getJobProfileByID = require('./getJobProfileByID');
var getAllJobProfiles = require('./getAllJobProfiles');
var putJobProfileByID = require('./putJobProfile');
var deleteJobProfileByID = require('./deleteJobProfile');

Router.post('/', passport.authenticate('jwt', { session: false }), postJobProfile);
Router.get('/:id', passport.authenticate('jwt', { session: false }), getJobProfileByID);
Router.get('/', passport.authenticate('jwt', { session: false }), getAllJobProfiles);
Router.put('/:id', passport.authenticate('jwt', { session: false }), putJobProfileByID);
Router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteJobProfileByID);
