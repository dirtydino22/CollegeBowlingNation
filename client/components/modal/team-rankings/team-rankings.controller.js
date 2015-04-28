/*global angular*/

/*@ngInject*/
function TeamRankingsCtrl($scope, $modalInstance, team, tabs, bowlers) {
    'use strict';

    this.team = team;
    this.tabs = tabs;
    this.bowlers = bowlers;
    this.bowlerSelected = false;
    
    this.bowlerLabels = ['Average', 'Games Played', 'Strikes', 'Strikes %',
        'Spares', 'Spare %', 'Avg. First Ball'
    ];
    
    this.teamLabels = ['Avg', 'Avg. Baker', 'Avg. Tenpin', 'Games Played',
        'Baker Games Played', 'Tenpin Games Played', 'Strike %', 'Spare %', 'Avg. First Ball'
    ];

    this.bowlerData = [
        [0, 0, 0, 0, 0, 0, 0]
    ];
    
    /*this.bowlerData = [
        [0, 0]
    ];*/

    this.teamData = [
        [team.teamStats.average, team.teamStats.bakerAverage, team.teamStats.tenpinAverage, team.teamStats.gamesPlayed, team.teamStats.bakerGamesPlayed, team.teamStats.tenpinGamesPlayed, team.teamStats.strikePercentage, team.teamStats.sparePercentage, team.teamStats.averageFirstBallCount]
    ];

    this.close = function() {
        $modalInstance.close();
    };

    this.showBowlerStats = function(bowler) {
        this.bowlerSelected = bowler;
        this.bowlerData[0] = [bowler.stats.average, bowler.stats.gamesPlayed, bowler.stats.strikes, bowler.stats.strikePercentage, bowler.stats.spares, bowler.stats.sparePercentage, bowler.stats.averageFirstBallCount];
    };
    
    /*this.showBowlerStats = function(bowler) {
        this.bowlerSelected = bowler;
        this.bowlerData[0] = [bowler.stats.strikePercentage, bowler.stats.sparePercentage];
    };*/

    this.hideBowlerStats = function() {
        this.bowlerSelected = false;
        this.bowlerData = [];
    };
}

TeamRankingsCtrl.$inject = ['$scope', '$modalInstance', 'team', 'tabs', 'bowlers'];

angular
    .module('app')
    .controller('TeamRankingsCtrl', TeamRankingsCtrl);
