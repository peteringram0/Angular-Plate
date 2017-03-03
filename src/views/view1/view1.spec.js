describe('view1 tests', function() {

	beforeEach(angular.mock.module('app.constant'));
	beforeEach(angular.mock.module('app.factory'));
	beforeEach(angular.mock.module('app.controllers'));

	var ApiFactory, View1Controller;

	beforeEach(inject(function(_$controller_, _apiFactory_) {

		ApiFactory = _apiFactory_;

		View1Controller = _$controller_('view1', {
			$scope: {}
		});

		spyOn(ApiFactory, 'login').and.callThrough();

	}));

	it('Calling loging function on the controller should call the API method', function() {

		expect(ApiFactory.login).not.toHaveBeenCalled();
		View1Controller.login();
		expect(ApiFactory.login).toHaveBeenCalled();

	});

});
