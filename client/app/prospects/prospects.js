function prospectsRoute($stateProvider) {
	'use strict';
	
    $stateProvider
        .state('prospects', {
            url: '/prospects',
            templateUrl: 'app/prospects/prospects.html',
            controller: 'ProspectsCtrl as ctrl'
        })
        .state('prospects.academic', {
            url: '/academic',
            templateUrl: 'app/prospects/form/academic.html'
        })
        .state('prospects.bowler', {
            url: '/bowler',
            templateUrl: 'app/prospects/form/bowler.html'
        })
        .state('prospects.done', {
            url: '/done',
            templateUrl: 'app/prospects/form/done.html'
        });
}

prospectsRoute.$inject = ['$stateProvider'];

angular
    .module('app')
    .config(prospectsRoute);
