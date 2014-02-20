/**
 * app.controllers module
 */
(function(angular) {
	'use strict';
	angular.module('app.controllers', [
		// Dependencies
		'app.controller.navigation',
		'app.controller.main',
		'app.controller.login',
		'app.controller.contact',
		'app.controller.rankings',
		'app.controller.prospects'
	]);
}(angular));