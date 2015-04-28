function NewGameCtrl(Auth, Lineup, Network, LocalStorage) {
	'use strict';
	
	var self = this;
	//this.roster = Auth.getRoster();
	
	if (!Network.isOnline()) {
        try {
            LocalStorage.get('roster')
                .then(function(roster) {
                    self.roster = angular.fromJson(roster);
                });
        } catch (err) {
            // err no data
        }
    } else {
        Auth.getRoster()
            .then(function(roster) {
                LocalStorage.set('roster', angular.toJson(roster));
                self.roster = roster;
            });
        
    }
	
	
	this.selectedBowlers = {};
	this.lineup = [];
	this.lineupCount = 0;
	this.bowlersSelectedForLineup = false;
	
	// clear lineup
	Lineup.reset();

	this.updateLineup = function(selectedBowlersIds) {
		console.log('IDs', selectedBowlersIds);
		console.log('Roster', this.roster);
		Lineup.update(selectedBowlersIds, this.roster,
			function(updatedLineup) {
				self.lineup = updatedLineup;
				self.lineupCount = updatedLineup.length;
			});
	};

	this.areEnoughBowlersSelected = function() {
		return this.lineup.length === 5;
	};
	
	this.dragControlListeners = {};
}

NewGameCtrl.$inject = ['Auth', 'Lineup', 'Network', 'LocalStorage'];

angular
	.module('app')
	.controller('NewGameCtrl', NewGameCtrl);