(function(angular) {
	'use strict';
	angular.module('app.controller.admin', [])
		.controller('AdminCtrl',[
			'$scope',
			'$http',
			'Auth',
			'socket',
			'localStorage',
			'Online',
			function ($scope, $http, Auth, socket, localStorage, Online) {
				/**
				 * Temp Users
				 */
				 //socket
				socket.on('tempUser:update', function(tempUsers) {
					localStorage.set('tempUsers', angular.toJson(tempUsers));
					$scope.tempUsers = tempUsers;
				});

				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('tempUsers').then(function(users) {
							$scope.tempUsers = angular.fromJson(users);
						});
					}
					catch (err) {
						// no data
						console.log('No Data');
					}
				}
				else {
					// initial api call for tempUsers
					$http.get('api/tempUsers')
						.success(function(users) {
							// cache api results in localStorage
							localStorage.set('tempUsers', angular.toJson(users));
							$scope.tempUsers = users;
						})
						.error(function(err) {
							console.log(err);
						});
				}
				
				/**
				 * declineUser
				 * declines a tempUser
				 * @ {Number} $index
				 */
				$scope.declineUser = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get('api/tempUsers/' + id + '/decline')
						.success(function() {
							socket.emit('tempUser:update');
						})
						.error(function(err) {
							console.log(err);
						});
				};

				/**
				 * acceptUser
				 * accepts a tempUser as a user
				 * @ {Number} $index
				 */
				$scope.acceptUser = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get('api/tempUsers/' + id + '/accept/user')
						.success(function() {
							socket.emit('tempUser:update');
						})
						.error(function() {
							console.log(err);
						});
				};

				/**
				 * acceptAdmin
				 * accepts a tempUser as a admin
				 * @ {Number} $index
				 */
				$scope.acceptAdmin = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get('api/tempUsers/' + id + '/accept/admin')
						.success(function() {
							socket.emit('tempUser:update');
						})
						.error(function() {
							console.log(err);
						});
				};
				// end Temp Users

				/**
				 * Users
				 */
				socket.on('user:update', function(users) {
					localStorage.set('users', angular.toJson(users));
					$scope.users = users;
				});
				
				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('users').then(function(users) {
							$scope.users = angular.fromJson(users);
						});
					}
					catch (err) {
						// no data
						console.log('No Data');
					}
				}
				else {
					$http.get('api/users')
						.success(function(users) {
							localStorage.set('users', angular.toJson(users));
							$scope.users = users;
						})
						.error(function(err) {
							console.log(err);
						});
						
				}
				

				$scope.removeUser = function($index) {
					var id = $scope.users[$index]._id;
					$http.post('api/users/' + id + '/remove')
						.success(function() {
							socket.emit('user:update');
						})
						.error(function(err) {
							console.log(err);
						});
				};
				// end users

				/**
				 * Bowlers
				 */
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
							localStorage.set('bowlers', angular.toJson(bowlers));
							$scope.bowlers = bowlers;
						})
						.error(function(err) {
							console.log(err);
						});
				}
				
				$scope.removeBowler = function($index) {
					var id = $scope.bowlers[$index]._id;
					$http.delete('api/bowlers/' + id + '')
						.success(function() {
							socket.emit('newBowler:update');
						})
						.error(function(err) {
							console.log(err);
						});
				};

				/*
				$scope.updatePassword = function() {
					if ($scope.user.password === $scope.user.confirm) {
						console.log(':id:' + Auth.user.id);
						console.log(':pword:' + $scope.user.password);
						Auth.updatePassword(Auth.user.id, $scope.user.password, function() {
							console.log('Password Updated.');
						});
					}
				};
				*/
			}
		]);
}(angular));