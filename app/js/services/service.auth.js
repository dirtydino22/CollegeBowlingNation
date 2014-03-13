(function(angular) {
	'use strict';
	angular.module('app.service.auth', [])
		.factory('Auth', [
			'$http',
			'$location',
			'$q',
			'$timeout',
			function ($http, $location, $q, $timeout) {
				var auth = {};
				// config
				auth.user = {
					username: false,
					access: false,
					id: false
				};
				auth.message = false;

				/**
				 * login
				 * handles logging in a user
				 */
				auth.login = function (username, password, cb) {
					$http.post('/login', {
						username: username,
						password: password
					})
					.success(function(user) {
						auth.user.username = user.username;
						auth.user.access = user.access;
						auth.user.id = user._id;
						auth.message = 'Authentication successful.';
						cb();
					})
					.error(function(err) {
						auth.message = err;
					});
				};
				/**
				 * logout
				 * handles logging a user out
				 */
				auth.logout = function (cb) {
					$http.post('/logout')
						.success(function() {
							auth.user.username = false;
							auth.user.access = false;
							auth.user.id = false;
							auth.message = 'You are logged out.';
							cb();
						})
						.error(function(err) {
							auth.message = err;
						});
				};
				/**
				 * createUser
				 * handles creating a new user
				 */
				auth.createUser = function (user, cb) {
					$http.post('/register', {
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						address: user.address,
						address2: user.address2,
						city: user.city,
						state: user.state,
						zipcode: user.zipcode,
						phone: user.phone,
						university: user.university,
						email: user.email,
						access: user.access,
						password: user.password
					})
					.success(function() {
						cb();
					})
					.error(function(err) {
						auth.message = err;
					});
				};
				/**
				 * isLoggedIn
				 * checks if user is logged in
				 */
				auth.isLoggedIn = function() {
					var defered = $q.defer();
					$http.get('/loggedin')
						.success(function(user) {
							if (user != '0') {
								$timeout(function() {
									defered.resolve();
								}, 0);
							}
							else {
								$timeout(function() {
									defered.reject();
								}, 0);
								$location.url('/login');
							}
						});
					return defered.promise;
				};
				/**
				 * login
				 * updates a users password
				 */
				auth.updatePassword = function(id, password, cb) {
					console.log('updatePassword(): ' + id + ' ' + password);
					$http.post('/api/coaches/' + id, {
						password: password
					})
					.success(function() {
						cb();
					})
					.error(function(err) {
						auth.message = err;
					});
				};
				// return auth object.
				return auth;
		}]);
}(angular));