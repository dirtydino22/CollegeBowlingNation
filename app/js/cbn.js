(function() {
    'use strict';
    angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'dialogs', 'ngGrid', 'app.controllers', 'app.services', 'app.directives', 'app.filters'])
        .constant('apiToken', 'api/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3MiOiJhcGkifQ.rw6L-dKVtRfMPF_iD8iskHPOixTv6s_rcsh6z00xayg')
        .config(function($routeProvider, $locationProvider, $httpProvider) {
            $httpProvider.interceptors.push(function($q, $location, Online) {
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
                .when('/blog', {
                    templateUrl: 'templates/blog.html',
                    controller: 'BlogCtrl'
                })
                .when('/account', {
                    templateUrl: 'templates/account.html',
                    controller: 'AccountCtrl',
                    resolve: {
                        auth: function(Auth) {
                            Auth.isLoggedIn();
                        }
                    }
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
                .when('/startgame', {
                    templateUrl: 'templates/newgame.html',
                    controller: 'NewGameCtrl',
                    resolve: {
                        auth: function(Auth) {
                            Auth.isLoggedIn();
                        }
                    }
                })
                .when('/startbaker', {
                    templateUrl: 'templates/newgame.html',
                    controller: 'NewBakerGameCtrl',
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
        .run(function($http, $q, $window, Online, socket) {
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
                            // emit offline:update event
                            socket.emit('offline:update');
                            // remove made requests
                            Online.requests = [];
                        }
                    });
                }
                /*
                else {
                    console.log('No Requests.');
                }
                */
            });
            /**
             * Cache Manifest
             */
            $window.applicationCache.addEventListener('updateready', function(e) {
                if ($window.applicationCache.status === $window.applicationCache.UPDATEREADY) {
                    if (confirm('A new version of this site is available. Would you like to load it?')) {
                        $window.location.reload();
                    }
                }
            }, false);
        });
}).call(this);

(function() {
	'use strict';
	angular.module('app.controller.account', [])
		.controller('AccountCtrl',[
			'$scope',
			'$http',
			'Universities',
			'Auth',
			'localStorage',
			'apiToken',
			'$dialogs',
			function ($scope, $http, Universities, Auth, localStorage, apiToken, $dialogs) {
				$scope.user = {};
				$scope.tokenMessage = false;
				// retrieve the universities list
				$scope.universities = Universities.get();
				// get users account info
				$http.get(apiToken + '/users/' + Auth.user.id )
					.success(function(user) {
						// add user info to the scope
						$scope.user = user;
					});
				/**
				 * updateInfo
				 * updates a users account info
				 **/
				$scope.updateInfo = function() {
					$http.post(apiToken + '/users/' + Auth.user.id + '/info', {
						firstName: $scope.user.firstName,
						lastName: $scope.user.lastName,
						address: $scope.user.address,
						address2: $scope.user.address2,
						city: $scope.user.city,
						state: $scope.user.state,
						zipcode: $scope.user.zipcode,
						phone: $scope.user.phone,
						university: $scope.user.university.name,
						email: $scope.user.email,
					})
						.success(function() {
							//console.log('User updated');
							$dialogs.notify('User Updated','Your information has been updated.');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Data post error','Your information could not be updated at this time.');
						});
				};
				/**
				 * updatePassword
				 * updates a users password
				 **/
				$scope.updatePassword = function() {
					if ($scope.user.password === $scope.user.confirm) {
						Auth.updatePassword(Auth.user.id, $scope.user.password, function() {
							//console.log('Password Updated.');
							$dialogs.notify('Password Updated','Your password has been updated.');
						});
					}
				};
				/**
				 * requestOfflineToken
				 * save a offline token in localStorage
				 **/
				$scope.requestOfflineToken = function() {
					if ($scope.user.offlinePassword === $scope.user.offlineConfirm) {
						localStorage.set('offlineUser', angular.toJson({
							username: Auth.user.username,
		                    access: Auth.user.access,
		                    id: Auth.user.id,
		                    pass: $scope.user.offlinePassword,
		                    timestamp: new Date().getTime()
						})).then(function() {
							$dialogs.notify('Success','Your offline token has been saved and is good for 21 days. Use this password with your username when logging in with no internet connection for offline access.');
						});
					}
					else {
						$dialogs.error('Error Retrieving Token','Your passwords do not match.');
					}
				};
			}
		]);
}).call(this);

(function() {
	'use strict';
	angular.module('app.controller.admin', [])
		.controller('AdminCtrl',[
			'$scope',
			'$http',
			'Auth',
			'socket',
			'localStorage',
			'Online',
			'apiToken',
			'$dialogs',
			function ($scope, $http, Auth, socket, localStorage, Online, apiToken, $dialogs) {
				/**
				 * Temp Users
				 */
				 //socket
				socket.on('tempUser:update', function(tempUsers) {
					localStorage.set('tempUsers', angular.toJson(tempUsers));
					$scope.tempUsers = tempUsers;
				});

				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('tempUsers').then(function(users) {
							$scope.tempUsers = angular.fromJson(users);
						});
					}
					catch (err) {
						// no data
						//console.log('No Data');
						$dialogs.error('No Data','The online check has failed.');
					}
				}
				else {
					// initial api call for tempUsers
					$http.get(apiToken + '/tempUsers')
						.success(function(users) {
							// cache api results in localStorage
							localStorage.set('tempUsers', angular.toJson(users));
							$scope.tempUsers = users;
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Temp Users Error','There was an error generating a temp user.');
						});
				}
				
				/**
				 * declineUser
				 * declines a tempUser
				 * @ {Number} $index
				 */
				$scope.declineUser = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get(apiToken + '/tempUsers/' + id + '/decline')
						.success(function() {
							socket.emit('tempUser:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('User Decline Error','There was an error declining the user.');
						});
				};

				/**
				 * acceptUser
				 * accepts a tempUser as a user
				 * @ {Number} $index
				 */
				$scope.acceptUser = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get(apiToken + '/tempUsers/' + id + '/accept/user')
						.success(function() {
							socket.emit('tempUser:update');
							socket.emit('user:update');
						})
						.error(function() {
							//console.log(err);
							$dialogs.error('Accept User Error','There was an error accepting the user.');
						});
				};

				/**
				 * acceptAdmin
				 * accepts a tempUser as a admin
				 * @ {Number} $index
				 */
				$scope.acceptAdmin = function($index) {
					var id = $scope.tempUsers[$index]._id;
					$http.get(apiToken + '/tempUsers/' + id + '/accept/admin')
						.success(function() {
							socket.emit('tempUser:update');
							socket.emit('user:update');
						})
						.error(function() {
							//console.log(err);
							$dialogs.error('Accept Admin Error','There was an error accepting an admin.');
						});
				};
				// end Temp Users

				/**
				 * Users
				 */
				socket.on('user:update', function(users) {
					localStorage.set('users', angular.toJson(users));
					$scope.users = users;
				});
				
				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('users').then(function(users) {
							$scope.users = angular.fromJson(users);
						});
					}
					catch (err) {
						// no data
						//console.log('No Data');
						$dialogs.error('Online Check Error','There was an error chacking your online status.');
					}
				}
				else {
					$http.get(apiToken + '/users')
						.success(function(users) {
							localStorage.set('users', angular.toJson(users));
							$scope.users = users;
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Token Error','There was an error accepting your token.');
						});
						
				}
				
				/**
				 * removeUser
				 * removes a user
				 * @ {Number} $index
				 */
				$scope.removeUser = function($index) {
					var id = $scope.users[$index]._id;
					$http.post(apiToken + '/users/' + id + '/remove')
						.success(function() {
							socket.emit('user:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Remove User Error','There was an error removing a user.');
						});
				};
				// end users

				/**
				 * News
				 */
				 // socket
				socket.on('news:update', function(news) {
					localStorage.set('news', angular.toJson(news));
					$scope.news = news;
				});
				$scope.newNews = {};
				$scope.news = {};

				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('news').then(function(news) {
							$scope.news = angular.fromJson(news);
						});
					}
					catch (err) {
						// no data
						//console.log('No Data');
						$dialogs.error('Online Check Error','There was an error checking your online status.');
					}
				}
				else {
					// initial api call for news
					$http.get(apiToken + '/news')
						.success(function(news) {
							localStorage.set('news', angular.toJson(news));
							$scope.news = news;
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Getting News','There was an error getting the news.');
						});
				}
				/**
				 * addNews
				 * posts a news item
				 */
				$scope.addNews = function() {
					$http.post(apiToken + '/news', {
						author: $scope.newNews.author,
						title: $scope.newNews.title,
						body: $scope.newNews.body
					})
					.success(function() {
						// update view
						socket.emit('news:update');
						$scope.newNews = {};
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Error Getting News','There was an error getting the news.');
					});
				};
				/**
				 * removeNews
				 * removes a news item
				 * @ {String} id
				 */
				$scope.removeNews = function(id) {
					$http.delete(apiToken + '/news/' + id)
						.success(function() {
							socket.emit('news:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Removing News','There was an error removing the news.');
						});
				};

				/**
				 * Posts
				 */
				socket.on('post:update', function(posts) {
					localStorage.set('posts', angular.toJson(posts));
					$scope.posts = posts.reverse();
				});
				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('posts').then(function(posts) {
							$scope.posts = angular.fromJson(posts).reverse();
						});
					}
					catch (err) {
						// no data
						//console.log('No Data');
						$dialogs.error('Error Checking Online','There was an error checking your online status.');
					}
				}
				else {
					// initial api call for posts
					$http.get(apiToken + '/posts')
						.success(function(posts) {
							localStorage.set('posts', angular.toJson(posts));
							$scope.posts = posts.reverse();
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Retrieving Posts','There was an error retrieving your posts.');
						});
				}

				$scope.removePost = function(id) {
					$http.delete(apiToken + '/posts/' + id)
						.success(function() {
							socket.emit('post:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Error Removing Post','There was an error removing your post.');
						});
				};
			}
		]);
}).call(this);

