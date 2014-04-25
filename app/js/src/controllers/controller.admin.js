(function() {
	'use strict';
	angular.module('app.controller.admin', [])
		.controller('AdminCtrl',[
			'$scope',
			'$http',
			'Auth',
			'socket',
			'localStorage',
			'Online',
			'apiToken',
			'$dialogs',
			function ($scope, $http, Auth, socket, localStorage, Online, apiToken, $dialogs) {
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
						//console.log('No Data');
						$dialogs.error('No Data','The online check has failed.');
					}
				}
				else {
					// initial api call for tempUsers
					$http.get(apiToken + '/tempUsers')
						.success(function(users) {
							// cache api results in localStorage
							localStorage.set('tempUsers', angular.toJson(users));
							$scope.tempUsers = users;
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Temp Users Error','There was an error generating a temp user.');
						});
				}
				
				/**
				 * declineUser
				 * declines a tempUser
				 * @ {Number} $index
				 */
				$scope.declineUser = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get(apiToken + '/tempUsers/' + id + '/decline')
						.success(function() {
							socket.emit('tempUser:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('User Decline Error','There was an error declining the user.');
						});
				};

				/**
				 * acceptUser
				 * accepts a tempUser as a user
				 * @ {Number} $index
				 */
				$scope.acceptUser = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get(apiToken + '/tempUsers/' + id + '/accept/user')
						.success(function() {
							socket.emit('tempUser:update');
							socket.emit('user:update');
						})
						.error(function() {
							//console.log(err);
							$dialogs.error('Accept User Error','There was an error accepting the user.');
						});
				};

				/**
				 * acceptAdmin
				 * accepts a tempUser as a admin
				 * @ {Number} $index
				 */
				$scope.acceptAdmin = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get(apiToken + '/tempUsers/' + id + '/accept/admin')
						.success(function() {
							socket.emit('tempUser:update');
							socket.emit('user:update');
						})
						.error(function() {
							//console.log(err);
							$dialogs.error('Accept Admin Error','There was an error accepting an admin.');
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
						//console.log('No Data');
						$dialogs.error('Online Check Error','There was an error chacking your online status.');
					}
				}
				else {
					$http.get(apiToken + '/users')
						.success(function(users) {
							localStorage.set('users', angular.toJson(users));
							$scope.users = users;
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Token Error','There was an error accepting your token.');
						});
						
				}
				
				/**
				 * removeUser
				 * removes a user
				 * @ {Number} $index
				 */
				$scope.removeUser = function($index) {
					var id = $scope.users[$index]._id;
					$http.post(apiToken + '/users/' + id + '/remove')
						.success(function() {
							socket.emit('user:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Remove User Error','There was an error removing a user.');
						});
				};
				// end users

				/**
				 * News
				 */
				 // socket
				socket.on('news:update', function(news) {
					localStorage.set('news', angular.toJson(news));
					$scope.news = news;
				});
				$scope.newNews = {};
				$scope.news = {};

				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('news').then(function(news) {
							$scope.news = angular.fromJson(news);
						});
					}
					catch (err) {
						// no data
						//console.log('No Data');
						$dialogs.error('Online Check Error','There was an error checking your online status.');
					}
				}
				else {
					// initial api call for news
					$http.get(apiToken + '/news')
						.success(function(news) {
							localStorage.set('news', angular.toJson(news));
							$scope.news = news;
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Getting News','There was an error getting the news.');
						});
				}
				/**
				 * addNews
				 * posts a news item
				 */
				$scope.addNews = function() {
					$http.post(apiToken + '/news', {
						author: $scope.newNews.author,
						title: $scope.newNews.title,
						body: $scope.newNews.body
					})
					.success(function() {
						// update view
						socket.emit('news:update');
						$scope.newNews = {};
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Error Getting News','There was an error getting the news.');
					});
				};
				/**
				 * removeNews
				 * removes a news item
				 * @ {String} id
				 */
				$scope.removeNews = function(id) {
					$http.delete(apiToken + '/news/' + id)
						.success(function() {
							socket.emit('news:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Removing News','There was an error removing the news.');
						});
				};

				/**
				 * Posts
				 */
				socket.on('post:update', function(posts) {
					localStorage.set('posts', angular.toJson(posts));
					$scope.posts = posts.reverse();
				});
				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('posts').then(function(posts) {
							$scope.posts = angular.fromJson(posts).reverse();
						});
					}
					catch (err) {
						// no data
						//console.log('No Data');
						$dialogs.error('Error Checking Online','There was an error checking your online status.');
					}
				}
				else {
					// initial api call for posts
					$http.get(apiToken + '/posts')
						.success(function(posts) {
							localStorage.set('posts', angular.toJson(posts));
							$scope.posts = posts.reverse();
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Retrieving Posts','There was an error retrieving your posts.');
						});
				}

				$scope.removePost = function(id) {
					$http.delete(apiToken + '/posts/' + id)
						.success(function() {
							socket.emit('post:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Removing Post','There was an error removing your post.');
						});
				};
			}
		]);
}).call(this);
