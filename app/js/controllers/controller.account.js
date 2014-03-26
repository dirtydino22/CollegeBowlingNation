(function() {
	'use strict';
	angular.module('app.controller.account', [])
		.controller('AccountCtrl',[
			'$scope',
			'Auth',
			function ($scope, Auth) {
				$scope.user = {};
				$scope.updatePassword = function() {
					if ($scope.user.password === $scope.user.confirm) {
						Auth.updatePassword(Auth.user.id, $scope.user.password, function() {
							console.log('Password Updated.');
						});
					}
				};
			}
		]);
}).call(this);