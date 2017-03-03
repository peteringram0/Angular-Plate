describe('wrapper tests', function() {

	beforeEach(angular.mock.module('app.constant'));
	beforeEach(angular.mock.module('app.factory'));
	beforeEach(angular.mock.module('app.controllers'));

	var WrapperController;

	beforeEach(inject(function(_$controller_) {

		WrapperController = _$controller_('wrapper', {
			$scope: {}
		});

	}));

	it('...', function() {

	});

});
