'use strict';

/*@ngInject*/
function AdminCtrl(socket, Auth, Modal, News, Blog, users, tempUsers, news, posts) {
    var self = this;

    this.users = users;
    this.tempUsers = tempUsers;
    this.news = news;
    this.posts = posts;
    this.removeUser = Auth.removeUser;
    this.acceptTempUser = Auth.acceptTempUser;
    this.acceptTempAdmin = Auth.acceptTempAdmin;
    this.declineTempUser = Auth.declineTempUser;
    this.openModal = Modal.open;

    this.removeArticle = function(articleId) {
        return Modal.open('confirmArticleRemoval', function() {
              News.remove({id: articleId},
                function() {
                  socket.socket.emit('news:update');
                },
                function() {
                  // error
                });
            });
    };

    this.removePost = function(postId) {
        return Modal.open('confirmPostRemoval', function() {
            Blog.remove({id: postId},
                function() {
                    socket.socket.emit('blog:update');
                },
                function() {
                    //error
                });
        });
    };

    this.tabs = [{
        title: 'Pending Users',
        template: 'app/admin/tabs/pending.html'
    }, {
        title: 'Users',
        template: 'app/admin/tabs/users.html'
    }, {
        title: 'News',
        template: 'app/admin/tabs/news.html'
    }, {
        title: 'Blog',
        template: 'app/admin/tabs/blog.html'
    }];

    socket.socket.on('news:update', function(news) {
        self.news = news.reverse();
    });
    socket.socket.on('user:update', function(users) {
        self.users = users;
    });
    socket.socket.on('tempuser:update', function(users) {
        self.tempUsers = users;
    });
    socket.socket.on('blog:update', function(posts) {
        self.posts = posts.reverse();
    });
}

AdminCtrl.$inject = ['socket', 'Auth', 'Modal', 'News', 'Blog', 'users', 'tempUsers', 'news', 'posts'];

angular
    .module('app')
    .controller('AdminCtrl', AdminCtrl);
