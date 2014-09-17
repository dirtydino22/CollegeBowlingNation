'use strict';
	angular.module('resource.prospect', [])
		.factory('Prospect', function($resource){
			return $resource('/api/newprospect');
		});