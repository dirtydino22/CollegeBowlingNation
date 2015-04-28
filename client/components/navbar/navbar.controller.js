/*global angular*/

/*@ngInject*/
function NavbarCtrl($location, Auth, Modal) {
    'use strict';
    
    this.menu = [{
        'title': 'Home',
        'link': '/'
    }, {
        'title': 'Rankings',
        'link': '/rankings'
    }, {
        'title': 'Prospects',
        'link': '/prospects'
    }, {
        'title': 'Blog',
        'link': '/blog'
    }];

    this.userMenu = [{
        'title': 'New Game',
        'link': '/newgame'
    }, {
        'title': 'My Roster',
        'link': '/roster'
    }, {
        'title': 'My Account',
        'link': '/account'
    }];

    this.isCollapsed = true;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    this.logout = function() {
        Auth.logout();
        $location.path('/');
    };

    this.isActive = function(route) {
        return route === $location.path();
    };

    this.openModal = function(type) {
        return Modal.open(type);
    };
}

NavbarCtrl.$inject = ['$location', 'Auth', 'Modal'];

angular.module('app')
    .controller('NavbarCtrl', NavbarCtrl);
