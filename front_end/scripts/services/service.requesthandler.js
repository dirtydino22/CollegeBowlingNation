'use strict';
	angular.module('service.requesthandler', [])
		.factory('RequestHandler', function($http, $q, Online, Socket) {
			var reqArr = [], i, o;
			var handle = function(req, method, obj) {
				if (!obj) {
					return (method === 'post') ? $http.post(req) : $http.put(req);
				}
				else {
					return (method === 'post') ? $http.post(req, obj) : $http.put(req, obj);
				}
			};
			var uniqueArray = function(og) {
				var newArr = [], found, i, o;
				for (i = 0; i < og.length; i++) {
					found = undefined;
					for (o = 0; o < newArr.length; o++) {
						if (og[i] === newArr[o]) {
							found = true;
							break;
						}
					}
					if (!found) { newArr.push(og[i]); }
				}
				return newArr;
			};
			return function() {
				Online.on('online', function() {
					for (i = 0; i < Online.requests.length; i++) {
					switch (Online.requests[i].method.toLowerCase()) {
                            case 'get':
                                reqArr.push($http.get(Online.requests[i].url));
                                break;
                            case 'post':
                                reqArr.push(handle(Online.requests[i].url, 'post', Online.requests[i].data));
                                break;
                            case 'delete':
                                reqArr.push($http.delete(Online.requests[i].url));
                                break;
                            case 'put':
                                reqArr.push(handle(Online.requests[i].url, 'put', Online.requests[i].data));
                                break;
                        }
				}

				$q.all(uniqueArray(reqArr))
					.then(function(res) {
						if (!res) { throw new Error('Error: offline requests failed.'); }
						Socket.emit('offline:update');
						Online.requests = [];
					});
				});
			}
		});