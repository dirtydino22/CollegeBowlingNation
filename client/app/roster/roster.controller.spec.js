'use strict';

describe('Controller: MainCtrl', function() {
	beforeEach(module('app'));

	var ctrl,
		scope,
		Auth,
		AuthSpy,
		Modal,
		ModalSpy;

	beforeEach(inject(function($controller, $rootScope, _Auth_, _Modal_) {
		scope = $rootScope.$new();

		Auth = _Auth_;
		AuthSpy = spyOn(_Auth_, 'getRoster').andReturn({ test: 'pass'});

		Modal = _Modal_;
		ModalSpy = spyOn(_Modal_, 'open');

		ctrl = $controller('RosterCtrl as ctrl', {
			$scope: scope
		});
	}));

	it('should be defined', function() {
		expect(scope.ctrl).toBeDefined();
	});

	it('should call getRoster from Auth', function() {
		expect(AuthSpy).toHaveBeenCalled();
	});

	it('should attach roster to scope', function() {
		expect(scope.ctrl.roster).toEqual({test: 'pass'});
	});

	it('should open create bowler modal', function() {
		scope.ctrl.openCreateBowlerModal('createBowler');
		var args = Modal.open.mostRecentCall.args;

		expect(args[0]).toEqual('createBowler');
	});

	it('should open edit bowler modal', function() {
		scope.ctrl.openEditBowlerModal('editBowler', {name: 'testuser', _id: 1});
		var args = Modal.open.mostRecentCall.args;

		expect(args[0]).toEqual('editBowler');
		expect(args[2]).toEqual({name: 'testuser', _id: 1});
	});

	it('should open remove bowler modal', function() {
		scope.ctrl.openRemoveBowlerModal('removeBowler', {name: 'testuser', _id: 1});
		var args = Modal.open.mostRecentCall.args;

		expect(args[0]).toEqual('removeBowler');

		expect(typeof args[1]).toEqual('function');
	});

	it('should open new season modal', function() {
		scope.ctrl.openNewSeasonModal();
		var args = Modal.open.mostRecentCall.args;

		expect(args[0]).toEqual('createNewSeason');
		expect(args[2]).toEqual(scope.ctrl.roster);
	});
});