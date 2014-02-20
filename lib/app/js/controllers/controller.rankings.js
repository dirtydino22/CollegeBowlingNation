(function(angular) {
	'use strict';
	angular.module('app.controller.rankings', [])
		.controller('RankingsCtrl', [
		'$scope',
		'$http',
		function ($scope, $http) {
			$http.get('json/rankings.json')
				.success(function (data) {
					$scope.teams = data;
				});
		}
	]);
}(angular));