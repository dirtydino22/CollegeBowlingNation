'use strict';

angular.module('controller.team', [])
	.controller('TeamCtrl', function($scope, $modalInstance, TeamService, Bowler, team, players, tabs) {
		$scope.team = team;
		$scope.players = players;
		$scope.tabs = tabs;
		$scope.teamData = TeamService.createTeamData(team);
		$scope.selectedPlayer = false;
		$scope.playerData = [];

		$scope.xFunction = function(){
		    return function(d) {
		        return d.key;
		    };
		};
		$scope.yFunction = function(){
			return function(d){
				return d.y;
			};
		};
		$scope.close = function() {
			$modalInstance.close();
		};

		$scope.showPlayer = function(player) {
			$scope.playerData = Bowler.createPlayerData(player.games);
			$scope.selectedPlayer = player._id;
		};

		$scope.back = function() {
			$scope.selectedPlayer = false;
			$scope.playerData = [];
		};
	});