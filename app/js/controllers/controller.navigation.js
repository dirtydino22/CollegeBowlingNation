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
			$scope.user = Auth.user.username;
			$scope.admin = (Auth.user.access === 'admin') ? true : false;
			
			/**
			 * openLoginModal
			 * opens login modal
			 */
			$scope.openLoginModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.login.html',
					controller: 'LoginCtrl'
				});
				modalInstance.result.then(function() {
					$scope.user = Auth.user.username;
					$scope.admin = (Auth.user.access === 'admin') ? true : false;
				});
			};

			/**
			 * openContactModal
			 * opens contact modal
			 */
			$scope.openContactModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.contact.html',
					controller: 'ContactCtrl'
				});
			};

			/**
			 * logout
			 * logs a user out
			 */
			$scope.logout = function() {
				Auth.logout(function() {
					$scope.user = Auth.user.username;
					$scope.admin = Auth.user.access;
				});
			};
		}
	]);
}(angular));