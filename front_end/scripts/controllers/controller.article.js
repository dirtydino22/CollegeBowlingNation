'use strict';

angular.module('controller.article', [])
	.controller('ArticleCtrl', function($scope, $modalInstance, Socket, News, growlNotifications, article) {
		$scope.article = article;

		$scope.close = function() { return $modalInstance.dismiss(); };

		$scope.createArticle = function(article) {
			News.save(article,
				function() {
					Socket.emit('news:update');
					growlNotifications.add('Your news article has been created.', 'success', 4000);
					$modalInstance.close();
				},
				function() {
					growlNotifications.add('There was an error creating your article.', 'danger', 4000);
				});
		};

		$scope.updateArticle = function(article) {
			News.update({id: article._id}, article,
				function() {
					Socket.emit('news:update');
					growlNotifications.add('Your news article has been updated.', 'success', 4000);
					$modalInstance.close();
				},
				function() {
					growlNotifications.add('There was an error updating your article.', 'danger', 4000);
				});
		};
	});