/**
 * app.contorller.navigation module
 */
(function(angular) {
	'use strict';
	angular.module('app.controller.navigation', [])
		.controller('NavigationCtrl', [
		// Dependencies
		'$scope',
		'$location',
		'$modal',
		'Auth',
		function ($scope, $location, $modal, Auth) {
			$scope.isCollapsed = true;
			$scope.user = Auth.user.username;
			$scope.admin = (Auth.user.access === 'admin') ? true : false;
			/**
			 * isActive
			 * return a boolean specifying if a view is active
			 */
			$scope.isActive = function(view) {
				return view === $location.path();
			};
			
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