(function(angular) {
	'use strict';
	angular.module('app.controller.main', [])
		.controller('MainCtrl', [
		'$scope',
		'$q',
		'$http',
		'Online',
		function ($scope, $q, $http, Online) {
			$scope.online = Online.check();
			/*
			Online.on('online', function(e) {
				if (Online.requests.length) {
					console.log(Online.requests);
					// handle request strings
					var reqArray = [];
					for (var i = 0; i < Online.requests.length; i++) {
						reqArray.push($http.get(Online.requests[i]));
					}
					/**
					 * uniqueArray 
					 * creates a unique array from the reqArray
					 * to prevent duplicate request.
					 */
					 /*
					var uniqueArray = function(ogArr) {
						var newArr = [],
							ogLength = ogArr.length,
							found, x, y;
						for (x = 0; x < ogLength; x++) {
							found = undefined;
							for (y = 0; y < newArr.length; y++) {
								if (ogArr[x] === newArr[y]) {
									found = true;
									break;
								}
							}
							if (!found) {
								newArr.push(ogArr[x]);
							}
						}
						return newArr;
					};
					// make all requests
					$q.all(uniqueArray(reqArray)).then(function(results) {
						if (results) { console.log('Results were returned.'); }
					});
				}
				else {
					console.log('No Requests.');
				}
			});
*/
		}
	]);
}(angular));