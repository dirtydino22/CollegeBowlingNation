(function(angular) {
	'use strict';
	angular.module('app.controller.bowler', [])
		.controller('BowlerCtrl',[
			'$scope',
			'$http',
			'socket',
			'Universities',
			function ($scope, $http, socket, Universities) {
				$scope.newBowler = {};
				$scope.universities = Universities.get();
				// socket
				socket.on('newBowler:update', function(bowlers) {
					$scope.bowlers = bowlers;
				});
				// initial api call for bowlers
				$http.get('api/bowlers')
					.success(function(bowlers) {
						$scope.bowlers = bowlers;
					})
					.error(function(err) {
						console.log(err);
					});
				// createBowler
				$scope.createBowler = function() {
					$http.post('api/bowlers', {
						name: $scope.newBowler.name,
						university: $scope.newBowler.university.name
					})
					.success(function() {
						// emit newBowler update
						socket.emit('newBowler:update');
						// clear newBowler input
						$scope.newBowler = '';
					})
					.error(function(err) {
						console.log(err);
					});
				};
			}
		]);
}(angular));