'use strict';

describe('Service: Auth', function() {
	beforeEach(module('app'));

	var Auth,
		$cookieStore;

	beforeEach(inject(function(_Auth_, _$cookieStore_) {
		Auth = _Auth_;
		$cookieStore = _$cookieStore_;
	}));
	

	it('should be defined', function() {
		expect(Auth).toBeDefined();
	});
});