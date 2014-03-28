(function(angular) {
	'use strict';
	angular.module('app.controller.bowler', [])
		.controller('BowlerCtrl',[
			'$scope',
			'$http',
			'socket',
			'Universities',
			'localStorage',
			'Online',
			function ($scope, $http, socket, Universities, localStorage, Online) {
				$scope.newBowler = {};
				$scope.universities = Universities.get();
				// socket
				socket.on('newBowler:update', function(bowlers) {
					localStorage.set('bowlers', angular.toJson(bowlers));
					$scope.bowlers = bowlers;
				});

				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('bowlers').then(function(bowlers) {
							$scope.bowlers = angular.fromJson(bowlers);
						});
					}
					catch (err) {
						// no data
						console.log('No Data');
					}
				}
				else {
					// initial api call for bowlers
					$http.get('api/bowlers')
						.success(function(bowlers) {
							$scope.bowlers = bowlers;
						})
						.error(function(err) {
							console.log(err);
						});
				}
				
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