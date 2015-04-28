function ProspectsCtrl($state, Universities, Countries, User) {
    'use strict';
    this.universities = Universities.get();
    this.countries = Countries.get();
    this.prospect = {};
    this.coaches = User.query(function(users) {
       angular.forEach(users, function(user) {
           user.label = user.name + '(' + user.email + ')';
       });
       return users;
    });
}

ProspectsCtrl.$inject = ['$state', 'Universities', 'Countries', 'User'];

angular
    .module('app')
    .controller('ProspectsCtrl', ProspectsCtrl);
