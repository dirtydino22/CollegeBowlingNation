'use strict';

angular.module('controller.prospects', [])
	.controller('ProspectsCtrl', function($scope, $state, Universities, Countries, User, Prospect) {
		$scope.universities = Universities.get();
		$scope.countries = Countries.get();
		$scope.prospect = {};
		$scope.coaches = User.query(function(list) {
			angular.forEach(list, function(item) {
				item.label = item.name + ' (' + item.university + ')';
			});
			return list;
		});

		$scope.isFormValid = function(form) {
			if (!form.$dirty || !form.$valid) { return true; }
			return false;
		};

		$scope.submitProspectForm = function(prospect) {
			Prospect.save(prospect, function(success) {
				$state.go('prospects.done');
			}, function(err) {
				console.log(err);
			});
		};
	});