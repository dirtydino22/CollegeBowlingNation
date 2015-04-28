/*global angular*/

(function() {
	'use strict';

	function Calculator() {

		this.analyzeBaker = function(data) {
			var dataModel = {
				strikes: data.strikes,
				strikePercentage: calculateStrikePercentage(data),
				spares: data.spares,
				sparePercentage: calculateSparePercentage(data),
				pinTotal: data.pinTotal,
				rollCount: data.rollCount,
				nineCount: data.nineCount,
				nineMade: data.nineMade,
				worth: 1,
				firstBallCount: data.firstBallCount,
				score: data.score,
				strikesToRemoveFromPercentage: data.strikesToRemoveFromPercentage,
				bowlers: []
			};

			for (var bowler in data.lineup) {
				data.lineup[bowler].worth = 1 / data.numberOfBowlers;
				data.lineup[bowler].strikePercentage = (data.lineup[bowler].strikes - data.lineup[bowler].strikesToRemoveFromPercentage) / 2 * 100;
				data.lineup[bowler].sparePercentage = data.lineup[bowler].spares / (2 - (data.lineup[bowler].strikes - data.lineup[bowler].strikesToRemoveFromPercentage)) * 100;
				dataModel.bowlers.push(data.lineup[bowler]);
			}

			return dataModel;
		};

		this.analyzeTenPin = function(data) {
			var dataModel = {
				strikes: 0,
				spares: 0,
				worth: 0,
				rollCount: 0,
				sparePercentage: 0,
				strikePercentage: 0,
				score: 0,
				nineCount: 0,
				nineMade: 0,
				firstBallCount: 0,
				averageFirstBallCount: 0,
				strikesToRemoveFromPercentage: 0,
				pinTotal: 0
			};

			var results = {
				strikes: 0,
				spares: 0,
				worth: 1,
				rollCount: data.rollCount,
				nineCount: data.nineCount,
				nineMade: data.nineMade,
				firstBallCount: data.firstBallCount,
				strikesToRemoveFromPercentage: 0,
				pinTotal: data.pinTotal
			};

			var rolls = data.rollDisplay.split('');

			for (var i = 0; i < rolls.length; i++) {
				switch (rolls[i]) {
					case 'X':
						if (i === 19 || i === 20) {
							results.strikesToRemoveFromPercentage++;
						}
						results.strikes++;
						break;
					case '/':
						results.spares++;
						break;
				}
			}

			results.sparePercentage = calculateSparePercentage(results);
			results.strikePercentage = calculateStrikePercentage(results);
			results.score = data.frameScores[data.frameScores.length - 1];

			angular.extend(dataModel, results);

			return dataModel;
		};

		function calculateSparePercentage(results) {
			return (results.spares >= 1) ? results.spares / (10 - (results.strikes - results.strikesToRemoveFromPercentage)) * 100 : 0;
		}

		function calculateStrikePercentage(results) {
			return (results.strikes >= 1) ? (results.strikes - results.strikesToRemoveFromPercentage) / 10 * 100 : 0;
		}
	}

	//Calculator.$inject = [];

	angular
		.module('app')
		.service('Calculator', Calculator);
})();
