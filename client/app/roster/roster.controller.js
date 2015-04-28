function RosterCtrl(Modal, Auth, LocalStorage, Network, socket) {
    'use strict';

    var self = this;

    if (!Network.isOnline()) {
        try {
            LocalStorage.get('roster')
                .then(function(roster) {
                    self.roster = angular.fromJson(roster);
                });
        } catch (err) {
            // err no data
        }
    } else {
        Auth.getRoster()
            .then(function(roster) {
                LocalStorage.set('roster', angular.toJson(roster));
                self.roster = roster;
            });
        
    }

    this.openCreateBowlerModal = function(type) {
        return Modal.open(type, function() {
            socket.socket.emit('roster:update', Auth.getCurrentUser()._id);
        });
    };

    this.openEditBowlerModal = function(type, bowler) {
        return Modal.open(type, function() {
            socket.socket.emit('roster:update', Auth.getCurrentUser()._id);
        }, bowler);
    };

    this.openRemoveBowlerModal = function(type, bowler) {
        return Modal.open(type, function() {
            Auth.removeBowler(bowler)
                .then(function() {
                    socket.socket.emit('roster:update', Auth.getCurrentUser()._id);
                });
        });
    };

    this.openNewSeasonModal = function() {
        return Modal.open('createNewSeason', function() {
            socket.socket.emit('roster:update', Auth.getCurrentUser()._id);
        }, self.roster);
    };

    socket.socket.on('roster:update', function(roster) {
        LocalStorage.set('roster', angular.toJson(roster));
        self.roster = roster;
    });
}

RosterCtrl.$inject = ['Modal', 'Auth', 'LocalStorage', 'Network', 'socket'];

angular
    .module('app')
    .controller('RosterCtrl', RosterCtrl);
