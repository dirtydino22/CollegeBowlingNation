/*global angular*/

/*@ngInject*/
function SignupCtrl($modalInstance, Auth, Universities) {
	'use strict';
	
    this.user = {};
    this.universities = Universities.get();
    
    this.createAccount = function(user) {
        if (user.password !== user.confirm) { return false; }
			Auth.createTempUser({
				name: user.name,
				email: user.email,
				password: user.password,
				university: user.university
			})
			.then(function() {
				$modalInstance.close();
			}, function(err) {
				console.log(err);
			});
    };
    
    this.close = function() {
        $modalInstance.close();
    };
}

SignupCtrl.$inject = ['$modalInstance', 'Auth', 'Universities'];

angular
    .module('app')
    .controller('SignupCtrl', SignupCtrl);