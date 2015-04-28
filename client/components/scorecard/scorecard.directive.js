/*global angular*/
(function() {
    'use strict';

    function Scorecard(Calculator, Auth, Notification, socket) {
        return {
            restrict: 'A',
            scope: {
                bowlerId: '@',
                isTenpin: '=',
                numberOfBowlers: '@',
                bowlers: '=',
                currentBowlerIndex: '='
            },
            templateUrl: 'components/scorecard/scorecard.html',
            controller: function() {
                var ctrl = this;

                ctrl.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                ctrl.frames = [1, 2, 3, 4, 5, 6, 7, 8, 9];

                ctrl.isGameOver = function(frameScores) {
                    return frameScores.length === 10;
                };
                ctrl.isSecondRoll = function(rollDisplay) {
                    return rollDisplay.length % 2 === 1;
                };
                ctrl.isTooLargeForSpare = function(pins, rolls) {
                    return pins + rolls[rolls.length - 1] > 10;
                };
                ctrl.isTooLargeForTenthFrameSpare = function(pins, rolls, rollDisplay) {
                    if (rolls[rolls.length - 1] === 10 && rollDisplay.length >= 19) {
                        return false;
                    }
                    return pins + rolls[rolls.length - 1] > 10;
                };
                ctrl.isTenthFrame = function(rollDisplay) {
                    return rollDisplay.length >= 19; // Was at 17!!!!!!!!!!!!!!!!
                };
                ctrl.isTenthFrameThirdRollSpareTry = function(rollDisplay) {
                    return ((rollDisplay[19] !== 'X') && (rollDisplay.length === 20)) ? true : false;
                };
                ctrl.isNineCount = function(pins, rollDisplay) {
                    return (pins === 9 && !ctrl.isSecondRoll(rollDisplay)) ? true : false;
                };
                ctrl.isNineMade = function(pins, rollDisplay, rolls) {
                    return (pins === 1 && ctrl.isSecondRoll(rollDisplay) && rolls[rolls.length - 1] === 9) ? true : false;
                };

                ctrl.addUpPins = function(pinArray) {
                    var len = pinArray.length;
                    var pinTotal = 0;

                    for (var i = 0; i < len; i++) {
                        pinTotal += pinArray[i];
                    }

                    return pinTotal;
                };
            },
            link: function($scope, $element, $attrs, ctrl) {
                $scope.isGameOver = false;
                $scope.rollCount = 0;
                $scope.nineCount = 0;
                $scope.nineMade = 0;
                $scope.firstBallCount = 0;
                $scope.rolls = [];
                $scope.frameScores = [];
                $scope.rollDisplay = '';
                $scope.pins = ctrl.pins;
                $scope.frames = ctrl.frames;
                $scope.history = {};
                $scope.results = {};
                $scope.isSubmitable = false;
                $scope.bakerScores = {
                    totalFrames: 0,
                    lineup: {},
                    spares: 0,
                    strikes: 0,
                    nineCount: 0,
                    nineMade: 0,
                    pinTotal: 0,
                    rollCount: 0,
                    numberOfBowlers: $scope.numberOfBowlers
                };

                $scope.addRoll = function(pins) {
                    console.log($scope.bowlers);
                    console.log($scope.currentBowlerIndex);
                    if (!!$scope.isTenpin) {
                        return handleTenPenRole(pins);
                    }
                    return handleBakerRole(pins);
                };
                
                function activateNextTab() {
                    if ($scope.currentBowlerIndex === $scope.bowlers.length) {
                        $scope.bowlers[0].active = true;
                    }
                    else {
                        $scope.bowlers[$scope.currentBowlerIndex + 1].active = true;
                    }
                }

                var handleBakerRole = function(pins) {
                    $scope.rolls.push(pins);
                    $scope.rollCount++;
                    $scope.rollDisplay = $scope.$eval('rolls | rollDisplay');
                    $scope.frameScores = $scope.$eval('rolls | frameScores');
                    $scope.bakerScores.totalFrames += 0.5;

                    var bakerScores = $scope.bakerScores;
                    var lineup = $scope.bakerScores.lineup;
                    var rolls = $scope.rollDisplay.split('');

                    if (!lineup[$scope.bowlerId]) {
                        lineup[$scope.bowlerId] = {
                            id: $scope.bowlerId,
                            spares: 0,
                            strikes: 0,
                            nineCount: 0,
                            nineMade: 0,
                            pinTotal: 0,
                            rollCount: 0,
                            firstBallCount: 0,
                            strikesToRemoveFromPercentage: 0
                        };
                    }
                    // pin total
                    lineup[$scope.bowlerId].pinTotal += pins;
                    bakerScores.pinTotal += pins;
                    // roll count
                    lineup[$scope.bowlerId].rollCount++;
                    bakerScores.rollCount++;
                    // spares
                    if ($scope.bakerScores.totalFrames % 1 === 0) {
                        if ($scope.rolls[$scope.rolls.length - 1] + $scope.rolls[$scope.rolls.length - 2] === 10) {
                            lineup[$scope.bowlerId].spares++;
                            bakerScores.spares++;
                        }
                    }
                    // strikes
                    if (pins === 10) {
                        lineup[$scope.bowlerId].strikes++;
                        bakerScores.strikes++;
                        bakerScores.totalFrames += 0.5;
                        if ($scope.rollDisplay.length >= 20) {
                            lineup[$scope.bowlerId].strikesToRemoveFromPercentage++;
                        }
                    }
                    // first ball count
                    if (ctrl.isSecondRoll($scope.rollDisplay) || pins === 10) {
                        if ($scope.rollDisplay.length < 20) {
                            $scope.firstBallCount += pins;
                            lineup[$scope.bowlerId].firstBallCount += pins;
                        }
                    }
                    // nine-count
                    if (pins === 9 && ctrl.isSecondRoll($scope.rollDisplay)) {
                        lineup[$scope.bowlerId].nineCount++;
                        bakerScores.nineCount++;
                    }
                    // nine-made
                    if (pins === 1 && !ctrl.isSecondRoll($scope.rollDisplay)) {
                        if (rolls[rolls.length - 2] === '9') {
                            lineup[$scope.bowlerId].nineMade++;
                            bakerScores.nineMade++;
                        }
                    }
                    // history
                    $scope.history[$scope.rollCount] = {
                        rolls: $scope.rolls.slice(),
                        frameScores: $scope.$eval('rolls | frameScores'),
                        rollDisplay: $scope.$eval('rolls | rollDisplay'),
                        rollCount: $scope.rollCount,
                        nineCount: $scope.nineCount,
                        nineMade: $scope.nineMade,
                        firstBallCount: $scope.firstBallCount,
                        isGameOver: $scope.isGameOver,
                        bakerScores: angular.copy($scope.bakerScores)
                    };
                    // game-over
                    if (ctrl.isGameOver($scope.frameScores)) {
                        $scope.isGameOver = !$scope.isGameOver;
                        $scope.bakerScores.score = $scope.frameScores[$scope.frameScores.length - 1];
                        $scope.bakerScores.firstBallCount = $scope.firstBallCount;
                        $scope.bakerScores.strikesToRemoveFromPercentage = 0;
                        for (var i = 0; i < $scope.rollDisplay.length; i++) {
                            switch ($scope.rollDisplay[i]) {
                                case 'X':
                                    if (i === 19 || i === 20) {
                                        $scope.bakerScores.strikesToRemoveFromPercentage++;
                                    }
                                    break;
                            }
                        }

                        $scope.results = Calculator.analyzeBaker($scope.bakerScores);
                        $scope.isSubmitable = !$scope.isSubmitable;
                    }

                    return angular.noop();
                };

                var handleTenPenRole = function(pins) {
                    if (ctrl.isNineCount(pins, $scope.rollDisplay)) {
                        $scope.nineCount++;
                    }
                    if (ctrl.isNineMade(pins, $scope.rollDisplay, $scope.rolls)) {
                        $scope.nineMade++;
                    }
                    if (!ctrl.isSecondRoll($scope.rollDisplay)) {
                        console.log($scope.firstBallCount);
                        if ($scope.rollDisplay.length !== 20) {
                            $scope.firstBallCount += pins;
                        }
                    }
                    $scope.rollCount++;
                    $scope.rolls.push(pins);
                    $scope.rollDisplay = $scope.$eval('rolls | rollDisplay');
                    $scope.frameScores = $scope.$eval('rolls | frameScores');

                    $scope.history[$scope.rollCount] = {
                        rolls: $scope.rolls.slice(),
                        frameScores: $scope.$eval('rolls | frameScores'),
                        rollDisplay: $scope.$eval('rolls | rollDisplay'),
                        rollCount: $scope.rollCount,
                        nineCount: $scope.nineCount,
                        nineMade: $scope.nineMade,
                        firstBallCount: $scope.firstBallCount,
                        isGameOver: $scope.isGameOver
                    };

                    if (ctrl.isGameOver($scope.frameScores)) {
                        $scope.isGameOver = !$scope.isGameOver;
                        $scope.results = Calculator.analyzeTenPin({
                            rollCount: $scope.rollCount,
                            rollDisplay: $scope.rollDisplay,
                            frameScores: $scope.frameScores,
                            nineCount: $scope.nineCount,
                            nineMade: $scope.nineMade,
                            firstBallCount: $scope.firstBallCount,
                            pinTotal: ctrl.addUpPins($scope.rolls)
                        });
                        $scope.isSubmitable = !$scope.isSubmitable;
                    }
                };

                var reset = $scope.reset = function() {
                    $scope.rollCount = 0;
                    $scope.firstBallCount = 0;
                    $scope.rolls = [];
                    $scope.frameScores = [];
                    $scope.rollDisplay = '';
                    $scope.history = {};
                    $scope.isGameOver = false;
                    $scope.bakerScores = {
                        totalFrames: 0,
                        lineup: {},
                        spares: 0,
                        strikes: 0,
                        nineCount: 0,
                        nineMade: 0,
                        pinTotal: 0,
                        rollCount: 0
                    };
                };

                $scope.goBackOne = function() {
                    if ($scope.rollCount === 1) {
                        return reset();
                    }

                    var historicFrame = $scope.history[$scope.rollCount - 1];

                    $scope.rolls = historicFrame.rolls.slice();
                    $scope.frameScores = historicFrame.frameScores;
                    $scope.rollDisplay = historicFrame.rollDisplay;
                    $scope.nineCount = historicFrame.nineCount;
                    $scope.nineMade = historicFrame.nineMade;
                    $scope.isGameOver = historicFrame.isGameOver;
                    $scope.firstBallCount = historicFrame.firstBallCount;

                    if (!$scope.isTenpin) {
                        $scope.bakerScores = historicFrame.bakerScores;
                    }

                    delete $scope.history[$scope.rollCount];

                    $scope.rollCount = historicFrame.rollCount;
                };

                $scope.isGameSubmitable = function() {
                    return $scope.isGameOver && $scope.isSubmitable;
                };

                $scope.submitGameResults = function() {
                    if ($scope.isTenpin) {
                        Auth.addBowlerTenpinGame($scope.bowlerId, $scope.results)
                            .then(function() {
                                $scope.isSubmitable = !$scope.isSubmitable;
                                Notification.add({
                                    type: 'success',
                                    message: 'Your results have been submitted.'
                                });
                            });
                    }
                    else {
                        Auth.addBakerGame($scope.results)
                            .then(function() {
                                $scope.isSubmitable = !$scope.isSubmitable;
                                Notification.add({
                                    type: 'success',
                                    message: 'Your results have been submitted.'
                                });
                            });
                    }
                    socket.socket.emit('team:update');
                };

                var disabled = $scope.disabled = function(pins) {
                    if ($scope.rollDisplay.length === 20) {
                        return false;
                    }
                    return ctrl.isGameOver($scope.frameScores) ||
                        ctrl.isSecondRoll($scope.rollDisplay) && ctrl.isTooLargeForSpare(pins, $scope.rolls) && !ctrl.isTenthFrame($scope.rollDisplay) ||
                        ctrl.isTenthFrameThirdRollSpareTry($scope.rollDisplay) && ctrl.isTooLargeForSpare(pins, $scope.rolls) ||
                        ctrl.isTenthFrame($scope.rollDisplay) && ctrl.isTooLargeForTenthFrameSpare(pins, $scope.rolls, $scope.rollDisplay) ||
                        !$scope.bowlerId;
                };

                return disabled;
            }
        };
    }

    Scorecard.$inject = ['Calculator', 'Auth', 'Notification', 'socket'];

    angular
        .module('app')
        .directive('scorecard', Scorecard);
})();
