'use strict';

angular.module('resource.user', [])
    .factory('User', function($resource) {
      return $resource('/api/users/:id/:method/:bowlerId', {
        id: '@id',
        method: '@method',
        bowlerId: '@bowlerId'
      }, {
        update: {
          method: 'PUT',
          params: {}
        },
        get: {
          method: 'GET',
          params: {
            id: 'me'
          }
        },
        list: {
          method: 'GET',
          params: {},
          isArray: true
        },
        updateAccount: {
          method: 'PUT',
          params: {}
        },
        changePassword: {
          method: 'PUT',
          params: {
            method: 'changepassword'
          }
        },
        newSeason: {
          method: 'GET',
          params: {
            method: 'newseason'
          }
        },
        createBowler: {
          method: 'POST',
          params: {
            method: 'bowler'
          }
        },
        removeBowler: {
          method: 'DELETE',
          params: {
            method: 'bowler'
          }
        },
        editBowler: {
          method: 'PUT',
          params: {
            method: 'bowler'
          }
        },
        forgotPassword: {
          method: 'POST',
          params: {
            id: 'forgot'
          }
        },
        newGame: {
          method: 'POST',
          params: {
            method: 'bowler'
          }
        }
      });
    });