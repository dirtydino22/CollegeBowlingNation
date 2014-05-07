(function(angular) {
    'use strict';
    angular.module('app.controller.bowler', [])
        .controller('BowlerCtrl', [
            '$scope',
            '$http',
            'socket',
            'Universities',
            'localStorage',
            'Online',
            'apiToken',
            'Auth',
            'Roster',
            '$dialogs',
            function($scope, $http, socket, Universities, localStorage, Online, apiToken, Auth, Roster, $dialogs) {
                $scope.newBowler = {};
                $scope.selectedBowlers = {};
                $scope.bowlers = {};
                $scope.roster = false;
                $scope.selectionMessage = '';
                // socket
                socket.on('newBowler:update', function(bowlers) {
                    localStorage.set('bowlers', angular.toJson(bowlers));
                    $scope.bowlers = bowlers;
                });

                if (!Online.check()) { // offline
                    try {
                        // try localStorage for last stored api results
                        localStorage.get('bowlers').then(function(bowlers) {
                            $scope.bowlers = angular.fromJson(bowlers);
                        });
                    } catch (err) {
                        // no data
                        $dialogs.error('No Data','Sorry, no data is available at this time.');
                    }
                } else {
                    // initial api call for bowlers
                    $http.get(apiToken + '/bowlers/' + Auth.user.id)
                        .success(function(bowlers) {
                            localStorage.set('bowlers', angular.toJson(bowlers));
                            $scope.bowlers = bowlers;
                        })
                        .error(function(err) {
                            $dialogs.error('Data Unavailble','Sorry, no data is available at this time.');
                        });
                }
                /**
                 * selectionsChanged()
                 * creates roster from selected bowlers
                 */
                $scope.selectionsChanged = function() {
                    var arr = [],
                        index = 0;
                    for (var i in $scope.bowlers) {
                        if ($scope.selectedBowlers.length > 6) {
                            $dialogs.notify('You selected too many bowlers', 'You may only select 6 bowlers to add to your roster.');
                            $scope.selectionMessage = 'You may only select 6 bowlers.';
                            return;
                        }
                        // get selected bowler data from $scope.bowlers
                        if ($scope.selectedBowlers.indexOf($scope.bowlers[i]._id) !== -1) {
                            if ($scope.selectionMessage !== '') {
                                $scope.selectionMessage = '';
                            }
                            arr.push({
                                id: $scope.bowlers[i]._id,
                                name: $scope.bowlers[i].name,
                                index: index // index for newgame dropdown
                            });
                            index++;
                        }
                    }
                    if (arr.length !== 0) {
                        $scope.roster = arr;
                    }
                    Roster.bowlers = arr;
                    return;
                };


                /**
                 * createBowler()
                 * creates a bowler and adds to users roster
                 */
                $scope.createBowler = function() {
                    if ($scope.bowlers.length !== 26) { // limit 26 to a roster
                        $http.post(apiToken + '/bowlers/' + Auth.user.id, {
                            name: $scope.newBowler.name,
                            university: Auth.user.university
                        })
                            .success(function() {
                                // emit newBowler update
                                socket.emit('newBowler:update', Auth.user.id);
                                // clear newBowler input
                                $scope.newBowler = '';
                            })
                            .error(function(err) {
                                $dialogs.error('Error Creating Bowler','There was an error creating your new bowler. Please try again...');
                            });
                    } else {
                        $dialogs.error('Error Creating Bowler','You have reached your roster limit.');
                    }

                };

                $scope.newSeason = function() {
                    $http.post(apiToken + '/newseason', {id: Auth.user.id})
                        .success(function() {
                            socket.emit('newBowler:update', Auth.user.id);
                            $dialogs.notify('Your season has been created','Your new season has been created.');
                        })
                        .error(function(err) {
                            $dialogs.error('Error Creating Season','There was an error creating your new season. Please Try again...');
                        });
                };
            }
        ]);
}(angular));
