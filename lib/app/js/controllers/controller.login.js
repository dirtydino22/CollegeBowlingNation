(function(angular) {
	'use strict';
	angular.module('app.controller.login', [])
		.controller('LoginCtrl', [
		'$scope',
		'$modalInstance',
		function ($scope, $modalInstance) {
			$scope.createMode = false;
			$scope.genders = [
				{type: 'Male'},
				{type: 'Female'}
			];
			$scope.login = function () {};
			$scope.register = function () {
				$scope.createMode = !$scope.createMode;
			};
		}
	]);
}(angular));