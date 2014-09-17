'use strict';
	angular.module('service.online', [])
		.service('Online', function($window) {
			this.requests = [];
			this.isAvailable = function() {
				if (!$window.navigator.onLine) { return false; }
				return true;
			};
			this.on = function(evt, handler) {
				return $window.addEventListener(evt, handler);
			};
			this.addRequest = function(obj) {
				return this.requests.push(obj);
			};
			this.reset = function() {
				this.requests = [];
				return;
			};
			return this;
		});