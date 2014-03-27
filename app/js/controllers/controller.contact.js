(function() {
	'use strict';
	angular.module('app.controller.contact', [])
		.controller('ContactCtrl',[
			'$scope',
			'$http',
			'$modalInstance',
			function ($scope, $http, $modalInstance) {
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
						console.log(err);
					});
				};
			}
		]);
}).call(this);