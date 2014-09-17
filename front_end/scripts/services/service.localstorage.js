'use strict';
    angular.module('service.localstorage', [])
        .factory('LocalStorage', function($window, $q) {
            return {
                prefix : 'ls.',
                isAvailable: ('localStorage' in $window && $window.localStorage !== null) ? true : false,
                setPrefix: function(prefix) {
                    if (!prefix) { return false; }
                    if (prefix.substr(-1) !== '.') {
                        this.prefix = !!prefix ? prefix + '.' : '';
                        return;
                    }
                    this.prefix = prefix;
                    return;
                },
                set: function(key, val) {
                    var d = $q.defer();
                    if (!!this.isAvailable) {
                        $window.localStorage.setItem(this.prefix + key, angular.toJson(val));
                        d.resolve('Success: item was stored successfully.');
                    }
                    else {
                        d.reject('Error: your browser does not support the HTML5 local-storage API.');
                    }
                    return d.promise;
                },
                get: function(key) {
                    var d = $q.defer(), item = null;
                    if (!!this.isAvailable) {
                        if ($window.localStorage[this.prefix + key]) {
                            d.resolve(angular.fromJson($window.localStorage.getItem(this.prefix + key)));
                        }
                        else {
                            d.reject('Error: key is not available in local-storage');
                        }
                    }
                    else {
                        d.reject('Error: your browser does not support the HTML5 local-storage API.');
                    }
                    return d.promise;
                },
                remove: function(key) {
                    var d = $q.defer(), item = null;
                    if (!!this.isAvailable) {
                        if ($window.localStorage[this.prefix + key]) {
                            $window.localStorage.removeItem(this.prefix + key);
                            d.resolve('Success: item was removed successfully.');
                        }
                        else {
                            d.reject('Error: key is not available in local-storage');
                        }
                    }
                    else {
                        d.reject('Error: your browser does not support the HTML5 local-storage API.');
                    }
                    return d.promise;
                },
                clear: function() {
                    var d = $d.defer();
                    if (!!this.isAvailable) {
                        $window.localStorage.clear();
                        d.resolve('Success: local-storage has been cleared.');
                    }
                    else {
                        d.reject('Error: your browser does not support the HTML5 local-storage API.');
                    }
                    return d.promise;
                }
            };
        });