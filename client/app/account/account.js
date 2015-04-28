function accountRoute($stateProvider) {
    'use strict';
    
    $stateProvider
        .state('account', {
            url: '/account',
            templateUrl: 'app/account/account.html',
            controller: 'AccountCtrl as ctrl',
            authenticate: true,
            resolve: {
            	universities: ['Universities', function(Universities) {
            		return Universities.get();
            	}]
            }
        });
}

accountRoute.$inject = ['$stateProvider'];

angular
    .module('app')
    .config(accountRoute);
