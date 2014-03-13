(function(angular) {
	'use strict';
	angular.module('app.controller.admin', [])
		.controller('AdminCtrl',[
			'$scope',
			'$http',
			'Auth',
			'socket',
			function ($scope, $http, Auth, socket) {
				/**
				 * Temp Users
				 */
				socket.on('tempUser:update', function(tempUsers) {
					$scope.tempUsers = tempUsers;
				});

				$http.get('api/tempUsers')
					.success(function(users) {
						$scope.tempUsers = users;
					})
					.error(function(err) {
						console.log(err);
					});

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

				socket.on('user:update', function(users) {
					$scope.users = users;
				});

				$http.get('api/coaches')
					.success(function(users) {
						$scope.users = users;
					})
					.error(function(err) {
						console.log(err);
					});

				$scope.removeUser = function($index) {
					var id = $scope.users[$index]._id;
					$http.post('api/coaches/' + id + '/remove')
						.success(function() {
							socket.emit('user:update');
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