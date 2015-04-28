function Notification() {
	'use strict';
	
	this.list = [];

	/**
	 * @param {Object{string type, string message}} notification
	 **/
	this.add = function(notification) {
		return this.list.push(notification);
	};
}

angular
	.module('app')
	.service('Notification', Notification);