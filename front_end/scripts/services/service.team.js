'use strict';

angular.module('service.team', [])
	.factory('TeamService', function() {
		var isData = function(data) {
			if (data !== null && data > 0) {return true;}
			return false;
		};

		return {
			createTeamData: function(data) {
				var returnArr = [];
				if (isData(data.gamesPlayed)) {
					returnArr.push({key: 'Games Played ' + data.gamesPlayed, y: data.gamesPlayed});
				}
				if (isData(data.gutterBalls)) {
					returnArr.push({key: 'Gutter Balls ' + data.gutterBalls, y: data.gutterBalls});
				}
				if (isData(data.nineCount)) {
					returnArr.push({key: 'Nine Counts ' + data.nineCount, y: data.nineCount});
				}
				if (isData(data.nineMade)) {
					returnArr.push({key: 'Nine Mades ' + data.nineMade, y: data.nineMade});
				}
				if (isData(data.pinCount)) {
					returnArr.push({key: 'Pins ' + data.pinCount, y: data.pinCount});
				}
				if (isData(data.rollCount)) {
					returnArr.push({key: 'Rolls ' + data.rollCount, y: data.rollCount});
				}
				if (isData(data.spares)) {
					returnArr.push({key: 'Spares ' + data.spares, y: data.spares});
				}
				if (isData(data.sparePercentage)) {
					returnArr.push({key: 'Spare Percentage ' + data.sparePercentage, y: data.sparePercentage});
				}
				if (isData(data.strikes)) {
					returnArr.push({key: 'Strikes ' + data.strikes, y: data.strikes});
				}
				if (isData(data.strikePercentage)) {
					returnArr.push({key: 'Strike Percentage ' + data.strikePercentage, y: data.strikePercentage});
				}
				return returnArr;
			}
		};
	});

