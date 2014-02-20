(function(angular) {
    'use strict';
    angular.module('app', [
        'ngRoute',
        'app.controllers'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/index',
                controller: 'IndexCtrl'
            })
            .when('/view2', {
                templateUrl: 'partials/view2',
                controller: 'View2Ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
}(angular));