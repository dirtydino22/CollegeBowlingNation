(function() {
    'use strict';
    angular.module('app.controller.main', [])
        .controller('MainCtrl', [
            '$scope',
            '$http',
            'socket',
            'localStorage',
            'Online',
            function($scope, $http, socket, localStorage, Online) {
                socket.on('news:update', function(news) {
                    $scope.news = news;
                });

                if (!Online.check()) { // offline
                    try {
                        // try localStorage for last stored api results
                        localStorage.get('news').then(function(news) {
                            $scope.news = angular.fromJson(news);
                        });
                    } catch (err) {
                        // no data
                        console.log('No Data');
                    }
                } else {
                    // initial api call for news
                    $http.get('api/news')
                        .success(function(news) {
                            localStorage.set('news', angular.toJson(news));
                            $scope.news = news;
                        })
                        .error(function(err) {
                            console.log(err);
                        });
                }
            }
        ]);
}).call(this);