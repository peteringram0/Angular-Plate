'use strict';

describe('global.filters tests', function() {

	var Filters;

	beforeEach(function() {

		module('app.filters');

		inject(function(_$filter_) {
			Filters = _$filter_;
		});

	});

	it('Check unsafe filter is loaded', function() {
		expect(typeof(Filters('unsafe'))).toBe('function');
	});

});
