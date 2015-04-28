function rankingsRoute($stateProvider) {
    'use strict';

    $stateProvider
        .state('rankings', {
            url: '/rankings',
            templateUrl: 'app/rankings/rankings.html',
            controller: 'RankingsCtrl',
            resolve: {
                teams: ['Team', 'LocalStorage', 'Network', function(Team, LocalStorage, Network) {
                    if (!Network.isOnline()) {
                        try {
                            return LocalStorage.get('teams')
                                .then(function(teams) {
                                    return angular.fromJson(teams);
                                });
                        } catch (err) {
                            // err no data
                        }
                    } else {
                        return Team.query(function(teams) {
                            LocalStorage.set('teams', angular.toJson(teams));
                            return teams;
                        });
                    }
                }]
            }
        });
}

rankingsRoute.$inject = ['$stateProvider'];

angular
    .module('app')
    .config(rankingsRoute);
