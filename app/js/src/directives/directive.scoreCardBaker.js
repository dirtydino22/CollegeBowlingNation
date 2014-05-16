(function() {
    'use strict';
    angular.module('app.directive.scoreCardBaker', []).directive('scoreCardBaker', [
        '$http',
        '$q',
        'socket',
        'Auth',
        'apiToken',
        '$dialogs',
        function($http, $q, socket, Auth, apiToken, $dialogs) {
            return {
                restrict: 'EA',
                scope: {
                    id: '@',
                    numberOfBowlers: '@'
                },
                templateUrl: 'templates/scorecard.html',
                link: function($scope, $element, $attrs) {
                    var isGameOver, isSecondRoll, isTenthFrame, isTenthFrameThirdRollSpareTry, isTooLargeForSpare, analyze;
                    var totalFrames = 0;
                    $scope.pinsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    $scope.frames = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    $scope.myRoster = {};
                    $scope.rolls = [];
                    $scope.rollCount = 0;
                    $scope.frameScores = [];
                    $scope.rollDisplay = '';
                    $scope.stats = {};
                    $scope.nineCount = 0;
                    $scope.nineMade = 0;
                    $scope.gameOver = false;

                    $scope.addRoll = function(pins) {
                        var rolls = $scope.rollDisplay.split('');
                        totalFrames = totalFrames + 1 / 2;
                        $scope.rolls.push(pins);
                        $scope.rollCount++;
                        $scope.frameScores = $scope.$eval('rolls | frameScores');
                        $scope.rollDisplay = $scope.$eval('rolls | rollDisplay');
                        // create bowler stats object
                        if (!$scope.myRoster[$scope.id]) {
                            $scope.myRoster[$scope.id] = {};
                            $scope.myRoster[$scope.id].id = $scope.id;
                        }
                        // get spares
                        if (totalFrames % 1 === 0) {
                            if ($scope.rolls[$scope.rolls.length - 1] + $scope.rolls[$scope.rolls.length - 2] === 10) {
                                if (!$scope.myRoster[$scope.id].spares) {
                                    $scope.myRoster[$scope.id].spares = 1;
                                } else {
                                    $scope.myRoster[$scope.id].spares++;
                                }
                            }

                        }
                        // get nine-count
                        if (pins === 9 && isSecondRoll()) {
                            if (!$scope.myRoster[$scope.id].nineCount) {
                                $scope.myRoster[$scope.id].nineCount = 1;
                            } else {
                                $scope.myRoster[$scope.id].nineCount++;
                            }
                        }
                        // get nine-made
                        if (pins === 1 && !isSecondRoll()) {
                            if (rolls[rolls.length - 1] === '9') {
                                if (!$scope.myRoster[$scope.id].nineMade) {
                                    $scope.myRoster[$scope.id].nineMade = 1;
                                } else {
                                    $scope.myRoster[$scope.id].nineMade++;
                                }
                            }
                        }
                        // get pincount
                        if (!$scope.myRoster[$scope.id].pinCount) {
                            $scope.myRoster[$scope.id].pinCount = pins;
                        } else {
                            $scope.myRoster[$scope.id].pinCount += pins;
                        }


                        // get roll count
                        if (!$scope.myRoster[$scope.id].rolls) {
                            $scope.myRoster[$scope.id].rolls = 1;
                        } else {
                            $scope.myRoster[$scope.id].rolls++;
                        }
                        // get gutters
                        if (pins === 0) {
                            if (!$scope.myRoster[$scope.id].gutterBalls) {
                                $scope.myRoster[$scope.id].gutterBalls = 1;
                            } else {
                                $scope.myRoster[$scope.id].gutterBalls++;
                            }
                        }
                        // get strikes
                        if (pins === 10) {
                            if (!$scope.myRoster[$scope.id].strikes) {
                                $scope.myRoster[$scope.id].strikes = 1;
                                totalFrames = totalFrames + 1 / 2;
                            } else {
                                $scope.myRoster[$scope.id].strikes++;
                                totalFrames = totalFrames + 1 / 2;
                            }
                        }

                        if (isGameOver()) {
                            $scope.gameOver = true;
                        }

                        return;
                    };

                    $scope.reset = function() {
                        $scope.rolls = [];
                        $scope.frameScores = [];
                        $scope.rollCount = 0;
                        $scope.stats = {};
                        $scope.rollDisplay = '';
                        $scope.gameOver = false;
                        $scope.myRoster = {};
                        return;
                    };
                    $scope.submitResults = function() {
                        var urlArr = [];
                        for (var id in $scope.myRoster) {
                            urlArr.push($http.post(apiToken + '/newgame/' + $scope.myRoster[id].id + '/' + Auth.user.id, {
                                game: {
                                    worth: 1 / $scope.numberOfBowlers,
                                    pinCount: $scope.myRoster[id].pinCount,
                                    rollCount: $scope.myRoster[id].rolls,
                                    gutterBalls: $scope.myRoster[id].gutterBalls,
                                    strikes: $scope.myRoster[id].strikes,
                                    spares: $scope.myRoster[id].spares,
                                    score: $scope.frameScores[$scope.frameScores.length - 1],
                                    nineMade: $scope.myRoster[id].nineMade,
                                    nineCount: $scope.myRoster[id].nineCount,
                                    sparePercentage: $scope.myRoster[id].spares / ($scope.myRoster[id].rolls - $scope.myRoster[id].strikes) * 100,
                                    strikePercentage: $scope.myRoster[id].strikes / $scope.myRoster[id].rolls * 100,
                                }
                            }));
                        }
                        $q.all(urlArr).then(function(results) {
                            if (results) {
                                $dialogs.notify('Success', 'Game results have been saved.');
                            }
                        });
                    };

                    isGameOver = function() {
                        return $scope.frameScores.length === 10;
                    };
                    isSecondRoll = function() {
                        return $scope.rollDisplay.length % 2 === 1;
                    };
                    isTooLargeForSpare = function(pins) {
                        return pins + $scope.rolls[$scope.rolls.length - 1] > 10;
                    };
                    isTenthFrame = function() {
                        return $scope.rollDisplay.length >= 17;
                    };
                    isTenthFrameThirdRollSpareTry = function() {
                        var check = $scope.rollDisplay[19] !== 'X' && $scope.rollDisplay.length === 20;
                        return check;
                    };
                    var disabled = $scope.disabled = function(pins) {
                        var check = isGameOver() || isSecondRoll() && isTooLargeForSpare(pins) && !isTenthFrame() || isTenthFrameThirdRollSpareTry() && isTooLargeForSpare(pins);
                        return check;
                    };
                    return disabled;
                }
            };
        }
    ]);
}.call(this));
