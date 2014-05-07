(function() {
	'use strict';
	angular.module('app.controller.post', [])
		.controller('PostCtrl',[
			'$scope',
			'$http',
			'$modalInstance',
			'apiToken',
			'$dialogs',
			function ($scope, $http, $modalInstance, apiToken, $dialogs) {
				$scope.post = {};
				$scope.submitPost = function() {
					$http.post(apiToken + '/posts', {
						author: $scope.post.author,
						body: $scope.post.body,
						title: $scope.post.title
					})
					.success(function() {
						$modalInstance.close();
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Error Submitting Post','There was an error submitting your post.');
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			}
		]);
}).call(this);
