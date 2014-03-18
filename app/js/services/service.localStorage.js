(function(angular) {
	'use strict';
	angular.module('app.service.localStorage', [])
		.factory('localStorage', [
			'$window',
			'$q',
			function($window, $q) {
				var storage = {};
				
				storage.prefix = 'ls.';

				/**
				 * isAvailable
				 * returns a boolean value that specifies wether 
				 * localSotrage is available or not.
				 */
				storage.isAvailable = ('localStorage' in $window && $window['localStorage'] !== null) ? true : false;

				/**
				 * setPrefix
				 * sets the storage prefix
				 * if prefix does not end in a '.' , one is appended.
				 */
				storage.setPrefix = function(prefix) {
					if (prefix.substr(-1) !== '.') {
						return storage.prefix = !!prefix ? prefix + '.' : '';
					}
					return storage.prefix = prefix;
				};

				/**
				 * set
				 * sets a localStorage item
				 */
				storage.set = function (key, item) {
					var d = $q.defer();
					if (storage.isAvailable) {
						$window.localStorage.setItem(storage.prefix + key, item);
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
				storage.get = function (key) {
					var d = $q.defer();
					if (storage.isAvailable) {
						d.resolve($window.localStorage.getItem(storage.prefix + key));
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
				storage.remove = function (key) {
					var d = $q.defer();
					if (storage.isAvailable) {
						$window.localStorage.removeItem(storage.prefix + key);
						d.resolve('Item was removed.');
					}
					else {
						d.reject('Your browser sucks, get a new one buddy.');
					}
					return d.promise;
				};
				/**
				 * clear
				 * clears entire localStorage
				 */
				storage.clear = function() {
					var d = $q.defer();
					if (storage.isAvailable) {
						$window.localStorage.clear();
						d.resolve('localStorage Cleared.');
					}
					else {
						d.reject('Your browser sucks, get a new one buddy.');
					}
					return d.promise;
				};

				// return storage object
				return storage;
			}
		]);
}(angular));