'use strict';

angular.module('controller.roster', [])
	.controller('RosterCtrl', function($scope, $modal, AppUser, Bowler) {
		$scope.roster = AppUser.user.roster;

		$scope.editBowler = function(bowler) {
			var modalInstance = $modal.open({
				templateUrl: 'modals/bowler-edit',
				controller: 'BowlerCtrl',
				resolve: {
					bowler: function() {
						return bowler;
					}
				}
			});
		};
		$scope.newBowler = function() {
			var modalInstance = $modal.open({
                templateUrl: 'modals/bowler-new',
                controller: 'BowlerCtrl',
                resolve: {
					bowler: function() {
						return null;
					}
				}
            });
		};
		$scope.newSeason = function() {
			var modalInstance = $modal.open({
				templateUrl: 'modals/confirm',
				controller: 'ConfirmCtrl',
				resolve: {
					settings: function() {
						return {
							title: 'Are you sure you want to start a new season?',
							message: 'Your current roster and relevant statistical data will be archived and no longer be available.'
						};
					}
				}
			});
			modalInstance.result.then(function(result) {
				if (result === 'confirmed') {
					Bowler.newSeason();
				}
			});
		};
		$scope.removeBowler = function(bowler) {
			var modalInstance = $modal.open({
				templateUrl: 'modals/confirm',
				controller: 'ConfirmCtrl',
				resolve: {
					settings: function() {
						return {
							title: 'Are you sure you want to delete ' + bowler.name + ' from your roster?',
							message: bowler.name + ' will no longer be available in your roster and all relevant statistics will be removed.'
						};
					}
				}
			});
			modalInstance.result.then(function(result) {
				if (result === 'confirmed') {
					Bowler.remove(bowler);
				}
			});
		};
	});