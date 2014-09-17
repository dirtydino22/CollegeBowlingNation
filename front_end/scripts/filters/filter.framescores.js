'use strict';
var FrameScorer;

angular.module('filter.framescores', [])
  .filter('frameScores', function() {
    return function(rolls) {
      return (new FrameScorer(rolls)).frameScore();
    };
  });

FrameScorer = (function() {
  function FrameScorer(rolls) {
    this.rolls = rolls;
  }

  FrameScorer.prototype.frameScore = function(scores, frame) {
    if (!scores) {
      scores = [];
    }
    if (!frame) {
      frame = 0;
    }

    if (this.isIncompleteFrame(frame)) {
      return scores;
    } else if (this.isSpare(frame)) {
      return this.pushThisScoreAndFinish(scores, this.sumNextThreePins(frame), frame + 2);
    } else if (this.isStrike(frame)) {
      return this.pushThisScoreAndFinish(scores, this.sumNextThreePins(frame), frame + 1);
    } else {
      return this.pushThisScoreAndFinish(scores, this.sumNextTwoPins(frame), frame + 2);
    }
  };

  FrameScorer.prototype.pushThisScoreAndFinish = function(scores, thisFrameScore, nextFrameStart) {
    scores.push(this.lastScore(scores) + thisFrameScore);
    return this.frameScore(scores, nextFrameStart);
  };

  FrameScorer.prototype.isStrike = function(frame) {
    return this.rolls[frame] === 10;
  };

  FrameScorer.prototype.isSpare = function(frame) {
    return (this.rolls[frame] + this.rolls[frame + 1] === 10) && (!this.isStrike(frame));
  };

  FrameScorer.prototype.sumNextThreePins = function(frame) {
    return this.rolls[frame] + this.rolls[frame + 1] + this.rolls[frame + 2];
  };

  FrameScorer.prototype.sumNextTwoPins = function(frame) {
    return this.rolls[frame] + this.rolls[frame + 1];
  };

  FrameScorer.prototype.lastScore = function(scores) {
    var ref = scores[scores.length - 1];
    return (ref) ? ref : 0;
  };

  FrameScorer.prototype.isIncompleteFrame = function(frame) {
    return this.isShortFrameOrNakedStrike(frame) || this.isNakedSpareOrStrikeWith1Roll(frame);
  };

  FrameScorer.prototype.isNakedSpareOrStrikeWith1Roll = function(frame) {
    return (this.rolls.length === frame + 2) && (this.isStrike(frame) || this.isSpare(frame));
  };

  FrameScorer.prototype.isShortFrameOrNakedStrike = function(frame) {
    return this.rolls.length <= frame + 1;
  };

  return FrameScorer;
})();