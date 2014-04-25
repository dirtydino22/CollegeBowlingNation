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
