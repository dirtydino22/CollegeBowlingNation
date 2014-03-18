(function(angular) {
	'use strict';
	angular.module('app.controller.login', [])
		.controller('LoginCtrl', [
		'$scope',
		'$modalInstance',
		'Auth',
		function ($scope, $modalInstance, Auth) {
			// config
			$scope.createMode = false;
			$scope.user = {};
			$scope.loginUser = {};

			/**
			 * login
			 * logs a user in
			 */
			$scope.login = function () {
				Auth.login($scope.loginUser.username, $scope.loginUser.password, function() {
					$modalInstance.close();
				});
			};
			/**
			 * register
			 * registers a user
			 */
			$scope.register = function () {
				$scope.createMode = !$scope.createMode;
			};
			/**
			 * createAccount
			 * creates a user account
			 */
			$scope.createAccount = function() {
				if ($scope.user.password === $scope.user.confirm) {
					Auth.createUser($scope.user, function() {
						$modalInstance.close();
					});
				}
			};
		}
	]);
}(angular));