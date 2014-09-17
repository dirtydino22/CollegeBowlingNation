'use strict';
  angular.module('resource.teams', [])
    .factory('Teams', function($resource) {
      return $resource('/api/teams');
    });