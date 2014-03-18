(function(angular) {
	'use strict';
	angular.module('app.controller.prospects', [])
		.controller('ProspectsCtrl', [
			'$scope',
			'$http',
			function ($scope, $http) {
				var userArray = [];
				
				$scope.genders = [
					{type: 'Male'},
					{type: 'Female'}
				];
				$scope.bowlStyle = [
					{type: 'Right-handed'},
					{type: 'Left-handed'}
				];
				$scope.admissionStatus = [
					{type: 'I have been admitted to college.'},
					{type: 'I have applied to college.'}
				];
				$scope.collegeClass = [
					{type: 'New Freshman'},
					{type: 'Transfer Student'},
					{type: 'Graduate Student'}
				];
				$scope.financialAid = [
					{applied: 'Yes'},
					{applied: 'No'}
				];

				// returns a list of coaches for select element
				$http.get('api/users')
					.success(function(users) {
						console.log(users);
						var i;
						for (i = 0; i < users.length; i++) {
							userArray.push({
								desc: users[i].firstName + ' ' + users[i].lastName + ' : ' + users[i].university + ' : ' + users[i].email,
								name: users[i].firstName + users[i].lastName,
								email: users[i].email
							});
						}
						$scope.coaches = userArray;
					}).
					error(function(err) {
						console.log(err);
					});
			}
		]);
}(angular));