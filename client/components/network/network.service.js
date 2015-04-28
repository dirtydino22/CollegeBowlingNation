function Network($window) {
	'use strict';
	
	this.requests = [];

	this.isOnline = function() {
		return $window.navigator.onLine ? true : false;
	};

	this.on = function(evt, fn) {
		return $window.addEventListener(evt, fn);
	};

	this.addRequest = function(req) {
		return this.requests.push(req);
	};

	this.reset = function() {
		this.requests = [];
		return;
	};
}

Network.$inject = ['$window'];

angular
	.module('app')
	.service('Network', Network);