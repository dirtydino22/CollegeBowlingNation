function rosterRoute($stateProvider) {
	'use strict';
	
    $stateProvider
        .state('roster', {
            url: '/roster',
            templateUrl: 'app/roster/roster.html',
            controller: 'RosterCtrl as ctrl',
            authenticate: true
        });
}

rosterRoute.$inject = ['$stateProvider'];

angular
    .module('app')
    .config(rosterRoute);
