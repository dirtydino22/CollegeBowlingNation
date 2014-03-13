(function(angular) {
	'use strict';
	angular.module('app.service.localStorage', [])
		.factory('localStorage', [
			'$window',
			'$q',
			function($window, $q) {
				var storage = {};
				/**
				 * isAvailable
				 * returns a boolean value that specifies wether 
				 * localSotrage is available or not.
				 */
				storage.isAvailable = ('localStorage' in $window && $window['localStorage'] !== null) ? true : false;
				
				/**
				 * set
				 * sets a localStorage item
				 */
				storage.set = function (name, item) {
					var d = $q.defer();
					if (storage.isAvailable) {
						$window.localStorage.setItem(name, item);
						d.resolve('Item was stored.');
					}
					else {
						d.reject('Your browser sucks, get a new one buddy.');
					}
					return d.promise;
				};
				/**
				 * get
				 * returns a localStorage item value
				 */
				storage.get = function (name) {
					var d = $q.defer();
					if (storage.isAvailable) {
						d.resolve($window.localStorage.getItem(name));
					}
					else {
						d.reject('Your browser sucks, get a new one buddy.');
					}
					return d.promise;
				};
				/**
				 * remove
				 * removes a localStorage item
				 */
				storage.remove = function (name) {
					var d = $q.defer();
					if (storage.isAvailable) {
						$window.localStorage.removeItem(name);
						d.resolve('Item was removed.');
					}
					else {
						d.reject('Your browser sucks, get a new one buddy.');
					}
					return d.promise;
				};
				return storage;
			}
		]);
}(angular));