'use strict';

describe('Controller: NavbarCtrl', function() {
	beforeEach(module('app'));

	var ctrl,
		scope,
		AuthIsAdminSpy,
		AuthIsLoggedInSpy,
		AuthGetCurrentUserSpy;

	beforeEach(inject(function(_Auth_, _$location_, $controller, $rootScope) {
		AuthIsLoggedInSpy = spyOn(_Auth_, 'isLoggedIn').andReturn(true);
		AuthIsAdminSpy = spyOn(_Auth_, 'isAdmin').andReturn(true);
		AuthGetCurrentUserSpy = spyOn(_Auth_, 'getCurrentUser').andReturn({name: 'testuser'});

		scope = $rootScope.$new();

		ctrl = $controller('NavbarCtrl as ctrl', {
			$scope: scope
		});
	}));

	it('should be defined', function() {
		expect(scope.ctrl).toBeDefined();
	});

	it('should attach a list of menu items to scope', function() {
		expect(scope.ctrl.menu.length).toBe(4);
	});
	
	it('should attach a list of user menu items to scope', function() {
		expect(scope.ctrl.userMenu.length).toBe(3);
	});
	
	it('should initialize isCollapsed as true on the scope', function() {
		expect(scope.ctrl.isCollapsed).toBe(true);
	});
	
	it('should initialize isLoggedIn by calling Auth.isLoggedIn on the scope', function() {
		expect(scope.ctrl.isLoggedIn()).toEqual(true);
	});
	
	it('should initialize isAdmin by calling Auth.isAdmin on the scope', function() {
		expect(scope.ctrl.isAdmin()).toEqual(true);
	});
	
	it('should retrieve current user by calling Auth.getCurrentUser', function() {
		expect(scope.ctrl.getCurrentUser().name).toEqual('testuser');
	});
});