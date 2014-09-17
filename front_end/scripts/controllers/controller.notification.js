'use strict';

angular.module('controller.notification', [])
	.controller('NotificationCtrl', function($scope, growlNotifications) {
		$scope.growlNotifications = growlNotifications;
	});