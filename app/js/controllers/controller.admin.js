(function(angular) {
	'use strict';
	angular.module('app.controller.admin', [])
		.controller('AdminCtrl',[
			'$scope',
			'Auth',
			function ($scope, Auth) {
				$scope.username = Auth.user.username;
				$scope.userAccess = Auth.user.access;
				$scope.userId = Auth.user.id;
				$scope.user = {};
				$scope.updatePassword = function() {
					if ($scope.user.password === $scope.user.confirm) {
						console.log(':id:' + Auth.user.id);
						console.log(':pword:' + $scope.user.password);
						Auth.updatePassword(Auth.user.id, $scope.user.password, function() {
							console.log('Password Updated.');
						});
					}
				};
			}
		]);
}(angular));