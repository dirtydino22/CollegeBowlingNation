'use strict';
angular.module('service.appuser', [])
    .factory('AppUser', function($cookieStore, User, growlNotifications) {
        var appuser = {};
        appuser.user = $cookieStore.get('user') || null;
        $cookieStore.remove('user');

        appuser.set = function(user) {
            appuser.user = user;
            return;
        };

        appuser.remove = function() {
            appuser.user = null;
            return;
        };

        appuser.isAdmin = function() {
            if (!appuser.user) {
                return false;
            }
            return (appuser.user.role === 'admin') ? true : false;
        }

        appuser.isLoggedIn = function() {
            return !!appuser.user;
        };

        appuser.currentUser = function() {
            return User.get();
        };

        appuser.changePassword = function(oldPassword, newPassword, callback) {
            var cb = callback || angular.noop;
            return User.changePassword({id: appuser.user.id}, {
                oldPassword: oldPassword,
                newPassword: newPassword
            }, function(user) {
                appuser.user = user;
                return cb();
            }, function(err) {
                return cb(err);
            }).$promise;
        };

        appuser.updateAccount = function(user, callback) {
            var cb = callback || angular.noop;
            return User.updateAccount({
                id: user.id
            }, user, function(success) {
                return cb(success);
            }, function(err) {
                return cb(err);
            }).$promise;
        };

        

        return appuser;
    });