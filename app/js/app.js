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
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.responseInterceptors.push(function($q, $location) {
            return function(promise) {
                return promise.then(
                    function(response) {
                        return response;
                    },
                    function(response) {
                        if (response.status === 401) {
                            $location.url('/login');
                        }
                        return $q.reject(response);
                    }
                );
            }
        });
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
            .when('/admin', {
                templateUrl: 'templates/admin.html',
                controller: 'AdminCtrl',
                resolve: {
                    auth: function(Auth) {
                        Auth.isLoggedIn();
                    }
                }
            })
    		.otherwise({
    			redirectTo: '/'
    		});
    });
}(angular));