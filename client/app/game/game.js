function GameRoute($stateProvider) {
    'use strict';
    
    $stateProvider
        .state('tenpin', {
            url: '/tenpin',
            templateUrl: 'app/game/game.html',
            controller: 'GameCtrl as ctrl',
            authenticate: true,
            resolve: {
                gameType: function() {
                    return 'tenpin';
                },
                lineup: ['Lineup', function(Lineup) {
                    return Lineup.get();
                }],
                tabs: ['Lineup', function(Lineup) {
                    var lineup = Lineup.get(),
                        tabs = [];
                        
                    for (var i = 0; i < lineup.length; i++) {
                        tabs.push({
                            name: lineup[i].name,
                            _id: lineup[i]._id,
                            active: false
                        });
                    }
                    
                    tabs[0].active = true;
                    
                    return tabs;
                }]
            }
        })
        .state('baker', {
            url: '/baker',
            templateUrl: 'app/game/game.html',
            controller: 'GameCtrl as ctrl',
            authenticate: true,
            resolve: {
                gameType: function() {
                    return 'baker';
                },
                lineup: ['Lineup', function(Lineup) {
                    return Lineup.get();
                }],
                tabs: function() {
                    return [];
                }
            }
        });
}

GameRoute.$inject = ['$stateProvider'];

angular
    .module('app')
    .config(GameRoute);