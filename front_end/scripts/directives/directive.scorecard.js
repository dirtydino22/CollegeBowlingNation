'use strict';
angular.module('directive.scorecard', [])
    .directive('scoreCard', function($q, $http, AppUser, Socket, Lineup, User, growlNotifications) {
        return {
            restrict: 'EA',
            scope: {
                bowlerId: '@',
                gameType: '@',
                numberOfBowlers: '@'
            },
            templateUrl: 'partials/scorecard',
            controller: function($scope) {
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
                ctrl.isTenthFrame = function(rollDisplay) {
                    return rollDisplay.length >= 17;
                };
                ctrl.isTenthFrameThirdRollSpareTry = function(rollDisplay) {
                    return ((rollDisplay[19] !== 'X') && (rollDisplay.length === 20)) ? true : false;
                };
                ctrl.isNineCount = function(pins, rollDisplay) {
                    return (pins === 9 && ctrl.isSecondRoll(rollDisplay)) ? true : false;
                };
                ctrl.isNineMade = function(pins, rollDisplay, rolls) {
                    return ((pins === 1 && ctrl.isSecondRoll(rollDisplay)) && rolls[rolls.length - 1] === '9') ? true : false;
                };
                

            },
            link: function($scope, $element, $attrs, ctrl) {
                $scope.submitted = false;
                $scope.rolls = [];
                $scope.frameScores = [];
                $scope.rollDisplay = '';
                $scope.pins = ctrl.pins;
                $scope.frames = ctrl.frames;

                $scope.settings = {
                    rollCount: 0,
                    nineCount: 0,
                    nineMade: 0,
                    gameOver: false,
                    stats: {}
                };


                // baker game settings
                if ($scope.gameType !== 'tenpin') {
                    $scope.settings.totalFrames = 0;
                    $scope.settings.lineup = {};
                }

                $scope.addRoll = function(pins) {
                    var rolls = $scope.rollDisplay.split('');

                    $scope.rolls.push(pins);
                    $scope.settings.rollCount++;
                    $scope.frameScores = $scope.$eval('rolls | frameScores');
                    $scope.rollDisplay = $scope.$eval('rolls | rollDisplay');

                    if ($scope.gameType === 'tenpin') {
                        if (ctrl.isNineCount(pins, $scope.rollDisplay)) {
                            $scope.settings.nineCount++;
                        }
                        if (ctrl.isNineMade(pins, $scope.rollDisplay, rolls)) {
                            $scope.settings.nineMade++;
                        }
                        if (ctrl.isGameOver($scope.frameScores)) {
                            $scope.settings.gameOver = true;
                            $scope.settings.results = analyzeTenPin();
                        }
                    } else {
                        handleBakerRoll(pins);
                    }

                    return;
                };


                $scope.submitGame = function() {
                    var urls = [];
                    if ($scope.gameType === 'tenpin') {
                        User.newGame({
                            id: AppUser.user.id,
                            bowlerId: $scope.bowlerId
                        }, $scope.settings.results,
                        function() {
                            $scope.submitted = true;
                            growlNotifications.add('Your game results have been submited.', 'success', 4000);
                            Socket.emit('games:update');
                        },
                        function() {
                            growlNotifications.add('There was an error submitting your game results.', 'danger', 4000);
                        });
                        
                    }
                    else {

                        for (var bowler in $scope.settings.lineup) {
                            urls.push($http.post('/api/users/' + AppUser.user.id + '/bowler/' + $scope.settings.lineup[bowler].id, {
                                worth: 1 / $scope.numberOfBowlers,
                                pinCount: $scope.settings.lineup[bowler].pinCount,
                                rollCount: $scope.settings.lineup[bowler].rolls,
                                gutterBalls: $scope.settings.lineup[bowler].gutterBalls,
                                strikes: $scope.settings.lineup[bowler].strikes,
                                spares: $scope.settings.lineup[bowler].spares,
                                score: $scope.frameScores[$scope.frameScores.length - 1],
                                nineMade: $scope.settings.lineup[bowler].nineMade,
                                nineCount: $scope.settings.lineup[bowler].nineCount,
                                sparePercentage: $scope.settings.lineup[bowler].spares / ($scope.settings.lineup[bowler].rolls - $scope.settings.lineup[bowler].strikes) * 100,
                                strikePercentage: $scope.settings.lineup[bowler].stikes / $scope.settings.lineup[bowler].rolls * 100
                            }));
                        }
                        console.log(urls);
                        $q.all(urls).then(function(results) {
                            if (results) {
                                $scope.submitted = true;
                                growlNotifications.add('Your game results have been submited.', 'success', 4000);
                                Socket.emit('games:update');
                            }
                            else {
                                growlNotifications.add('There was an error submitting your game results.', 'danger', 4000);
                            }
                        });
                    }
                };

                $scope.reset = function() {
                    $scope.rolls = [];
                        $scope.frameScores = [];
                        $scope.rollDisplay = '';
                        $scope.settings = {
                            rollCount: 0,
                            nineCount: 0,
                            nineMade: 0,
                            gameOver: false,
                            stats: {}
                        };
                    if ($scope.submitted !== false) {$scope.submitted = false;}
                    // baker reset
                    if ($scope.gameType !== 'tenpin') {
                    	$scope.settings.totalFrames = 0;
                    	$scope.settings.lineup = {};
                    }
                };

                var handleBakerRoll = function(pins) {
                    var rolls = $scope.rollDisplay.split('');
                    $scope.settings.totalFrames += 0.5;
                    // create stats obj for each bowler if not already made
                    if (!$scope.settings.lineup[$scope.bowlerId]) {
                        $scope.settings.lineup[$scope.bowlerId] = {
                            id: $scope.bowlerId
                        };
                    }
                    // handle spares
                    if ($scope.settings.totalFrames % 1 === 0) {
                        if ($scope.rolls[$scope.rolls.length - 1] + $scope.rolls[$scope.rolls.length - 2] === 10) {
                            if (!$scope.settings.lineup[$scope.bowlerId].spares) {
                                $scope.settings.lineup[$scope.bowlerId].spares = 1;
                            } else {
                                $scope.settings.lineup[$scope.bowlerId].spares++;
                            }
                        }
                    }
                    // handle nine count
                    if (pins === 9 && ctrl.isSecondRoll($scope.rollDisplay)) {
                        if (!$scope.settings.lineup[$scope.bowlerId].nineCount) {
                            $scope.settings.lineup[$scope.bowlerId].nineCount = 1;
                        } else {
                            $scope.settings.lineup[$scope.bowlerId].nineCount++;
                        }
                    }
                    // handle nine made
                    if (pins === 1 && !ctrl.isSecondRoll($scope.rollDisplay)) {
                        if (rolls[rolls.length - 1] === '9') {
                            if (!$scope.settings.lineup[$scope.bowlerId].nineMade) {
                                $scope.settings.lineup[$scope.bowlerId].nineMade = 1;
                            } else {
                                $scope.settings.lineup[$scope.bowlerId].nineMade++;
                            }
                        }
                    }
                    // handle pin count
                    if (!$scope.settings.lineup[$scope.bowlerId].pinCount) {
                        $scope.settings.lineup[$scope.bowlerId].pinCount = pins;
                    } else {
                        $scope.settings.lineup[$scope.bowlerId].pinCount += pins;
                    }
                    // handle roll count
                    if (!$scope.settings.lineup[$scope.bowlerId].rolls) {
                        $scope.settings.lineup[$scope.bowlerId].rolls = 1;
                    } else {
                        $scope.settings.lineup[$scope.bowlerId].rolls++;
                    }
                    // handle gutters		
                    if (pins === 0) {
                        if (!$scope.settings.lineup[$scope.bowlerId].gutterBalls) {
                            $scope.settings.lineup[$scope.bowlerId].gutterBalls = 1;
                        } else {
                            $scope.settings.lineup[$scope.bowlerId].gutterBalls++;
                        }
                    }
                    // handle strikes
                    if (pins === 10) {
                        if (!$scope.settings.lineup[$scope.bowlerId].strikes) {
                            $scope.settings.lineup[$scope.bowlerId].strikes = 1;
                            $scope.settings.totalFrames += 0.5;
                        } else {
                            $scope.settings.lineup[$scope.bowlerId].strikes++;
                            $scope.settings.totalFrames += 0.5;
                        }
                    }

                    //handle game over
                    if (ctrl.isGameOver($scope.frameScores)) {
                        $scope.settings.gameOver = true;
                    }

                    return;
                };

                var analyzeTenPin = function() {
                    var calc = {
                        strikes: 0,
                        spares: 0,
                        gutters: 0,
                        pinCount: 0
                    },
                        rolls = $scope.rollDisplay.split(''),
                        i;

                    for (i = 0; i < $scope.rolls.length; i++) {
                        calc.pinCount += $scope.rolls[i];
                    }
                    for (i = 0; i < rolls.length; i++) {
                        switch (rolls[i]) {
                            case 'X':
                                calc.strikes++;
                                break;
                            case '/':
                                calc.spares++;
                                break;
                            case '-':
                                calc.gutters++;
                                break;
                        }
                    }

                    $scope.settings.stats = {
                        pinCount: calc.pinCount,
                        rollCount: $scope.settings.rollCount,
                        gutterBalls: calc.gutters,
                        spares: calc.spares,
                        sparePercentage: calc.spares / ($scope.settings.rollCount - calc.strikes) * 100,
                        strikes: calc.strikes,
                        strikePercentage: calc.strikes / $scope.settings.rollCount * 100,
                        score: $scope.frameScores[$scope.frameScores.length - 1],
                        worth: 1
                    };

                    return $scope.settings.stats;
                };

                var disabled = $scope.disabled = function(pins) {
                    return (ctrl.isGameOver($scope.frameScores) || ctrl.isSecondRoll($scope.rollDisplay) && ctrl.isTooLargeForSpare(pins, $scope.rolls) && !ctrl.isTenthFrame($scope.rollDisplay) || ctrl.isTenthFrameThirdRollSpareTry($scope.rollDisplay) && ctrl.isTooLargeForSpare(pins, $scope.rolls)) ? true : false;
                };

                return disabled;
            }
        };
    });