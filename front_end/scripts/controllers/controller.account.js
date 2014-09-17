'use strict';

angular.module('controller.account', [])
	.controller('AccountCtrl', function($scope, AppUser, growlNotifications, universities, tabs) {
		$scope.user = AppUser.user;
		$scope.universities = universities;
		$scope.tabs = tabs;
		$scope.pass = {};

		$scope.updateAccount = function(user) {
			return AppUser.updateAccount(user)
				.then(function(success) {
					growlNotifications.add('Your account has been updated.', 'success', 4000);
				}, function(err) {
					growlNotifications.add('There was an error updating your account. Please, try again.', 'error', 4000);
				});
		};

		$scope.updatePassword = function(pass) {
			if (pass.newPassword !== pass.confirm) { return false; }
			return AppUser.changePassword(pass.oldPassword, pass.newPassword)
					.then(function(success) {
						growlNotifications.add('Your password has been updated.', 'success', 4000);
					}, function(err) {
						growlNotifications.add('There was an error updating your password. Please, try again.', 'error', 4000);
					});
		};
	});