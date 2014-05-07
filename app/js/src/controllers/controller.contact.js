(function() {
	'use strict';
	angular.module('app.controller.contact', [])
		.controller('ContactCtrl',[
			'$scope',
			'$http',
			'$modalInstance',
			'$dialogs',
			function ($scope, $http, $modalInstance, $dialogs) {
				$scope.contact = {};
				/* cancel
				 * dismisses the modal
				 */
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
				$scope.sendMessage = function() {
					$http.post('/mail', {
						name: $scope.contact.fullName,
						email: $scope.contact.email,
						message: $scope.contact.message
					})
					.success(function() {
						$modalInstance.close();
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Send Message Error','Your message could not be sent.');
					});
				};
			}
		]);
}).call(this);
