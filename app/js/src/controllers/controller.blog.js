(function() {
	'use strict';
	angular.module('app.controller.blog', [])
		.controller('BlogCtrl',[
			'$scope',
			'$http',
			'$modal',
			'socket',
			'Auth',
			'localStorage',
			'Online',
			function ($scope, $http, $modal, socket, Auth, localStorage, Online) {
				socket.on('post:update', function(posts) {
					localStorage.set('posts', angular.toJson(posts));
					$scope.posts = posts;
				});
				$scope.admin = (Auth.user.access === 'admin') ? true : false;
				$scope.reply = {};

				if (!Online.check()) { // offline
					try {
						alert('trying ls');
						// try localStorage for last stored api results
						localStorage.get('posts').then(function(posts) {
							$scope.posts = angular.fromJson(posts);
						});
					}
					catch (err) {
						// no data
						console.log('No Data');
					}
				}
				else {
					alert('trying api');
					// initial api call for posts
					$http.get('api/posts')
						.success(function(posts) {
							localStorage.set('posts', angular.toJson(posts));
							$scope.posts = posts;
						})
						.error(function(err) {
							console.log(err);
						});
				}

				$scope.openNewPostModal = function() {
					var modalInstance = $modal.open({
						templateUrl: 'templates/modals/modal.post.html',
						controller: 'PostCtrl'
					});
					modalInstance.result.then(function() {
						socket.emit('post:update');
					});
				};
				$scope.addReply = function(id) {
					$http.post('api/posts/' + id + '/reply', $scope.reply)
					.success(function() {
						socket.emit('post:update');
					})
					.error(function(err) {
						console.log(err);
					});
				};
				$scope.removePost = function(id) {
					$http.delete('api/posts/' + id)
						.success(function() {
							console.log('Post removed.');
							socket.emit('post:update');
						})
						.error(function(err) {
							console.log(err);
						});
				};
			}
		]);
}).call(this);