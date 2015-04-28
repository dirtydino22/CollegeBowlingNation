function Blog($resource) {
    'use strict';
    
    return $resource('/api/blog/:id/:handle/:commentId', {
        id: '@id',
        handle: '@handle'
    }, {
        update: {
            method: 'PUT',
            params: {}
        },
        addComment: {
            method: 'POST',
            params: {
                handle: 'comment'
            }
        },
        remove: {
            method: 'DELETE',
            params: {}
        },
        removeComment: {
            method: 'DELETE',
            params: {
                handle: 'comment'
            }
        }
    });
}

Blog.$inject = ['$resource'];

angular
	.module('app')
	.factory('Blog', Blog);