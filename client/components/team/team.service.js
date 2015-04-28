/*@ngInject*/
function Team($resource) {
	'use strict';
	
    return $resource('/api/team/:university', {
        
    }, {
        getUniversity: {
            method: 'GET'
        }
    });
}

Team.$inject = ['$resource'];

angular
	.module('app')
    .factory('Team', Team);
