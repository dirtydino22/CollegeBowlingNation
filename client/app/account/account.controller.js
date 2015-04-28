function AccountCtrl(LocalStorage, Auth, User, universities, Notification) {
    'use strict';
    var self = this;

    this.user = Auth.getCurrentUser();
    this.universities = universities;
    this.password = {};
    this.tabs = [{
        title: 'Account Information',
        template: '/app/account/tabs/info.html'
    }, {
        title: 'Change Password',
        template: '/app/account/tabs/password.html'
    }, {
        title: 'Offline Token',
        template: '/app/account/tabs/offline.html'
    }];

    this.updateAccount = function(user) {
        Auth.updateAccount(user)
            .then(function() {
                Notification.add({
                    type: 'success',
                    message: 'Your account has been updated.'
                });
            }, function() {
                Notification.add({
                    type: 'danger',
                    message: 'There was an error updating your account.'
                });
            });
    };

    this.changePassword = function(password) {
        Auth.changePassword(
                password.oldPassword,
                password.newPassword
            )
            .then(function() {
                    Notification.add({
                        type: 'success',
                        message: 'Your password has been updated.'
                    });
                    self.password = {};
                },
                function() {
                    Notification.add({
                        type: 'danger',
                        message: 'There was an error updating your password.'
                    });
                });
    };

    this.isPasswordValid = function(password) {
        return password.offlinePassword === password.confirm;
    };

    this.createOfflineToken = function(password) {
        LocalStorage.set('offlineToken', angular.toJson({
            password: password,
            user: Auth.getCurrentUser()
        }))
            .then(function() {
                Notification.add({
                        type: 'success',
                        message: 'Your offline access token has been stored.'
                    });
                self.password = {};
            });
    };
}

AccountCtrl.$inject = ['LocalStorage', 'Auth', 'User', 'universities', 'Notification'];

angular
    .module('app')
    .controller('AccountCtrl', AccountCtrl);
