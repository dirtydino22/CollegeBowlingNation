function AuthInterceptor($rootScope, $q, $cookieStore, $location, Network, Notification) {
    'use strict';
    return {
        // Add authorization token to headers
        request: function(config) {
            config.headers = config.headers || {};
            if ($cookieStore.get('token')) {
                config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
            }

            if (!Network.isOnline() && config.url.indexOf('api/') !== -1 && 'PUT|POST|DELETE'.indexOf(config.method) !== -1) {
                Network.addRequest({
                    url: config.url,
                    method: config.method,
                    data: config.data
                });

                Notification.add({
                    type: 'info',
                    message: 'Your request will be processed when a network is available.'
                });
            }

            return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function(response) {
            if (response.status === 401) {
                $location.path('/');
                // remove any stale tokens
                $cookieStore.remove('token');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }
    };
}

AuthInterceptor.$inject = ['$rootScope', '$q', '$cookieStore', '$location', 'Network', 'Notification'];

angular
    .module('app')
    .factory('authInterceptor', AuthInterceptor);