(function(angular) {
	'use strict';
	angular.module('app.controller.newGame', [])
		.controller('NewGameCtrl',[
			'$scope',
			'$routeParams',
			'Game',
			'socket',
			function ($scope, $routeParams, Game, socket) {
				var id = $routeParams.id; // bowler id
				
				$scope.score = Game.stats.score;
				$scope.shots = Game.stats.shots;

				// add 1 to shot count
				// fired on input blur
				$scope.addShots = function() {
					Game.stats.shots += 1;
					$scope.shots = Game.stats.shots;
				};
			}
		]);
}(angular));