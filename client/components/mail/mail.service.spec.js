'use strict';

describe('Service: Mail', function() {
	beforeEach(module('app'));

	var Mail,
		$httpBackend;

	beforeEach(inject(function(_Mail_, _$httpBackend_) {
		$httpBackend = _$httpBackend_;
		Mail = _Mail_;
	}));
	

	it('should be defined', function() {
		expect(Mail).toBeDefined();
	});

	it('should return a list of news articles', function() {
		$httpBackend.expectPOST('/api/mail/contact')
			.respond({test: 'pass'});

		var result = Mail.contact();

		$httpBackend.flush();

		expect(result.test).toEqual('pass');
	});
});