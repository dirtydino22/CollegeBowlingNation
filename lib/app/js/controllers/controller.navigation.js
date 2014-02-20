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
		function ($scope, $modal) {
			$scope.isCollapsed = true;
			$scope.openLoginModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.login.html',
					controller: 'LoginCtrl'
				});
			};

			$scope.openContactModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.contact.html',
					controller: 'ContactCtrl'
				});
			};
		}
	]);
}(angular));