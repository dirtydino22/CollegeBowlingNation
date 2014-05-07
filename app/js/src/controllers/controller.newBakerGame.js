(function(angular) {
    'use strict';
    angular.module('app.controller.newBakerGame', [])
        .controller('NewBakerGameCtrl', [
            '$scope',
            'Roster',
            function($scope, Roster) {
                $scope.game = 'baker';
                $scope.bowlers = Roster.bowlers;
            }
        ]);
}(angular));