(function() {
	'use strict';
	angular.module('app.controller.blog', [])
		.controller('BlogCtrl',[
			'$scope',
			'$http',
			'$modal',
			'socket',
			'localStorage',
			'Online',
			'apiToken',
			'$dialogs',
			function ($scope, $http, $modal, socket, localStorage, Online, apiToken, $dialogs) {
				socket.on('post:update', function(posts) {
					localStorage.set('posts', angular.toJson(posts));
					$scope.posts = posts.reverse();
				});
				$scope.reply = {};

				if (!Online.check()) { // offline
					try {
						// try localStorage for last stored api results
						localStorage.get('posts').then(function(posts) {
							$scope.posts = angular.fromJson(posts).reverse();
						});
					}
					catch (err) {
						// no data
						//console.log('No Data');
						$dialogs.error('No Data','There was an error obtaining your online status.');
					}
				}
				else {
					// initial api call for posts
					$http.get(apiToken + '/posts')
						.success(function(posts) {
							localStorage.set('posts', angular.toJson(posts));
							$scope.posts = posts.reverse();
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('API Call Error','There was an API call error.');
						});
				}

				$scope.openNewPostModal = function() {
					var modalInstance = $modal.open({
						templateUrl: 'templates/modals/modal.post.html',
						controller: 'PostCtrl'
					});
					modalInstance.result.then(function() {
						socket.emit('post:update');
					}, function() {
						return false;
					});
				};
				$scope.addReply = function(id) {
					$http.post(apiToken + '/posts/' + id + '/reply', $scope.reply)
					.success(function() {
						socket.emit('post:update');
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Reply Error','There was an error in adding your reply.');
					});
				};
				$scope.removePost = function(id) {
					$http.delete(apiToken + '/posts/' + id)
						.success(function() {
							socket.emit('post:update');
						})
						.error(function(err) {
							//console.log(err);
							$dialogs.error('Post Removal Error','There was an error removing your post.');
						});
				};
			}
		]);
}).call(this);

(function(angular) {
    'use strict';
    angular.module('app.controller.bowler', [])
        .controller('BowlerCtrl', [
            '$scope',
            '$http',
            'socket',
            'Universities',
            'localStorage',
            'Online',
            'apiToken',
            'Auth',
            'Roster',
            '$dialogs',
            function($scope, $http, socket, Universities, localStorage, Online, apiToken, Auth, Roster, $dialogs) {
                $scope.newBowler = {};
                $scope.selectedBowlers = {};
                $scope.bowlers = {};
                $scope.roster = false;
                $scope.selectionMessage = '';
                // socket
                socket.on('newBowler:update', function(bowlers) {
                    localStorage.set('bowlers', angular.toJson(bowlers));
                    $scope.bowlers = bowlers;
                });

                if (!Online.check()) { // offline
                    try {
                        // try localStorage for last stored api results
                        localStorage.get('bowlers').then(function(bowlers) {
                            $scope.bowlers = angular.fromJson(bowlers);
                        });
                    } catch (err) {
                        // no data
                        $dialogs.error('No Data','Sorry, no data is available at this time.');
                    }
                } else {
                    // initial api call for bowlers
                    $http.get(apiToken + '/bowlers/' + Auth.user.id)
                        .success(function(bowlers) {
                            localStorage.set('bowlers', angular.toJson(bowlers));
                            $scope.bowlers = bowlers;
                        })
                        .error(function(err) {
                            $dialogs.error('Data Unavailble','Sorry, no data is available at this time.');
                        });
                }
                /**
                 * selectionsChanged()
                 * creates roster from selected bowlers
                 */
                $scope.selectionsChanged = function() {
                    var arr = [],
                        index = 0;
                    for (var i in $scope.bowlers) {
                        if ($scope.selectedBowlers.length > 6) {
                            $dialogs.notify('You selected too many bowlers', 'You may only select 6 bowlers to add to your roster.');
                            $scope.selectionMessage = 'You may only select 6 bowlers.';
                            return;
                        }
                        // get selected bowler data from $scope.bowlers
                        if ($scope.selectedBowlers.indexOf($scope.bowlers[i]._id) !== -1) {
                            if ($scope.selectionMessage !== '') {
                                $scope.selectionMessage = '';
                            }
                            arr.push({
                                id: $scope.bowlers[i]._id,
                                name: $scope.bowlers[i].name,
                                index: index // index for newgame dropdown
                            });
                            index++;
                        }
                    }
                    if (arr.length !== 0) {
                        $scope.roster = arr;
                    }
                    Roster.bowlers = arr;
                    return;
                };


                /**
                 * createBowler()
                 * creates a bowler and adds to users roster
                 */
                $scope.createBowler = function() {
                    if ($scope.bowlers.length !== 26) { // limit 26 to a roster
                        $http.post(apiToken + '/bowlers/' + Auth.user.id, {
                            name: $scope.newBowler.name,
                            university: Auth.user.university
                        })
                            .success(function() {
                                // emit newBowler update
                                socket.emit('newBowler:update', Auth.user.id);
                                // clear newBowler input
                                $scope.newBowler = '';
                            })
                            .error(function(err) {
                                $dialogs.error('Error Creating Bowler','There was an error creating your new bowler. Please try again...');
                            });
                    } else {
                        $dialogs.error('Error Creating Bowler','You have reached your roster limit.');
                    }

                };

                $scope.newSeason = function() {
                    $http.post(apiToken + '/newseason', {id: Auth.user.id})
                        .success(function() {
                            socket.emit('newBowler:update', Auth.user.id);
                            $dialogs.notify('Your season has been created','Your new season has been created.');
                        })
                        .error(function(err) {
                            $dialogs.error('Error Creating Season','There was an error creating your new season. Please Try again...');
                        });
                };
            }
        ]);
}(angular));

(function() {
	'use strict';
	angular.module('app.controller.contact', [])
		.controller('ContactCtrl',[
			'$scope',
			'$http',
			'$modalInstance',
			'$dialogs',
			function ($scope, $http, $modalInstance, $dialogs) {
				$scope.contact = {};
				/* cancel
				 * dismisses the modal
				 */
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
				$scope.sendMessage = function() {
					$http.post('/mail', {
						name: $scope.contact.fullName,
						email: $scope.contact.email,
						message: $scope.contact.message
					})
					.success(function() {
						$modalInstance.close();
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Send Message Error','Your message could not be sent.');
					});
				};
			}
		]);
}).call(this);

(function() {
	'use strict';
	angular.module('app.controller.login', [])
		.controller('LoginCtrl', [
		'$scope',
		'$modalInstance',
		'Auth',
		'Universities',
		function ($scope, $modalInstance, Auth, Universities) {
			// config
			$scope.createMode = false;
			$scope.user = {};
			$scope.loginUser = {};
			$scope.universities = Universities.get();

			/**
			 * login
			 * logs a user in
			 */
			$scope.login = function () {
				Auth.login($scope.loginUser.username, $scope.loginUser.password, function() {
					$modalInstance.close();
				});
			};
			/**
			 * register
			 * registers a user
			 */
			$scope.register = function () {
				$scope.createMode = !$scope.createMode;
			};
			/**
			 * createAccount
			 * creates a user account
			 */
			$scope.createAccount = function() {
				if ($scope.user.password === $scope.user.confirm) {
					Auth.createUser($scope.user, function() {
						$modalInstance.close();
					});
				}
			};
		}
	]);
}).call(this);
(function() {
    'use strict';
    angular.module('app.controller.main', [])
        .controller('MainCtrl', [
            '$scope',
            '$http',
            'socket',
            'localStorage',
            'Online',
            'apiToken',
            '$dialogs',
            function($scope, $http, socket, localStorage, Online, apiToken, $dialogs) {
                socket.on('news:update', function(news) {
                    $scope.news = news.reverse();
                });
                if (!Online.check()) {
                    try {
                        // try localStorage for last stored api results
                        localStorage.get('news').then(function(news) {
                            $scope.news = angular.fromJson(news).reverse();
                        });
                    } catch (err) {
                        // no data
                        $dialogs.error('No Data Available','Sorry, there is no data available at this time.');
                    }
                } else {
                    $http.get(apiToken + '/news')
                        .success(function(news) {
                            localStorage.set('news', angular.toJson(news));
                            $scope.news = news.reverse();
                        })
                        .error(function(err) {
                            $dialogs.error('Error','There was an error retrieving news articles.');
                        });
                }
            }
        ]);
}).call(this);

