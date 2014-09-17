'use strict';
  angular.module('resource.players', [])
    .factory('Players', function($resource) {
      return $resource('/api/players/:teamName');
    });