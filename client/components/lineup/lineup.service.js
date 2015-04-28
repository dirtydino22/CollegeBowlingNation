function Lineup(Auth, Notification) {
	'use strict';
	
	var lineup = [];
	var lineupCache = [];
	

	this.get = function() {
		return lineup;
	};

	this.reset = function() {
		lineup = [];
		return this;
	};

	this.update = function(selectedBowlers, roster, callback) {
		var cb = callback || angular.noop;
		
		
		var updatedLineup = [];

		if (selectedBowlers.length > 5) { 
			return Notification.add({
				type: 'danger',
				message: 'Your lineup may only contain up to six bowlers'
			});
		}

		for (var i = 0; i < roster.length; i++) {
			if (selectedBowlers.indexOf(roster[i]._id) !== -1) {
				updatedLineup.push({
					_id: roster[i]._id,
					name: roster[i].name,
					index: i
				});
			}
		}
		//console.log(roster)
		lineup = updatedLineup;
		return cb(lineup);
		
		/**
		if (selectedBowlers.length > 5) { 
			return Notification.add({
				type: 'danger',
				message: 'Your lineup may only contain up to five bowlers'
			});
		}
		// if new lineup
		if (lineup.length < 1) {
			for (var i = 0; i < roster.length; i++) {
			if (selectedBowlers.indexOf(roster[i]._id) !== -1) {
				lineup.push({
					_id: roster[i]._id,
					name: roster[i].name,
					index: i
				});
			}
		}
		}
		// else add to lineup
		else {
			
			
			// create lineupCache of existing lineup items
			lineupCache = angular.copy(lineup);
			
			
			
			console.log('lineup', lineup);
			console.log('lineupCache', lineupCache);
			//lineupCache = [];
		}
		
		return cb(lineup);
		**/
		/**
		var updatedLineup = [];

		if (selectedBowlers.length > 5) { 
			return Notification.add({
				type: 'danger',
				message: 'Your lineup may only contain up to six bowlers'
			});
		}

		for (var i = 0; i < roster.length; i++) {
			if (selectedBowlers.indexOf(roster[i]._id) !== -1) {
				updatedLineup.push({
					_id: roster[i]._id,
					name: roster[i].name,
					index: i
				});
			}
		}
		//console.log(roster)
		lineup = updatedLineup;
		return cb(lineup);
		**/
	};
}

Lineup.$inject = ['Auth', 'Notification'];

angular
	.module('app')
	.service('Lineup', Lineup);