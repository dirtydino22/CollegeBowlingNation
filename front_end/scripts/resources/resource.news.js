'use strict';
	angular.module('resource.news', [])
		.factory('News', ['$resource', function($resource){
			return $resource('/api/news/:id', {
				id: '@id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}]);