/**
 * app.contorller.navigation module
 */
(function(angular) {
	'use strict';
	angular.module('app.controller.navigation', [])
		.controller('NavigationCtrl', [
		// Dependencies
		'$scope',
		'$location',
		'$modal',
		'Auth',
		function ($scope, $location, $modal, Auth) {
			$scope.isCollapsed = true;
			$scope.user = Auth.user.username;
			$scope.admin = (Auth.user.access === 'admin') ? true : false;
			/**
			 * isActive
			 * return a boolean specifying if a view is active
			 */
			$scope.isActive = function(view) {
				return view === $location.path();
			};
			
			/**
			 * openLoginModal
			 * opens login modal
			 */
			$scope.openLoginModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.login.html',
					controller: 'LoginCtrl'
				});
				modalInstance.result.then(function() {
					$scope.user = Auth.user.username;
					$scope.admin = (Auth.user.access === 'admin') ? true : false;
				});
			};

			/**
			 * openContactModal
			 * opens contact modal
			 */
			$scope.openContactModal = function () {
				var modalInstance = $modal.open({
					templateUrl: 'templates/modals/modal.contact.html',
					controller: 'ContactCtrl'
				});
			};

			/**
			 * logout
			 * logs a user out
			 */
			$scope.logout = function() {
				Auth.logout(function() {
					$scope.user = Auth.user.username;
					$scope.admin = Auth.user.access;
				});
			};
		}
	]);
}(angular));
(function(angular) {
    'use strict';
    angular.module('app.controller.newBakerGame', [])
        .controller('NewBakerGameCtrl', [
            '$scope',
            'Roster',
            function($scope, Roster) {
                $scope.game = 'baker';
                $scope.bowlers = Roster.bowlers;
            }
        ]);
}(angular));

(function(angular) {
    'use strict';
    angular.module('app.controller.newGame', [])
        .controller('NewGameCtrl', [
            '$scope',
            'Roster',
            function($scope, Roster) {
                $scope.game = 'tenpin';
                $scope.bowlers = Roster.bowlers;
            }
        ]);
}(angular));

