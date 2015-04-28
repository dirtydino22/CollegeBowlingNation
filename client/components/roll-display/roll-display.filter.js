'use strict';
var RollDisplayer;

angular.module('app').filter('rollDisplay', function() {
    return function(rolls) {
        return (new RollDisplayer(rolls)).rollDisplay();
    };
});

RollDisplayer = (function() {
    function RollDisplayer(rolls) {
        this.rolls = rolls;
    }

    RollDisplayer.prototype.rollDisplay = function(str, here) {
        if (!str) {
            str = '';
        }
        if (!here) {
            here = 0;
        }
        if (this.rolls.length === here) {
            return str;
        }
        else if (this.rolls.length === here + 1 && !this.isStrike(here)) {
            return str + this.displayPins(here);
        }
        else if (this.isStrike(here)) {
            return this.rollDisplay(str + this.spaceUnlessTenth(str) + 'X', here + 1);
        }
        else if (this.isSpare(here)) {
            return this.rollDisplay(str + this.displayPins(here) + '/', here + 2);
        }
        else {
            return this.rollDisplay(str + this.displayPins(here) + this.displayPins(here + 1), here + 2);
        }
    };

    RollDisplayer.prototype.displayPins = function(here) {
        var str = '-123456789',
            ref = str[this.rolls[here]];
        return (ref !== null) ? ref : '?';
    };

    RollDisplayer.prototype.isStrike = function(here) {
        return this.rolls[here] === 10;
    };

    RollDisplayer.prototype.isSpare = function(here) {
        return this.rolls[here] + this.rolls[here + 1] === 10 && !this.isStrike(here);
    };

    RollDisplayer.prototype.spaceUnlessTenth = function(str) {
        return (str.length >= 18) ? '' : ' ';
    };

    return RollDisplayer;

})();
