(function(angular) {
    'use strict';
    angular.module('app.controller.newGame', [])
        .controller('NewGameCtrl', [
            '$scope',
            'Roster',
            function($scope, Roster) {
                $scope.game = 'tenpin';
                $scope.bowlers = Roster.bowlers;
            }
        ]);
}(angular));
