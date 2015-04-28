function RequestHandler($http, $q, $timeout, Network, socket, Notification, Auth) {
	'use strict';

	var requests = [];

	var handleRequest = function(req, method, obj) {
		if (!obj) {
			return (method === 'post') ? $http.post(req) : $http.put(req);
		}
		return (method === 'post') ? $http.post(req, obj) : $http.put(req, obj);
	};

	var createRequestArray = function(ogArr) {
		var newArr = [],
			found;

		for (var i = 0; i < ogArr.length; i++) {
			found = undefined;

			for (var o = 0; o < newArr.length; o++) {
				if (ogArr[i] === newArr[o]) {
					found = true;
					break;
				}
			}

			if (!found) {
				newArr.push(ogArr[i]);
			}
		}

		return newArr;
	};

	return function() {
		Network.on('online', function() {

			Notification.add('Connection found. Your offline requests will now processed.');

			var makeRequest = function() {
				for (var i = 0; i < Network.requests.length; i++) {

					switch (Network.requests[i].method.toLowerCase()) {

						case 'get':
							requests.push($http.get(Network.requests[i].url));
							break;

						case 'post':
							requests.push(
								handleRequest(
									Network.requests[i].url,
									'post',
									Network.requests[i].data
								)
							);
							break;

						case 'delete':
							requests.push($http.delete(Network.requests[i].url));
							break;

						case 'put':
							requests.push(
								handleRequest(
									Network.requests[i].url,
									'put',
									Network.requests[i].data
								)
							);
							break;
					}

				}
				
				

				$q.all(createRequestArray(requests))
					.then(function( /*res*/ ) {
						console.log('requests sent');
						Notification.add({type: 'success', message: 'Your offline request have been processed. Please refresh the page to see updates.'});
						//socket.socket.emit('offline:update');
						Network.requests = [];
						socket.socket.emit('blog:update');
						socket.socket.emit('news:update');
						socket.socket.emit('team:update');
						socket.socket.emit('user:update');
						socket.socket.emit('tempuser:update');
						socket.socket.emit('roster:update', Auth.getCurrentUser()._id);
					});
			};

			$timeout(makeRequest, 2000);
		});


	};
}

RequestHandler.$inject = ['$http', '$q', '$timeout', 'Network', 'socket', 'Notification', 'Auth'];

angular
	.module('app')
	.factory('RequestHandler', RequestHandler);