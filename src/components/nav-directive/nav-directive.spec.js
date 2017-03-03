describe('nav-directive tests', function() {

	beforeEach(angular.mock.module('ui.router'));
	beforeEach(angular.mock.module('app.routes'));
	beforeEach(angular.mock.module('app.factory'));
	beforeEach(angular.mock.module('app.directive'));

	beforeEach(angular.mock.module('partials'));

	var Scope, Compile, Element, State, LocalStorage;

    beforeEach(inject(function(_$rootScope_, _$compile_, _$templateCache_, _$state_, _localStorage_) {

        Scope = _$rootScope_.$new(),
		State = _$state_;
		LocalStorage = _localStorage_;
        Element = _$compile_('<nav-directive></nav-directive>')(Scope);

        Scope.$digest();

		spyOn(State, 'go');
		spyOn(LocalStorage, 'deleteAllLocal');

    }));

    it('Logout should change the state back to the login route & delete everything from localStorage', function() {

		Scope.logout();

		expect(State.go).toHaveBeenCalledWith('wrapper.login');
		expect(LocalStorage.deleteAllLocal).toHaveBeenCalled();

	});

});
