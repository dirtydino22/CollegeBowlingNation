function blogRoute($stateProvider) {
	'use strict';
	
    $stateProvider
        .state('blog', {
            url: '/blog',
            templateUrl: 'app/blog/blog.html',
            controller: 'BlogCtrl as ctrl'
        });
}

blogRoute.$inject = ['$stateProvider'];

angular
    .module('app')
    .config(blogRoute);
