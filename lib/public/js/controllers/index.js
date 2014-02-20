(function(angular) {
    'use strict';
    angular.module('app.controllers')
        .controller('IndexCtrl', function($scope) {
            $scope.libs = [
                {name: 'Angular', version: '1.27'},
                {name: 'Bootstrap', version: '3.0.3'}
            ];
        });
}(angular));