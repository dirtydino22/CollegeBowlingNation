function PostCtrl($modalInstance, Auth, Blog, socket, type, post) {
	'use strict';
	
	this.type = type;
	this.close = $modalInstance.close;
	this.post = post;
	
	this.createPost = function(post) {
		Blog.save(post,
			function() {
				socket.socket.emit('blog:update');
				$modalInstance.close();
			},
			function() {
				//error
			});
	};

	this.updatePost = function(post) {
		Blog.update({id: post._id},
			post,
			function() {
				socket.socket.emit('blog:update');
				$modalInstance.close();
			},
			function() {
				//error
			});
	};
}

PostCtrl.$inject = ['$modalInstance', 'Auth', 'Blog', 'socket', 'type', 'post'];

angular
	.module('app')
	.controller('PostCtrl', PostCtrl);