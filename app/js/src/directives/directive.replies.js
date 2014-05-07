(function() {
	angular.module('app.directive.replies', []).directive('replies', [
		'$http',
		'socket',
		'apiToken',
		'$dialogs',
		function($http, socket, apiToken, $dialogs) {
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
						$http.post(apiToken + '/posts/' + $scope.id + '/reply', $scope.reply)
						.success(function() {
							socket.emit('post:update');
							$dialogs.notify('Success','Your reply has been posted.');
						})
						.error(function(err) {
							$dialogs.error('Error','There was an error posting your reply, please try again.');
						});
					};
				}
			};
		}
	]);
}).call(this);
