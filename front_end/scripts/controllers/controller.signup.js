'use strict';

angular.module('controller.signup', [])
	.controller('SignUpCtrl', function($scope, $modalInstance, Auth, universities) {
		$scope.user = {};
		$scope.universities = universities;
		$scope.createAccount = function(user) {
			if (user.password !== user.confirm) { return false; }
			Auth.createTempUser({
				name: user.name,
				email: user.email,
				password: user.password,
				university: user.university
			})
			.then(function(success) {
				$modalInstance.close();
			}, function(err) {
				console.log(err);
			});
		};
		$scope.close = function() {
			$modalInstance.close();
		};
	});