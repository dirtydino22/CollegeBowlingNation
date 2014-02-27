(function(angular) {
	'use strict';
	angular.module('app.controller.contact', [])
		.controller('ContactCtrl',[
			'$scope',
			'$modalInstance',
			function ($scope, $modalInstance) {
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			}
		]);
}(angular));