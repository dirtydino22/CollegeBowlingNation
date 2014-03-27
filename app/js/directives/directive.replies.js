(function() {
	angular.module('app.directive.replies', []).directive('replies', [
		'$http',
		'socket',
		function($http, socket) {
			return {
				restrict: 'A',
				replace: true,
				scope: {
					replies: '=',
					id: '='
				},
				templateUrl: 'templates/replies.html',
				link: function($scope, $element, $attrs) {
					$scope.replies.reverse();
					$scope.reply = {};
					$scope.addReply = function() {
						$http.post('api/posts/' + $scope.id + '/reply', $scope.reply)
						.success(function() {
							socket.emit('post:update');
						})
						.error(function(err) {
							console.log(err);
						});
					};
				}
			};
		}
	]);
}).call(this);