(function() {
    'use strict';
    /**
     * Authorization Controller
     */
    // Module Dependecies
    var passport = require('passport'),
        User = require('../models/user');
    /**
     * loggedIn
     * returns user if logged in, otherwise a '0'
     */
    exports.loggedIn = function(req, res) {
        // return user if available
        // otherwise return '0'
        res.send(req.isAuthenticated() ? req.user : '0');
    };
    /**
     * login
     * logs a user in
     */
    exports.login = function(req, res) {
        res.send(req.user);
    };
    /**
     * logout
     * logs a user out
     */
    exports.logout = function(req, res) {
        // log user out
        req.logOut();
        res.send(200);
    };
}());