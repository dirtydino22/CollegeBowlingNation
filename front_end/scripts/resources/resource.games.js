'use strict';
  angular.module('resource.games', [])
    .factory('Games', function($resource) {
      return $resource('/api/games');
    });