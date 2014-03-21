(function() {
    'use strict';
    angular.module('app.directive.scoreCard', []).directive('scoreCard', [
        '$http',
        function($http) {
            return {
                restrict: 'EA',
                scope: {
                    id: '@'
                },
                templateUrl: 'templates/scorecard.html',
                link: function($scope, $element, $attrs) {
                    var isGameOver, isSecondRoll, isTenthFrame, isTenthFrameThirdRollSpareTry, isTooLargeForSpare, analyze;
                    $scope.pinsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    $scope.frames = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    $scope.rolls = [];
                    $scope.rollCount = 0;
                    $scope.frameScores = [];
                    $scope.rollDisplay = '';
                    $scope.stats = {};
                    $scope.gameOver = false;
                    $scope.addRoll = function(pins) {
                        $scope.rolls.push(pins);
                        $scope.rollCount++;
                        $scope.frameScores = $scope.$eval('rolls | frameScores');
                        $scope.rollDisplay = $scope.$eval('rolls | rollDisplay');
                        if (isGameOver()) {
                            $scope.gameOver = true;
                            analyze();
                        }
                        return;
                    };
                    $scope.reset = function() {
                        $scope.rolls = [];
                        $scope.frameScores = [];
                        $scope.rollCount = 0;
                        $scope.stats = {};
                        $scope.rollDisplay = '';
                        return;
                    };
                    $scope.submitResults = function() {
                        $http.post('api/bowlers/' + $scope.id, {
                            game: {
                                pinCount: $scope.stats.pinCount,
                                rollCount: $scope.stats.rollCount,
                                gutterBalls: $scope.stats.gutterBalls,
                                strikes: $scope.stats.strikes,
                                spares: $scope.stats.spares,
                                sparePercentage: $scope.stats.sparePercentage,
                                strikePercentage: $scope.stats.strikePercentage,
                                score: $scope.stats.score
                            }
                        })
                        .success(function() {
                            console.log('results saved');
                        })
                        .error(function(err) {
                            console.log(err);
                        });
                    };
                    analyze = function() {
                        var strikes = 0,
                            spares = 0,
                            gutters = 0,
                            i;
                        var rolls = $scope.rollDisplay.split('');
                        var pinCount = 0;
                        for (i = 0; i < $scope.rolls.length; i++) {
                            pinCount += $scope.rolls[i];
                        }
                        for (i = 0; i < rolls.length; i++) {
                            if (rolls[i] === 'X') {
                                strikes++;
                            }
                            if (rolls[i] === '/') {
                                spares++;
                            }
                            if (rolls[i] === '-') {
                                gutters++;
                            }
                        }
                        $scope.stats = {
                            pinCount: pinCount,
                            rollCount: $scope.rollCount,
                            gutterBalls: gutters,
                            spares: spares,
                            strikes: strikes,
                            sparePercentage: spares / ($scope.rollCount - strikes) * 100,
                            strikePercentage: strikes / $scope.rollCount * 100,
                            currentScore: $scope.frameScores[$scope.frameScores.length - 1]
                        };
                        return $scope.stats;
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