'use strict';

angular.module('service.bowler', [])
	.factory('Bowler', function(AppUser, User, TeamService, growlNotifications) {
		function analyzeGames(games) {
		  var scores = {}, 
		  	  returnObj = {},
		  	  model = {
			      pinCount: 0,
			      rollCount: 0,
			      gutterBalls: 0,
			      strikes: 0,
			      spares: 0,
			      strikePercentage: 0,
			      sparePercentage: 0,
			      gamesPlayed: 0,
			      nineMade: 0,
			      nineCount: 0
		    };
		  if (games.length > 1) {
			  for (var i = 0; i < games.length; i++) {
			    model.pinCount += games[i].pinCount;
			  	model.rollCount += games[i].rollCount;
			  	model.gutterBalls += games[i].gutterBalls;
			  	model.strikes += games[i].strikes;
			  	model.spares += games[i].spares;
			  	model.strikePercentage += games[i].strikePercentage;
			  	model.sparePercentage += games[i].sparePercentage;
			  	model.gamesPlayed += games[i].worth;
			  	model.nineCount += games[i].nineCount;
			  	model.nineMade += games[i].nineMade;
			  }
			  model.strikePercentage = Math.round(model.strikePercentage / model.gamesPlayed) / 100;
    		  model.sparePercentage = Math.round(model.sparePercentage / model.gamesPlayed) / 100;
		  }
		  else {
		  	model.pinCount = games[0].pinCount;
		  	model.rollCount = games[0].rollCount;
		  	model.gutterBalls = games[0].gutterBalls;
		  	model.strikes = games[0].strikes;
		  	model.spares = games[0].spares;
		  	model.strikePercentage = Math.round(games[0].strikePercentage) / 100;
		  	model.sparePercentage = Math.round(games[0].sparePercentage) / 100;
		  	model.gamesPlayed = 1;
		  	model.nineCount = games[0].nineCount;
		  	model.nineMade = games[0].nineMade;
		  }


		  return TeamService.createTeamData(model);
		}

		return {
			create: function(bowlerName, callback) {
	            var cb = callback || angular.noop;
	            return User.createBowler({id: AppUser.user.id}, {name: bowlerName}, function(success) {
	                growlNotifications.add('Your new bowler has been created.', 'success', 4000);
	            }, function(err) {
	                growlNotifications.add('There was an error creating your new bowler.', 'danger', 4000);
	            }).$promise;
	        },

	        edit: function(bowler, callback) {
	        	var cb = callback || angular.noop;
	        	return User.editBowler({id: AppUser.user.id, bowlerId: bowler._id}, bowler, function(success) {
	        		growlNotifications.add('Your bowler has been updated.', 'success', 4000);
	        	}, function(err) {
	        		growlNotifications.add('There was an error updating your bowler.', 'danger', 4000);
	        	}).$promise;
	        },

	        remove: function(bowler, callback) {
	        	var cb = callback || angular.noop;
	        	return User.removeBowler({id: AppUser.user.id, bowlerId: bowler._id}, function(success) {
	        		growlNotifications.add('Your bowler has been removed.', 'success', 4000);
	        	}, function(err) {
	        		growlNotifications.add('There was an error removing your bowler.', 'danger', 4000);
	        	}).$promise;
	        },

	        newSeason: function(callback) {
	            var cb = callback || angular.noop;
	            return User.newSeason({id: AppUser.user.id}, function(success) {
	                growlNotifications.add('Your new season has been created.', 'success', 4000);
	            }, function(err) {
	                growlNotifications.add('There was an error creating your new season.', 'danger', 4000);
	            }).$promise;
	        },

	        createPlayerData: function(games) {
	        	return analyzeGames(games);
	        }
		};
	});