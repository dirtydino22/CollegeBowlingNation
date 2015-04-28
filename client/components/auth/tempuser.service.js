/*global angular*/

/*@ngInject*/
function TempUser($resource) {
    'use strict';
    return $resource('/api/tempusers/:handle/:id', {
        handle: '@handle',
        id: '@id'
    }, {
        list: {
            method: 'GET',
            params: {},
            isArray: true
        },
        accept: {
            method: 'POST',
            params: {
                handle: 'accept'
            }
        },
        acceptAdmin: {
            method: 'POST',
            params: {
                handle: 'acceptadmin'
            }
        },
        decline: {
            method: 'POST',
            params: {
                handle: 'decline'
            }
        }
    });
}

TempUser.$inject = ['$resource'];

angular
    .module('app')
    .factory('TempUser', TempUser);
