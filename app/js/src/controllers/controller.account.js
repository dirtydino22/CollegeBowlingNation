(function() {
	'use strict';
	angular.module('app.controller.account', [])
		.controller('AccountCtrl',[
			'$scope',
			'$http',
			'Universities',
			'Auth',
			'localStorage',
			'apiToken',
			'$dialogs',
			function ($scope, $http, Universities, Auth, localStorage, apiToken, $dialogs) {
				$scope.user = {};
				$scope.tokenMessage = false;
				// retrieve the universities list
				$scope.universities = Universities.get();
				// get users account info
				$http.get(apiToken + '/users/' + Auth.user.id )
					.success(function(user) {
						// add user info to the scope
						$scope.user = user;
					});
				/**
				 * updateInfo
				 * updates a users account info
				 **/
				$scope.updateInfo = function() {
					$http.post(apiToken + '/users/' + Auth.user.id + '/info', {
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
							//console.log('User updated');
							$dialogs.notify('User Updated','Your information has been updated.');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Data post error','Your information could not be updated at this time.');
						});
				};
				/**
				 * updatePassword
				 * updates a users password
				 **/
				$scope.updatePassword = function() {
					if ($scope.user.password === $scope.user.confirm) {
						Auth.updatePassword(Auth.user.id, $scope.user.password, function() {
							//console.log('Password Updated.');
							$dialogs.notify('Password Updated','Your password has been updated.');
						});
					}
				};
				/**
				 * requestOfflineToken
				 * save a offline token in localStorage
				 **/
				$scope.requestOfflineToken = function() {
					if ($scope.user.offlinePassword === $scope.user.offlineConfirm) {
						localStorage.set('offlineUser', angular.toJson({
							username: Auth.user.username,
		                    access: Auth.user.access,
		                    id: Auth.user.id,
		                    pass: $scope.user.offlinePassword,
		                    timestamp: new Date().getTime()
						})).then(function() {
							$dialogs.notify('Success','Your offline token has been saved and is good for 21 days. Use this password with your username when logging in with no internet connection for offline access.');
						});
					}
					else {
						$dialogs.error('Error Retrieving Token','Your passwords do not match.');
					}
				};
			}
		]);
}).call(this);
