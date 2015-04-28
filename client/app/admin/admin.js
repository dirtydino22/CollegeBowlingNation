function AdminRoute($stateProvider) {
    'use strict';
    
    $stateProvider
        .state('admin', {
            url: '/admin',
            templateUrl: 'app/admin/admin.html',
            controller: 'AdminCtrl as ctrl',
            authenticateAdmin: true,
            resolve: {
                users: ['User', function(User) {
                    return User.query();
                }],
                tempUsers: ['TempUser', function(TempUser) {
                    return TempUser.query();
                }],
                news: ['News', function(News) {
                    return News.query().reverse();
                }],
                posts: ['Blog', function(Blog) {
                    return Blog.query().reverse();
                }]
            }
        });
}

AdminRoute.$inject = ['$stateProvider'];

angular.module('app')
    .config(AdminRoute);
