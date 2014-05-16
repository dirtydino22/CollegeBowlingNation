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
            'apiToken',
            '$dialogs',
            function($scope, $http, $modal, socket, localStorage, Online, apiToken, $dialogs) {
                var getPlayers, getGames, analyzeGameData, createAnalyzedDataArray;
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
                    $scope.teamData = createAnalyzedDataArray(analyzeGameData(getGames(getPlayers(stats))));
                });

                if (!Online.check()) {
                    try {
                        // try localStorage for last stored api results
                        localStorage.get('stats').then(function(stats) {
                            $scope.teamData = $scope.teamData = createAnalyzedDataArray(analyzeGameData(getGames(getPlayers(angular.fromJson(stats)))));
                        });
                    } catch (err) {
                        // no data
                        $dialogs.error('Data Unavailble','Sorry, no data is available at this time.');
                    }
                } else {
                    $http.get(apiToken + '/teams')
                        .success(function(stats) {
                            localStorage.set('stats', angular.toJson(stats));
                            $scope.teamData = createAnalyzedDataArray(analyzeGameData(getGames(getPlayers(stats))));
                        })
                        .error(function(err) {
                            $scope.teamData('Token Error',err);
                        });
                }

                getPlayers = function(stats) {
                    var myObj = {};
                    for (var i = 0; i < stats.length; i++) {
                        for (var o = 0; o < stats[i].roster.length; o++) {
                            if (!myObj.hasOwnProperty(stats[i].university)) {
                                myObj[stats[i].university] = {
                                    name: stats[i].university,
                                    players: [stats[i].roster[o]]
                                };
                            } else {
                                myObj[stats[i].university].players.push(stats[i].roster[o]);
                            }
                        }
                    }
                    return myObj;
                };

                getGames = function(data) {
                    var myObj = {};
                    for (var university in data) {
                        for (var i = 0;  i < data[university].players.length; i++) {
                            if (!myObj.hasOwnProperty(university)) {
                                myObj[university] = {
                                    name: university,
                                    games: data[university].players[i].games
                                };
                            } else {
                                for (var o = 0; o < data[university].players[i].games.length; o++) {
                                    myObj[university].games.push(data[university].players[i].games[o]);
                                }
                            }
                        }
                    }
                    //console.log('Games',myObj);
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
                            gamesPlayed: 0,
                            nineMade: 0,
                            nineCount: 0
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
                                model.gamesPlayed += gameObj[key].games.worth;
                                model.nineMade += gameObj[key].games[i].nineMade;
                                model.nineCount += gameObj[key].games[i].nineCount;
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
                            model.nineMade += gameObj[key].games[0].nineMade;
                            model.nineCount += gameObj[key].games[0].nineCount;
                            model.strikePercentage += Math.round(gameObj[key].games[0].strikePercentage) / 100;
                            model.sparePercentage += Math.round(gameObj[key].games[0].sparePercentage) / 100;
                            model.name = gameObj[key].name;
                            model.gamesPlayed = 1;
                            scoreObj[key] = model;
                        }
                    }
                    //console.log('scoreObj',scoreObj);
                    return scoreObj;
                };

                createAnalyzedDataArray = function(data) {
                    var arr = [];
                    for (var key in data) {
                        arr.push(data[key]);
                    }
                    return arr;
                };

                $scope.gridOptions = {
                    data: 'teamData',
                    columnDefs: [{
                            field: 'name',
                            displayName: 'University'
                        },

                        {
                            field: 'pinCount',
                            displayName: 'Pin Count'
                        }, {
                            field: 'rollCount',
                            displayName: 'Roll Count'
                        }, {
                            field: 'gutterBalls',
                            displayName: 'Gutter Balls'
                        }, {
                            field: 'strikes',
                            displayName: 'Strikes'
                        }, {
                            field: 'spares',
                            displayName: 'Spares'
                        },
                        {
                            field: 'nineCount',
                            displayName: 'Nine Count'
                        },
                        {
                            field: 'nineMade',
                            displayName: 'Nine Made'
                        },
                        {
                            field: 'strikePercentage',
                            displayName: 'Strike %'
                        }, {
                            field: 'sparePercentage',
                            displayName: 'Spare %'
                        }, {
                            field: 'gamesPlayed',
                            displayName: 'Games Played'
                        }
                    ],
                        selectedItems: $scope.selectedTeams
                    };

            }
        ]);
}).call(this);
