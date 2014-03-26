(function() {
	'use strict';
	angular.module('app.controller.team', [])
		.controller('TeamCtrl', [
		'$scope',
		'$modalInstance',
		'$http',
		'team',
		function ($scope, $modalInstance, $http, team) {
			var pinCount, strikes, spares;
			var sum = function(data) {
                var sum = 0, length = data.length, i;
                for (i = 0; i < length; i++) {
                    sum += data[i];
                }
                return sum;
            };
			$scope.team = team[0];
			$scope.teamData = undefined;
			$scope.games = undefined;
			

			$http.get('api/teams/' + $scope.team.name)
				.success(function(data) {
					$scope.teamData = data[0];
					$scope.games = data[0].games;
					for (var i = 0; i < data[0].games.length; i++) {
						pinCount.push(data[0].games[i].pinCount);
						strikes.push(data[0].games[i].strikes);
						spares.push(data[0].games[i].spares);
					}
				
				});

			$scope.ok = function() {
				$modalInstance.close();
			};

			
		}
	]);
}).call(this);