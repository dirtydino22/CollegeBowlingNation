function NotificationCtrl(Notification) {
	'use strict';

	this.notifications = Notification.list;
}

NotificationCtrl.$inject = ['Notification'];

angular
    .module('app')
    .controller('NotificationCtrl', NotificationCtrl);
