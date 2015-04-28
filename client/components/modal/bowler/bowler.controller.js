function BowlerCtrl($modalInstance, Auth, type, bowler) {
	'use strict';
	
	this.type = type;
	this.bowler = bowler;

	this.close = $modalInstance.close;

	this.createBowler = function(bowlerName) {
		Auth.createBowler(bowlerName)
			.then(function() {
				$modalInstance.close('update');
			})
			.catch(function() {
				$modalInstance.close();
			});
	};

	this.editBowler = function(bowler) {
		Auth.editBowler(bowler)
			.then(function() {
				$modalInstance.close('update');
			});
	};
}

BowlerCtrl.$inject = ['$modalInstance', 'Auth', 'type', 'bowler'];

angular
	.module('app')
	.controller('BowlerCtrl', BowlerCtrl);