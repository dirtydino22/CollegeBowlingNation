(function(angular) {
	'use strict';
	angular.module('app.controller.main', [])
		.controller('MainCtrl', [
		'$scope',
		'Online',
		function ($scope, Online) {
			$scope.online = Online.check();
		}
	]);
}(angular));