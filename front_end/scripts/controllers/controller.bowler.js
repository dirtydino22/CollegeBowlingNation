'use strict';

angular.module('controller.bowler', [])
	.controller('BowlerCtrl', function($scope, $modalInstance, AppUser, Bowler, bowler) {
		$scope.bowler = bowler || {};

		$scope.editBowler = function(bowler) {
			Bowler.edit(bowler)
				.then(function() {
					$modalInstance.close();
				});
		};

		$scope.createBowler = function(bowlerName) {
			Bowler.create(bowlerName)
				.then(function() {
					$modalInstance.close();
				});
		};

		$scope.close = function() {
			$modalInstance.dismiss();
		};
	
	});