// require('dotenv').config();
// Move sensitive variables to dotenv file

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var passportStrategy = require('./api/user/passportJWTSetup.js');
passport.use(passportStrategy);

// var express_enforces_ssl = require('express-enforces-ssl');

var app = express();

// app.enable('trust proxy');
// app.use(express_enforces_ssl());


// Setting up connection to datbase
var mlabURL = 'mongodb://jobcastAdmin:virtualworld@ds111066.mlab.com:11066/jobcast';
mongoose.connect(mlabURL);
var jobcastDatabaseClient = mongoose.connection;
jobcastDatabaseClient.on('error', console.error.bind(console, 'Connection error:'));
jobcastDatabaseClient.once('open', function () {
    console.log("Connected correctly to the database server");
});

// Importing routes
var jobprofile = require('./api/jobprofile/jobprofileRoutes.js');
var user = require('./api/user/userRoutes.js');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/jobprofile', jobprofile);
app.use('/user', user);

app.get('/', function (req, res, next) {
    res.json({
        message: "Request acknowledged. Connected to Server"
    });
})

module.exports = app;