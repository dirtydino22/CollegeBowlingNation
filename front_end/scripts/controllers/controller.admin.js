'use strict';

angular.module('controller.admin', [])
    .controller('AdminCtrl', function($scope, $modal, Socket, LocalStorage, AppUser, News, Blog, Auth, growlNotifications, tempUsers, users, news, posts, tabs) {
        $scope.tempUsers = tempUsers;
        $scope.users = users;
        $scope.news = news;
        $scope.posts = posts;
        $scope.tabs = tabs;

        $scope.acceptUser = function(id) {
            Auth.acceptUser(id);
        };

        $scope.acceptAdmin = function(id) {
            Auth.acceptAdmin(id);
        };

        $scope.declineUser = function(id) {
            Auth.declineUser(id);
        };

        $scope.removeUser = function(id) {
            Auth.removeUser(id);
        };

        Socket.on('users:update', function(users) {
            LocalStorage.set('users', users);
            $scope.users = users;
        });

        Socket.on('tempusers:update', function(users) {
            LocalStorage.set('tempusers', users);
            $scope.tempUsers = users;
        });

        $scope.updateArticle = function(article) {
            var modalInstance = $modal.open({
                templateUrl: 'modals/article-edit',
                controller: 'ArticleCtrl',
                resolve: {
                    article: function() {
                        return article;
                    }
                }
            });
        };

        $scope.createArticle = function() {
            var modalInstance = $modal.open({
                templateUrl: 'modals/article-new',
                controller: 'ArticleCtrl',
                resolve: {
                    article: function() {
                        return {
                            author: AppUser.user.name
                        };
                    }
                }
            });
        };

        $scope.removeArticle = function(articleId) {
            var modalInstance = $modal.open({
                templateUrl: 'modals/confirm',
                controller: 'ConfirmCtrl',
                resolve: {
                    settings: function() {
                        return {
                            title: 'Are you sure you want to delete this article?',
                            message: 'This article will no longer be available.'
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {
                if (result === 'confirmed') {
                    News.remove({id: articleId},
                        function() {
                            Socket.emit('news:update');
                            return growlNotifications.add('Your news article has been removed.', 'success', 4000);
                        },
                        function() {
                            return growlNotifications.add('There was an error removing your news article.', 'danger', 4000);
                        });
                }
            });
        };

        Socket.on('news:update', function(news) {
            LocalStorage.set('news', news);
            $scope.news = news.reverse();
        });

        $scope.updatePost = function(post) {
            var modalInstance = $modal.open({
                templateUrl: 'modals/post-edit',
                controller: 'PostCtrl',
                resolve: {
                    post: function() {
                        return post;
                    },
                    comment: function() {
                        return null;
                    }
                }
            });
        };

        $scope.createPost = function() {
            var modalInstance = $modal.open({
                templateUrl: 'modals/post-new',
                controller: 'PostCtrl',
                resolve: {
                    post: function() {
                        return {
                            author: AppUser.user.name
                        };
                    },
                    comment: function() {
                        return null;
                    }
                }
            });
        };

        $scope.removePost = function(postId) {
            var modalInstance = $modal.open({
                templateUrl: 'modals/confirm',
                controller: 'ConfirmCtrl',
                resolve: {
                    settings: function() {
                        return {
                            title: 'Are you sure you want to delete this post?',
                            message: 'This post will no longer be available.'
                        };
                    }
                }
            });
            modalInstance.result.then(function(result) {
                if (result === 'confirmed') {
                    Blog.remove({id: postId},
                        function() {
                            Socket.emit('posts:update');
                            return growlNotifications.add('Your blog post has been removed.', 'success', 4000);
                        },
                        function() {
                            return growlNotifications.add('There was an error removing your blog post.', 'danger', 4000);
                        });
                }
            });
        };

        Socket.on('posts:update', function(posts) {
            LocalStorage.set('blog', posts);
            $scope.posts = posts;
        });
    });