'use strict';

function GameCtrl(gameType, lineup, tabs) {
    this.gameType = gameType;
    this.lineup = lineup;
    this.tabs = tabs;
    
    this.isTenPin = function() {
        return this.gameType === 'tenpin';
    };
}

GameCtrl.$inject = ['gameType', 'lineup', 'tabs'];

angular
    .module('app')
    .controller('GameCtrl', GameCtrl);