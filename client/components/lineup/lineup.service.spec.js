'use strict';

describe('Service: Lineup', function() {

	beforeEach(module('app'));

	var Lineup,
		AuthSpy,
		NotificationSpy;

	beforeEach(inject(function(_Lineup_, Auth, Notification) {
		AuthSpy = spyOn(Auth, 'getRoster').andReturn([{name: 'testuser', _id: 1}]);
		NotificationSpy = spyOn(Notification, 'add');
		Lineup = _Lineup_;
	}));
	

	it('should be defined', function() {
		expect(Lineup).toBeDefined();
	});

	it('should get users current lineup', function() {
		var lineup = Lineup.get();
		expect(lineup).toEqual([]);
	});

	it('should update users lineup', function() {
		//Lineup.update([1], function(lineup) {
			//expect(lineup).toEqual([{name: 'testuser', _id: 1, index: 0}]);
		//});
	});

	it('should reset users lineup', function() {
		//Lineup.update([1], function(lineup) {
			//expect(lineup).toEqual([{name: 'testuser', _id: 1, index: 0}]);
		//});
		//Lineup.reset();
		//expect(Lineup.get()).toEqual([]);
	});

	it('should call Notification service if selected bowlers is greater than 5', function() {
		Lineup.update([1,2,3,4,5,6]);
		expect(NotificationSpy).toHaveBeenCalled();
	});
});