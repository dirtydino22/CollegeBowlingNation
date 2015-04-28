function Mail($resource) {
    'use strict';
    return $resource('/api/mail/:route', {
        route: '@route'
    }, {
        contact: {
            method: 'POST',
            params: {
                route: 'contact'
            }
        }
    });
}

Mail.$inject = ['$resource'];

angular
    .module('app')
    .factory('Mail', Mail);
