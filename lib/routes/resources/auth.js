'use strict';
/**
 * Module Dependecies
 */
var passport = require('passport'),
	User = require('../../models/user');
/**
 * Auth Routes
 */
exports.loggedIn = function(req, res) {
	// return user if available
	// otherwise return '0'
	res.send(req.isAuthenticated() ? req.user : '0');
};

exports.login = function(req, res) {
	res.send(req.user);
};

exports.logout = function(req, res) {
	// log user out
	req.logOut();
	// redirect to index
	res.redirect('/');
};

exports.register = function(req, res) {

};