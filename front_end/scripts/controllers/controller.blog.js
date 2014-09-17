'use strict';

angular.module('controller.blog', [])
	.controller('BlogCtrl', function($scope, $modal, Socket, LocalStorage, posts, user) {
		$scope.user = user;
		$scope.posts = posts;

		Socket.on('posts:update', function(posts) {
			angular.forEach(posts, function(post) {
                post.comments.reverse();
            });
			$scope.posts = posts.reverse();
		});

		$scope.createPost = function() {
			var modalInstance = $modal.open({
				templateUrl: 'modals/post-new',
				controller: 'PostCtrl',
				resolve: {
					post: function() {
						return {
							author: user.name
						}
					},
					comment: function() { return null; }
				}
			});
		};

		$scope.createComment = function(postId) {
			var modalInstance = $modal.open({
				templateUrl: 'modals/comment-new',
				controller: 'PostCtrl',
				resolve: {
					post: function() {
						return {
							_id: postId
						}
					},
					comment: function() {
						return {
							author: user.name
						};
					}
				}
			});
		};
	});