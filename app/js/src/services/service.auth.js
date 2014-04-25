(function() {
    'use strict';
    angular.module('app.service.auth', [])
        .factory('Auth', [
            '$http',
            '$location',
            '$q',
            '$timeout',
            'Online',
            'localStorage',
            'apiToken',
            '$dialogs',
            function($http, $location, $q, $timeout, Online, localStorage, apiToken, $dialogs) {
                var auth = {};
                // config
                auth.user = {
                    username: false,
                    access: false,
                    id: false,
                    university: false
                };
                auth.message = false;

                /**
                 * login
                 * handles logging in a user
                 */
                auth.login = function(username, password, cb) {
                    if (!Online.check()) {/*console.log('im offline');*/} else {/*console.log('im online still');*/}
                    if (!Online.check()) {
                        try {
                            //console.log('trying to login offline user.');
                            localStorage.get('offlineUser').then(function(user) {
                                var User = angular.fromJson(user);
                                //console.log('User', User);
                                //console.log('Username',User.username);
                                if (!user) { console.log('no offline user'); return false; }
                                if (username === User.username) {
                                    //console.log('username match');
                                    if (password === User.pass) {
                                        //console.log('checking timestamp');
                                        if (User.timestamp > new Date().getTime() - 21 * 24 * 60 * 60 * 1000) { // 21 Days
                                            auth.user.username = User.username;
                                            auth.user.access = User.access;
                                            auth.user.id = User.id;
                                            auth.user.university = User.university;
                                            auth.message = 'Authentication successful.';
                                            cb();
                                        }
                                        else {
                                            //console.log('token out.');
                                            $dialogs.notify('Token Invalid','Your token was not accepted.');
                                        }
                                    }
                                    else {
                                        //console.log('incorrect password.');
                                        $dialogs.notify('Incorrect Password','Your password was incorrect.');
                                    }
                                }
                                else {
                                    //console.log('incorrect username.');
                                    $dialogs.notify('Incorrect Username','Your username was incorrect.');
                                }
                            });
                        }
                        catch (e) {
                            //console.log(e);
                            $dialogs.error('Error Logging In','There was an error when attempting to log in.');
                        }
                    } else {
                        $http.post('/login', {
                            username: username,
                            password: password
                        })
                            .success(function(user) {
                                auth.user.username = user.username;
                                auth.user.access = user.access;
                                auth.user.id = user._id;
                                auth.user.university = user.university;
                                auth.message = 'Authentication successful.';
                                cb();
                            })
                            .error(function(err) {
                                auth.message = err;
                            });
                    }
                };
                /**
                 * logout
                 * handles logging a user out
                 */
                auth.logout = function(cb) {
                    $http.post('/logout')
                        .success(function() {
                            auth.user.username = false;
                            auth.user.access = false;
                            auth.user.id = false;
                            auth.message = 'You are logged out.';
                            cb();
                        })
                        .error(function(err) {
                            auth.message = err;
                        });
                };
                /**
                 * createUser
                 * handles creating a new user
                 */
                auth.createUser = function(user, cb) {
                    //console.log('Creating User', user.university.name);
                    $http.post('/register', {
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        address: user.address,
                        address2: user.address2,
                        city: user.city,
                        state: user.state,
                        zipcode: user.zipcode,
                        phone: user.phone,
                        university: user.university.name,
                        email: user.email,
                        access: user.access,
                        password: user.password
                    })
                        .success(function() {
                            cb();
                        })
                        .error(function(err) {
                            auth.message = err;
                        });
                };
                /**
                 * createAdmin
                 * ** For initial setup ** *
                 * handles creating a new admin
                 */
                auth.createAdmin = function(user, cb) {
                    $http.post('/registeradmin', {
						username: user.username,
						password: user.password
					})
                        .success(function() {
						console.log('admin created');
						cb();
					})
                        .error(function(err) {
                            auth.message = err;
                        });
                };
                /**
                 * isLoggedIn
                 * checks if user is logged in
                 */
                auth.isLoggedIn = function() {
                    var defered = $q.defer();
                    if (!Online.check()) {
                        try {
                            //console.log('trying offline user.');
                            //console.log('User', user);
                            localStorage.get('offlineUser').then(function(user) {
                                if (!user) { return defered.reject(); }
                                if (user.username === Auth.user.username) {
                                    if (user.password === Auth.user.password) {
                                        return defered.resolve();
                                    }
                                    else {
                                        return defered.reject('Incorrect Password.');
                                    }
                                }
                                else {
                                    return defered.reject('Incorrect Username.');
                                }
                            });
                        }
                        catch (e) {
                            return defered.reject('No offline credentials.');
                        }
                    } else {
                        $http.get('/loggedin')
                            .success(function(user) {
                                if (user !== '0') {
                                    $timeout(function() {
                                        defered.resolve();
                                    }, 0);
                                } else {
                                    $timeout(function() {
                                        defered.reject();
                                    }, 0);
                                    $location.url('/login');
                                }
                            });
                        return defered.promise;
                    }
                };
                /**
                 * login
                 * updates a users password
                 */
                auth.updatePassword = function(id, password, cb) {
                    $http.post(apiToken + '/users/' + id + '/password', {
                        password: password
                    })
                        .success(function() {
                            cb();
                        })
                        .error(function(err) {
                            auth.message = err;
                        });
                };
                // return auth object.
                return auth;
            }
        ]);
}).call(this);
