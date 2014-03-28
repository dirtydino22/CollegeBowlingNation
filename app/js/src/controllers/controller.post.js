(function() {
	'use strict';
	angular.module('app.controller.post', [])
		.controller('PostCtrl',[
			'$scope',
			'$http',
			'$modalInstance',
			function ($scope, $http, $modalInstance) {
				$scope.post = {};
				$scope.submitPost = function() {
					$http.post('api/posts', {
						author: $scope.post.author,
						body: $scope.post.body,
						title: $scope.post.title
					})
					.success(function() {
						$modalInstance.close();
					})
					.error(function(err) {
						console.log(err);
					});
				};
			}
		]);
}).call(this);