'use strict';

angular.module('app', [
	'ngResource',
	'ngCookies',
	'ngSanitize',
	'ngAnimate',
	'ngTouch',
	'ui.bootstrap',
	'ui.router',
	'growlNotifications',
	'smartTable.table',
	'nvd3ChartDirectives',
	'app.routes',
	'app.controllers',
	'app.resources',
	'app.services',
	'app.directives',
	'app.filters'
])
.config(function($httpProvider) {
	$httpProvider.interceptors.push(['$q', '$location', 'Online', function($q, $location, Online) {
      return {
        // intercept requests
        'request': function(config) {
          if (!!Online.isAvailable()) {
            return config || $q.when(config);
          }
          else {
            if (config.url.indexOf('api/') === -1) {
              return config || $q.when(config);
            }

            return Online.addRequest({
              url: config.url,
              method: config.method,
              data: config.data
            });
          }
        },
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
})
.run(function($rootScope, $state, $animate, AppUser, RequestHandler, Socket, growlNotifications) {
	RequestHandler();
	$rootScope.$on('$stateChangeStart', function(e, to) {
		if ((to.authenticate && !AppUser.isLoggedIn()) || (to.admin && !AppUser.isAdmin())) {
			e.preventDefault();
			growlNotifications.add('You are not an authorized user.', 'danger', 4000);
			$state.go('home', {notify: false});
		}
	});
	Socket.on('error:nodata', function() {
		growlNotifications.add('There was an error retrieving data.', 'danger', 4000);
	});
});