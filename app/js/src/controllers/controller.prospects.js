(function() {
	'use strict';
	angular.module('app.controller.prospects', [])
		.controller('ProspectsCtrl', [
			'$scope',
			'$http',
			'apiToken',
			'$dialogs',
			function ($scope, $http, apiToken, $dialogs) {
				var userArray = [];
				$scope.prospect = {};
				
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
				$http.get(apiToken + '/users')
					.success(function(users) {
						//console.log('Users',users);
						var i;
						for (i = 0; i < users.length; i++) {
							// push coach object
							userArray.push({
								desc: users[i].firstName + ' ' + users[i].lastName + ' ' + users[i].university + ' : ' + users[i].email,
								name: users[i].firstName + users[i].lastName,
								email: users[i].email
							});
						}
						$scope.coaches = userArray;
					}).
					error(function(err) {
						//console.log(err);
						$dialogs.error('Token Error','Your token could not be validated at this time.');
					});

				$scope.sendToCoach = function() {
					$http.post('/mailtocoach', {
						fullName: $scope.prospect.fullName,
						gender: $scope.prospect.gender.type,
						email: $scope.prospect.email,
						address: $scope.prospect.address,
						city: $scope.prospect.city,
						state: $scope.prospect.state,
						zipcode: $scope.prospect.zipcode,
						country: $scope.prospect.country,
						highschool: $scope.prospect.highschool,
						classification: $scope.prospect.classification,
						schoolCity: $scope.prospect.schoolCity,
						schoolState: $scope.prospect.schoolState,
						gpa: $scope.prospect.gpa,
						act: $scope.prospect.act,
						major: $scope.prospect.major,
						admissionStatus: $scope.prospect.admissionStatus.type,
						collegeClass: $scope.prospect.collegeClass.type,
						financialAid: $scope.prospect.financialAid.applied,
						bowlStyle: $scope.prospect.bowlStyle.type,
						currentAverage: $scope.prospect.currentAverage,
						highAverage: $scope.prospect.highAverage,
						schoolOfIntrest: $scope.prospect.schoolOfIntrest,
						coachToContact: $scope.prospect.coachToContact.email,
						message: $scope.prospect.message,
					})
					.success(function() {
						//console.log('Message Sent.');
						$dialogs.notify('Message Sent','Your Message');
					})
					.error(function(err) {
						//console.log(err);
						$dialogs.error('Message Send Error','Your message could not be sent at this time.');
					});
				};
			}
		]);
}).call(this);
