'use strict';

describe('api.factory tests', function() {

	var ApiFactory;

	beforeEach(angular.mock.module('app.constant'));
	beforeEach(angular.mock.module('app.factory'));

	beforeEach(inject(function(_apiFactory_) {
		ApiFactory = _apiFactory_;
	}));

	it('Check it gets loaded in correctly', function() {
		expect(typeof(ApiFactory)).toBe('object');
	});

	it('Check login is accessable', function() {
		expect(typeof(ApiFactory.login)).toBe('function');
	});

	it('It should error if no creds are passed to login', function() {
		expect(function() {
			ApiFactory.login();
		}).toThrow();
	});

});
