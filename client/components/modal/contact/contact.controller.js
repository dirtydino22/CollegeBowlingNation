function ContactCtrl($modalInstance, Mail) {
    'use strict';
    
	this.mail = {};
    this.close = $modalInstance.close;

    this.send = function(mail) {
    	return Mail.contact(mail,
    		function() {
    			console.log('mail sent');
    		},
    		function() {
    			console.log('mail error');
    		});
    };
}

ContactCtrl.$inject = ['$modalInstance', 'Mail'];

angular
    .module('app')
    .controller('ContactCtrl', ContactCtrl);
