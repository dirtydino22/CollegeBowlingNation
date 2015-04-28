/*@ngInject*/
function NewsCtrl($modalInstance, News, socket, type, article) {
	'use strict';
	
	this.type = type;
	this.article = article;

	this.close = function() {
		return $modalInstance.close();
	};

	this.createArticle = function(article) {
		News.save(article,
			function() {
				socket.socket.emit('news:update');
				$modalInstance.close();
			},
			function() {
				//error
			});
	};

	this.updateArticle = function(article) {
		News.update({ id: article._id },
			article,
			function() {
				socket.socket.emit('news:update');
				$modalInstance.close();
			},
			function() {
				// error
			});
	};
}

NewsCtrl.$inject = ['$modalInstance', 'News', 'socket', 'type', 'article'];

angular
	.module('app')
	.controller('NewsCtrl', NewsCtrl);