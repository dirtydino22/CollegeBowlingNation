'use strict';

angular.module('app')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl as ctrl'
            });
    }]);
