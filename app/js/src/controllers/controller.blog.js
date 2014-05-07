(function() {
	'use strict';
	angular.module('app.controller.blog', [])
		.controller('BlogCtrl',[
			'$scope',
			'$http',
			'$modal',
			'socket',
			'localStorage',
			'Online',
			'apiToken',
			'$dialogs',
			function ($scope, $http, $modal, socket, localStorage, Online, apiToken, $dialogs) {
				socket.on('post:update', function(posts) {
					localStorage.set('posts', angular.toJson(posts));
					$scope.posts = posts.reverse();
				});
				$scope.reply = {};

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
						$dialogs.error('No Data','There was an error obtaining your online status.');
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
							$dialogs.error('API Call Error','There was an API call error.');
						});
				}

				$scope.openNewPostModal = function() {
					var modalInstance = $modal.open({
						templateUrl: 'templates/modals/modal.post.html',
						controller: 'PostCtrl'
					});
					modalInstance.result.then(function() {
						socket.emit('post:update');
					}, function() {
						return false;
					});
				};
				$scope.addReply = function(id) {
					$http.post(apiToken + '/posts/' + id + '/reply', $scope.reply)
					.success(function() {
						socket.emit('post:update');
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Reply Error','There was an error in adding your reply.');
					});
				};
				$scope.removePost = function(id) {
					$http.delete(apiToken + '/posts/' + id)
						.success(function() {
							socket.emit('post:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Post Removal Error','There was an error removing your post.');
						});
				};
			}
		]);
}).call(this);
