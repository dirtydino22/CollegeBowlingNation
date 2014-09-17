'use strict';
  angular.module('resource.session', [])
    .factory('Session', function($resource) {
      return $resource('/api/session/');
    });