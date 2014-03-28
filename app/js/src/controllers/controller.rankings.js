(function() {
    'use strict';
    angular.module('app.controller.rankings', [])
        .controller('RankingsCtrl', [
            '$scope',
            '$http',
            '$modal',
            'socket',
            'localStorage',
            'Online',
            function($scope, $http, $modal, socket, localStorage, Online) {
                var getGames, createGameObject, analyzeGameData, createAnalyzedDataArray;
                $scope.teamData = [];
                $scope.selectedTeams = [];
                $scope.message = '';
                function reset() {
                    $scope.selectedTeams = [];
                }
                $scope.$watchCollection('selectedTeams', function(newValue) {
                    if ($scope.selectedTeams.length > 0) {
                        var modalInstance = $modal.open({
                            templateUrl: 'templates/modals/modal.team.html',
                            controller: 'TeamCtrl',
                            resolve: {
                                team: function() {
                                    return $scope.selectedTeams;
                                }
                            }
                        });
                        modalInstance.result.then(function() {
                            $scope.message = 'Please deselect team before choosing another.';
                        });
                    }
                    if ($scope.selectedTeams.length === 0) {
                        $scope.message = '';
                    }
                });
                socket.on('stats:update', function(stats) {
                    localStorage.set('stats', angular.toJson(stats));
                    $scope.teamData = createAnalyzedDataArray([analyzeGameData(createGameObject(getGames(stats)))]);
                });

                if (!Online.check()) { // offline
                    try {
                        // try localStorage for last stored api results
                        localStorage.get('stats').then(function(stats) {
                            $scope.teamData = createAnalyzedDataArray([analyzeGameData(createGameObject(getGames(angular.fromJson(stats))))]);
                        });
                    }
                    catch (err) {
                        // no data
                        console.log('No Data');
                    }
                }
                else {
                    // initial api call for stats
                    $http.get('api/teams')
                        .success(function(stats) {
                            localStorage.set('stats', angular.toJson(stats));
                            $scope.teamData = createAnalyzedDataArray([analyzeGameData(createGameObject(getGames(stats)))]);
                        })
                        .error(function(err) {
                            console.log(err);
                        });
                }

                
                
                $scope.gridOptions = {
                    data: 'teamData',
                    columnDefs: [
                        {field:'name', displayName: 'University'},
                        /*
                        {field:'pinCount', displayName: 'Pin Count'},
                        {field:'rollCount', displayName: 'Roll Count'},
                        {field:'gutterBalls', displayName: 'Gutter Balls'},
                        {field:'strikes', displayName: 'Strikes'},
                        {field:'spares', displayName: 'Spares'},
                        */
                        {field:'strikePercentage', displayName: 'Strike %'},
                        {field:'sparePercentage', displayName: 'Spare %'},
                        {field:'gamesPlayed', displayName: 'Games Played'}
                    ],
                    selectedItems: $scope.selectedTeams 
                };
                createAnalyzedDataArray = function(data) {
                    var arr = [];
                    for (var key in data[0]) {
                        arr.push(data[0][key]);
                    }
                    return arr;
                };

                getGames = function(data) {
                    var arr = [],
                        i;
                    for (i = 0; i < data.length; i++) {
                        if (data[i].games.length > 0) {
                            arr.push({
                                university: data[i].university,
                                game: data[i].games
                            });
                        }
                    }
                    return arr;
                };

                createGameObject = function(data) {
                    var myObj = {};
                    Object.keys(data).forEach(function(key) {
                        if (!myObj.hasOwnProperty(data[key].university)) {
                            myObj[data[key].university] = {
                                games: [],
                                name: data[key].university
                            };
                        }
                        if (data[key].game.length > 1) {
                            for (var i = 0; i < data[key].game.length; i++) {
                                myObj[data[key].university].games.push(data[key].game[i]);
                            }
                        } else if (data[key].game.length === 1) {
                            myObj[data[key].university].games.push(data[key].game[0]);
                        }
                    });
                    return myObj;
                };

                analyzeGameData = function(gameObj) {
                    var scoreObj = {};
                    for (var key in gameObj) {
                        var obj = gameObj[key];
                        var model = {
                            pinCount: 0,
                            rollCount: 0,
                            gutterBalls: 0,
                            strikes: 0,
                            spares: 0,
                            strikePercentage: 0,
                            sparePercentage: 0,
                            name: undefined,
                            gamesPlayed: 0
                        };
                        if (gameObj[key].games.length > 1) {
                            for (var i = 0; i < gameObj[key].games.length; i++) {
                                model.pinCount += gameObj[key].games[i].pinCount;
                                model.rollCount += gameObj[key].games[i].rollCount;
                                model.gutterBalls += gameObj[key].games[i].gutterBalls;
                                model.strikes += gameObj[key].games[i].strikes;
                                model.spares += gameObj[key].games[i].spares;
                                model.strikePercentage += gameObj[key].games[i].strikePercentage;
                                model.sparePercentage += gameObj[key].games[i].sparePercentage;
                                model.name = gameObj[key].name;
                                model.gamesPlayed = gameObj[key].games.length;
                            }
                            model.strikePercentage = Math.round(model.strikePercentage / model.gamesPlayed) / 100;
                            model.sparePercentage = Math.round(model.sparePercentage / model.gamesPlayed) / 100;
                            scoreObj[key] = model;
                        } else {
                            model.pinCount += gameObj[key].games[0].pinCount;
                            model.rollCount += gameObj[key].games[0].rollCount;
                            model.gutterBalls += gameObj[key].games[0].gutterBalls;
                            model.strikes += gameObj[key].games[0].strikes;
                            model.spares += gameObj[key].games[0].spares;
                            model.strikePercentage += Math.round(gameObj[key].games[0].strikePercentage) / 100;
                            model.sparePercentage += Math.round(gameObj[key].games[0].sparePercentage) / 100;
                            model.name = gameObj[key].name;
                            model.gamesPlayed = 1;
                            scoreObj[key] = model;
                        }
                    }
                    
                    return scoreObj;
                };
            }
        ]);
}).call(this);