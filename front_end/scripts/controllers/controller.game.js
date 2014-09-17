'use strict';

angular.module('controller.game', [])
	.controller('GameCtrl', function($scope, bowlers, tabs) {
		$scope.bowlers = bowlers;
		$scope.tabs = tabs;
		
	});