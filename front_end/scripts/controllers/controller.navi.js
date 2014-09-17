'use strict';

angular.module('controller.navi', [])
	.controller('NaviCtrl', function($scope, $state, $modal, AppUser, Auth, Universities, growlNotifications) {
		$scope.isCollapsed = true;
		$scope.user = AppUser.isLoggedIn() ? AppUser.user : false;
		$scope.admin = AppUser.isAdmin() ? true : false;

		$scope.pageLinks = [
			{title: 'Home', state: 'home'},
			{title: 'Rankings', state: 'rankings'},
			{title: 'Prospects', state: 'prospects'},
			{title: 'Blog', state: 'blog'}
		];

		$scope.userLinks = [
			{title: 'New Game', state: 'newgame'},
			{title: 'My Account', state: 'account'},
			{title: 'My Roster', state: 'roster'}
		];

		$scope.openContactModal = function() {
			var modalInstance = $modal.open({
				templateUrl: 'modals/contact',
				controller: 'ContactCtrl'
			});
		};

		$scope.openLoginModal = function() {
			var modalInstance = $modal.open({
				templateUrl: 'modals/login',
				controller: 'LoginCtrl'
			});
			modalInstance.result.then(function(user) {
				$scope.user = user;
			});
		};

		$scope.openSignUpModal = function() {
			var modalInstance = $modal.open({
				templateUrl: 'modals/signup',
				controller: 'SignUpCtrl',
				resolve: {
					universities: function() {
						return Universities.get();
					}
				}
			});
		};

		$scope.logout = function() {
			Auth.logout()
				.then(function() {
					$scope.user = false;
					$state.go('home');
				});
		};
	});