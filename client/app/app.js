(function() {
  'use strict';

  angular.module('app', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngAnimate',
      'btford.socket-io',
      'ui.router',
      'ui.bootstrap',
      'growlNotifications',
      'smart-table',
      'chart.js',
      'ui.sortable'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('authInterceptor');
    })
  .run(function($rootScope, $location, $window, Auth, RequestHandler, Notification, Modal) {
    (function() {
      return new RequestHandler();
    }());
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/');
          Notification.add({type: 'danger', message: 'You are unauthorized.'});
        }
        if (next.authenticateAdmin && Auth.getCurrentUser().role !== 'admin') {
          $location.path('/');
          Notification.add({type: 'danger', message: 'You are unauthorized.'});
        }
      });
    });

    $window.applicationCache.addEventListener('updateready', function() {
      if ($window.applicationCache.status === $window.applicationCache.UPDATEREADY) {
        Modal.open('appCache', function() {
          $window.location.reload();
        });
      }
    }, false);
  });
})();
