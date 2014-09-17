'use strict';
angular.module('controller.login', [])
	.controller('LoginCtrl', function($scope, $modalInstance, Auth, growlNotifications) {
		$scope.loginMode = true;
		$scope.user = {};
		$scope.errors = {};

		$scope.close = function() {
			$modalInstance.dismiss();
		};

		$scope.login = function(user) {
			Auth.login(user)
				.then(function(user) {
					$modalInstance.close(user);
				})
				.catch(function(err) {
					err = err.data;
					$scope.errors.other = err.message;
				});
		};

		$scope.reset = function(email) {
			Auth.forgotPassword(email)
				.then(function() {
					$modalInstance.close();
				})
				.catch(function(err) {
					err = err.data.replace(/["]+/g, ''); // remove quotes
					$scope.errors.reset = err;
				});
		};
	});