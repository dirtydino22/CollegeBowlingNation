/*@ngInject*/

function ConfirmCtrl($modalInstance, title, message) {
	'use strict';
	
	this.title = title;
	this.message = message;
	this.close = function() {
		return $modalInstance.close();
	};

	this.confirm = function() {
		return $modalInstance.close('confirmed');
	};
}

ConfirmCtrl.$inject = ['$modalInstance', 'title', 'message'];

angular
	.module('app')
	.controller('ConfirmCtrl', ConfirmCtrl);
