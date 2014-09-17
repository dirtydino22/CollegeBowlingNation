'use strict';

angular.module('controller.post', [])
	.controller('PostCtrl', function($scope, $modalInstance, Socket, growlNotifications, Blog, post, comment) {
		$scope.comment = comment;
		$scope.post = post;

		$scope.createComment = function(comment) {
			Blog.addComment({id: post._id}, comment,
				function(success) {
					Socket.emit('posts:update');
					growlNotifications.add('Your comment was added.', 'success', 4000);
					$modalInstance.close();
				}, function(err) {
					growlNotifications.add('There was an error adding your comment.', 'danger', 4000);
					$modalInstance.close();
				});
		};

		$scope.createPost = function(post) {
				Blog.save(post,
					function(success) {
						Socket.emit('posts:update');
						growlNotifications.add('Your post was created.', 'success', 4000);
						$modalInstance.close();
					},
					function(err) {
						growlNotifications.add('There was an error creating your post.', 'danger', 4000);
						$modalInstance.close();
					});
			};

		$scope.updatePost = function(post) {
			Blog.update({id: post._id}, post,
				function() {
					Socket.emit('posts:update');
					growlNotifications.add('Your post was updated.', 'success', 4000);
					$modalInstance.close();
				},
				function() {
					growlNotifications.add('There was an error updating your post.', 'danger', 4000);
					$modalInstance.close();
				});
		};


		$scope.close = function() {
			$modalInstance.close();
		};
	});