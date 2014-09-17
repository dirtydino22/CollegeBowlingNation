'use strict';

angular.module('controller.home', [])
	.controller('HomeCtrl', function($scope, Socket, LocalStorage, news) {
		$scope.news = news;

		Socket.on('news:update', function(news) {
			LocalStorage.set('news', news);
			$scope.news = news.reverse();
		});
	});