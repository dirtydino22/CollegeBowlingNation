'use strict';

describe('Service: News', function() {
	
	beforeEach(module('app'));

	var News,
		$httpBackend;

	beforeEach(inject(function(_News_, _$httpBackend_) {
		$httpBackend = _$httpBackend_;
		News = _News_;
	}));
	

	it('should be defined', function() {
		expect(News).toBeDefined();
	});

	it('should return a list of news articles', function() {
		$httpBackend.expectGET('/api/news')
			.respond([{
				title: 'Article 1'
			}, {
				title: 'Article 2'
			}]);

		var result = News.query();

		$httpBackend.flush();

		expect(result.length).toBe(2);
	});
	
	it('should update a news article', function() {
	    $httpBackend.expectPUT('/api/news/1')
	        .respond({test: 'pass'});
	    
	    var result = News.update({id: 1});
	    
	    $httpBackend.flush();
	    
	    expect(result.test).toEqual('pass');
	});

});