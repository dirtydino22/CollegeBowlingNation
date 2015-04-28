function newGameRoute($stateProvider) {
    'use strict';
    
    $stateProvider
        .state('newgame', {
            url: '/newgame',
            templateUrl: 'app/newgame/newgame.html',
            controller: 'NewGameCtrl as ctrl',
            authenticate: true
        });
}

newGameRoute.$inject = ['$stateProvider'];

angular
    .module('app')
    .config(newGameRoute);
