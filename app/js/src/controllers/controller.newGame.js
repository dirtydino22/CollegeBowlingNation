(function(angular) {
    'use strict';
    angular.module('app.controller.newGame', [])
        .controller('NewGameCtrl', [
            '$scope',
            '$routeParams',
            'socket',
            function($scope, $routeParams, socket) {
                $scope.id = $routeParams.id; // bowler id

            }
        ]);
}(angular));