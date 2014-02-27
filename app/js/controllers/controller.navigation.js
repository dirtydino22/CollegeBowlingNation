/**
 * app.contorller.navigation module
 */
(function(angular) {
	'use strict';
	angular.module('app.controller.navigation', [])
		.controller('NavigationCtrl', [
		// Dependencies
		'$scope',
		'$modal',
		'Auth',
		function ($scope, $modal, Auth) {
			$scope.isCollapsed = true;
			$scope.openLoginModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.login.html',
					controller: 'LoginCtrl'
				});
				modalInstance.result.then(function() {
					$scope.user = Auth.user.username;
				});
			};

			$scope.openContactModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.contact.html',
					controller: 'ContactCtrl'
				});
			};

			$scope.logout = function() {
				Auth.logout(function() {
					$scope.user = Auth.user.username;
				});
			};

			$scope.user = Auth.user.username;
		}
	]);
}(angular));