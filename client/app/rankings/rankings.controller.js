'use strict';

angular
    .module('app')
    .controller('RankingsCtrl', ['$scope', 'Modal', '$http', 'socket', 'LocalStorage', 'Network', function($scope, Modal, $http, socket, LocalStorage, Network) {
        $scope.dataLoaded = false;

        if (!Network.isOnline()) {
            try {
                LocalStorage.get('teams')
                    .then(function(teams) {
                        $scope.teams = angular.fromJson(teams);
                        $scope.dataLoaded = !$scope.dataLoaded;
                    });
            } catch (err) {
                // err
            }
        } else {
            $http.get('/api/team')
            .success(function(teams) {
                LocalStorage.set('teams', angular.toJson(teams));
                $scope.teams = teams;
                $scope.dataLoaded = !$scope.dataLoaded;
            });
        }

        

        $scope.columns = ['University', 'Games Played'];
        $scope.map = ['university', 'teamStats.gamesPlayed'];
        $scope.getters = {
            gp: function(val) {
                return val.teamStats.gamesPlayed;
            },
            avg: function(val) {
                return val.teamStats.average;
            }
        };

        $scope.openTeamRankingsModal = function(team) {
            return Modal.open('teamRankings', team);
        };

        socket.socket.on('team:update', function(teams) {
            LocalStorage.set('teams', angular.toJson(teams));
            $scope.teams = teams;
        });

    }]);
