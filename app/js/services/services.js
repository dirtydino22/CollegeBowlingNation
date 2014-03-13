(function(angular) {
	'use strict';
	angular.module('app.services', [
		'app.service.auth',
		'app.service.socket',
		'app.service.localStorage',
		'app.service.online'
	]);
}(angular));