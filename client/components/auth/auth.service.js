'use strict';

angular.module('app')
    .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q, TempUser, socket, Notification, Network, LocalStorage) {
        var currentUser = {};
        if ($cookieStore.get('token')) {
            currentUser = User.get();
        }

        return {

            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            login: function(user, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();

                $http.post('/auth/local', {
                    email: user.email,
                    password: user.password
                }).
                success(function(data) {
                    $cookieStore.put('token', data.token);
                    console.log(data.token);
                    currentUser = User.get();
                    deferred.resolve(data);
                    Notification.add({
                        'type': 'success',
                        'message': 'You have been logged in.'
                    });
                    return cb();
                }).
                error(function(err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));


                return deferred.promise;
            },

            loginOffline: function(user, callback) {
                var cb = callback || angular.noop;
                try {
                    LocalStorage.get('offlineToken')
                        .then(function(token) {
                            var offlineToken = angular.fromJson(token);

                            if (user.password === offlineToken.password && user.email === offlineToken.user.email) {
                                currentUser = offlineToken.user;
                                Notification.add({
                                    'type': 'success',
                                    'message': 'You have been logged in.'
                                });
                                return cb();
                            } else {
                                if (!offlineToken) {
                                    Notification.add({
                                        'type': 'danger',
                                        'message': 'You do not have an offline access token. When a connection is available, go to your account page to retrieve an access token.'
                                    });
                                }
                            }
                        });
                } catch (err) {
                    Notification.add({
                        'type': 'danger',
                        'message': 'You do not have a connection or an offline token to login.'
                    });
                    return cb(err);
                }
            },

            /**
             * Delete access token and user info
             *
             * @param  {Function}
             */
            logout: function() {
                Notification.add({
                    'type': 'success',
                    'message': 'You have been logged out.'
                });
                $cookieStore.remove('token');
                currentUser = {};
            },

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            createUser: function(user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function(data) {
                        $cookieStore.put('token', data.token);
                        currentUser = User.get();
                        socket.socket.emit('user:update');
                        return cb(user);
                    },
                    function(err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },

            removeUser: function(id, callback) {
                var cb = callback || angular.noop;
                return User.delete({
                        id: id
                    }, function(success) {
                        socket.socket.emit('user:update');
                        return cb(success);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

            createTempUser: function(user, callback) {
                var cb = callback || angular.noop;

                return TempUser.save(user,
                    function(res) {
                        socket.socket.emit('tempuser:update');
                        return cb(res);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

            acceptTempUser: function(id, callback) {
                var cb = callback || angular.noop;
                return TempUser.accept({
                        id: id
                    }, function(res) {
                        socket.socket.emit('user:update');
                        socket.socket.emit('tempuser:update');
                        return cb(res);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

            acceptTempAdmin: function(id, callback) {
                var cb = callback || angular.noop;
                return TempUser.acceptAdmin({
                        id: id
                    }, function(res) {
                        socket.socket.emit('user:update');
                        socket.socket.emit('tempuser:update');
                        return cb(res);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

            declineTempUser: function(id, callback) {
                var cb = callback || angular.noop;
                return TempUser.decline({
                        id: id
                    }, function(res) {
                        socket.socket.emit('tempuser:update');
                        return cb(res);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            changePassword: function(oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;

                return User.changePassword({
                    id: currentUser._id
                }, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(user) {
                    return cb(user);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },

            forgotPassword: function(email, callback) {
                var cb = callback || angular.noop;
                return User.forgotPassword({
                    email: email
                }, function(success) {
                    Notification.add({
                        type: 'success',
                        message: 'A reset link has been set to your email.'
                    });
                    return cb(success);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },

            updateAccount: function(user, callback) {
                var cb = callback || angular.noop;
                return User.update({
                    id: user._id
                }, user, function(success) {
                    return cb(success);
                }, function(err) {
                    return cb(err);
                }).$promise;

            },

            /**
             * Gets all available info on authenticated user
             *
             * @return {Object} user
             */
            getCurrentUser: function() {
                return currentUser;
            },

            /**
             * Check if a user is logged in
             *
             * @return {Boolean}
             */
            isLoggedIn: function() {
                return currentUser.hasOwnProperty('role');
            },

            /**
             * Waits for currentUser to resolve before checking if user is logged in
             */
            isLoggedInAsync: function(cb) {
                if (currentUser.hasOwnProperty('$promise')) {
                    currentUser.$promise.then(function() {
                        cb(true);
                    }).catch(function() {
                        cb(false);
                    });
                } else if (currentUser.hasOwnProperty('role')) {
                    cb(true);
                } else {
                    cb(false);
                }
            },

            /**
             * Check if a user is an admin
             *
             * @return {Boolean}
             */
            isAdmin: function() {
                return currentUser.role === 'admin';
            },

            /**
             * Get auth token
             */
            getToken: function() {
                return $cookieStore.get('token');
            },

            getRoster: function(callback) {
                var cb = callback || angular.noop;
                return User.getRoster({
                        id: currentUser._id
                    },
                    function(roster) {
                        return cb(roster);
                    },
                    function() {
                        console.log('roster err');
                    }).$promise;
            },

            createBowler: function(bowlerName, callback) {
                var cb = callback || angular.noop;
                return User.createBowler({
                    id: currentUser._id
                }, {
                    name: bowlerName
                }, function() {
                    return cb();
                }, function() {
                    return cb();
                }).$promise;
            },

            addBowlerTenpinGame: function(bowlerId, stats, callback) {
                var cb = callback || angular.noop;
                return User.addBowlerTenpinGame({
                    id: currentUser._id,
                    bowlerId: bowlerId
                }, stats, function() {
                    return cb();
                }, function() {
                    //return err
                }).$promise;
            },

            addBakerGame: function(stats, callback) {
                var cb = callback || angular.noop;
                return User.addBakerGame({
                    id: currentUser._id
                }, stats, function() {
                    return cb();
                }, function() {
                    // return err
                }).$promise;
            },

            editBowler: function(bowler, callback) {
                var cb = callback || angular.noop;
                return User.updateBowler({
                        id: currentUser._id,
                        bowlerId: bowler._id
                    },
                    bowler,
                    function() {
                        return cb();
                    },
                    function() {
                        //error
                    }).$promise;
            },

            removeBowler: function(bowler, callback) {
                var cb = callback || angular.noop;
                return User.removeBowler({
                        id: currentUser._id,
                        bowlerId: bowler._id
                    },
                    function() {
                        return cb();
                    },
                    function() {
                        //error
                    }).$promise;
            },

            createNewSeason: function(roster, callback) {
                var cb = callback || angular.noop;
                var bowlersToKeep = [];
                for (var i = 0; i < roster.length; i++) {
                    bowlersToKeep.push({
                        _id: roster[i]._id,
                        name: roster[i].name,
                        games: roster[i].games
                    });
                }
                return User.createNewSeason({
                        id: currentUser._id
                    },
                    bowlersToKeep,
                    function() {
                        socket.socket.emit('user:update');
                        return cb();
                    },
                    function() {
                        //error
                    }).$promise;
            }
        };
    });
