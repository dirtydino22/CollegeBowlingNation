'use strict';

angular.module('controller.confirm', [])
	.controller('ConfirmCtrl', function($scope, $modalInstance, settings) {
		$scope.title = settings.title;
		$scope.message = settings.message;

		$scope.close = function() {
			$modalInstance.dismiss();
		};

		$scope.confirm = function() {
			$modalInstance.close('confirmed');
		};		
	});