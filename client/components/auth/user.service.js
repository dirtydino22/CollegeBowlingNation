angular.module('app')
    .factory('User', function($resource) {
        'use strict';

        return $resource('/api/users/:id/:controller/:bowlerId/:gameType', {
            id: '@_id'
        }, {
            changePassword: {
                method: 'PUT',
                params: {
                    controller: 'password'
                }
            },
            get: {
                method: 'GET',
                params: {
                    id: 'me'
                }
            },
            update: {
                method: 'PUT',
                params: {}
            },
            forgotPassword: {
                method: 'POST',
                params: {
                    id: 'forgot'
                }
            },
            createBowler: {
                method: 'POST',
                params: {
                    controller: 'bowler'
                }
            },
            getRoster: {
                method: 'GET',
                params: {
                    controller: 'roster'
                },
                isArray: true
            },
            updateBowler: {
                method: 'PUT',
                params: {
                    controller: 'bowler'
                }
            },
            addBowlerTenpinGame: {
                method: 'POST',
                params: {
                    controller: 'bowler',
                    gameType: 'tenpin'
                }
            },
            addBakerGame: {
                method: 'POST',
                params: {
                    controller: 'bowler',
                    gameType: 'baker'
                }
            },
            removeBowler: {
                method: 'DELETE',
                params: {
                    controller: 'bowler'
                }
            },
            createNewSeason: {
                method: 'POST',
                params: {
                    controller: 'newseason'
                }
            }
        });
    });
