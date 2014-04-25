(function() {
    'use strict';
    angular.module('app.service.roster', [])
        .factory('Roster', [
            function() {
                var roster = {};
                roster.bowlers = [];
                return roster;
            }
        ]);
}).call(this);