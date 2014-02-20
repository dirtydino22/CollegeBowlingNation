/**
 * app module
 */
(function(angular) {
    'use strict';
    angular.module('app', [
    	// Dependencies
    	'ngRoute',
    	'ui.bootstrap',
    	'app.controllers',
    	'app.services',
    	'app.directives'
    ])
    .config(function ($routeProvider, $locationProvider) {
    	// Routes
    	$routeProvider
    		.when('/', {
    			templateUrl: 'templates/main.html',
    			controller: 'MainCtrl'
    		})
            .when('/rankings', {
                templateUrl: 'templates/rankings.html',
                controller: 'RankingsCtrl'
            })
            .when('/prospects', {
                templateUrl: 'templates/prospects.html',
                controller: 'ProspectsCtrl'
            })
    		.otherwise({
    			redirectTo: '/'
    		});
    });
}(angular));