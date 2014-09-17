'use strict';
angular.module('service.lineup', [])
	.service('Lineup', function($q, AppUser, growlNotifications) {
		this.roster = AppUser.user.roster;
		this.lineup = [];

		this.add = function(bowler) {
			return this.bowlers.push(bowler);
		};
		this.reset = function() {
			this.bowlers = [];
			return;
		};
		this.handleLineup = function(selectedBowlers, callback) {
			var newLineup = [], index = 0;
			if (selectedBowlers.length > 5) {
				return growlNotifications.add('Your lineup may only contain up to six bowlers.', 'warning', 4000);
			}
			angular.forEach(this.roster, function(bowler) {
				if (selectedBowlers.indexOf(bowler._id) !== -1) {
					newLineup.push({
						_id: bowler._id,
						name: bowler.name,
						index: index
					});
					index++;
				}
			});
			this.lineup = newLineup;
			return callback(this.lineup);
		};

		return this;
	});