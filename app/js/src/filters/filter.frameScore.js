(function() {
    'use strict';
    var FrameScorer;

    angular.module('app.filter.frameScore', []).filter('frameScores', function() {
        return function(rolls) {
            return (new FrameScorer(rolls)).frameScore();
        };
    });

    FrameScorer = (function() {
        function FrameScorer(rolls) {
            this.rolls = rolls;
        }

        FrameScorer.prototype.frameScore = function(scores, here) {
            if (!scores) {
                scores = [];
            }
            if (!here) {
                here = 0;
            }
            if (this.isIncompleteFrame(here)) {
                return scores;
            } else if (this.isSpare(here)) {
                return this.pushThisScoreAndFinish(scores, this.sumNextThreePins(here), here + 2);
            } else if (this.isStrike(here)) {
                return this.pushThisScoreAndFinish(scores, this.sumNextThreePins(here), here + 1);
            } else {
                return this.pushThisScoreAndFinish(scores, this.sumNextTwoPins(here), here + 2);
            }
        };

        FrameScorer.prototype.pushThisScoreAndFinish = function(scores, thisFrameScore, nextFrameStart) {
            scores.push(this.lastScore(scores) + thisFrameScore);
            return this.frameScore(scores, nextFrameStart);
        };

        FrameScorer.prototype.isStrike = function(here) {
            return this.rolls[here] === 10;
        };

        FrameScorer.prototype.isSpare = function(here) {
            return (this.rolls[here] + this.rolls[here + 1] === 10) && (!this.isStrike(here));
        };

        FrameScorer.prototype.sumNextThreePins = function(here) {
            return this.rolls[here] + this.rolls[here + 1] + this.rolls[here + 2];
        };

        FrameScorer.prototype.sumNextTwoPins = function(here) {
            return this.rolls[here] + this.rolls[here + 1];
        };

        FrameScorer.prototype.lastScore = function(scores) {
            var ref = scores[scores.length - 1];
            return (ref) ? ref : 0;
        };

        FrameScorer.prototype.isIncompleteFrame = function(here) {
            return this.isShortFrameOrNakedStrike(here) || this.isNakedSpareOrStrikeWith1Roll(here);
        };

        FrameScorer.prototype.isNakedSpareOrStrikeWith1Roll = function(here) {
            return (this.rolls.length === here + 2) && (this.isStrike(here) || this.isSpare(here));
        };

        FrameScorer.prototype.isShortFrameOrNakedStrike = function(here) {
            return this.rolls.length <= here + 1;
        };

        return FrameScorer;

    })();

}).call(this);