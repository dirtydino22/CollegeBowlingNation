(function() {
	'use strict';
	angular.module('app.controller.account', [])
		.controller('AccountCtrl',[
			'$scope',
			'$http',
			'Universities',
			'Auth',
			function ($scope, $http, Universities, Auth) {
				$scope.user = {};
				// retrieve the universities list
				$scope.universities = Universities.get();
				// get users account info
				$http.get('api/users/' + Auth.user.id )
					.success(function(user) {
						// add user info to the scope
						$scope.user = user;
					});
				/**
				 * updateInfo
				 * updates a users account info
				 **/
				$scope.updateInfo = function() {
					$http.post('api/users/' + Auth.user.id + '/info', {
						firstName: $scope.user.firstName,
						lastName: $scope.user.lastName,
						address: $scope.user.address,
						address2: $scope.user.address2,
						city: $scope.user.city,
						state: $scope.user.state,
						zipcode: $scope.user.zipcode,
						phone: $scope.user.phone,
						university: $scope.user.university.name,
						email: $scope.user.email,
					})
						.success(function() {
							console.log('User updated');
						})
						.error(function(err) {
							console.log(err);
						});
				};
				/**
				 * updatePassword
				 * updates a users password
				 **/
				$scope.updatePassword = function() {
					if ($scope.user.password === $scope.user.confirm) {
						Auth.updatePassword(Auth.user.id, $scope.user.password, function() {
							console.log('Password Updated.');
						});
					}
				};
			}
		]);
}).call(this);