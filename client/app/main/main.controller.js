function MainCtrl(News, LocalStorage, Network, socket) {
    'use strict';
    var self = this;

    if (!Network.isOnline()) {
        try {
            LocalStorage.get('news')
                .then(function(news) {
                    self.news = angular.fromJson(news).reverse();
                });
        } catch (err) {
            // err
        }
    } else {
        News.query(function(news) {
            LocalStorage.set('news', angular.toJson(news));
            self.news = news.reverse();
        });
    }

    socket.socket.on('news:update', function(news) {
        self.news = news.reverse();
    });
}

MainCtrl.$inject = ['News', 'LocalStorage', 'Network', 'socket'];

angular
    .module('app')
    .controller('MainCtrl', MainCtrl);
