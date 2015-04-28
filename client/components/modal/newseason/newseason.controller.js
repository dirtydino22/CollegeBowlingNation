function NewSeasonCtrl(Auth, $modalInstance, roster) {
	'use strict';
	
	this.roster = roster;
	this.updatedRoster = [];
	this.close = $modalInstance.close;

	this.updateRoster = function(updatedRoster) {
		this.updatedRoster = updatedRoster;
	};

	this.createNewSeason = function() {
		Auth.createNewSeason(this.updatedRoster,
			function() {
				$modalInstance.close('update');
			});
	};
}

NewSeasonCtrl.$inject = ['Auth', '$modalInstance', 'roster'];

angular
	.module('app')
	.controller('NewSeasonCtrl', NewSeasonCtrl);