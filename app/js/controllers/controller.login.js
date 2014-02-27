(function(angular) {
	'use strict';
	angular.module('app.controller.login', [])
		.controller('LoginCtrl', [
		'$scope',
		'$modalInstance',
		'Auth',
		function ($scope, $modalInstance, Auth) {
			$scope.createMode = false;
			$scope.user = {};
			$scope.loginUser = {};
			$scope.login = function () {
				Auth.login($scope.loginUser.username, $scope.loginUser.password, function() {
					$modalInstance.close();
				});
			};
			$scope.register = function () {
				$scope.createMode = !$scope.createMode;
			};
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