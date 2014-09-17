'use strict';

angular.module('controller.rankings', [])
	.controller('RankingsCtrl', function($scope, $modal, Socket, LocalStorage, growlNotifications, Players, games) {

		$scope.games = games;
		$scope.isModalOpen = false;

		$scope.columns = [
			{label: 'University', map: 'name'},
			{label: 'Games Played', map: 'gamesPlayed'},
			{label: 'Pin Count', map: 'pinCount'}
		];

		$scope.config = {
			isPaginationEnabled: false,
			selectionMode: 'single'
		};

		$scope.$on('selectionChange', function(evt, args) {
			if ($scope.isModalOpen === true) { return false; }
			$scope.isModalOpen = !$scope.isModalOpen;
			var modalInstance = $modal.open({
				templateUrl: 'modals/team',
				controller: 'TeamCtrl',
				resolve: {
					team: function() {
						return args.item;
					},
					players: function(Players) {
						return Players.get({teamName: args.item.name});
					},
					tabs: function() {
						return [
							{title: 'Team Stats', template: 'partials/rankings-team'},
							{title: 'Player Stats', template: 'partials/rankings-players'}
						];
					}
				}
			});
			modalInstance.result.then(function(results) {
				$scope.isModalOpen = !$scope.isModalOpen;
				angular.forEach($scope.games, function(game) {
					game.isSelected = false;
				});
			});
		});

		Socket.on('games:update', function(newgames) {
			LocalStorage.set('games', newgames);
			//$scope.games = newgames; table does not handle updates to scope
			growlNotifications.add('New game data is available upon refresh.', 'success', 4000);
		});
	});