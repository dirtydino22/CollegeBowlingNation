/*global angular*/

/*@ngInject*/
function LoginCtrl($location, $modalInstance, Auth, Network) {
    'use strict';
    
    var self = this;

    this.title = 'Login';
    this.loginMode = true;
    this.user = {};
    this.errors = {};

    this.close = function() {
        $modalInstance.close();
    };

    this.login = function(user) {
        if (Network.isOnline()) {
            Auth.login({
                email: user.email,
                password: user.password
            })
            .then(function() {
                $modalInstance.close();
                $location.path('/');
                
            })
            .catch(function(err) {
                self.errors.other = err.message;
            });
        }
        else {
            Auth.loginOffline({
                email: user.email,
                password: user.password
            }, function() {
                $modalInstance.close();
                $location.path('/');
            });
        }
        
    };

    this.forgotPassword = function(email) {
        Auth.forgotPassword(email)
            .then(function() {
                $modalInstance.close();
            })
            .catch(function(err) {
                err = err.data.replace(/["]+/g, ''); // remove quotes
                self.errors.reset = err;
            });
    };
}

LoginCtrl.$inject = ['$location', '$modalInstance', 'Auth', 'Network'];

angular.module('app')
    .controller('LoginCtrl', LoginCtrl);