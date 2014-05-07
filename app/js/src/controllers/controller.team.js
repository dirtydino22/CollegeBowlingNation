(function() {
	'use strict';
	angular.module('app.controller.team', [])
		.controller('TeamCtrl', [
		'$scope',
		'$modalInstance',
		'$http',
		'team',
		'apiToken',
		function ($scope, $modalInstance, $http, team, apiToken) {
			$scope.team = team[0];
			$scope.stats = [$scope.team.pinCount, $scope.team.strikes, $scope.team.spares, $scope.team.gutterBalls, $scope.team.rollCount,];
			$scope.ok = function() {
				$modalInstance.close();
			};

			
		}
	]);
}).call(this);