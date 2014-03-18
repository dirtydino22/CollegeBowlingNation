(function(angular) {
    'use strict';
    angular.module('app.service.online', [])
        .factory('Online', [
            '$window',
            function($window) {
                var online = {};
                online.requests = [];

                /**
                 * check
                 * returns a boolean value specific to whether the user is online
                 */
                online.check = function() {
                    if ($window.navigator.onLine) {
                        return true;
                    } else {
                        return false;
                    }
                };

                /**
                 * on
                 * creates an eventListener on the window
                 * events { online, offline }
                 */
                online.on = function(event, handler) {
                    return $window.addEventListener(event, handler);
                };

                // return online object.
                return online;
            }
        ]);
}(angular));