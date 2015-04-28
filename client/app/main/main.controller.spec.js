'use strict';

describe('Controller: MainCtrl', function() {
	beforeEach(module('app'));

	var ctrl,
		scope,
		$httpBackend;

	beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET('/api/news')
			.respond([{
				title: 'test',
				createdOn: '',
				author: '',
				body: '',
				lastUpdate: ''
			}]);

		scope = $rootScope.$new();

		ctrl = $controller('MainCtrl as ctrl', {
			$scope: scope
		});
	}));

	it('should be defined', function() {
		expect(scope.ctrl).toBeDefined();
	});

	it('should attach a list of news articles to scope', function() {
		$httpBackend.flush();
		expect(scope.ctrl.news[0].title).toBe('test');
	});
});