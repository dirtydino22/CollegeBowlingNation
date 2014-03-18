/**
 * app module
 */
(function(angular) {
    'use strict';
    angular.module('app', ['ngRoute', 'ui.bootstrap', 'app.controllers', 'app.services', 'app.directives'])
        .config(function($routeProvider, $locationProvider, $httpProvider) {
            $httpProvider.interceptors.push(function($q, Online) {
                return {
                    // intercept request
                    request: function(config) {
                        if (Online.check()) {
                            // Online
                            return config || $q.when(config);
                        }
                        // Offline
                        else {
                            // check if url is a request to the api
                            if (config.url.indexOf('api/') === -1) {
                                // if not return config

                                return config || $q.when(config);
                            }
                            /* if request to api, then push the url 
                             * string to Online.requests array
                             */
                            return Online.requests.push({
                                url: config.url,
                                method: config.method,
                                data: config.data
                            });
                        }
                    },
                    // intercept response
                    response: function(response) {
                        return response || $q.when(response);
                    },
                    // intercept responseError
                    responseError: function(rejection) {
                        if (rejection.status === 401) {
                            $location.url('/login');
                        }
                        return $q.reject(rejection);
                    }
                };
            });
            // Routes
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/main.html',
                    controller: 'MainCtrl'
                })
                .when('/rankings', {
                    templateUrl: 'templates/rankings.html',
                    controller: 'RankingsCtrl'
                })
                .when('/prospects', {
                    templateUrl: 'templates/prospects.html',
                    controller: 'ProspectsCtrl'
                })
                .when('/admin', {
                    templateUrl: 'templates/admin.html',
                    controller: 'AdminCtrl',
                    resolve: {
                        auth: function(Auth) {
                            Auth.isLoggedIn();
                        }
                    }
                })
                .when('/newgame', {
                    templateUrl: 'templates/bowler.html',
                    controller: 'BowlerCtrl',
                    resolve: {
                        auth: function(Auth) {
                            Auth.isLoggedIn();
                        }
                    }
                })
                .when('/newgame/:id', {
                    templateUrl: 'templates/newgame.html',
                    controller: 'NewGameCtrl',
                    resolve: {
                        auth: function(Auth) {
                            Auth.isLoggedIn();
                        }
                    }
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .run(function($http, $q, Online, socket) {
            Online.on('online', function(e) {
                if (Online.requests.length) {
                    var reqArray = [];

                    /**
                     * handleRequest
                     * handles objects for post and put methods
                     * @param {String} req
                     * @param {String} method
                     * @param {Object} obj
                     */
                    var handleRequest = function(req, method, obj) {
                        if (!obj) {
                            return (method === 'post') ? $http.post(req) : $http.put(req);
                        } else {
                            return (method === 'post') ? $http.post(req, obj) : $http.put(req, obj);
                        }
                    };

                    // create the reqArr from requests
                    for (var i = 0; i < Online.requests.length; i++) {
                        switch (Online.requests[i].method.toLowerCase()) {
                            case 'get':
                                reqArray.push($http.get(Online.requests[i].url));
                                break;
                            case 'post':
                                reqArray.push(handleRequest(Online.requests[i].url, 'post', Online.requests[i].data));
                                break;
                            case 'delete':
                                reqArray.push($http.delete(Online.requests[i].url));
                                break;
                            case 'put':
                                reqArray.push(handleRequest(Online.requests[i].url, 'put', Online.requests[i].data));
                                break;
                        }
                    }
                    /**
                     * uniqueArray
                     * creates a unique array from the reqArray
                     * to prevent duplicate request.
                     * @param {Array} ogArr
                     */
                    var uniqueArray = function(ogArr) {
                        var newArr = [],
                            ogLength = ogArr.length,
                            found, x, y;
                        for (x = 0; x < ogLength; x++) {
                            found = undefined;
                            for (y = 0; y < newArr.length; y++) {
                                if (ogArr[x] === newArr[y]) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                newArr.push(ogArr[x]);
                            }
                        }
                        return newArr;
                    };

                    // make all requests
                    $q.all(uniqueArray(reqArray)).then(function(results) {
                        if (results) {
                            console.log(uniqueArray(reqArray));
                            console.log(results);
                            console.log('Results were returned.');
                            // emit offline:update event 
                            socket.emit('offline:update');
                            // remove made requests
                            Online.requests = [];
                        }
                    });
                } else {
                    console.log('No Requests.');
                }
            });
        });
}(angular));