(function() {
	'use strict';
	angular.module('app.controller.post', [])
		.controller('PostCtrl',[
			'$scope',
			'$http',
			'$modalInstance',
			'apiToken',
			'$dialogs',
			function ($scope, $http, $modalInstance, apiToken, $dialogs) {
				$scope.post = {};
				$scope.submitPost = function() {
					$http.post(apiToken + '/posts', {
						author: $scope.post.author,
						body: $scope.post.body,
						title: $scope.post.title
					})
					.success(function() {
						$modalInstance.close();
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Error Submitting Post','There was an error submitting your post.');
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			}
		]);
}).call(this);

(function() {
	'use strict';
	angular.module('app.controller.prospects', [])
		.controller('ProspectsCtrl', [
			'$scope',
			'$http',
			'apiToken',
			'$dialogs',
			function ($scope, $http, apiToken, $dialogs) {
				var userArray = [];
				$scope.prospect = {};
				
				$scope.genders = [
					{type: 'Male'},
					{type: 'Female'}
				];
				$scope.bowlStyle = [
					{type: 'Right-handed'},
					{type: 'Left-handed'}
				];
				$scope.admissionStatus = [
					{type: 'I have been admitted to college.'},
					{type: 'I have applied to college.'}
				];
				$scope.collegeClass = [
					{type: 'New Freshman'},
					{type: 'Transfer Student'},
					{type: 'Graduate Student'}
				];
				$scope.financialAid = [
					{applied: 'Yes'},
					{applied: 'No'}
				];

				// returns a list of coaches for select element
				$http.get(apiToken + '/users')
					.success(function(users) {
						//console.log('Users',users);
						var i;
						for (i = 0; i < users.length; i++) {
							// push coach object
							userArray.push({
								desc: users[i].firstName + ' ' + users[i].lastName + ' ' + users[i].university + ' : ' + users[i].email,
								name: users[i].firstName + users[i].lastName,
								email: users[i].email
							});
						}
						$scope.coaches = userArray;
					}).
					error(function(err) {
						//console.log(err);
						$dialogs.error('Token Error','Your token could not be validated at this time.');
					});

				$scope.sendToCoach = function() {
					$http.post('/mailtocoach', {
						fullName: $scope.prospect.fullName,
						gender: $scope.prospect.gender.type,
						email: $scope.prospect.email,
						address: $scope.prospect.address,
						city: $scope.prospect.city,
						state: $scope.prospect.state,
						zipcode: $scope.prospect.zipcode,
						country: $scope.prospect.country,
						highschool: $scope.prospect.highschool,
						classification: $scope.prospect.classification,
						schoolCity: $scope.prospect.schoolCity,
						schoolState: $scope.prospect.schoolState,
						gpa: $scope.prospect.gpa,
						act: $scope.prospect.act,
						major: $scope.prospect.major,
						admissionStatus: $scope.prospect.admissionStatus.type,
						collegeClass: $scope.prospect.collegeClass.type,
						financialAid: $scope.prospect.financialAid.applied,
						bowlStyle: $scope.prospect.bowlStyle.type,
						currentAverage: $scope.prospect.currentAverage,
						highAverage: $scope.prospect.highAverage,
						schoolOfIntrest: $scope.prospect.schoolOfIntrest,
						coachToContact: $scope.prospect.coachToContact.email,
						message: $scope.prospect.message,
					})
					.success(function() {
						//console.log('Message Sent.');
						$dialogs.notify('Message Sent','Your Message');
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Message Send Error','Your message could not be sent at this time.');
					});
				};
			}
		]);
}).call(this);

(function() {
    'use strict';
    angular.module('app.controller.rankings', [])
        .controller('RankingsCtrl', [
            '$scope',
            '$http',
            '$modal',
            'socket',
            'localStorage',
            'Online',
            'apiToken',
            '$dialogs',
            function($scope, $http, $modal, socket, localStorage, Online, apiToken, $dialogs) {
                var getPlayers, getGames, analyzeGameData, createAnalyzedDataArray;
                $scope.teamData = [];
                $scope.selectedTeams = [];
                $scope.message = '';

                function reset() {
                    $scope.selectedTeams = [];
                }
                $scope.$watchCollection('selectedTeams', function(newValue) {
                    if ($scope.selectedTeams.length > 0) {
                        var modalInstance = $modal.open({
                            templateUrl: 'templates/modals/modal.team.html',
                            controller: 'TeamCtrl',
                            resolve: {
                                team: function() {
                                    return $scope.selectedTeams;
                                }
                            }
                        });
                        modalInstance.result.then(function() {
                            $scope.message = 'Please deselect team before choosing another.';
                        });
                    }
                    if ($scope.selectedTeams.length === 0) {
                        $scope.message = '';
                    }
                });
                socket.on('stats:update', function(stats) {
                    localStorage.set('stats', angular.toJson(stats));
                    $scope.teamData = createAnalyzedDataArray(analyzeGameData(getGames(getPlayers(stats))));
                });

                if (!Online.check()) {
                    try {
                        // try localStorage for last stored api results
                        localStorage.get('stats').then(function(stats) {
                            $scope.teamData = $scope.teamData = createAnalyzedDataArray(analyzeGameData(getGames(getPlayers(angular.fromJson(stats)))));
                        });
                    } catch (err) {
                        // no data
                        $dialogs.error('Data Unavailble','Sorry, no data is available at this time.');
                    }
                } else {
                    $http.get(apiToken + '/teams')
                        .success(function(stats) {
                            localStorage.set('stats', angular.toJson(stats));
                            $scope.teamData = createAnalyzedDataArray(analyzeGameData(getGames(getPlayers(stats))));
                        })
                        .error(function(err) {
                            $scope.teamData('Token Error',err);
                        });
                }

                getPlayers = function(stats) {
                    var myObj = {};
                    for (var i = 0; i < stats.length; i++) {
                        for (var o = 0; o < stats[i].roster.length; o++) {
                            if (!myObj.hasOwnProperty(stats[i].university)) {
                                myObj[stats[i].university] = {
                                    name: stats[i].university,
                                    players: [stats[i].roster[o]]
                                };
                            } else {
                                myObj[stats[i].university].players.push(stats[i].roster[o]);
                            }
                        }
                    }
                    return myObj;
                };

                getGames = function(data) {
                    var myObj = {};
                    for (var university in data) {
                        for (var i = 0;  i < data[university].players.length; i++) {
                            if (!myObj.hasOwnProperty(university)) {
                                myObj[university] = {
                                    name: university,
                                    games: data[university].players[i].games
                                };
                            } else {
                                for (var o = 0; o < data[university].players[i].games.length; o++) {
                                    myObj[university].games.push(data[university].players[i].games[o]);
                                }
                            }
                        }
                    }
                    //console.log('Games',myObj);
                    return myObj;
                };

                analyzeGameData = function(gameObj) {
                    var scoreObj = {};
                    for (var key in gameObj) {
                        var obj = gameObj[key];
                        var model = {
                            pinCount: 0,
                            rollCount: 0,
                            gutterBalls: 0,
                            strikes: 0,
                            spares: 0,
                            strikePercentage: 0,
                            sparePercentage: 0,
                            name: undefined,
                            gamesPlayed: 0,
                            nineMade: 0,
                            nineCount: 0
                        };
                        if (gameObj[key].games.length > 1) {
                            for (var i = 0; i < gameObj[key].games.length; i++) {
                                model.pinCount += gameObj[key].games[i].pinCount;
                                model.rollCount += gameObj[key].games[i].rollCount;
                                model.gutterBalls += gameObj[key].games[i].gutterBalls;
                                model.strikes += gameObj[key].games[i].strikes;
                                model.spares += gameObj[key].games[i].spares;
                                model.strikePercentage += gameObj[key].games[i].strikePercentage;
                                model.sparePercentage += gameObj[key].games[i].sparePercentage;
                                model.name = gameObj[key].name;
                                model.gamesPlayed = gameObj[key].games.length;
                                model.nineMade += gameObj[key].games[i].nineMade;
                                model.nineCount += gameObj[key].games[i].nineCount;
                            }
                            model.strikePercentage = Math.round(model.strikePercentage / model.gamesPlayed) / 100;
                            model.sparePercentage = Math.round(model.sparePercentage / model.gamesPlayed) / 100;
                            scoreObj[key] = model;
                        } else {
                            model.pinCount += gameObj[key].games[0].pinCount;
                            model.rollCount += gameObj[key].games[0].rollCount;
                            model.gutterBalls += gameObj[key].games[0].gutterBalls;
                            model.strikes += gameObj[key].games[0].strikes;
                            model.spares += gameObj[key].games[0].spares;
                            model.nineMade += gameObj[key].games[0].nineMade;
                            model.nineCount += gameObj[key].games[0].nineCount;
                            model.strikePercentage += Math.round(gameObj[key].games[0].strikePercentage) / 100;
                            model.sparePercentage += Math.round(gameObj[key].games[0].sparePercentage) / 100;
                            model.name = gameObj[key].name;
                            model.gamesPlayed = 1;
                            scoreObj[key] = model;
                        }
                    }
                    //console.log('scoreObj',scoreObj);
                    return scoreObj;
                };

                createAnalyzedDataArray = function(data) {
                    var arr = [];
                    for (var key in data) {
                        arr.push(data[key]);
                    }
                    return arr;
                };

                $scope.gridOptions = {
                    data: 'teamData',
                    columnDefs: [{
                            field: 'name',
                            displayName: 'University'
                        },

                        {
                            field: 'pinCount',
                            displayName: 'Pin Count'
                        }, {
                            field: 'rollCount',
                            displayName: 'Roll Count'
                        }, {
                            field: 'gutterBalls',
                            displayName: 'Gutter Balls'
                        }, {
                            field: 'strikes',
                            displayName: 'Strikes'
                        }, {
                            field: 'spares',
                            displayName: 'Spares'
                        },
                        {
                            field: 'nineCount',
                            displayName: 'Nine Count'
                        },
                        {
                            field: 'nineMade',
                            displayName: 'Nine Made'
                        },
                        {
                            field: 'strikePercentage',
                            displayName: 'Strike %'
                        }, {
                            field: 'sparePercentage',
                            displayName: 'Spare %'
                        }, {
                            field: 'gamesPlayed',
                            displayName: 'Games Played'
                        }
                    ],
                        selectedItems: $scope.selectedTeams
                    };

            }
        ]);
}).call(this);

(function() {
	'use strict';
	angular.module('app.controller.team', [])
		.controller('TeamCtrl', [
		'$scope',
		'$modalInstance',
		'$http',
		'team',
		'apiToken',
		function ($scope, $modalInstance, $http, team, apiToken) {
			$scope.team = team[0];
			$scope.stats = [$scope.team.pinCount, $scope.team.strikes, $scope.team.spares, $scope.team.gutterBalls, $scope.team.rollCount,];
			$scope.ok = function() {
				$modalInstance.close();
			};

			
		}
	]);
}).call(this);
/**
 * app.controllers module
 */
(function(angular) {
	'use strict';
	angular.module('app.controllers', [
		// Dependencies
		'app.controller.navigation',
		'app.controller.main',
		'app.controller.login',
		'app.controller.contact',
		'app.controller.rankings',
		'app.controller.prospects',
		'app.controller.admin',
		'app.controller.newGame',
        'app.controller.newBakerGame',
		'app.controller.bowler',
		'app.controller.team',
		'app.controller.account',
		'app.controller.blog',
		'app.controller.post'
	]);
}(angular));

(function() {
	angular.module('app.directive.bars', []).directive('bars', [
		function() {
			return {
				restrict: 'A',
				replace: true,
				scope: {
					data: '='
				},
				template: '<div id="chart"></div>',
				link: function($scope, $element, $attrs) {
					var labels = ['Pin Count', 'Strikes', 'Spares', 'Gutter-Balls', 'Rolls'];
					var chart = d3.select($element[0])
							.append('div').attr('class', 'chart')
							.selectAll('div')
							.data($scope.data).enter()
							.append('div')
							.transition().ease('elastic')
							.style('width', function(d) {
								return d + '%';
							})
							.attr('text-anchor', 'middle')
							.text(function(d) {
								return d + '%';
							});
					$scope.$watch('data',function(newVal, oldVal) {
						if (!newVal) {
							return oldVal;
						}
						chart = d3.select($element[0]).selectAll('*').remove();
						chart = d3.select($element[0])
							.append('div').attr('class', 'chart')
							.selectAll('div')
							.data(newVal).enter()
							.append('div')
							.transition().ease('elastic')
							.style('width', function(d) {
								if (d < 15) {
									return d + 5 + '%';
								}
								else if (d > 100) {
									return d * 0.1 + '%';
								}
								else if (d > 1000) {
									return d * 0.01 + '%';
								}
								else if (d > 100000) {
									return d * 0.001 + '%';
								}
								else {
									return d + '%';
								}
								
								//return 100 % d + 'px';
							})
							.attr('text-anchor', 'middle')
							.text(function(d, index) {
								return labels[index] + ' ' + d;
							});
						return chart;
					});
				}
			};
		}
	]);
}).call(this);
(function() {
	angular.module('app.directive.replies', []).directive('replies', [
		'$http',
		'socket',
		'apiToken',
		'$dialogs',
		function($http, socket, apiToken, $dialogs) {
			return {
				restrict: 'A',
				replace: true,
				scope: {
					replies: '=',
					id: '='
				},
				templateUrl: 'templates/replies.html',
				link: function($scope, $element, $attrs) {
					$scope.replies.reverse();
					$scope.reply = {};
					$scope.addReply = function() {
						$http.post(apiToken + '/posts/' + $scope.id + '/reply', $scope.reply)
						.success(function() {
							socket.emit('post:update');
							$dialogs.notify('Success','Your reply has been posted.');
						})
						.error(function(err) {
							$dialogs.error('Error','There was an error posting your reply, please try again.');
						});
					};
				}
			};
		}
	]);
}).call(this);

(function() {
    'use strict';
    angular.module('app.directive.scoreCard', []).directive('scoreCard', [
        '$http',
        'socket',
        'Auth',
        'apiToken',
        function($http, socket, Auth, apiToken) {
            return {
                restrict: 'EA',
                scope: {
                    id: '@'
                },
                templateUrl: 'templates/scorecard.html',
                link: function($scope, $element, $attrs) {
                    var isGameOver, isSecondRoll, isTenthFrame, isTenthFrameThirdRollSpareTry, isTooLargeForSpare, analyze;
                    $scope.pinsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    $scope.frames = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    $scope.rolls = [];
                    $scope.rollCount = 0;
                    $scope.frameScores = [];
                    $scope.rollDisplay = '';
                    $scope.stats = {};
                    $scope.nineCount = 0;
                    $scope.nineMade = 0;
                    $scope.gameOver = false;
                    $scope.addRoll = function(pins) {
                        var rolls = $scope.rollDisplay.split('');
                        $scope.rolls.push(pins);
                        $scope.rollCount++;
                        $scope.frameScores = $scope.$eval('rolls | frameScores');
                        $scope.rollDisplay = $scope.$eval('rolls | rollDisplay');
                        if (pins === 9 && isSecondRoll()) {
                            $scope.nineCount++;
                        }
                        if (pins === 1 && !isSecondRoll()) {
                            if (rolls[rolls.length - 1] === '9') {
                                $scope.nineMade++;
                            }
                        }
                        console.log('NineCount',$scope.nineCount);
                        if (isGameOver()) {
                            $scope.gameOver = true;
                            analyze();
                        }
                        return;
                    };
                    $scope.reset = function() {
                        $scope.rolls = [];
                        $scope.frameScores = [];
                        $scope.rollCount = 0;
                        $scope.stats = {};
                        $scope.rollDisplay = '';
                        $scope.gameOver = false;
                        return;
                    };
                    $scope.submitResults = function() {
                        $http.post(apiToken + '/newgame/' + $scope.id + '/' + Auth.user.id, {
                            game: {
                                pinCount: $scope.stats.pinCount,
                                rollCount: $scope.stats.rollCount,
                                gutterBalls: $scope.stats.gutterBalls,
                                strikes: $scope.stats.strikes,
                                spares: $scope.stats.spares,
                                sparePercentage: $scope.stats.sparePercentage,
                                strikePercentage: $scope.stats.strikePercentage,
                                score: $scope.stats.score,
                                nineMade: $scope.nineMade,
                                nineCount: $scope.nineCount
                            }
                        })
                        .success(function() {
                            socket.emit('stats:update');
                        })
                        .error(function(err) {
                            console.log(err);
                        });
                    };
                    analyze = function() {
                        var strikes = 0,
                            spares = 0,
                            gutters = 0,
                            i;
                        var rolls = $scope.rollDisplay.split('');
                        var pinCount = 0;
                        for (i = 0; i < $scope.rolls.length; i++) {
                            pinCount += $scope.rolls[i];
                        }
                        for (i = 0; i < rolls.length; i++) {
                            if (rolls[i] === 'X') {
                                strikes++;
                            }
                            if (rolls[i] === '/') {
                                spares++;
                            }
                            if (rolls[i] === '-') {
                                gutters++;
                            }
                        }
                        $scope.stats = {
                            pinCount: pinCount,
                            rollCount: $scope.rollCount,
                            gutterBalls: gutters,
                            spares: spares,
                            strikes: strikes,
                            sparePercentage: spares / ($scope.rollCount - strikes) * 100,
                            strikePercentage: strikes / $scope.rollCount * 100,
                            currentScore: $scope.frameScores[$scope.frameScores.length - 1]
                        };

                        return $scope.stats;
                    };
                    isGameOver = function() {
                        return $scope.frameScores.length === 10;
                    };
                    isSecondRoll = function() {
                        return $scope.rollDisplay.length % 2 === 1;
                    };
                    isTooLargeForSpare = function(pins) {
                        return pins + $scope.rolls[$scope.rolls.length - 1] > 10;
                    };
                    isTenthFrame = function() {
                        return $scope.rollDisplay.length >= 17;
                    };
                    isTenthFrameThirdRollSpareTry = function() {
                        var check = $scope.rollDisplay[19] !== 'X' && $scope.rollDisplay.length === 20;
                        return check;
                    };
                    var disabled = $scope.disabled = function(pins) {
                        var check = isGameOver() || isSecondRoll() && isTooLargeForSpare(pins) && !isTenthFrame() || isTenthFrameThirdRollSpareTry() && isTooLargeForSpare(pins);
                        return check;
                    };
                    return disabled;
                }
            };
        }
    ]);
}.call(this));

(function() {
    'use strict';
    angular.module('app.directive.scoreCardBaker', []).directive('scoreCardBaker', [
        '$http',
        '$q',
        'socket',
        'Auth',
        'apiToken',
        '$dialogs',
        function($http, $q, socket, Auth, apiToken, $dialogs) {
            return {
                restrict: 'EA',
                scope: {
                    id: '@'
                },
                templateUrl: 'templates/scorecard.html',
                link: function($scope, $element, $attrs) {
                    var isGameOver, isSecondRoll, isTenthFrame, isTenthFrameThirdRollSpareTry, isTooLargeForSpare, analyze;
                    var totalFrames = 0;
                    $scope.pinsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    $scope.frames = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    $scope.myRoster = {};
                    $scope.rolls = [];
                    $scope.rollCount = 0;
                    $scope.frameScores = [];
                    $scope.rollDisplay = '';
                    $scope.stats = {};
                    $scope.nineCount = 0;
                    $scope.nineMade = 0;
                    $scope.gameOver = false;

                    $scope.addRoll = function(pins) {
                        var rolls = $scope.rollDisplay.split('');
                        totalFrames = totalFrames + 1 / 2;
                        $scope.rolls.push(pins);
                        $scope.rollCount++;
                        $scope.frameScores = $scope.$eval('rolls | frameScores');
                        $scope.rollDisplay = $scope.$eval('rolls | rollDisplay');
                        // create bowler stats object
                        if (!$scope.myRoster[$scope.id]) {
                            $scope.myRoster[$scope.id] = {};
                            $scope.myRoster[$scope.id].id = $scope.id;
                        }
                        // get spares
                        if (totalFrames % 1 === 0) {
                            if ($scope.rolls[$scope.rolls.length - 1] + $scope.rolls[$scope.rolls.length - 2] === 10) {
                                if (!$scope.myRoster[$scope.id].spares) {
                                    $scope.myRoster[$scope.id].spares = 1;
                                }
                                else {
                                    $scope.myRoster[$scope.id].spares++;
                                }
                            }

                        }
                        // get nine-count
                        if (pins === 9 && isSecondRoll()) {
                            if (!$scope.myRoster[$scope.id].nineCount) {
                                $scope.myRoster[$scope.id].nineCount = 1;
                            }
                            else {
                                $scope.myRoster[$scope.id].nineCount++;
                            }
                        }
                        // get nine-made
                        if (pins === 1 && !isSecondRoll()) {
                            if (rolls[rolls.length - 1] === '9') {
                                if (!$scope.myRoster[$scope.id].nineMade) {
                                    $scope.myRoster[$scope.id].nineMade = 1;
                                }
                                else {
                                    $scope.myRoster[$scope.id].nineMade++;
                                }
                            }
                        }
                        // get pincount
                        if (!$scope.myRoster[$scope.id].pinCount) {
                            $scope.myRoster[$scope.id].pinCount = pins;
                        }
                        else {
                            $scope.myRoster[$scope.id].pinCount += pins;
                        }


                        // get roll count
                        if (!$scope.myRoster[$scope.id].rolls) {
                            $scope.myRoster[$scope.id].rolls = 1;
                        }
                        else {
                            $scope.myRoster[$scope.id].rolls++;
                        }
                        // get gutters
                        if (pins === 0) {
                            if (!$scope.myRoster[$scope.id].gutterBalls) {
                                $scope.myRoster[$scope.id].gutterBalls = 1;
                            }
                            else {
                                $scope.myRoster[$scope.id].gutterBalls++;
                            }
                        }
                        // get strikes
                        if (pins === 10) {
                            if (!$scope.myRoster[$scope.id].strikes) {
                                $scope.myRoster[$scope.id].strikes = 1;
                                totalFrames = totalFrames + 1 / 2;
                            }
                            else {
                                $scope.myRoster[$scope.id].strikes++;
                                totalFrames = totalFrames + 1 / 2;
                            }
                        }

                        if (isGameOver()) {
                            $scope.gameOver = true;
                        }

                        return;
                    };

                    $scope.reset = function() {
                        $scope.rolls = [];
                        $scope.frameScores = [];
                        $scope.rollCount = 0;
                        $scope.stats = {};
                        $scope.rollDisplay = '';
                        $scope.gameOver = false;
                        $scope.myRoster = {};
                        return;
                    };
                    $scope.submitResults = function() {
                        var urlArr = [];
                        for (var id in $scope.myRoster) {
                            urlArr.push($http.post(apiToken + '/newgame/' + $scope.myRoster[id].id + '/' + Auth.user.id, {
                                game: {
                                    pinCount: $scope.myRoster[id].pinCount,
                                    rollCount: $scope.myRoster[id].rolls,
                                    gutterBalls: $scope.myRoster[id].gutterBalls,
                                    strikes: $scope.myRoster[id].strikes,
                                    spares: $scope.myRoster[id].spares,
                                    score: $scope.frameScores[$scope.frameScores.length - 1],
                                    nineMade: $scope.myRoster[id].nineMade,
                                    nineCount: $scope.myRoster[id].nineCount,
                                    sparePercentage: $scope.myRoster[id].spares / ($scope.myRoster[id].rolls - $scope.myRoster[id].strikes) * 100,
                                    strikePercentage: $scope.myRoster[id].strikes / $scope.myRoster[id].rolls * 100
                                }
                            }));
                        }
                        $q.all(urlArr).then(function(results) {
                            if (results) {
                                $dialogs.notify('Success','Game results have been saved.');
                            }
                        });
                    };

                    isGameOver = function() {
                        return $scope.frameScores.length === 10;
                    };
                    isSecondRoll = function() {
                        return $scope.rollDisplay.length % 2 === 1;
                    };
                    isTooLargeForSpare = function(pins) {
                        return pins + $scope.rolls[$scope.rolls.length - 1] > 10;
                    };
                    isTenthFrame = function() {
                        return $scope.rollDisplay.length >= 17;
                    };
                    isTenthFrameThirdRollSpareTry = function() {
                        var check = $scope.rollDisplay[19] !== 'X' && $scope.rollDisplay.length === 20;
                        return check;
                    };
                    var disabled = $scope.disabled = function(pins) {
                        var check = isGameOver() || isSecondRoll() && isTooLargeForSpare(pins) && !isTenthFrame() || isTenthFrameThirdRollSpareTry() && isTooLargeForSpare(pins);
                        return check;
                    };
                    return disabled;
                }
            };
        }
    ]);
}.call(this));

(function(angular) {
	'use strict';
	angular.module('app.directives', ['app.directive.scoreCard','app.directive.scoreCardBaker','app.directive.replies','app.directive.bars']);
}(angular));

(function() {
    'use strict';
    var FrameScorer;

    angular.module('app.filter.frameScore', []).filter('frameScores', function() {
        return function(rolls) {
            return (new FrameScorer(rolls)).frameScore();
        };
    });

    FrameScorer = (function() {
        function FrameScorer(rolls) {
            this.rolls = rolls;
        }

        FrameScorer.prototype.frameScore = function(scores, here) {
            if (!scores) {
                scores = [];
            }
            if (!here) {
                here = 0;
            }
            if (this.isIncompleteFrame(here)) {
                return scores;
            } else if (this.isSpare(here)) {
                return this.pushThisScoreAndFinish(scores, this.sumNextThreePins(here), here + 2);
            } else if (this.isStrike(here)) {
                return this.pushThisScoreAndFinish(scores, this.sumNextThreePins(here), here + 1);
            } else {
                return this.pushThisScoreAndFinish(scores, this.sumNextTwoPins(here), here + 2);
            }
        };

        FrameScorer.prototype.pushThisScoreAndFinish = function(scores, thisFrameScore, nextFrameStart) {
            scores.push(this.lastScore(scores) + thisFrameScore);
            return this.frameScore(scores, nextFrameStart);
        };

        FrameScorer.prototype.isStrike = function(here) {
            return this.rolls[here] === 10;
        };

        FrameScorer.prototype.isSpare = function(here) {
            return (this.rolls[here] + this.rolls[here + 1] === 10) && (!this.isStrike(here));
        };

        FrameScorer.prototype.sumNextThreePins = function(here) {
            return this.rolls[here] + this.rolls[here + 1] + this.rolls[here + 2];
        };

        FrameScorer.prototype.sumNextTwoPins = function(here) {
            return this.rolls[here] + this.rolls[here + 1];
        };

        FrameScorer.prototype.lastScore = function(scores) {
            var ref = scores[scores.length - 1];
            return (ref) ? ref : 0;
        };

        FrameScorer.prototype.isIncompleteFrame = function(here) {
            return this.isShortFrameOrNakedStrike(here) || this.isNakedSpareOrStrikeWith1Roll(here);
        };

        FrameScorer.prototype.isNakedSpareOrStrikeWith1Roll = function(here) {
            return (this.rolls.length === here + 2) && (this.isStrike(here) || this.isSpare(here));
        };

        FrameScorer.prototype.isShortFrameOrNakedStrike = function(here) {
            return this.rolls.length <= here + 1;
        };

        return FrameScorer;

    })();

}).call(this);
(function() {
    'use strict';
    var RollDisplayer;

    angular.module('app.filter.rollDisplay', []).filter('rollDisplay', function() {
        return function(rolls) {
            return (new RollDisplayer(rolls)).rollDisplay();
        };
    });

    RollDisplayer = (function() {
        function RollDisplayer(rolls) {
            this.rolls = rolls;
        }

        RollDisplayer.prototype.rollDisplay = function(str, here) {
            if (!str) {
                str = "";
            }
            if (!here) {
                here = 0;
            }
            if (this.rolls.length === here) {
                return str;
            } else if (this.rolls.length === here + 1 && !this.isStrike(here)) {
                return str + this.displayPins(here);
            } else if (this.isStrike(here)) {
                return this.rollDisplay(str + this.spaceUnlessTenth(str) + "X", here + 1);
            } else if (this.isSpare(here)) {
                return this.rollDisplay(str + this.displayPins(here) + '/', here + 2);
            } else {
                return this.rollDisplay(str + this.displayPins(here) + this.displayPins(here + 1), here + 2);
            }
        };

        RollDisplayer.prototype.displayPins = function(here) {
            var str = '-123456789',
                ref = str[this.rolls[here]];
            return (ref !== null) ? ref : '?';
        };

        RollDisplayer.prototype.isStrike = function(here) {
            return this.rolls[here] === 10;
        };

        RollDisplayer.prototype.isSpare = function(here) {
            return this.rolls[here] + this.rolls[here + 1] === 10 && !this.isStrike(here);
        };

        RollDisplayer.prototype.spaceUnlessTenth = function(str) {
            return (str.length >= 18) ? '' : ' ';
        };

        return RollDisplayer;

    })();

}).call(this);
(function(angular) {
	'use strict';
	angular.module('app.filters', ['app.filter.rollDisplay', 'app.filter.frameScore']);
}(angular));
function minErr(module) {
    var stringify = function(arg) {
        if (typeof arg === 'function') {
            return arg.toString().replace(/ \{[\s\S]*$/, '');
        } else if (typeof arg === 'undefined') {
            return 'undefined';
        } else if (typeof arg !== 'string') {
            return JSON.stringify(arg);
        }
        return arg;
    };
    return function() {
        var code = arguments[0],
            prefix = '[' + (module ? module + ':' : '') + code + '] ',
            message,
            i;
        message = prefix + 'MINERR_URL' + (module ? module + 'MINERR_SEPARATOR' : '') + code;
        for (i = 1; i < arguments.length; i++) {
            message = message + (i === 1 ? '?' : '&') + 'p' + (i - 1) + '=' +
                encodeURIComponent(stringify(arguments[i]));
        }
        return new Error(message);
    };
}

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

(function(angular) {
    'use strict';
    angular.module('app.service.localStorage', [])
        .factory('localStorage', [
            '$window',
            '$q',
            function($window, $q) {
                var storage = {};

                storage.prefix = 'ls.';

                /**
                 * isAvailable
                 * returns a boolean value that specifies wether
                 * localSotrage is available or not.
                 */
                storage.isAvailable = ('localStorage' in $window && $window.localStorage !== null) ? true : false;

                /**
                 * setPrefix
                 * sets the storage prefix
                 * if prefix does not end in a '.' , one is appended.
                 */
                storage.setPrefix = function(prefix) {
                    if (prefix.substr(-1) !== '.') {
                        storage.prefix = !! prefix ? prefix + '.' : '';
                        return;
                    }
                    storage.prefix = prefix;
                    return;
                };

                /**
                 * set
                 * sets a localStorage item
                 */
                storage.set = function(key, item) {
                    var d = $q.defer();
                    if (storage.isAvailable) {
                        $window.localStorage.setItem(storage.prefix + key, item);
                        d.resolve('Item was stored.');
                    } else {
                        d.reject('Your browser sucks, get a new one buddy.');
                    }
                    return d.promise;
                };
                /**
                 * get
                 * returns a localStorage item value
                 */
                storage.get = function(key) {
                    var d = $q.defer();
                    if (storage.isAvailable) {
                        d.resolve($window.localStorage.getItem(storage.prefix + key));
                    } else {
                        d.reject('Your browser sucks, get a new one buddy.');
                    }
                    return d.promise;
                };
                /**
                 * remove
                 * removes a localStorage item
                 */
                storage.remove = function(key) {
                    var d = $q.defer();
                    if (storage.isAvailable) {
                        $window.localStorage.removeItem(storage.prefix + key);
                        d.resolve('Item was removed.');
                    } else {
                        d.reject('Your browser sucks, get a new one buddy.');
                    }
                    return d.promise;
                };
                /**
                 * clear
                 * clears entire localStorage
                 */
                storage.clear = function() {
                    var d = $q.defer();
                    if (storage.isAvailable) {
                        $window.localStorage.clear();
                        d.resolve('localStorage Cleared.');
                    } else {
                        d.reject('Your browser sucks, get a new one buddy.');
                    }
                    return d.promise;
                };

                // return storage object
                return storage;
            }
        ]);
}(angular));
(function() {
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
}).call(this);
(function() {
    'use strict';
    angular.module('app.service.roster', [])
        .factory('Roster', [
            function() {
                var roster = {};
                roster.bowlers = [];
                return roster;
            }
        ]);
}).call(this);
(function(angular) {
	'use strict';
	angular.module('app.service.socket', [])
		.factory('socket', function($rootScope) {
			var socket = io.connect();
			return {
				on: function(eventName, callback) {
					socket.on(eventName, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							callback.apply(socket, args);
						});
					});
				},
				emit: function(eventName, data, callback) {
					socket.emit(eventName, data, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							if (callback) {
								callback.apply(socket, args);
							}
						});
					});
				}
			};
		});
}(angular));
(function() {
    'use strict';
    angular.module('app.service.universities', []).factory('Universities', [
        function() {
            var universities = {};
            universities.list = [{
                "name": "Adelphi"
            }, {
                "name": "Adirondack CC"
            }, {
                "name": "Adrian"
            }, {
                "name": "AIB"
            }, {
                "name": "Akron"
            }, {
                "name": "Alabama"
            }, {
                "name": "Alabama A&M"
            }, {
                "name": "Alabama State"
            }, {
                "name": "Alabama-Birmingham"
            }, {
                "name": "Alcorn State"
            }, {
                "name": "Allegheny-Boyce"
            }, {
                "name": "Allegheny-North"
            }, {
                "name": "Allegheny-South"
            }, {
                "name": "Allen"
            }, {
                "name": "Alma"
            }, {
                "name": "Anne Arundel CC"
            }, {
                "name": "Aquinas"
            }, {
                "name": "Arizona"
            }, {
                "name": "Arizona State"
            }, {
                "name": "Ark. - Pine Bluff"
            }, {
                "name": "Arkansas"
            }, {
                "name": "Arkansas State"
            }, {
                "name": "Ashford"
            }, {
                "name": "Baker"
            }, {
                "name": "Ball State"
            }, {
                "name": "Bellarmine"
            }, {
                "name": "Bethel-TN"
            }, {
                "name": "Bethune-Cookman"
            }, {
                "name": "Black Hills St."
            }, {
                "name": "Bloomsburg"
            }, {
                "name": "Boise State"
            }, {
                "name": "Bowie State"
            }, {
                "name": "Bowling Green State"
            }, {
                "name": "Briarcliffe"
            }, {
                "name": "Bryant"
            }, {
                "name": "Buffalo State"
            }, {
                "name": "Cal. - Davis"
            }, {
                "name": "Cal. - Los Angeles"
            }, {
                "name": "Cal. Poly"
            }, {
                "name": "Cal.- Santa Barbara"
            }, {
                "name": "Cal.St.- Chico"
            }, {
                "name": "Cal.St.- Fresno"
            }, {
                "name": "Cal.St.- Fullerton"
            }, {
                "name": "Cal.St.- Long Beach"
            }, {
                "name": "Cal.St.- Northridge"
            }, {
                "name": "Cal.St.- Sacramento"
            }, {
                "name": "Calumet"
            }, {
                "name": "Campbellsville"
            }, {
                "name": "Canisius"
            }, {
                "name": "Cardinal Stritch"
            }, {
                "name": "Carthage"
            }, {
                "name": "Cayuga CC"
            }, {
                "name": "Central Florida"
            }, {
                "name": "Central Michigan"
            }, {
                "name": "Central Missouri"
            }, {
                "name": "Central Oklahoma"
            }, {
                "name": "Central Washington"
            }, {
                "name": "Chaffey"
            }, {
                "name": "Cheyney"
            }, {
                "name": "Chowan"
            }, {
                "name": "Cincinnati"
            }, {
                "name": "Clackamas CC"
            }, {
                "name": "Clarion"
            }, {
                "name": "Clarke"
            }, {
                "name": "Clarkson"
            }, {
                "name": "Clemson"
            }, {
                "name": "Colorado Mines"
            }, {
                "name": "Colorado St.- Pueblo"
            }, {
                "name": "Colorado State"
            }, {
                "name": "Columbia-Greene CC"
            }, {
                "name": "Concordia"
            }, {
                "name": "Coppin State"
            }, {
                "name": "Cornell"
            }, {
                "name": "Corning CC"
            }, {
                "name": "Cumberland"
            }, {
                "name": "Cumberlands"
            }, {
                "name": "Davenport"
            }, {
                "name": "Delaware"
            }, {
                "name": "Delaware State"
            }, {
                "name": "Delta"
            }, {
                "name": "Dutchess CC"
            }, {
                "name": "East Carolina"
            }, {
                "name": "Eastern Illinois"
            }, {
                "name": "Eastern Michigan"
            }, {
                "name": "Elizabeth City St."
            }, {
                "name": "Elmhurst"
            }, {
                "name": "Emmanuel"
            }, {
                "name": "Emporia State"
            }, {
                "name": "Erie CC"
            }, {
                "name": "Fairleigh Dickinson"
            }, {
                "name": "Fashion Institute"
            }, {
                "name": "Fayetteville State"
            }, {
                "name": "Ferris State"
            }, {
                "name": "Florida"
            }, {
                "name": "Florida A&M"
            }, {
                "name": "Florida Atlantic"
            }, {
                "name": "Florida Inter."
            }, {
                "name": "Florida State"
            }, {
                "name": "Fontbonne"
            }, {
                "name": "George Mason"
            }, {
                "name": "Georgia College"
            }, {
                "name": "Georgia Southern"
            }, {
                "name": "Georgia Tech"
            }, {
                "name": "Globe Institute"
            }, {
                "name": "Graceland"
            }, {
                "name": "Grambling State"
            }, {
                "name": "Grand Canyon"
            }, {
                "name": "Grand Valley State"
            }, {
                "name": "Grand View"
            }, {
                "name": "Hampton"
            }, {
                "name": "Hastings"
            }, {
                "name": "Herkimer CCC"
            }, {
                "name": "Highland CC"
            }, {
                "name": "Holy Family"
            }, {
                "name": "Houston"
            }, {
                "name": "Howard"
            }, {
                "name": "Hudson Valley CC"
            }, {
                "name": "Huntington"
            }, {
                "name": "Idaho"
            }, {
                "name": "Idaho State"
            }, {
                "name": "Illinois - Chicago"
            }, {
                "name": "Illinois - Urbana"
            }, {
                "name": "Illinois State"
            }, {
                "name": "Illinois Tech"
            }, {
                "name": "Indiana"
            }, {
                "name": "Indiana - PA"
            }, {
                "name": "Indiana State"
            }, {
                "name": "Indiana Tech"
            }, {
                "name": "Indiana-S.Bend"
            }, {
                "name": "Iowa"
            }, {
                "name": "Iowa Central CC"
            }, {
                "name": "Iowa State"
            }, {
                "name": "Jackson State"
            }, {
                "name": "James Madison"
            }, {
                "name": "JC Smith"
            }, {
                "name": "Kansas"
            }, {
                "name": "Kansas State"
            }, {
                "name": "Kent State"
            }, {
                "name": "King"
            }, {
                "name": "Kutztown"
            }, {
                "name": "Lafayette"
            }, {
                "name": "Landmark"
            }, {
                "name": "Las Positas"
            }, {
                "name": "Lawrence Tech"
            }, {
                "name": "Lee"
            }, {
                "name": "Lehigh"
            }, {
                "name": "Lewis and Clark"
            }, {
                "name": "Lincoln"
            }, {
                "name": "Linden.-Belleville"
            }, {
                "name": "Lindenwood"
            }, {
                "name": "Lindsey Wilson"
            }, {
                "name": "Linfield"
            }, {
                "name": "Livingstone"
            }, {
                "name": "Long Island"
            }, {
                "name": "Louisiana State"
            }, {
                "name": "Louisiana Tech"
            }, {
                "name": "Louisiana-Lafayette"
            }, {
                "name": "Louisville"
            }, {
                "name": "Marian"
            }, {
                "name": "Marist"
            }, {
                "name": "Marquette"
            }, {
                "name": "Martin Methodist"
            }, {
                "name": "Maryland-Balt.Co."
            }, {
                "name": "Maryland-Coll.Park"
            }, {
                "name": "Maryland-E.Shore"
            }, {
                "name": "Maryland-Univ.Coll."
            }, {
                "name": "McKendree"
            }, {
                "name": "Medaille"
            }, {
                "name": "Mesa CC"
            }, {
                "name": "Miami"
            }, {
                "name": "Miami - OH"
            }, {
                "name": "Michigan"
            }, {
                "name": "Michigan - Flint"
            }, {
                "name": "Michigan State"
            }, {
                "name": "Michigan-Dearborn"
            }, {
                "name": "Mid. Tennessee St."
            }, {
                "name": "Midland"
            }, {
                "name": "Millersville"
            }, {
                "name": "Milwaukee Eng."
            }, {
                "name": "Minn.-Twin Cities"
            }, {
                "name": "Minn.St.-Mankato"
            }, {
                "name": "Mississippi Vall."
            }, {
                "name": "Missouri Baptist"
            }, {
                "name": "Missouri State"
            }, {
                "name": "Mohawk Valley CC"
            }, {
                "name": "Monmouth"
            }, {
                "name": "Monroe CCC"
            }, {
                "name": "Montana"
            }, {
                "name": "Montana State"
            }, {
                "name": "Morehead State"
            }, {
                "name": "Morgan State"
            }, {
                "name": "Morningside"
            }, {
                "name": "Mount Aloysius"
            }, {
                "name": "Mount Mercy"
            }, {
                "name": "Mount Union"
            }, {
                "name": "Muskingum"
            }, {
                "name": "N. Carolina A&T"
            }, {
                "name": "N. Carolina Cent."
            }, {
                "name": "N. Carolina State"
            }, {
                "name": "N. Carolina-Charl."
            }, {
                "name": "Nassau CC"
            }, {
                "name": "Nebraska - Kearney"
            }, {
                "name": "Nebraska - Lincoln"
            }, {
                "name": "Nebraska - Omaha"
            }, {
                "name": "Nevada - Las Vegas"
            }, {
                "name": "Nevada - Reno"
            }, {
                "name": "New Haven"
            }, {
                "name": "New Jersey"
            }, {
                "name": "New Jersey City"
            }, {
                "name": "New Jersey Tech"
            }, {
                "name": "New Mexico"
            }, {
                "name": "New Mexico State"
            }, {
                "name": "Newman"
            }, {
                "name": "Niagara CCC"
            }, {
                "name": "Norfolk State"
            }, {
                "name": "North Dakota State"
            }, {
                "name": "North Harris"
            }, {
                "name": "North Texas"
            }, {
                "name": "Northeastern St."
            }, {
                "name": "Northern Illinois"
            }, {
                "name": "Northern Iowa"
            }, {
                "name": "Northern Kentucky"
            }, {
                "name": "Notre Dame"
            }, {
                "name": "Notre Dame - OH"
            }, {
                "name": "NW Ohio"
            }, {
                "name": "Oberlin"
            }, {
                "name": "Ohio Dominican"
            }, {
                "name": "Ohio State"
            }, {
                "name": "Ohio-Chillicothe"
            }, {
                "name": "Oklahoma"
            }, {
                "name": "Oklahoma State"
            }, {
                "name": "Oregon"
            }, {
                "name": "Oregon State"
            }, {
                "name": "Our Lady"
            }, {
                "name": "Palmer"
            }, {
                "name": "Paul Smith's"
            }, {
                "name": "PennSt.-Altoona"
            }, {
                "name": "PennSt.-Berks/Leh."
            }, {
                "name": "PennSt.-Harrisburg"
            }, {
                "name": "PennSt.-Main"
            }, {
                "name": "Pikeville"
            }, {
                "name": "Pitt.-Bradford"
            }, {
                "name": "Pitt.-Greensburg"
            }, {
                "name": "Pittsburgh"
            }, {
                "name": "Portland CC"
            }, {
                "name": "Prairie View A&M"
            }, {
                "name": "Purdue"
            }, {
                "name": "R.Morris-Illinois"
            }, {
                "name": "R.Morris-Lake Co."
            }, {
                "name": "R.Morris-Peoria"
            }, {
                "name": "R.Morris-Springfield"
            }, {
                "name": "Radford"
            }, {
                "name": "Ripon"
            }, {
                "name": "Robert Morris-PA"
            }, {
                "name": "Rochester Tech"
            }, {
                "name": "Rock Valley"
            }, {
                "name": "Rockland CC"
            }, {
                "name": "Rose-Hulman IT"
            }, {
                "name": "S.Ill.-Carbondale"
            }, {
                "name": "S.Ill.-Edwardsville"
            }, {
                "name": "Sacred Heart"
            }, {
                "name": "Saginaw Valley St."
            }, {
                "name": "Salem Inter."
            }, {
                "name": "Sam Houston State"
            }, {
                "name": "San Diego State"
            }, {
                "name": "San Jose State"
            }, {
                "name": "Santa Fe"
            }, {
                "name": "Savannah State"
            }, {
                "name": "Schenectady CCC"
            }, {
                "name": "Schoolcraft"
            }, {
                "name": "Shaw"
            }, {
                "name": "Shippensburg"
            }, {
                "name": "Siena Heights"
            }, {
                "name": "South Carolina St."
            }, {
                "name": "South Dakota State"
            }, {
                "name": "South Florida"
            }, {
                "name": "Southern"
            }, {
                "name": "Southern Cal."
            }, {
                "name": "Southern Indiana"
            }, {
                "name": "Southern Oregon"
            }, {
                "name": "Southern Utah"
            }, {
                "name": "Southwestern CC"
            }, {
                "name": "Spalding"
            }, {
                "name": "Spokane Falls CC"
            }, {
                "name": "Spring Hill"
            }, {
                "name": "St. Ambrose"
            }, {
                "name": "St. Augustine's"
            }, {
                "name": "St. Catharine"
            }, {
                "name": "St. Clair CC"
            }, {
                "name": "St. Cloud State"
            }, {
                "name": "St. Francis-IL"
            }, {
                "name": "St. Francis-NY"
            }, {
                "name": "St. Francis-PA"
            }, {
                "name": "St. John's"
            }, {
                "name": "St. Paul's"
            }, {
                "name": "St. Peter's"
            }, {
                "name": "St. Thomas"
            }, {
                "name": "Stanford"
            }, {
                "name": "Stephen F. Austin"
            }, {
                "name": "Stevens Institute"
            }, {
                "name": "Stonehill"
            }, {
                "name": "Stony Brook"
            }, {
                "name": "Suffolk - Grant"
            }, {
                "name": "SUNY - Albany"
            }, {
                "name": "SUNY - Binghamton"
            }, {
                "name": "SUNY - IT"
            }, {
                "name": "SW Christian"
            }, {
                "name": "Syracuse"
            }, {
                "name": "Tabor"
            }, {
                "name": "Technical Career"
            }, {
                "name": "Temple"
            }, {
                "name": "Tenn. - Chattanooga"
            }, {
                "name": "Tenn. - Knoxville"
            }, {
                "name": "Texas - Austin"
            }, {
                "name": "Texas - Dallas"
            }, {
                "name": "Texas A&M"
            }, {
                "name": "Texas Southern"
            }, {
                "name": "Texas State"
            }, {
                "name": "Texas Tech"
            }, {
                "name": "Toledo"
            }, {
                "name": "Towson"
            }, {
                "name": "Tulane"
            }, {
                "name": "U.S. Air Force"
            }, {
                "name": "U.S. Coast Guard"
            }, {
                "name": "Ulster CCC"
            }, {
                "name": "Union"
            }, {
                "name": "Urbana"
            }, {
                "name": "Ursuline"
            }, {
                "name": "Utah"
            }, {
                "name": "Utah State"
            }, {
                "name": "Utica"
            }, {
                "name": "Valparaiso"
            }, {
                "name": "Vanderbilt"
            }, {
                "name": "Victory"
            }, {
                "name": "Vincennes"
            }, {
                "name": "Virginia Comm."
            }, {
                "name": "Virginia State"
            }, {
                "name": "Virginia Tech"
            }, {
                "name": "Virginia Union"
            }, {
                "name": "Viterbo"
            }, {
                "name": "Volunteer State CC"
            }, {
                "name": "Waldorf"
            }, {
                "name": "Washington"
            }, {
                "name": "Washington State"
            }, {
                "name": "Wayne CCC"
            }, {
                "name": "Wayne State-NE"
            }, {
                "name": "Webber Int."
            }, {
                "name": "Weber State"
            }, {
                "name": "Webster"
            }, {
                "name": "West Point"
            }, {
                "name": "West Texas A&M"
            }, {
                "name": "West Virginia"
            }, {
                "name": "West. New England"
            }, {
                "name": "West. Washington"
            }, {
                "name": "Westchester CC"
            }, {
                "name": "Western Illinois"
            }, {
                "name": "Western Kentucky"
            }, {
                "name": "Western Michigan"
            }, {
                "name": "Westminster"
            }, {
                "name": "Wichita State"
            }, {
                "name": "William Paterson"
            }, {
                "name": "William Penn"
            }, {
                "name": "Winona State"
            }, {
                "name": "Winston-Salem St."
            }, {
                "name": "Wisc.-Eau Claire"
            }, {
                "name": "Wisc.-Green Bay"
            }, {
                "name": "Wisc.-LaCrosse"
            }, {
                "name": "Wisc.-Madison"
            }, {
                "name": "Wisc.-Milwaukee"
            }, {
                "name": "Wisc.-Oshkosh"
            }, {
                "name": "Wisc.-Parkside"
            }, {
                "name": "Wisc.-Platteville"
            }, {
                "name": "Wisc.-Stout"
            }, {
                "name": "Wisc.-Whitewater"
            }, {
                "name": "Wisconsin Lutheran"
            }, {
                "name": "Wright State"
            }, {
                "name": "Youngstown State"
            }, {
                "name": "Yuba"
            }];
            universities.get = function() {
                return universities.list;
            };
            return universities;
        }
    ]);

}).call(this);
(function(angular) {
	'use strict';
	angular.module('app.services', [
		'app.service.auth',
		'app.service.socket',
		'app.service.localStorage',
		'app.service.online',
		'app.service.universities',
		'app.service.roster'
	]);
}(angular));