/*@ngInject*/
function Prospects($resource) {
	'use strict';
    return $resource('/api/prospects');
}

Prospects.$inject = ['$resource'];

angular
	.module('app')
    .factory('Prospects', Prospects);
