'use strict';

angular.module('controller.newgame', [])
	.controller('NewGameCtrl', function($scope, $modal, growlNotifications, Lineup, User, user) {
		$scope.user = user;
		$scope.roster = Lineup.roster;
		$scope.newBowler = {};
		$scope.selectedBowlers = {};
		$scope.lineup = false;
		$scope.lineupCount = false;

		$scope.handleLineup = function(selectedBowlerIds) {
			Lineup.handleLineup(selectedBowlerIds, function(newLineup) {
					$scope.lineup = newLineup;
					$scope.lineupCount = newLineup.length;
				});
		};

		
	});