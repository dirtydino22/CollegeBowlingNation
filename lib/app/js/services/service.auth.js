(function(angular) {
	'use strict';
	angular.module('app.service.auth', [])
		.factory('Auth', [function () {
			this.user = null;
			this.currentUser = function () {};
			this.login = function () {};
			this.logout = function () {};
			this.createUser = function () {};
			
			return this;
		}]);
}(angular));