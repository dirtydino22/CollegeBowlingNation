(function(angular) {
	'use strict';
	angular.module('app.service.game', [])
		.factory('Game', [
			'$http',
			function($http) {
				var game = {};
				// stats config
				game.stats = {
					score: 0,
					shots: 0,
					firstBallCount: 0,
					strikes: 0,
					spares: 0,
					nineCounts: 0,
					nineMade: 0
				};

				game.submit = function() {
					// submit game stats
				};

				return game;
			}
		]);
}(angular));