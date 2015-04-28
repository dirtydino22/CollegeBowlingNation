/*@ngInject*/
function News($resource) {
	'use strict';
	
    return $resource('/api/news/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}

News.$inject = ['$resource'];

angular
	.module('app')
    .factory('News', News);
