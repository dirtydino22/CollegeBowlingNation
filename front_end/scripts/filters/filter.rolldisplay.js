'use strict';
var RollDisplayer;
angular.module('filter.rolldisplay', [])
  .filter('rollDisplay', function() {
    return function(rolls) {
      return (new RollDisplayer(rolls)).rollDisplay();
    };
  });

RollDisplayer = (function() {
  function RollDisplayer(rolls) {
    this.rolls = rolls;
  }

  RollDisplayer.prototype.rollDisplay = function(str, frame) {
    if (!str) {
      str = "";
    }
    if (!frame) {
      frame = 0;
    }
    if (this.rolls.length === frame) {
      return str;
    } else if (this.rolls.length === frame + 1 && !this.isStrike(frame)) {
      return str + this.displayPins(frame);
    } else if (this.isStrike(frame)) {
      return this.rollDisplay(str + this.spaceUnlessTenth(str) + "X", frame + 1);
    } else if (this.isSpare(frame)) {
      return this.rollDisplay(str + this.displayPins(frame) + '/', frame + 2);
    } else {
      return this.rollDisplay(str + this.displayPins(frame) + this.displayPins(frame + 1), frame + 2);
    }
  };

  RollDisplayer.prototype.displayPins = function(frame) {
    var str = '-123456789',
      ref = str[this.rolls[frame]];
    return (ref !== null) ? ref : '?';
  };

  RollDisplayer.prototype.isStrike = function(frame) {
    return this.rolls[frame] === 10;
  };

  RollDisplayer.prototype.isSpare = function(frame) {
    return this.rolls[frame] + this.rolls[frame + 1] === 10 && !this.isStrike(frame);
  };

  RollDisplayer.prototype.spaceUnlessTenth = function(str) {
    return (str.length >= 18) ? '' : ' ';
  };

  return RollDisplayer;
})();