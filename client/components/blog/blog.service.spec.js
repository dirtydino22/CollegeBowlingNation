'use strict';

describe('Service: Blog', function() {
	
	beforeEach(module('app'));

	var Blog,
		$httpBackend;

	beforeEach(inject(function(_Blog_, _$httpBackend_) {
		$httpBackend = _$httpBackend_;
		Blog = _Blog_;
	}));
	

	it('should be defined', function() {
		expect(Blog).toBeDefined();
	});

	it('should return a list of news articles', function() {
		$httpBackend.expectGET('/api/blog')
			.respond([{
				title: 'Article 1'
			}, {
				title: 'Article 2'
			}]);

		var result = Blog.query();

		$httpBackend.flush();

		expect(result.length).toBe(2);
	});

	it('should send an updated article to the server', function() {
		$httpBackend
			.expectPUT('/api/blog/1', {
				title: 'Article 1 Update'
			})
			.respond(200, {pass: true});

		var result = Blog.update({id: '1'}, {title: 'Article 1 Update'});

		$httpBackend.flush();

		expect(result.pass).toBe(true);
	});

	it('should post a comment on a article', function() {
		$httpBackend
			.expectPOST('/api/blog/1/comment', {
				title: 'Article Comment'
			})
			.respond(200, {pass: true});

		var result = Blog.addComment({id: '1'}, {title: 'Article Comment'});

		$httpBackend.flush();

		expect(result.pass).toBe(true);
	});

	it('should delete a article', function() {
		$httpBackend
			.expectDELETE('/api/blog/1')
				.respond(200, {pass: true});

		var result = Blog.remove({id: '1'});

		$httpBackend.flush();

		expect(result.pass).toBe(true);
	});

	it('should delete a comment from a article', function() {
		$httpBackend
			.expectDELETE('/api/blog/1/comment/2')
				.respond(200, {pass: true});

		var result = Blog.removeComment({id: '1', commentId: '2'});

		$httpBackend.flush();

		expect(result.pass).toBe(true);
	});
});