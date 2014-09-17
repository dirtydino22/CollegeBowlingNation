'use strict';
angular.module('app.routes', [])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/home',
                controller: 'HomeCtrl',
                resolve: {
                    news: function(News, Online, LocalStorage, growlNotifications) {
                        if (!Online.isAvailable()) {
                            try {
                                return LocalStorage.get('news')
                                    .then(function(news) {
                                        return news.reverse();
                                    });
                            }
                            catch (err) {
                                return growlNotifications.add('No data is available.', 'danger', 4000);
                            }
                        }
                        else {
                            return News.query(function(articles) {
                                LocalStorage.set('news', articles);
                                return articles.reverse();
                            });
                        }
                    }
                }
            })
            .state('rankings', {
                url: '/rankings',
                templateUrl: 'partials/rankings',
                controller: 'RankingsCtrl',
                resolve: {
                    games: function(Games, Online, LocalStorage, growlNotifications) {
                        if (!Online.isAvailable()) {
                            try {
                                return LocalStorage.get('games')
                                    .then(function(games) {
                                        return games;
                                    });
                            }
                            catch (err) {
                                return growlNotifications.add('No data is available.', 'danger', 4000);
                            }
                        }
                        else {
                            return Games.query(function(games) {
                                LocalStorage.set('games', games);
                                return games;
                            });
                        }
                    }
                }
            })
            .state('prospects', {
                url: '/prospects',
                templateUrl: 'partials/prospects',
                controller: 'ProspectsCtrl'
            })
            .state('prospects.academic', {
                url: '/academic',
                templateUrl: 'partials/prospects-academic'
            })
            .state('prospects.bowler', {
                url: '/bowler',
                templateUrl: 'partials/prospects-bowler'
            })
            .state('prospects.done', {
                url: '/done',
                templateUrl: 'partials/prospects-done'
            })
            .state('blog', {
                url: '/blog',
                templateUrl: 'partials/blog',
                controller: 'BlogCtrl',
                resolve: {
                    posts: function(Blog, Online, LocalStorage, growlNotifications) {
                        var postArray;
                        if (!Online.isAvailable()) {
                            try {
                                return LocalStorage.get('blog')
                                    .then(function(posts) {
                                        angular.forEach(posts, function(post) {
                                            post.comments.reverse();
                                            return post;
                                        });
                                        return posts.reverse();
                                    });
                            }
                            catch (err) {
                                return growlNotifications.add('No data is available.', 'danger', 4000);
                            }
                        }
                        else {
                            return Blog.query(function(posts) {
                                angular.forEach(posts, function(post) {
                                    post.comments.reverse();
                                    return post;
                                });
                                return posts.reverse();
                            });
                        }
                    },
                    user: function(AppUser) {
                        return AppUser.isLoggedIn() ? AppUser.user : null;
                    }
                }
            })
            .state('newgame', {
                url: '/newgame',
                templateUrl: 'partials/newgame',
                controller: 'NewGameCtrl',
                authenticate: true,
                resolve: {
                    user: function(AppUser) {
                        return AppUser.isLoggedIn() ? AppUser.user : null;
                    }
                }
            })
            .state('tenpin', {
                url: '/tenpin',
                templateUrl: 'partials/game-tenpin',
                controller: 'GameCtrl',
                authenticate: true,
                resolve: {
                    bowlers: function(Lineup) {
                        return Lineup.lineup;
                    },
                    tabs: function(Lineup) {
                        var tabs = [], i = 0;
                        for (; i < Lineup.lineup.length; i++) {
                            tabs.push({
                                name: Lineup.lineup[i].name,
                                _id: Lineup.lineup[i]._id
                            });
                        }
                        return tabs;
                    }
                }
            })
            .state('baker', {
                url: '/baker',
                templateUrl: 'partials/game-baker',
                controller: 'GameCtrl',
                authenticate: true,
                resolve: {
                    bowlers: function(Lineup) {
                        return Lineup.lineup;
                    },
                    tabs: function() {
                        return null;
                    }
                }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'partials/account',
                controller: 'AccountCtrl',
                authenticate: true,
                resolve: {
                    universities: function(Universities) {
                        return Universities.get();
                    },
                    tabs: function() {
                        return [
                            {title: 'Account Information', template: 'partials/account-info'},
                            {title: 'Change Password', template: 'partials/account-pass'}
                        ];
                    }
                }
            })
            .state('roster', {
                url: '/roster',
                templateUrl: 'partials/roster',
                controller: 'RosterCtrl',
                authenticate: true
            })
            .state('admin', {
            	url: '/admin',
            	templateUrl: 'partials/admin',
            	controller: 'AdminCtrl',
            	authenticate: true,
            	admin: true,
                resolve: {
                    tempUsers: function(TempUser, Online, LocalStorage, growlNotifications) {
                        if (!Online.isAvailable()) {
                            try {
                                return LocalStorage.get('tempusers')
                                    .then(function(users) {
                                        return users;
                                    });
                            }
                            catch (err) {
                                return growlNotifications.add('No data is available.', 'danger', 4000);
                            }
                        }
                        else {
                            return TempUser.list(function(users) {
                                LocalStorage.set('tempusers', users);
                                return users;
                            });
                        }
                    },
                    users: function(User, Online, LocalStorage, growlNotifications) {
                        if (!Online.isAvailable()) {
                            try {
                                return LocalStorage.get('users')
                                    .then(function(users) {
                                        return users;
                                    });
                            }
                            catch (err) {
                                return growlNotifications.add('No data is available.', 'danger', 4000);
                            }
                        }
                        else {
                            return User.list(function(users) {
                                LocalStorage.set('users', users);
                                return users;
                            });
                        }
                    },
                    news: function(News, Online, LocalStorage, growlNotifications) {
                        if (!Online.isAvailable()) {
                            try {
                                return LocalStorage.get('news')
                                    .then(function(news) {
                                        return news.reverse();
                                    });
                            }
                            catch (err) {
                                return growlNotifications.add('No data is available.', 'danger', 4000);
                            }
                        }
                        else {
                            return News.query(function(articles) {
                                LocalStorage.set('news', articles);
                                return articles.reverse();
                            });
                        }
                    },
                    posts: function(Blog, Online, LocalStorage, growlNotifications) {
                        if (!Online.isAvailable()) {
                            try {
                                return LocalStorage.get('blog')
                                    .then(function(posts) {
                                        return posts.reverse();
                                    });
                            }
                            catch (err) {
                                return growlNotifications.add('No data is available.', 'danger', 4000);
                            }
                        }
                        else {
                            return Blog.query(function(posts) {
                                LocalStorage.set('blog', posts);
                                return posts.reverse();
                            });
                        }
                    },
                    tabs: function() {
                        return [
                            {title: 'Pending Users', template: 'partials/admin-pending'},
                            {title: 'Users', template: 'partials/admin-users'},
                            {title: 'News', template: 'partials/admin-news'},
                            {title: 'Blog', template: 'partials/admin-blog'}
                        ];
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    });