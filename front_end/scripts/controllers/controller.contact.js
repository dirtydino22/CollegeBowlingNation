'use strict';

angular.module('controller.contact', [])
	.controller('ContactCtrl', function($scope, $modalInstance) {
		$scope.message = {};
		$scope.close = function() {
			$modalInstance.close();
		};
	});